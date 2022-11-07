import {
  Guard,
  IGuard,
  getPropertyMetadata,
  Inject,
  Init,
} from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { THROTTLER_LIMIT, THROTTLER_SKIP } from '../constant';
import * as crypto from 'crypto';
import { ThrottlerFactoryService } from '../service/throttler.service';

@Guard()
export class ThrottlerGuard implements IGuard<Context> {
  @Inject()
  throttlerFactoryService: ThrottlerFactoryService;

  @Init()
  init() {
    console.log('guard初始化');
  }

  /**
   * implement canActivate
   * @param context
   * @param suppilerClz
   * @param methodName
   * @returns
   */
  async canActivate(
    context: Context,
    suppilerClz,
    methodName: string
  ): Promise<boolean> {
    const isSkip: boolean = getPropertyMetadata<boolean>(
      THROTTLER_SKIP,
      suppilerClz,
      methodName
    );
    if (isSkip) {
      return true;
    }

    const ttl: number = getPropertyMetadata<number>(
      THROTTLER_LIMIT,
      suppilerClz,
      methodName
    );
    const limit: number = getPropertyMetadata<number>(
      THROTTLER_LIMIT,
      suppilerClz,
      methodName
    );

    const reqIp = context.request.ip;
    if (!reqIp) {
      throw new Error('cannot get client request ip');
    }
    const key = this.generateKey(suppilerClz, methodName, reqIp);

    return this.handleRequest(context, limit, ttl, key);
  }

  /**
   * handle http request
   * @param context
   * @param limit
   * @param ttl
   */
  protected async handleRequest(
    ctx: Context,
    limit: number,
    ttl: number,
    key: string
  ): Promise<boolean> {
    const rawThrottler = this.throttlerFactoryService.get();
    const ret = await rawThrottler.tryAcquire({ key });
    if (ret) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * generate key
   * @param suppilerClz
   * @param methodName
   * @param reqIp
   * @returns
   */
  generateKey(suppilerClz, methodName: string, reqIp: string): string {
    return this.md5(`${suppilerClz.getName()}_${methodName}_${reqIp}`);
  }

  public md5(str: string): string {
    return crypto.createHash('md5').update(str).digest('hex');
  }
}
