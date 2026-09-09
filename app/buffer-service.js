/**
 * Buffer API Integration Service
 * Handles social media scheduling and posting across multiple platforms
 * Platforms: Facebook, Instagram, Twitter, LinkedIn
 */

const axios = require('axios');

const BUFFER_API_BASE = 'https://api.bufferapp.com/1';
const BUFFER_TOKEN = process.env.BUFFER_ACCESS_TOKEN || '';

/**
 * Buffer API Client
 */
class BufferService {
  constructor(accessToken = BUFFER_TOKEN) {
    this.accessToken = accessToken;
    this.client = axios.create({
      baseURL: BUFFER_API_BASE,
      params: { access_token: this.accessToken }
    });
  }

  /**
   * Get all connected social media profiles
   */
  async getProfiles() {
    try {
      const response = await this.client.get('/profiles.json');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch Buffer profiles: ${error.message}`);
    }
  }

  /**
   * Get specific profile details
   */
  async getProfile(profileId) {
    try {
      const response = await this.client.get(`/profiles/${profileId}.json`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch profile ${profileId}: ${error.message}`);
    }
  }

  /**
   * Create a new post (scheduled or immediate)
   */
  async createPost(profileIds, postData) {
    try {
      const payload = {
        profile_ids: profileIds,
        text: postData.text,
        shorten_url: postData.shortenUrl || true,
        scheduled_at: postData.scheduledAt || Math.floor(Date.now() / 1000),
        ...postData
      };

      const response = await this.client.post('/updates/create.json', payload);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create post: ${error.message}`);
    }
  }

  /**
   * Schedule a post to multiple platforms
   */
  async schedulePost(profileIds, content, scheduledTime, mediaUrls = []) {
    try {
      const payload = {
        profile_ids: profileIds,
        text: content,
        scheduled_at: Math.floor(new Date(scheduledTime).getTime() / 1000),
        shorten_url: true,
        media: {
          link: mediaUrls[0] || null
        }
      };

      const response = await this.client.post('/updates/create.json', payload);
      return {
        success: true,
        updateId: response.data.buffer_update,
        profiles: profileIds,
        scheduledFor: scheduledTime
      };
    } catch (error) {
      throw new Error(`Failed to schedule post: ${error.message}`);
    }
  }

  /**
   * Get pending/scheduled posts
   */
  async getPendingPosts(profileId) {
    try {
      const response = await this.client.get(`/profiles/${profileId}/updates/pending.json`);
      return response.data.updates || [];
    } catch (error) {
      throw new Error(`Failed to fetch pending posts: ${error.message}`);
    }
  }

  /**
   * Get published/sent posts
   */
  async getSentPosts(profileId) {
    try {
      const response = await this.client.get(`/profiles/${profileId}/updates/sent.json`);
      return response.data.updates || [];
    } catch (error) {
      throw new Error(`Failed to fetch sent posts: ${error.message}`);
    }
  }

  /**
   * Get post analytics/performance
   */
  async getPostAnalytics(updateId) {
    try {
      const response = await this.client.get(`/updates/${updateId}/interactions.json`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch post analytics: ${error.message}`);
    }
  }

  /**
   * Cancel/delete a scheduled post
   */
  async deletePost(updateId) {
    try {
      const response = await this.client.delete(`/updates/${updateId}.json`);
      return { success: true, deleted: updateId };
    } catch (error) {
      throw new Error(`Failed to delete post: ${error.message}`);
    }
  }

  /**
   * Get Buffer account profile (current user)
   */
  async getUser() {
    try {
      const response = await this.client.get('/user.json');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch user profile: ${error.message}`);
    }
  }

  /**
   * Get profile statistics
   */
  async getProfileStats(profileId, days = 7) {
    try {
      const response = await this.client.get(`/profiles/${profileId}/statistics.json`, {
        params: { days }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch profile stats: ${error.message}`);
    }
  }
}

module.exports = BufferService;
