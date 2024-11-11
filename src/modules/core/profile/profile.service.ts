import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities';
import { Repository } from 'typeorm';
import { promises as fs } from 'fs';
import { cwd } from 'node:process';
import { join } from 'path';


@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }

  public async getProfile(userId: number): Promise<User | any> {
    const user = await this.userRepository.findOneBy({ id: userId });

    const response = {
      ...user,
      avatar: user.avatar_url
    }
    return response;
  }

  public async update(userId: number, updateProfileDto: UpdateProfileDto) {
    await this.userRepository.update(userId, updateProfileDto);
    return await this.getProfile(userId);
  }

  public async uploadAvatar(userId: number, file: Express.Multer.File) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (user.avatar) {
      await this.removeAvatar(user.avatar);
    }
    await this.userRepository.update(userId, { avatar: file.path });

    return await this.getProfile(userId);
  }

  public async deleteAvatar(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user.avatar) {
      throw new NotFoundException('Avatar not found');
    }
    await this.removeAvatar(user.avatar);
    await this.userRepository.update(userId, { avatar: null });

    return await this.getProfile(userId);
  }

  private async removeAvatar(filename: string): Promise<void> {
    const filePath = join(process.cwd(), filename);

    try {
      // Check if the file exists
      await fs.access(filePath);

      // If the file exists, delete it
      await fs.unlink(filePath);
      console.log(`File ${filename} deleted successfully`);
    } catch (err) {
      if (err.code === 'ENOENT') {
        return;
      }
      throw err; // Throw other errors
    }
  }
}