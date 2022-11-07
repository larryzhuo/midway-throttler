import { ServiceFactory } from '@midwayjs/core';
import { Application } from '@midwayjs/koa';
import { IThrottler, IThrottlerOption } from 'traffic-throttler';
/**
 * nacos 配置中心client
 */
export declare class ThrottlerFactoryService extends ServiceFactory<IThrottler> {
    logger: any;
    throttlerConfig: IThrottlerOption;
    app: Application;
    getName(): string;
    init(): Promise<void>;
    protected createClient(config: any): Promise<IThrottler>;
    protected destroyClient(client: IThrottler): Promise<void>;
}
