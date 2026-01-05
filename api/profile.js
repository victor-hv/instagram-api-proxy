const axios = require('axios');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const username = req.query.username;

    if (!username) {
      return res.status(400).json({
        success: false,
        error: 'Username obrigatorio'
      });
    }

    const cleanUsername = username.replace(/^@+/, '').trim();

    const url = `https://www.instagram.com/${cleanUsername}/?__a=1&__d=dis`;

    const response = await axios.get(url, {
      timeout: 8000,
      validateStatus: () => true, // 🔑 NUNCA deixa o axios quebrar
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': '*/*',
        'Referer': 'https://www.instagram.com/'
      }
    });

    // 🚨 Instagram bloqueou
    if (response.status !== 200 || !response.data) {
      return res.status(200).json({
        success: false,
        blocked: true,
        message: 'Instagram bloqueou a requisição'
      });
    }

    const user = response.data?.graphql?.user;

    if (!user) {
      return res.status(200).json({
        success: false,
        error: 'Usuario nao encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        username: user.username,
        full_name: user.full_name || '',
        biography: user.biography || '',
        profile_pic_url: user.profile_pic_url || '',
        is_private: user.is_private,
        is_verified: user.is_verified,
        follower_count: user.edge_followed_by?.count || 0,
        following_count: user.edge_follow?.count || 0,
        media_count: user.edge_owner_to_timeline_media?.count || 0
      }
    });

  } catch (err) {
    console.error('FATAL ERROR:', err);

    // ⚠️ NUNCA retorna 500 sem JSON
    return res.status(200).json({
      success: false,
      fatal: true,
      message: 'Erro interno tratado',
      details: err.message
    });
  }
};
