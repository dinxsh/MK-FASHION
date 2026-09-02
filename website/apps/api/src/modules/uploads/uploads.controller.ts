import {
  BadRequestException,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('admin/uploads')
@UseGuards(JwtAuthGuard)
export class UploadsController {
  @Post('product-image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: 'uploads',
        filename: (_request, file, callback) => {
          const extension = extname(file.originalname).toLowerCase();
          callback(null, `product-${Date.now()}${extension}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_request, file, callback) => {
        callback(null, file.mimetype.startsWith('image/'));
      },
    }),
  )
  uploadProductImage(
    @UploadedFile() file: { filename: string } | undefined,
    @Req() request: { protocol: string; get(name: string): string },
  ) {
    if (!file) {
      throw new BadRequestException('Please upload an image file up to 5MB');
    }

    return {
      imageUrl: `${request.protocol}://${request.get('host')}/uploads/${file.filename}`,
    };
  }
}
