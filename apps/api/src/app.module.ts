import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AnimalsModule } from './animals/animals.module';
import { LotsModule } from './lots/lots.module';
import { MarketplaceModule } from './marketplace/marketplace.module';
import { SalesModule } from './sales/sales.module';
import { ReputationModule } from './reputation/reputation.module';
import { NotificationsModule } from './notifications/notifications.module';
import { InterestsModule } from './interests/interests.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    AnimalsModule,
    LotsModule,
    MarketplaceModule,
    SalesModule,
    ReputationModule,
    NotificationsModule,
    InterestsModule,
    AuthModule,
  ],
})
export class AppModule {}
