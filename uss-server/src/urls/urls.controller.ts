import { Controller, UseGuards, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { Prisma, url } from '@prisma/client';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator'; //ROLES CUSTOM DECORATOR
import { Role } from 'src/enums/role.enum';//ROLES ENUM -> 1,2

@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) { }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Query('username') username: string, @Body() createUrlDto: CreateUrlDto): Promise<url | undefined> {
    return await this.urlsService.create(username, createUrlDto);
  }
  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Query('username') username: string): Promise<url[] | undefined> {
    return await this.urlsService.findAll(username);
  }
  // redirect/:url
  @Get('redirect/:url')
  async redirect(@Param('url') url: string) {
    console.log(url)
    console.log('url = ', url);
    return await this.urlsService.redirect(url);
  }
  @UseGuards(AuthGuard)
  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<url | undefined> {
    return await this.urlsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUrlDto: UpdateUrlDto): Promise<url | undefined> {
    return this.urlsService.update(id, updateUrlDto);
  }
  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<url | undefined> {
    return await this.urlsService.remove(id);
  }
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Post("pregenerate")
  async createMany(@Query('username') username: string, @Query('qty') qty: number): Promise<Prisma.urlCreateInput[] | undefined> {
    console.log("createmany called");
    return await this.urlsService.createPregenerated(username, qty);
  }

}
