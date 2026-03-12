import { Module } from '@nestjs/common';
import { REPORT_STORAGE } from '../../application/ports/report-storage.port';
import { R2StorageService } from './r2-storage.service';

@Module({
  providers: [
    R2StorageService,
    {
      provide: REPORT_STORAGE,
      useExisting: R2StorageService,
    },
  ],
  exports: [REPORT_STORAGE, R2StorageService],
})
export class StorageModule {}
