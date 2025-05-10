const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const socialAccountsController = require('../controllers/socialAccountsController');

// Get status of all social media connections
router.get('/status', auth, socialAccountsController.getConnectionStatus);

// Facebook OAuth routes
router.get('/facebook/auth-url', auth, socialAccountsController.getFacebookAuthUrl);
router.get('/facebook/callback', socialAccountsController.facebookCallback);
router.get('/facebook/pages', auth, socialAccountsController.getFacebookPages);
router.post('/facebook/disconnect', auth, socialAccountsController.disconnectFacebook);
router.post('/facebook/post', auth, socialAccountsController.postToFacebook);

module.exports = router;

// Add this to d:\FYP\contentflow\backend\controllers\socialAccountsController.js

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

    // Use the page's access token to post content
    const result = await facebookApi.postToPage(pageId, page.accessToken, { 
      message, 
      link 
    });
    
    res.status(200).json({
      success: true,
      message: 'Posted to Facebook successfully',
      postId: result.id
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