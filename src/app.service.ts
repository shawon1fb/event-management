import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AppService {
  constructor(private httpService: HttpService) {}

  async getHello(): Promise<any> {
    /// image links
    const t = this.httpService.get<string>(
      'https://rest.entitysport.com/v2/matches/49689/live?token=ec471071441bb2ac538a0ff901abd249',
    );

    //console.log(await t.toPromise());
    const s = await t.toPromise();

    return s.data;

    //    return 'Hello World!';
  }
}
