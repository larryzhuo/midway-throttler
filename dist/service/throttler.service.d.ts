import { ServiceFactory } from '@midwayjs/core';
import { IThrottler } from 'traffic-throttler';
import { IMidwayThrottlerOption } from '../interface';
/**
 * nacos 配置中心client
 */
export declare class ThrottlerFactoryService extends ServiceFactory<IThrottler> {
    logger: any;
    throttlerConfig: IMidwayThrottlerOption;
    getName(): string;
    init(): Promise<void>;
    protected createClient(config: any): Promise<IThrottler>;
    protected destroyClient(client: IThrottler): Promise<void>;
}
