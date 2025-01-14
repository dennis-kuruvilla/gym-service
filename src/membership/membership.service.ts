import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateMembershipRequest,
  Membership,
  MembershipStatus,
  UpdateMembershipStartDateRequest,
} from './membership.entity';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Membership)
    private readonly membershipRepo: Repository<Membership>,
  ) {}

  async createMembership(membership: CreateMembershipRequest) {
    const newMembership = this.membershipRepo.create({ ...membership });
    return await this.membershipRepo.save(newMembership);
  }

  async getMemberships(email: string) {
    const whereFilter =
      email && email.length > 0 ? { email: email } : undefined;
    const membership = this.membershipRepo.find({
      where: whereFilter,
    });
    return membership;
  }

  async cancelMembership(email: string) {
    const membership = await this.membershipRepo.findOne({
      where: {
        email: email,
      },
    });

    membership.status = MembershipStatus.CANCELLED;
    await this.membershipRepo.save(membership);
    return membership;
  }

  async updateMembershipStartDate(
    email: string,
    updateObj: UpdateMembershipStartDateRequest,
  ) {
    const membership = await this.membershipRepo.findOne({
      where: {
        email: email,
      },
    });

    if (membership.status === MembershipStatus.CANCELLED)
      throw new BadRequestException(
        'Cannot update membership as it is cancelled',
      );

    membership.startDate = new Date(updateObj.startDate);
    await this.membershipRepo.save(membership);
    return membership;
  }
}
