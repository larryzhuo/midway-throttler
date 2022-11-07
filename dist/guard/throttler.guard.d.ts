import { IGuard } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { ThrottlerFactoryService } from '../service/throttler.service';
export declare class ThrottlerGuard implements IGuard<Context> {
    throttlerFactoryService: ThrottlerFactoryService;
    init(): void;
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
}
