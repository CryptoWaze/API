import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../../../../src/presentation/users/users.controller';
import { UsersService } from '../../../../src/presentation/users/users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    usersService = {
      login: jest.fn(),
      register: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersService }],
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
});
