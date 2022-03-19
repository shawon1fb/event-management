import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';

@Global()
@Module({
  imports: [NestjsFormDataModule.config({ storage: MemoryStoredFile })],
  providers: [PrismaService],
  exports: [PrismaService, NestjsFormDataModule],
})
export class PrismaModule {}
