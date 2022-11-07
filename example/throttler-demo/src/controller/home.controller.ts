import { Controller, Get } from '@midwayjs/decorator';
import {SkipThrottle, Throttle} from '../../../../dist/index';

@Throttle(2, 20)
@Controller('/')
export class HomeController {
  @Get('/')
  async home(): Promise<string> {
    return 'Hello Midwayjs!';
  }

  @SkipThrottle(false)
  @Get('/skip')
  async doSkip():Promise<string> {
    return "I am skip, no throttle"
  }
}
