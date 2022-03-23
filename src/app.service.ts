import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Store } from 'cache-manager';
import Redis from 'redis';
import { HttpService } from '@nestjs/axios';

interface RedisCache extends Cache {
  store: RedisStore;
}

interface RedisStore extends Store {
  name: 'redis';
  getClient: () => Redis.RedisClient;
  isCacheableValue: (value: any) => boolean;
}

class AxiosResponse<T> {}

@Injectable()
export class AppService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: RedisCache,
    private httpService: HttpService,
  ) {}

  async getHello(): Promise<any> {
    /// image links
    const t = this.httpService.get<string>(
      'https://rest.entitysport.com/v2/matches/49689/live?token=ec471071441bb2ac538a0ff901abd249',
    );

    console.log(await t.toPromise());
    const s = await t.toPromise();

    return s.data;

    //    return 'Hello World!';
  }
}
