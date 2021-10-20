import { Controller, Get, Res } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export class AppController {
  /**
   * Redirect to the API documentation
   */
  @Get()
  @ApiExcludeEndpoint()
  redirect(@Res() res) {
    return res.redirect('/api');
  }
}
