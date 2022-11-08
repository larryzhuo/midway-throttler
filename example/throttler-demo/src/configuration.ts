import { Configuration, App } from '@midwayjs/decorator';
import * as koa from '@midwayjs/koa';
// import * as info from '@midwayjs/info';
import { join } from 'path';
// import { DefaultErrorFilter } from './filter/default.filter';
// import { NotFoundFilter } from './filter/notfound.filter';
import { ReportMiddleware } from './middleware/report.middleware';
import * as throttler from 'midway-throttler';
import { ThrottlerGuard } from 'midway-throttler';

@Configuration({
  imports: [
    koa,
    // {
    //   component: info,
    //   enabledEnvironment: ['local'],
    // },
    throttler,
  ],
  importConfigs: [join(__dirname, './config')],
})
export class ContainerLifeCycle {
  @App()
  app: koa.Application;

  async onReady() {
    // add middleware
    this.app.useMiddleware([ReportMiddleware]);
    // add filter
    // this.app.useFilter([NotFoundFilter, DefaultErrorFilter]);

    //全局守卫配置
    this.app.useGuard(ThrottlerGuard);
  }
}
