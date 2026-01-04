// ===================================
// API PROXY INSTAGRAM - VERCEL
// Endpoint: /api/profile?username=X
// ===================================

const axios = require('axios');

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Buscar perfil do Instagram (via scraping)
async function getInstagramProfile(username) {
  try {
    // Usar endpoint público do Instagram
    const url = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`;
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Instagram 76.0.0.15.395 Android (24/7.0; 640dpi; 1440x2560; samsung; SM-G930F; herolte; samsungexynos8890; en_US; 138226743)',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate',
        'X-IG-App-ID': '936619743392459',
        'X-ASBD-ID': '198387',
        'X-IG-WWW-Claim': '0',
        'Origin': 'https://www.instagram.com',
        'Referer': `https://www.instagram.com/${username}/`,
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin'
      },
      timeout: 15000
    });

    if (response.data && response.data.data && response.data.data.user) {
      const user = response.data.data.user;
      
      return {
        success: true,
        data: {
          pk: user.id,
          username: user.username,
          full_name: user.full_name || '',
          biography: user.biography || '',
          profile_pic_url: user.profile_pic_url || user.profile_pic_url_hd || '',
          is_private: user.is_private || false,
          is_verified: user.is_verified || false,
          is_business: user.is_business_account || false,
          media_count: user.edge_owner_to_timeline_media?.count || 0,
          follower_count: user.edge_followed_by?.count || 0,
          following_count: user.edge_follow?.count || 0,
          external_url: user.external_url || '',
          category: user.category_name || ''
        }
      };
    }

    throw new Error('Dados inválidos retornados');
  } catch (error) {
    console.error('Erro ao buscar perfil:', error.message);
    
    // Se falhar, tentar método alternativo (sem API)
    return await getProfileFallback(username);
  }
}

// Método alternativo - Scraping da página HTML
async function getProfileFallback(username) {
  try {
    const url = `https://www.instagram.com/${username}/?__a=1&__d=dis`;
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-Mode': 'cors'
      },
      timeout: 15000
    });

    // Tentar extrair JSON da resposta
    let userData = null;
    
    if (response.data && typeof response.data === 'object') {
      userData = response.data;
    } else if (typeof response.data === 'string') {
      // Extrair JSON do HTML
      const jsonMatch = response.data.match(/"graphql":\s*(\{.+?\})\s*,\s*"toast_content_on_load"/);
      if (jsonMatch) {
        userData = JSON.parse(jsonMatch[1]);
      }
    }

    if (userData && userData.user) {
      const user = userData.user;
      return {
        success: true,
        data: {
          pk: user.id,
          username: user.username,
          full_name: user.full_name || '',
          biography: user.biography || '',
          profile_pic_url: user.profile_pic_url || user.profile_pic_url_hd || '',
          is_private: user.is_private || false,
          is_verified: user.is_verified || false,
          is_business: user.is_business_account || false,
          media_count: user.edge_owner_to_timeline_media?.count || 0,
          follower_count: user.edge_followed_by?.count || 0,
          following_count: user.edge_follow?.count || 0,
          external_url: user.external_url || '',
          category: user.category_name || ''
        }
      };
    }

    throw new Error('Usuário não encontrado');
  } catch (error) {
    throw new Error(`Erro no fallback: ${error.message}`);
  }
}

// Handler principal
module.exports = async (req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({
        success: false,
        error: 'Username é obrigatório'
      });
    }

    // Limpar username
    const cleanUsername = username.replace(/^@+/, '').trim();

    if (!cleanUsername) {
      return res.status(400).json({
        success: false,
        error: 'Username inválido'
      });
    }

    console.log('🔍 Buscando perfil:', cleanUsername);

    // Buscar perfil
    const result = await getInstagramProfile(cleanUsername);

    // Retornar com CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    return res.status(200).json(result);

  } catch (error) {
    console.error('❌ Erro na API:', error.message);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao buscar perfil'
    });
  }
};
