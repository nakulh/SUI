import { LRUCache } from 'lru-cache';

const options = {
    max: 5000,
    // how long to live in ms
    ttl: 1000 * 60 * 60 * 24 * 7,
};

const options2 = {
  max: 500000,
  // how long to live in ms
  ttl: 1000 * 60 * 5
};

export const coinCache = new LRUCache(options);
export const objectCache = new LRUCache(options);
export const subscriberCache = new LRUCache(options2);