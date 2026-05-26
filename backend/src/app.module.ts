import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthModule } from './health/health.module';
import { SparePartsModule } from './spare-parts/spare-parts.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_URI ?? 'mongodb://localhost:27017/motostock',
    ),
    HealthModule,
    SparePartsModule,
  ],
})
export class AppModule {}
