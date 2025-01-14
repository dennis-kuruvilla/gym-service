import { Test, TestingModule } from '@nestjs/testing';
import { MembershipService } from './membership.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Membership, MembershipStatus } from './membership.entity';
import { BadRequestException } from '@nestjs/common';

describe('MembershipService', () => {
  let service: MembershipService;
  let repo: Repository<Membership>;

  const mockMembershipRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembershipService,
        {
          provide: getRepositoryToken(Membership),
          useValue: mockMembershipRepository,
        },
      ],
    }).compile();

    service = module.get<MembershipService>(MembershipService);
    repo = module.get<Repository<Membership>>(getRepositoryToken(Membership));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createMembership', () => {
    it('should create and save a new membership', async () => {
      const createMembershipDto = {
        email: 'test@example.com',
        name: 'test',
        startDate: '2035-06-29T14:00:00',
      };
      const savedMembership = { id: 1, ...createMembershipDto };

      mockMembershipRepository.create.mockReturnValue(createMembershipDto);
      mockMembershipRepository.save.mockResolvedValue(savedMembership);

      const result = await service.createMembership(createMembershipDto);

      expect(mockMembershipRepository.create).toHaveBeenCalledWith(
        createMembershipDto,
      );
      expect(mockMembershipRepository.save).toHaveBeenCalledWith(
        createMembershipDto,
      );
      expect(result).toEqual(savedMembership);
    });
  });

  describe('getMemberships', () => {
    it('should return memberships filtered by email', async () => {
      const email = 'test@example.com';
      const memberships = [
        { id: 1, email: email, startDate: new Date() },
        { id: 2, email: email, startDate: new Date() },
      ];

      mockMembershipRepository.find.mockResolvedValue(memberships);

      const result = await service.getMemberships(email);

      expect(mockMembershipRepository.find).toHaveBeenCalledWith({
        where: { email: email },
      });
      expect(result).toEqual(memberships);
    });

    it('should return all memberships when no email is provided', async () => {
      const memberships = [
        { id: 1, email: 'test1@example.com', startDate: new Date() },
        { id: 2, email: 'test2@example.com', startDate: new Date() },
      ];

      mockMembershipRepository.find.mockResolvedValue(memberships);

      const result = await service.getMemberships('');

      expect(mockMembershipRepository.find).toHaveBeenCalledWith({
        where: undefined,
      });
      expect(result).toEqual(memberships);
    });
  });

  describe('cancelMembership', () => {
    it('should cancel a membership by setting its status to CANCELLED', async () => {
      const email = 'test@example.com';
      const membership = {
        id: 1,
        email: email,
        status: MembershipStatus.ACTIVE,
      };

      mockMembershipRepository.findOne.mockResolvedValue(membership);
      mockMembershipRepository.save.mockResolvedValue({
        ...membership,
        status: MembershipStatus.CANCELLED,
      });

      const result = await service.cancelMembership(email);

      expect(mockMembershipRepository.findOne).toHaveBeenCalledWith({
        where: { email: email },
      });
      expect(mockMembershipRepository.save).toHaveBeenCalledWith({
        ...membership,
        status: MembershipStatus.CANCELLED,
      });
      expect(result.status).toBe(MembershipStatus.CANCELLED);
    });
  });

  describe('updateMembershipStartDate', () => {
    it('should update the startDate of an active membership', async () => {
      const email = 'test@example.com';
      const updateObj = { startDate: '2025-06-29T14:00:00' };
      const membership = {
        id: 1,
        email: email,
        name: 'test',
        status: MembershipStatus.ACTIVE,
        startDate: '2025-06-27T14:00:00',
      };

      mockMembershipRepository.findOne.mockResolvedValue(membership);
      mockMembershipRepository.save.mockResolvedValue({
        ...membership,
        startDate: updateObj.startDate,
      });

      const result = await service.updateMembershipStartDate(email, updateObj);

      expect(mockMembershipRepository.findOne).toHaveBeenCalledWith({
        where: { email: email },
      });
    });

    it('should throw an error if the membership is cancelled', async () => {
      const email = 'test@example.com';
      const updateObj = { startDate: '2025-06-29T14:00:00' };
      const membership = {
        id: 1,
        email: email,
        status: MembershipStatus.CANCELLED,
        startDate: '2025-06-30T14:00:00',
      };

      mockMembershipRepository.findOne.mockResolvedValue(membership);

      await expect(
        service.updateMembershipStartDate(email, updateObj),
      ).rejects.toThrow(BadRequestException);

      expect(mockMembershipRepository.findOne).toHaveBeenCalledWith({
        where: { email: email },
      });
      expect(mockMembershipRepository.save).not.toHaveBeenCalled();
    });
  });
});
