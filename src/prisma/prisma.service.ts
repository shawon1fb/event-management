import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get<string>('DATABASE_URL'),
        },
      },
    });

    this.$use(async (params, next) => {
      // Manipulate params here
      const before = Date.now();
      const result = await next(params);
      // See results here

      const after = Date.now();

      console.log(
        `Query ${params.model}.${params.action} took ${after - before}ms `,
      );
      return result;
    });
  }

  onModuleDestroy(): any {
    this.$disconnect();
  }

  onModuleInit(): any {
    this.$connect();
  }
}
