import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';

import { Store } from 'cache-manager';
import Redis from 'redis';

interface RedisCache extends Cache {
  store: RedisStore;
}

interface RedisStore extends Store {
  name: 'redis';
  getClient: () => Redis.RedisClient;
  isCacheableValue: (value: any) => boolean;
}

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: RedisCache) {}

  // function to get  data from redis cache manager
  async get(key: string): Promise<any> {
    return this.cacheManager.store.get(key);
  }

  // function to set data in redis cache manager
  async set(key: string, value: any, ttl?: number): Promise<void> {
    return this.cacheManager.store.set(key, value, ttl);
  }

  // function to delete data from redis cache manager
  async del(key: string): Promise<void> {
    return this.cacheManager.store.del(key);
  }

  // function to check if key exists in redis cache manager
  async has(key: string): Promise<boolean> {
    const keys: string[] = await this.cacheManager.store.keys();
    return keys.includes(key);
  }

  // function to clear all redis cache manager
  async clearAll(): Promise<void> {
    return this.cacheManager.store.getClient().flushdb();
  }

  // function to get all keys from redis cache manager
  async keys(): Promise<string[]> {
    return this.cacheManager.store.keys();
  }

  // function to remember data in redis cache manager
  async remember(
    key: string,
    ttl: number,
    fn: () => Promise<any>,
  ): Promise<any> {
    const value = await this.get(key);
    if (value) {
      return value;
    }
    const result = await fn();
    await this.set(key, result, ttl);
    return result;
  }

  // function to remember forever data in redis cache manager
  async rememberForever(key: string, fn: () => Promise<any>): Promise<any> {
    return this.remember(key, 0, fn);
  }

  // function to pull data in redis cache manager
  async pull(key: string): Promise<any> {
    const value = await this.get(key);
    if (value) {
      await this.del(key);
    }
    return value;
  }

  // function to add data if not exist in redis cache manager
  async add(key: string, value: any, ttl?: number): Promise<void> {
    if (await this.has(key)) {
      throw new Error('Key already exists');
    }
    return this.set(key, value, ttl);
  }

  // function to store an item in the cache permanently
  async forever(key: string, value: any): Promise<void> {
    return this.add(key, value, 0);
  }
}
