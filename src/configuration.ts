import * as DefaultConfig from './config/config.default';
import { Configuration } from '@midwayjs/decorator';
import { ThrottlerFactoryService } from './service/throttler.service';

@Configuration({
  namespace: 'throttler',
  importConfigs: [
    {
      default: DefaultConfig,
    },
  ],
})
export class ThrottlerConfiguration {
  async onReady(container) {
    await container.getAsync(ThrottlerFactoryService);
  }

  async onStop(container): Promise<void> {
    const factory = await container.getAsync(ThrottlerFactoryService);
    if (factory) {
      await factory.stop();
    }
  }
}
