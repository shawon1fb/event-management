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

  // function to check if data exists in redis cache manager
  async has(key: string): Promise<boolean> {
    return this.cacheManager.store.getClient().exists(key);
  }
}
