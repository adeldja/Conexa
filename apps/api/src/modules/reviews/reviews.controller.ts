import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Request,
  ParseIntPipe,
  DefaultValuePipe,
  UnauthorizedException,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  create(@Request() req: any, @Body() createReviewDto: CreateReviewDto) {
    const clientId = req.user?.id;
    if (!clientId) {
      throw new UnauthorizedException('Authentification requise');
    }
    return this.reviewsService.create(clientId, createReviewDto);
  }

  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get('provider/:providerId')
  findByProvider(
    @Param('providerId') providerId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    return this.reviewsService.findByProvider(providerId, page, limit);
  }

  @Get('client/my-reviews')
  findByClient(@Request() req: any) {
    const clientId = req.user?.id;
    if (!clientId) {
      throw new UnauthorizedException('Authentification requise');
    }
    return this.reviewsService.findByClient(clientId);
  }

  @Get('provider/:providerId/stats')
  getProviderReviewStats(@Param('providerId') providerId: string) {
    return this.reviewsService.getProviderReviewStats(providerId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Request() req: any,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    const clientId = req.user?.id;
    if (!clientId) {
      throw new UnauthorizedException('Authentification requise');
    }
    return this.reviewsService.update(id, clientId, updateReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    const clientId = req.user?.id;
    if (!clientId) {
      throw new UnauthorizedException('Authentification requise');
    }
    return this.reviewsService.remove(id, clientId);
  }
}
