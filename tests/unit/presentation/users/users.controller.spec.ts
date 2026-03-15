import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { GetUserDashboardUseCase } from '../../../../src/application/use-cases/get-user-dashboard.use-case';
import { UsersController } from '../../../../src/presentation/users/users.controller';
import { UsersService } from '../../../../src/presentation/users/users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: jest.Mocked<UsersService>;
  let getUserDashboardUseCase: jest.Mocked<GetUserDashboardUseCase>;

  beforeEach(async () => {
    usersService = {
      login: jest.fn(),
      register: jest.fn(),
    };
    getUserDashboardUseCase = { execute: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: usersService },
        { provide: GetUserDashboardUseCase, useValue: getUserDashboardUseCase },
      ],
    }).compile();

    controller = module.get(UsersController);
  });

  describe('login', () => {
    it('throws BadRequestException when body is invalid', async () => {
      await expect(controller.login({})).rejects.toThrow(BadRequestException);
      expect(usersService.login).not.toHaveBeenCalled();
    });

    it('delegates to usersService.login with parsed data', async () => {
      usersService.login.mockResolvedValue({
        user: { id: 'u1', email: 'a@b.com', name: 'User' },
        accessToken: 'token',
      });

      const result = await controller.login({
        email: 'a@b.com',
        password: 'secret',
      });

      expect(usersService.login).toHaveBeenCalledWith({
        email: 'a@b.com',
        password: 'secret',
      });
      expect(result.accessToken).toBe('token');
    });
  });

  describe('register', () => {
    it('throws BadRequestException when body is invalid', async () => {
      await expect(controller.register({})).rejects.toThrow(BadRequestException);
      expect(usersService.register).not.toHaveBeenCalled();
    });

    it('delegates to usersService.register', async () => {
      usersService.register.mockResolvedValue({
        user: { id: 'u1', email: 'a@b.com', name: 'User' },
        accessToken: 'token',
      });

      const result = await controller.register({
        email: 'a@b.com',
        password: 'secret',
        name: 'User',
      });

      expect(usersService.register).toHaveBeenCalledWith({
        email: 'a@b.com',
        password: 'secret',
        name: 'User',
      });
      expect(result.user.email).toBe('a@b.com');
    });
  });

  describe('getDashboard', () => {
    it('throws ForbiddenException when id is not the current user', async () => {
      await expect(
        controller.getDashboard('other-user-id', { userId: 'user-1' }),
      ).rejects.toThrow(ForbiddenException);
      expect(getUserDashboardUseCase.execute).not.toHaveBeenCalled();
    });

    it('delegates to getUserDashboardUseCase when id matches current user', async () => {
      getUserDashboardUseCase.execute.mockResolvedValue({
        totalCases: 32,
        totalTrackedValueUSD: 354100,
        casesThisMonth: 32,
        totalTrackedTransactions: 54,
        caseHistory: [],
      });

      const result = await controller.getDashboard('user-1', { userId: 'user-1' });

      expect(getUserDashboardUseCase.execute).toHaveBeenCalledWith('user-1');
      expect(result.totalCases).toBe(32);
      expect(result.totalTrackedValueUSD).toBe(354100);
      expect(result.totalTrackedTransactions).toBe(54);
    });
  });
});
