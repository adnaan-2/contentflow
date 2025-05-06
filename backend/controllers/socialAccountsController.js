const User = require('../models/user');
const config = require('../config'); // Update this import

exports.getStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const status = {
      facebook: user.socialConnections.facebook.connected || false,
      instagram: user.socialConnections.instagram.connected || false,
      twitter: user.socialConnections.twitter.connected || false,
      linkedin: user.socialConnections.linkedin.connected || false
    };
    res.json(status);
  } catch (error) {
    console.error('Error fetching status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.connect = async (req, res) => {
  const { platform } = req.params;
  
  try {
    let authUrl;
    switch (platform) {
      case 'facebook':
        authUrl = `https://www.facebook.com/v12.0/dialog/oauth?` +
          `client_id=${config.FACEBOOK_APP_ID}&` +
          `redirect_uri=${config.BASE_URL}/api/social-accounts/callback/facebook&` +
          `scope=pages_show_list,pages_read_engagement,pages_manage_posts`;
        break;
      case 'instagram':
        authUrl = `https://api.instagram.com/oauth/authorize?` +
          `client_id=${config.INSTAGRAM_APP_ID}&` +
          `redirect_uri=${config.BASE_URL}/api/social-accounts/callback/instagram&` +
          `scope=user_profile,user_media&response_type=code`;
        break;
      case 'twitter':
        authUrl = `https://twitter.com/i/oauth2/authorize?` +
          `client_id=${config.TWITTER_CLIENT_ID}&` +
          `redirect_uri=${config.BASE_URL}/api/social-accounts/callback/twitter&` +
          `scope=tweet.read,tweet.write&response_type=code`;
        break;
      case 'linkedin':
        authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
          `client_id=${config.LINKEDIN_CLIENT_ID}&` +
          `redirect_uri=${config.BASE_URL}/api/social-accounts/callback/linkedin&` +
          `scope=r_liteprofile%20w_member_social&response_type=code`;
        break;
      default:
        return res.status(400).json({ message: 'Invalid platform' });
    }
    res.json({ authUrl });
  } catch (error) {
    console.error(`Error generating ${platform} auth URL:`, error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.saveToken = async (req, res) => {
  const { platform } = req.params;
  const { token } = req.body;

  try {
    await User.findByIdAndUpdate(req.user.id, {
      [`socialConnections.${platform}.connected`]: true,
      [`socialConnections.${platform}.accessToken`]: token,
      [`socialConnections.${platform}.expiresIn`]: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
    });
    res.json({ message: 'Token saved successfully' });
  } catch (error) {
    console.error('Error saving token:', error);
    res.status(500).json({ message: 'Failed to save token' });
  }
};

exports.disconnect = async (req, res) => {
  const { platform } = req.params;

  try {
    await User.findByIdAndUpdate(req.user.id, {
      [`socialConnections.${platform}.connected`]: false,
      [`socialConnections.${platform}.accessToken`]: null,
      [`socialConnections.${platform}.refreshToken`]: null,
      [`socialConnections.${platform}.expiresIn`]: null,
      [`socialConnections.${platform}.userData`]: null
    });
    res.json({ message: 'Successfully disconnected' });
  } catch (error) {
    console.error(`Error disconnecting ${platform}:`, error);
    res.status(500).json({ message: 'Failed to disconnect' });
  }
};