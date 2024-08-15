import { Body, Controller, Delete, Get, Param, Post, Request, UseGuards, Query, UseFilters, ForbiddenException, Patch } from '@nestjs/common';
import { UrltagsService } from './urltags.service';
import { Prisma, urltag } from '@prisma/client';
import { CreateUrltagDto } from './dto/create-urltag.dto';
import { UpdateUrltagDto } from './dto/update-urltag.dto';
import { Roles } from 'src/decorators/roles.decorator'; //ROLES CUSTOM DECORATOR
import { Role } from 'src/enums/role.enum';//ROLES ENUM -> 1,2
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AllExceptionsFilter } from 'src/exceptions/all-exception.filter';

@UseFilters(AllExceptionsFilter)
@Roles(Role.Admin)
@UseGuards(AuthGuard, RolesGuard)
@Controller('urltags')

export class UrltagsController {
  constructor(private readonly urltagsService: UrltagsService) { }

  @Post()
  async create(@Query('username') username: string, @Body() createUrltagDto: CreateUrltagDto): Promise<urltag | undefined> {
    return await this.urltagsService.create(username, createUrltagDto);
  }

  @Get()
  async findAll(@Query('username') username: string): Promise<urltag[] | undefined> {
    return await this.urltagsService.findAll(username);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.urltagsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUrltagDto: UpdateUrltagDto) {
    return this.urltagsService.update(+id, updateUrltagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.urltagsService.remove(+id);
  }
}
