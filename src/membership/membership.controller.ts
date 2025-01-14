import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { CreateMembershipRequest, UpdateMembershipStartDateRequest } from './membership.entity';
import { MembershipService } from './membership.service';

@Controller('memberships')
export class MembershipController {
  constructor(
    @Inject()
    private readonly membershipService: MembershipService,
  ) {}

  @Post()
  async createMembership(@Body() membership: CreateMembershipRequest) {
    return await this.membershipService.createMembership(membership);
  }

  @Get()
  async getMemberships(@Query('email') email: string) {
    return await this.membershipService.getMemberships(email);
  }

  @Post(':email/cancel')
  async cancelMembership(@Param('email') email: string) {
    return await this.membershipService.cancelMembership(email);
  }

  @Patch(':email')
  async updateMembershipStartTime(
    @Param('email') email: string,
    @Body() updateObj: UpdateMembershipStartDateRequest,
  ) {
    return await this.membershipService.updateMembershipStartDate(
      email,
      updateObj,
    );
  }
}
