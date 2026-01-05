const axios = require('axios');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  // Preflight (CORS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({
        success: false,
        error: 'Username obrigatorio'
      });
    }

    const cleanUsername = username.replace(/^@+/, '').trim();

    const url = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${cleanUsername}`;

    const response = await axios.get(url, {
      headers: {
        // Headers MAIS ACEITOS no ambiente serverless
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.instagram.com/',
      },
      timeout: 10000
    });

    if (response?.data?.data?.user) {
      const user = response.data.data.user;

      return res.status(200).json({
        success: true,
        data: {
          username: user.username,
          full_name: user.full_name || '',
          biography: user.biography || '',
          profile_pic_url: user.profile_pic_url || '',
          is_private: Boolean(user.is_private),
          is_verified: Boolean(user.is_verified),
          follower_count: user.edge_followed_by?.count ?? 0,
          following_count: user.edge_follow?.count ?? 0,
          media_count: user.edge_owner_to_timeline_media?.count ?? 0
        }
      });
    }

    return res.status(404).json({
      success: false,
      error: 'Usuario nao encontrado'
    });

  } catch (error) {
    // LOG REAL (evita crash silencioso no Vercel)
    console.error('INSTAGRAM ERROR:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });

    return res.status(500).json({
      success: false,
      error: 'Erro ao buscar perfil do Instagram',
      details: error.message
    });
  }
};
