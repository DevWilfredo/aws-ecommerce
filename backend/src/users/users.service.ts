import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepo.create({
      ...createUserDto,
      email: createUserDto.email.trim().toLowerCase(),
      cognitoSub: createUserDto.cognitoSub.trim(),
      firstname: createUserDto.firstname?.trim() || null,
      lastname: createUserDto.lastname?.trim() || null,
      isEmailVerified: createUserDto.isEmailVerified ?? false,
    });

    return this.usersRepo.save(user);
  }

  async findAll() {
    return this.usersRepo.find();
  }

  async findOne(id: string) {
    const user = await this.usersRepo.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado.`);
    }

    return user;
  }

  async findByCognitoSub(cognitoSub: string) {
    return this.usersRepo.findOneBy({ cognitoSub: cognitoSub.trim() });
  }

  async upsertFromCognito(createUserDto: CreateUserDto) {
    const normalizedEmail = createUserDto.email.trim().toLowerCase();
    const normalizedSub = createUserDto.cognitoSub.trim();

    const existingUser = await this.usersRepo.findOne({
      where: [{ cognitoSub: normalizedSub }, { email: normalizedEmail }],
    });

    if (!existingUser) {
      return this.create({
        ...createUserDto,
        email: normalizedEmail,
        cognitoSub: normalizedSub,
      });
    }

    existingUser.cognitoSub = normalizedSub;
    existingUser.email = normalizedEmail;
    existingUser.firstname = createUserDto.firstname?.trim() || null;
    existingUser.lastname = createUserDto.lastname?.trim() || null;
    if (typeof createUserDto.isEmailVerified === 'boolean') {
      existingUser.isEmailVerified = createUserDto.isEmailVerified;
    }

    return this.usersRepo.save(existingUser);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const preloadPayload: Partial<User> = { id };

    if (typeof updateUserDto.email === 'string') {
      preloadPayload.email = updateUserDto.email.trim().toLowerCase();
    }
    if (typeof updateUserDto.cognitoSub === 'string') {
      preloadPayload.cognitoSub = updateUserDto.cognitoSub.trim();
    }
    if (updateUserDto.firstname !== undefined) {
      preloadPayload.firstname = updateUserDto.firstname.trim() || null;
    }
    if (updateUserDto.lastname !== undefined) {
      preloadPayload.lastname = updateUserDto.lastname.trim() || null;
    }
    if (typeof updateUserDto.isEmailVerified === 'boolean') {
      preloadPayload.isEmailVerified = updateUserDto.isEmailVerified;
    }

    const user = await this.usersRepo.preload(preloadPayload);

    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no existe.`);
    }

    return this.usersRepo.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    await this.usersRepo.remove(user);
    return { message: `Usuario ${id} eliminado correctamente.` };
  }
}
