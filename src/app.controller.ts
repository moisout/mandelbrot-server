import { Controller, Get, UseGuards, Query } from "@nestjs/common";
import { AppService } from "./app.service";
import { MandelbrotQuery } from "./query.interface";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getMandelbrot(@Query() query: MandelbrotQuery): string {
    return this.appService.getMandelbrot(query);
  }
}
