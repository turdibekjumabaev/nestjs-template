import { Controller, Get, Post, Body, Patch, UseGuards, UseInterceptors, UploadedFile, Delete, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, HttpStatus } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AccessTokenGuard } from 'src/common/guards';
import { ActiveUser } from 'src/common/decorators';
import { IActiveUser } from 'src/common/interfaces';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@UseGuards(AccessTokenGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }

  @Get()
  getProfile(@ActiveUser() user: IActiveUser) {
    return this.profileService.getProfile(user.id);
  }

  @Patch()
  update(@ActiveUser() user: IActiveUser, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(user.id, updateProfileDto);
  }

  @Post('upload/avatar')
  @UseInterceptors(FileInterceptor('avatar', {
    storage: diskStorage({
      destination: './storages/avatars',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
        return cb(null, `${randomName}${extname(file.originalname)}`)
      },
    })
  }))
  async uploadAvatar(@ActiveUser() user: IActiveUser,
    @UploadedFile(new ParseFilePipe({
      fileIsRequired: true,
      validators: [
        new FileTypeValidator({ fileType: /image\/*/ }),
        new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),  // 5MB
      ],
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
    })) file: Express.Multer.File) {
    return await this.profileService.uploadAvatar(user.id, file);
  }


  @Delete('avatar')
  async deleteAvatar(@ActiveUser() user: IActiveUser) {
    return await this.profileService.deleteAvatar(user.id);
  }

}
