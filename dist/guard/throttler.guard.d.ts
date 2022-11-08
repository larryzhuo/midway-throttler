import { Context } from '@midwayjs/koa';
import { ThrottlerFactoryService } from '../service/throttler.service';
import { IGuard } from '@midwayjs/core';
import { IMidwayThrottlerOption } from '../interface';
export declare class ThrottlerGuard implements IGuard<Context> {
    logger: any;
    throttlerFactoryService: ThrottlerFactoryService;
    throttlerConfig: IMidwayThrottlerOption;
    private _storage;
    init(): void;
    /**
     * 从 class 上，或者方法上读取 meta data
     * @param key
     * @param target
     * @param propertyName
     */
    getMetadataFromClassOrMethod<T>(key: string, suppilerClz: any, methodName: string): T;
    /**
     * implement canActivate
     * @param context
     * @param suppilerClz
     * @param methodName
     * @returns
     */
    canActivate(context: Context, suppilerClz: any, methodName: string): Promise<boolean>;
    /**
     * handle http request
     * @param context
     * @param limit
     * @param ttl
     */
    protected handleRequest(ctx: Context, limit: number, ttl: number, key: string): Promise<boolean>;
    /**
     * generate key
     * @param suppilerClz
     * @param methodName
     * @param reqIp
     * @returns
     */
    generateKey(suppilerClz: any, methodName: string, reqIp: string): string;
    md5(str: string): string;
    destroy(): Promise<void>;
}
