const axios = require('axios');

// Facebook API utility
const facebookApi = {
  /**
   * Get user profile from Facebook
   * @param {string} accessToken - Facebook access token
   * @returns {Promise<Object>} - User profile data
   */
  getUserProfile: async (accessToken) => {
    try {
      const response = await axios.get('https://graph.facebook.com/v18.0/me', {
        params: {
          fields: 'id,name,email,picture',
          access_token: accessToken
        }
      });
      return response.data;
    } catch (error) {
      console.error('Facebook API error:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Get user's Facebook pages
   * @param {string} accessToken - Facebook access token
   * @returns {Promise<Array>} - List of pages
   */
  getUserPages: async (accessToken) => {
    try {
      const response = await axios.get('https://graph.facebook.com/v18.0/me/accounts', {
        params: {
          access_token: accessToken
        }
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Facebook API error:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Post content to a Facebook page
   * @param {string} pageId - Facebook page ID
   * @param {string} pageAccessToken - Page access token
   * @param {Object} content - Post content
   * @returns {Promise<Object>} - Post result
   */
  postToPage: async (pageId, pageAccessToken, content) => {
    try {
      const response = await axios.post(
        `https://graph.facebook.com/v18.0/${pageId}/feed`,
        null,
        {
          params: {
            message: content.message,
            link: content.link || undefined,
            access_token: pageAccessToken
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Facebook API error:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Revoke app permissions
   * @param {string} accessToken - Facebook access token
   * @returns {Promise<Object>} - Revocation result
   */
  revokePermissions: async (accessToken) => {
    try {
      const response = await axios.delete('https://graph.facebook.com/v18.0/me/permissions', {
        params: {
          access_token: accessToken
        }
      });
      return response.data;
    } catch (error) {
      console.error('Facebook API error:', error.response?.data || error.message);
      throw error;
    }
  }
};

module.exports = facebookApi;