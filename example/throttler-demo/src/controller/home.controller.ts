import { Controller, Get } from '@midwayjs/decorator';
import { SkipThrottle, Throttle } from 'midway-throttler';

@Throttle(2, 20)
@Controller('/')
export class HomeController {
  @Throttle(1, 10)
  @Get('/')
  async home(): Promise<string> {
    return 'Hello Midwayjs!';
  }

  @SkipThrottle(true)
  @Get('/skip')
  async doSkip(): Promise<string> {
    return 'I am skip, no throttle';
  }
}
