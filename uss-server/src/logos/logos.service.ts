import { BadRequestException, Injectable, InternalServerErrorException, Query } from '@nestjs/common';
import { CreateLogoDto } from './dto/create-logo.dto';
import { UpdateLogoDto } from './dto/update-logo.dto';
import { Prisma, users, logo } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { UsersService } from 'src/users/users.service';
import { CloudinaryService } from 'common/cloudinary.service';
@Injectable()
export class LogosService {
  // private urlsService: UrlsService
  constructor(private readonly databaseService: DatabaseService, private readonly usersService: UsersService, private readonly cloudinaryService: CloudinaryService) { }
  async uploadFile(username: string, file: Express.Multer.File) {
    try {
      if (!file) {
        throw new BadRequestException('file is not an image');
      }
      const user: users = await this.usersService.findByUsername(username);
      if (!user) {
        throw new InternalServerErrorException('User not found')
      }
      //upload on cloudinary:
      const response: any = await this.cloudinaryService.uploadOnCloudinary(file.path);
      if (!response) {
        throw new InternalServerErrorException('Error uploading image')
      }
      console.log("upload response :", response);
      // return response;

      // create logo entry here in the database.

      const Newlogo: logo = await this.create({ user_id: user.user_id, logo_path: response.secure_url });
      return Newlogo;
    } catch (error) {
      throw new BadRequestException('error in uploading file on cloud');
    }
  }
  async getLogo(localPath: string) {

  }
  async create(createLogoDto: CreateLogoDto) {
    try {
      const newLogo: logo = await this.databaseService.logo.create({ data: createLogoDto });
      if (!newLogo) {
        throw new InternalServerErrorException('Error creating logo')
      }
      return newLogo;
    } catch (error) {
      throw new BadRequestException('error adding logo to data store');
    }
  }

  findAll() {
    return JSON.stringify(`This action returns all logos`);
  }

  findOne(id: number) {
    return `This action returns a #${id} logo`;
  }

  update(id: number, updateLogoDto: UpdateLogoDto) {
    return `This action updates a #${id} logo`;
  }

  async remove(username: string, secure_url: string): Promise<any> {

    try {
      const user: users = await this.usersService.findByUsername(username);
      if (!user) {
        throw new InternalServerErrorException('User not found')
      }
      const deleted: any = await this.cloudinaryService.deleteFromCloudinary(secure_url);
      console.log("delete from cloud response = ", deleted);
      if (!deleted) {
        throw new InternalServerErrorException('Error deleting logo from cloud')
      }
      const deletedLogo = await this.databaseService.logo.deleteMany({ where: { logo_path: secure_url } });
      return deletedLogo;
    } catch (error) {
      throw new BadRequestException('error in deleting file');
    }
  }
}
