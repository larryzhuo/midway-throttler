import * as DefaultConfig from './config/config.default';
import { Configuration, Logger } from '@midwayjs/decorator';
import { ThrottlerFactoryService } from './service/throttler.service';
import { ThrottlerGuard } from './guard/throttler.guard';

//入口启动文件
@Configuration({
  namespace: 'traffic-throttler',
  importConfigs: [
    {
      default: DefaultConfig,
    },
  ],
})
export class ThrottlerConfiguration {
  
  @Logger('coreLogger')
  logger;

  async onReady(container) {
    this.logger.info(`throttler onReady`);

    await container.getAsync(ThrottlerFactoryService);

    //import guard
    await container.getAsync(ThrottlerGuard);
  }

  async onStop(container): Promise<void> {
    const factory = await container.getAsync(ThrottlerFactoryService);
    if (factory) {
      await factory.stop();
    }

    this.logger.info(`throttler stop`);
  }
}
