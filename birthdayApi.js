import { birthdayConfig as defaultConfig } from '../config/birthdayConfig';

const API_BASE = '/api';
const STORAGE_KEY = 'birthday_surprise_config_cache';

export const birthdayApi = {
  // Get Configuration
  async getConfig() {
    try {
      const res = await fetch(`${API_BASE}/birthday`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(json.data));
          return json.data;
        }
      }
    } catch (err) {
      console.warn('Backend API unavailable, using cached or default configuration:', err);
    }

    // Check localStorage cache
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        // Fallback to static defaultConfig
      }
    }

    return defaultConfig;
  },

  // Save Configuration
  async saveConfig(newConfig) {
    // Update local cache immediately
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));

    try {
      const res = await fetch(`${API_BASE}/birthday`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newConfig),
      });
      if (res.ok) {
        const data = await res.json();
        return { success: true, data };
      }
    } catch (err) {
      console.warn('Could not persist to backend file, but saved to local cache:', err);
    }

    return { success: true, message: 'Saved to local browser cache' };
  },

  // Upload Photo / Gift Image
  async uploadFile(file, type = 'photo') {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_BASE}/upload?type=${type}`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const json = await res.json();
        return json;
      }
    } catch (err) {
      console.error('File upload error:', err);
    }

    // Local fallback: convert to base64 data URL if backend upload fails
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          success: true,
          url: reader.result,
          filename: file.name,
        });
      };
      reader.readAsDataURL(file);
    });
  },

  // Upload Multiple Photos at once (e.g. WhatsApp photos)
  async uploadMultipleFiles(files, type = 'photo') {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const res = await fetch(`${API_BASE}/upload-multiple?type=${type}`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const json = await res.json();
        return json;
      }
    } catch (err) {
      console.error('Multiple file upload error:', err);
    }

    // Fallback: upload one by one using uploadFile
    const results = [];
    for (let i = 0; i < files.length; i++) {
      const single = await this.uploadFile(files[i], type);
      if (single && single.url) {
        results.push(single);
      }
    }
    return {
      success: results.length > 0,
      files: results,
    };
  },
};

export default birthdayApi;
