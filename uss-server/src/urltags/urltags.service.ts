import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUrltagDto } from './dto/create-urltag.dto';
import { Prisma, users, urltag } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { UsersService } from 'src/users/users.service';
import { UpdateUrltagDto } from './dto/update-urltag.dto';

@Injectable()
export class UrltagsService {
  constructor(private readonly databaseService: DatabaseService, private usersService: UsersService) { }
  async create(user_id: string, createUrltagDto: CreateUrltagDto): Promise<urltag | undefined> {
    try {
      const exists: boolean = await this.checkIfExists(createUrltagDto.tag_name, user_id);
      if (exists) {
        throw new InternalServerErrorException('Tag already exists')
      }
      const urlTag: urltag = await this.databaseService.urltag.create({ data: { user_id: user_id, tag_name: createUrltagDto.tag_name } });
      if (!urlTag) {
        throw new InternalServerErrorException('Failed to create url tag');
      }
      return urlTag;

    } catch (error) {
      throw new InternalServerErrorException('Failed to create url tag');
    }
  }

  async findAll(username: string): Promise<urltag[] | undefined> {
    try {
      const user: users | undefined = await this.usersService.findByUsername(username);
      if (!user) {
        throw new InternalServerErrorException('User not found')
      }
      const urlTag: urltag[] = await this.databaseService.urltag.findMany({ where: { user_id: user.user_id } })
      if (!urlTag.length) {
        return undefined;
      }
      return urlTag;
    } catch (error) {
      throw new InternalServerErrorException('Failed to get url tags');

    }
  }


  findOne(id: number) {
    return `This action returns a #${id} urltag`;
  }

  update(id: number, updateUrltagDto: UpdateUrltagDto) {
    return `This action updates a #${id} urltag`;
  }

  remove(id: number) {
    return `This action removes a #${id} urltag`;
  }
  async checkIfExists(tag_name: string, user_id: string) {
    const urlTag: urltag | undefined = await this.databaseService.urltag.findFirst({ where: { tag_name, user_id } })
    if (urlTag)
      return true;

    return false;

  }
}
