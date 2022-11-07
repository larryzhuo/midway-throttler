import { savePropertyMetadata } from '@midwayjs/core';
import { THROTTLER_SKIP } from '../constant';

export function SkipThrottle(skip = true): MethodDecorator & ClassDecorator {
  return (
    target: any,
    propertyKey?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>
  ) => {
    if (descriptor) {
      savePropertyMetadata(THROTTLER_SKIP, skip, target, propertyKey);
      return descriptor;
    }
    savePropertyMetadata(THROTTLER_SKIP, skip, target, propertyKey);
    return target;
  };
}
