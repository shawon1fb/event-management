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
export class AppService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: RedisCache) {}

  async getHello(): Promise<string> {
    await this.cacheManager.store.set('foo', 'bar');

    const value = await this.cacheManager.store.get('foo');
    console.log(value);
    return 'Hello World!';
  }
}
