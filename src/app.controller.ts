import {
  Controller,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'file_one', maxCount: 1 },
      { name: 'file_two', maxCount: 1 },
    ]),
  )
  testMultipleFiles(
    @UploadedFiles(
      new ParseFilePipeBuilder()
        // None of the following work
        // .addFileTypeValidator({ fileType: 'image/png' })
        // .addFileTypeValidator({ fileType: 'png' })
        // .addFileTypeValidator({ fileType: new RegExp(/.(jpg|jpeg|png)$/) })
        .addMaxSizeValidator({ maxSize: 500 * 1024 })
        // .addMaxSizeValidator({ maxSize: 5000 * 1024 })
        .build(),
    )
    files: {
      file_one: Express.Multer.File[];
      file_two: Express.Multer.File[];
    },
  ): string {
    return files.file_one[0].originalname + files.file_two[0].originalname;
  }

  @Post('/working')
  @UseInterceptors(FileInterceptor('file_one'))
  testSingleFil(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: new RegExp(/.(jpg|jpeg|png)$/) })
        .addMaxSizeValidator({ maxSize: 500 * 1024 })
        .build(),
    )
    file: Express.Multer.File,
  ): string {
    return file.originalname;
  }
}
