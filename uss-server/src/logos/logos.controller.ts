import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Query, Res, Req, UseGuards, } from '@nestjs/common';
import { LogosService } from './logos.service';
import { CreateLogoDto } from './dto/create-logo.dto';
import { UpdateLogoDto } from './dto/update-logo.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response, Request } from 'express';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('logos')
export class LogosController {
  constructor(private readonly logosService: LogosService) { }

  //upload to localserver:(step 1)
  @UseInterceptors(FileInterceptor('logoImage', {
    storage: diskStorage({
      destination: './common/public/temp',
      filename: (req, file, cb) => {
        const fileName: string = file.originalname.split('.')[0];
        const fileExtension: string = file.originalname.split('.')[1];
        const newFileName: string = fileName.split(" ").join("_")
          + "_" +
          Date.now() +
          "." +
          fileExtension;
        cb(null, newFileName);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(null, false);
      }
      cb(null, true);
    }

  }))

  @Post('upload')
  async uploadFile(@Query('username') username: string, @UploadedFile() file: Express.Multer.File) {
    return await this.logosService.uploadFile(username, file);
  }
  //get the image from localserver:
  // @Get()
  // async getLogo(@Query('path') localPath: string, @Res() res: Response) {
  //   res.sendFile(localPath, { root: './common/public/temp' })
  // }
  // @Post()
  // create(@Body() createLogoDto: CreateLogoDto) {
  //   return this.logosService.create(createLogoDto);
  // }
  @UseGuards(AuthGuard)
  @Get()
  findAll(@Req() req: Request) {
    console.log(req['user']['user_id']);
    return this.logosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.logosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLogoDto: UpdateLogoDto) {
    return this.logosService.update(+id, updateLogoDto);
  }

  @Delete('delete')
  remove(@Query('username') username: string, @Body('secure_url') secure_url: string) {

    return this.logosService.remove(username, secure_url);
  }
}
