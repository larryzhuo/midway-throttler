import { ServiceFactory } from '@midwayjs/core';
import {
  Config,
  Init,
  Provide,
  Scope,
  ScopeEnum,
  Logger,
} from '@midwayjs/decorator';
import { IThrottler } from 'traffic-throttler';
import { IMidwayThrottlerOption } from '../interface';

/**
 * nacos 配置中心client
 */
@Provide()
@Scope(ScopeEnum.Singleton)
export class ThrottlerFactoryService extends ServiceFactory<IThrottler> {
  @Logger('coreLogger')
  logger;

  @Config('throttler')
  throttlerConfig: IMidwayThrottlerOption;

  getName(): string {
    return 'ThrottlerFactoryService';
  }

  @Init()
  async init() {
    await this.initClients(this.throttlerConfig); //initClients循环调用createClient将生成的client存储到map中，ServiceFactory中实现
  }

  protected async createClient(config: any): Promise<IThrottler> {
    this.logger.info(`createClient调用, %s`, config);

    if (!config) {
      throw new Error('config 空');
    }
    if (!config.logger) {
      config.logger = console;
    }
    return;
  }

  protected async destroyClient(client: IThrottler) {
    if (client) {
      await client.destory();
    }
  }
}
