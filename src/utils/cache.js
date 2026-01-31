// Simple in-memory cache for API responses
class ApiCache {
  constructor() {
    this.cache = new Map();
    this.timestamps = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes default TTL
  }

  set(key, value, ttl = this.defaultTTL) {
    this.cache.set(key, value);
    this.timestamps.set(key, Date.now() + ttl);
  }

  get(key) {
    const timestamp = this.timestamps.get(key);
    if (!timestamp || Date.now() > timestamp) {
      // Cache expired
      this.cache.delete(key);
      this.timestamps.delete(key);
      return null;
    }
    return this.cache.get(key);
  }

  has(key) {
    return this.get(key) !== null;
  }

  clear() {
    this.cache.clear();
    this.timestamps.clear();
  }

  delete(key) {
    this.cache.delete(key);
    this.timestamps.delete(key);
  }

  // Clear expired entries
  cleanup() {
    const now = Date.now();
    for (const [key, timestamp] of this.timestamps.entries()) {
      if (now > timestamp) {
        this.cache.delete(key);
        this.timestamps.delete(key);
      }
    }
  }
}

// Create a global cache instance
const apiCache = new ApiCache();

// Auto cleanup every 10 minutes
setInterval(() => {
  apiCache.cleanup();
}, 10 * 60 * 1000);

export default apiCache;