import { savePropertyMetadata } from '@midwayjs/core';
import { THROTTLER_LIMIT, THROTTLER_TTL } from '../constant';

export const MODEL_KEY = 'decorator:midway-trottler:throttle';

function setThrottlerMetadata(
  target: any,
  limit: number,
  ttl: number,
  propertyKey
): void {
  savePropertyMetadata(THROTTLER_TTL, ttl, target, propertyKey);
  savePropertyMetadata(THROTTLER_LIMIT, limit, target, propertyKey);
}

export function Throttle(
  limit = 20,
  ttl = 60
): MethodDecorator & ClassDecorator {
  return (
    target: any,
    propertyKey?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>
  ) => {
    if (descriptor) {
      setThrottlerMetadata(descriptor.value, limit, ttl, propertyKey);
      return descriptor;
    }
    setThrottlerMetadata(target, limit, ttl, propertyKey);
    return target;
  };
}
