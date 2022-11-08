import { saveClassMetadata, savePropertyMetadata } from '@midwayjs/core';
import { THROTTLER_LIMIT, THROTTLER_TTL } from '../constant';

export const MODEL_KEY = 'decorator:midway-trottler:throttle';

export function Throttle(
  limit = 20,
  ttl = 60
): MethodDecorator & ClassDecorator {
  return (
    target: any,  //method时=class对象, class时=[class HomeController]
    propertyKey?: string | symbol,  //method时=方法名， class时=undefined
    descriptor?: TypedPropertyDescriptor<any> //method时={ value: , writable: true, enumerable: false, configurable: true }， class时=undefined
  ) => {
    if(propertyKey) {
      savePropertyMetadata(THROTTLER_TTL, ttl, target, propertyKey);
      savePropertyMetadata(THROTTLER_LIMIT, limit, target, propertyKey);
    } else {
      saveClassMetadata(THROTTLER_TTL, ttl, target);
      saveClassMetadata(THROTTLER_LIMIT, limit, target);
    }
  };
}
