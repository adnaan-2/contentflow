const User = require('../models/user');
const axios = require('axios');
const crypto = require('crypto');

// Create a mapping to store state values temporarily
// In a production environment, use Redis or a database
const stateMap = new Map();

// Get connection status for all social platforms
exports.getConnectionStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Extract connected status for all platforms
    const connectionStatus = {
      facebook: user.socialConnections?.facebook?.connected || false,
      instagram: user.socialConnections?.instagram?.connected || false,
      twitter: user.socialConnections?.twitter?.connected || false,
      linkedin: user.socialConnections?.linkedin?.connected || false
    };

    res.status(200).json(connectionStatus);
  } catch (error) {
    console.error('Error getting connection status:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Generate Facebook authorization URL
exports.getFacebookAuthUrl = async (req, res) => {
  try {
    // Generate a random state parameter to prevent CSRF attacks
    const state = crypto.randomBytes(20).toString('hex');
    
    // Store the state linked to the user ID (for verification in callback)
    stateMap.set(state, {
      userId: req.user.id,
      createdAt: Date.now()
    });
    
    // Clean up old states (older than 10 minutes)
    const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
    for (const [key, value] of stateMap.entries()) {
      if (value.createdAt < tenMinutesAgo) {
        stateMap.delete(key);
      }
    }
    
    // Build the redirect URL
    const redirectUri = `${process.env.BASE_URL}/api/social-accounts/facebook/callback`;
    
    // Create the Facebook authorization URL
    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
      `client_id=${process.env.FACEBOOK_APP_ID}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&state=${state}` +
      `&scope=email,public_profile,pages_show_list,pages_read_engagement,pages_manage_posts`;
    
    res.status(200).json({ authUrl });
  } catch (error) {
    console.error('Error generating Facebook auth URL:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Handle Facebook OAuth callback
exports.facebookCallback = async (req, res) => {
  try {
    const { code, state } = req.query;
    
    // Verify the state parameter (CSRF protection)
    if (!state || !stateMap.has(state)) {
      return res.redirect(`${process.env.CLIENT_URL}/dashboard/social-accounts?error=invalid_state`);
    }
    
    // Get the user ID associated with this state
    const { userId } = stateMap.get(state);
    stateMap.delete(state); // Remove the used state
    
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL}/dashboard/social-accounts?error=user_not_found`);
    }
    
    // Exchange the code for an access token
    const redirectUri = `${process.env.BASE_URL}/api/social-accounts/facebook/callback`;
    const tokenResponse = await axios.get(`https://graph.facebook.com/v18.0/oauth/access_token`, {
      params: {
        client_id: process.env.FACEBOOK_APP_ID,
        client_secret: process.env.FACEBOOK_APP_SECRET,
        redirect_uri: redirectUri,
        code
      }
    });
    
    const { access_token, expires_in } = tokenResponse.data;
    
    // Get user data from Facebook
    const userResponse = await axios.get(`https://graph.facebook.com/v18.0/me`, {
      params: {
        fields: 'id,name,email,picture',
        access_token
      }
    });
    
    // Get pages data (if available)
    let pagesData = [];
    try {
      const pagesResponse = await axios.get(`https://graph.facebook.com/v18.0/me/accounts`, {
        params: {
          access_token
        }
      });
      
      if (pagesResponse.data && pagesResponse.data.data) {
        pagesData = pagesResponse.data.data.map(page => ({
          id: page.id,
          name: page.name,
          accessToken: page.access_token,
          category: page.category
        }));
      }
    } catch (error) {
      console.error('Error fetching Facebook pages:', error.response?.data || error.message);
      // Continue without pages
    }
    
    // Calculate token expiration date
    const expirationDate = new Date();
    expirationDate.setSeconds(expirationDate.getSeconds() + expires_in);
    
    // Update user document with Facebook data
    user.socialConnections.facebook = {
      connected: true,
      accessToken: access_token,
      refreshToken: '', // Facebook doesn't provide refresh tokens in this flow
      expiresIn: expirationDate,
      userData: {
        id: userResponse.data.id,
        name: userResponse.data.name,
        email: userResponse.data.email || '',
        picture: userResponse.data.picture?.data?.url || '',
        pages: pagesData
      }
    };
    
    await user.save();
    
    // Redirect back to the client with success
    res.redirect(`${process.env.CLIENT_URL}/dashboard/social-accounts?facebook_connected=true`);
  } catch (error) {
    console.error('Error in Facebook callback:', error.response?.data || error.message);
    res.redirect(`${process.env.CLIENT_URL}/dashboard/social-accounts?error=${encodeURIComponent(error.message)}`);
  }
};

// Get user's Facebook pages
exports.getFacebookPages = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if Facebook is connected
    if (!user.socialConnections?.facebook?.connected) {
      return res.status(400).json({ 
        success: false, 
        message: 'Facebook account is not connected' 
      });
    }

    const pages = user.socialConnections.facebook.userData.pages || [];
    
    // Return pages without access tokens
    res.status(200).json({
      success: true,
      pages: pages.map(page => ({
        id: page.id,
        name: page.name
      }))
    });
  } catch (error) {
    console.error('Error fetching Facebook pages:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Disconnect Facebook account
exports.disconnectFacebook = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if there is a token to revoke
    const accessToken = user.socialConnections?.facebook?.accessToken;
    
    if (accessToken) {
      try {
        // Attempt to revoke Facebook access permissions
        await axios.delete(`https://graph.facebook.com/v18.0/me/permissions`, {
          params: { access_token: accessToken }
        });
      } catch (error) {
        console.error('Error revoking Facebook permissions:', error.response?.data || error.message);
        // Continue even if revocation fails
      }
    }

    // Reset Facebook connection data
    user.socialConnections.facebook = {
      connected: false,
      accessToken: null,
      refreshToken: null,
      expiresIn: null,
      userData: {
        id: null,
        name: null,
        email: null,
        pages: []
      }
    };

    await user.save();
    
    res.status(200).json({ 
      success: true, 
      message: 'Facebook account disconnected successfully' 
    });
  } catch (error) {
    console.error('Error disconnecting Facebook:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error disconnecting Facebook account' 
    });
  }
};

// Post content to a Facebook page
exports.postToFacebook = async (req, res) => {
  try {
    const { pageId, message, link } = req.body;
    
    if (!pageId || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Page ID and message are required' 
      });
    }

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if Facebook is connected
    if (!user.socialConnections?.facebook?.connected) {
      return res.status(400).json({ 
        success: false, 
        message: 'Facebook account is not connected' 
      });
    }

    // Find the specified page
    const pages = user.socialConnections.facebook.userData.pages || [];
    const page = pages.find(p => p.id === pageId);
    
    if (!page) {
      return res.status(404).json({ 
        success: false, 
        message: 'Page not found or you do not have permission to post to this page' 
      });
    }

    // Post to Facebook
    const result = await axios.post(
      `https://graph.facebook.com/v18.0/${pageId}/feed`,
      null,
      {
        params: {
          message,
          link: link || undefined,
          access_token: page.accessToken
        }
      }
    );
    
    res.status(200).json({
      success: true,
      message: 'Posted to Facebook successfully',
      postId: result.data.id
    });
  } catch (error) {
    console.error('Error posting to Facebook:', error.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Error posting to Facebook',
      error: error.response?.data?.error?.message || error.message 
    });
  }
};