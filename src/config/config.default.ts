import { StorageTypeEnum } from "traffic-throttler";
import { IMidwayThrottlerOption } from "../interface";

export const throttler:IMidwayThrottlerOption = {
  ttl: 10,
  limit: 3,
  storage: {
    type: StorageTypeEnum.memory
  }
};
