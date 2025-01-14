import { Module } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membership } from './membership.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Membership])
  ],
  providers: [MembershipService],
  controllers: [MembershipController]
})
export class MembershipModule {}
