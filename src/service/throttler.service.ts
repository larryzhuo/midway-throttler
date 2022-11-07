import { App, ServiceFactory } from '@midwayjs/core';
import {
  Config,
  Init,
  Provide,
  Scope,
  ScopeEnum,
  Logger,
} from '@midwayjs/decorator';
import { Application } from '@midwayjs/koa';
import { IThrottler, IThrottlerOption } from 'traffic-throttler';
import { ThrottlerGuard } from '../guard/throttler.guard';

/**
 * nacos 配置中心client
 */
@Provide()
@Scope(ScopeEnum.Singleton)
export class ThrottlerFactoryService extends ServiceFactory<IThrottler> {
  @Logger('coreLogger')
  logger;

  @Config('throttler')
  throttlerConfig: IThrottlerOption;

  @App()
  app: Application;

  getName(): string {
    return 'ThrottlerFactoryService';
  }

  @Init()
  async init() {
    await this.initClients(this.throttlerConfig); //initClients循环调用createClient将生成的client存储到map中，ServiceFactory中实现
  }

  protected async createClient(config: any): Promise<IThrottler> {
    if (!config) {
      throw new Error('config 空');
    }
    if (!config.logger) {
      config.logger = console;
    }
    //初始化 throttler 留到 Guard 中
    const appCtx = this.app.getApplicationContext();
    appCtx.getAsync(ThrottlerGuard);

    return;
  }

  protected async destroyClient(client: IThrottler) {
    if (client) {
      await client.destory();
    }
  }
}
