import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { FileSystemStoredFile, NestjsFormDataModule } from 'nestjs-form-data';

@Global()
@Module({
  imports: [
    NestjsFormDataModule.config({
      storage: FileSystemStoredFile,
      autoDeleteFile: false,
      fileSystemStoragePath: './uploads',
    }),
  ],
  providers: [PrismaService],
  exports: [PrismaService, NestjsFormDataModule],
})
export class PrismaModule {}
