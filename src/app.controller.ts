import { Controller, Query, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { MandelbrotQuery } from './query.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('set')
  getMandelbrot(@Body() body: MandelbrotQuery): string {
    return this.appService.getMandelbrot(body);
  }
}
