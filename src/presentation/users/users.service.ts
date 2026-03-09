import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../infrastructure/database';
import { LoginUserInput } from '../../application/schemas/login-user.schema';
import { RegisterUserInput } from '../../application/schemas/register-user.schema';

const SALT_ROUNDS = 10;

export type UserResponse = {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
  accessToken?: string;
};

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(input: RegisterUserInput): Promise<UserResponse> {
    const existing = await this.prisma.user.findUnique({
      where: { email: input.email },
    });
    if (existing) {
      throw new ConflictException('E-mail já cadastrado.');
    }
    const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);
    const user = await this.prisma.user.create({
      data: {
        email: input.email,
        name: input.name ?? null,
        password: hashedPassword,
      },
    });
    return this.toResponse(user);
  }

  async login(input: LoginUserInput): Promise<UserResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email },
    });
    if (!user) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }
    const passwordMatch = await bcrypt.compare(input.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }
    const response = this.toResponse(user);
    response.accessToken = this.jwtService.sign({ sub: user.id });
    return response;
  }

  private toResponse(user: { id: string; email: string; name: string | null; createdAt: Date }): UserResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };
  }
}
