import {
  Guard,
  getPropertyMetadata,
  Inject,
  Init,
  Logger
} from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { THROTTLER_LIMIT, THROTTLER_SKIP, THROTTLER_TTL } from '../constant';
import * as crypto from 'crypto';
import { ThrottlerFactoryService } from '../service/throttler.service';
import { Config, Destroy, getClassMetadata, IGuard } from '@midwayjs/core';
import { IStorage, StorageFactory, StorageTypeEnum } from 'traffic-throttler';
import { IMidwayThrottlerOption } from '../interface';

@Guard()
export class ThrottlerGuard implements IGuard<Context> {

  @Logger('coreLogger')
  logger;
  
  @Inject()
  throttlerFactoryService: ThrottlerFactoryService;

  @Config('throttler')
  throttlerConfig: IMidwayThrottlerOption;

  private _storage: IStorage;

  @Init()
  init() {
    console.log('guard初始化');

    //初始化 storage
    let {storage} = this.throttlerConfig;
    storage = storage || { type: StorageTypeEnum.memory };
    this._storage = StorageFactory.getStorage(storage);
  }

  /**
   * 从 class 上，或者方法上读取 meta data
   * @param key 
   * @param target 
   * @param propertyName 
   */
  getMetadataFromClassOrMethod<T>(key:string, suppilerClz:any, methodName: string):T {
    //先获取 method 上，有则返回
    let methodVal = getPropertyMetadata(key, suppilerClz, methodName);
    if(methodVal) {
      return methodVal;
    }
    //后从 class 上取
    let classVal = getClassMetadata(key, suppilerClz);
    return classVal;
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
    this.logger.info(`suppilerClz=%s, methodName=%s`, suppilerClz.name, methodName);

    const isSkip: boolean = this.getMetadataFromClassOrMethod<boolean>(
      THROTTLER_SKIP,
      suppilerClz,
      methodName
    );
    if (isSkip) {
      return true;
    }

    let ttl: number = this.getMetadataFromClassOrMethod<number>(
      THROTTLER_TTL,
      suppilerClz,
      methodName
    );
    let limit: number = this.getMetadataFromClassOrMethod<number>(
      THROTTLER_LIMIT,
      suppilerClz,
      methodName
    );

    ttl = ttl || this.throttlerConfig.ttl;
    limit = limit || this.throttlerConfig.limit;

    this.logger.info(`isSkip=%s, ttl=%s, limit=%s`, isSkip, ttl, limit);

    const reqIp = context.request.ip;
    if (!reqIp) {
      throw new Error('cannot get client request ip');
    }
    const key = this.generateKey(suppilerClz, methodName, reqIp);

    this.logger.info(`generateKey=%s`, key);

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
    let {response} = ctx;
    let ttls = await this._storage.getRecord(key);
    const nearestExpiryTime = ttls.length > 0 ? Math.ceil((ttls[0] - Date.now()) / 1000) : 0;

    let {errorMsg} = this.throttlerConfig;
    if(ttls.length >= limit) {
      response.set('Retry-After', nearestExpiryTime.toString());
      throw new Error(errorMsg || `rate is overlimit`);
    }

    await this._storage.addRecord(key, ttl);
    return true;
  }

  /**
   * generate key
   * @param suppilerClz
   * @param methodName
   * @param reqIp
   * @returns
   */
  generateKey(suppilerClz, methodName: string, reqIp: string): string {
    return this.md5(`${suppilerClz.name}_${methodName}_${reqIp}`);
  }

  public md5(str: string): string {
    return crypto.createHash('md5').update(str).digest('hex');
  }

  @Destroy()
  async destroy() {
    if(this._storage) {
      await this._storage.destory();
    }
  }
}
