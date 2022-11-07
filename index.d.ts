import { IThrottlerOption } from 'traffic-throttler';

export * from './dist/index';

declare module '@midwayjs/core/dist/interface' {
  interface MidwayConfig {
    throttler?: IThrottlerOption;
  }
}
