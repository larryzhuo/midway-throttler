import { MidwayConfig } from '@midwayjs/core';
import { StorageTypeEnum } from 'midway-throttler';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1667812240207_4756',
  koa: {
    port: 7001,
  },

  throttler: {
    ttl: 10,
    limit: 3,
    storage: {
      type: StorageTypeEnum.memory,
    },
    errorMsg: '请求过于频繁',
  },
} as MidwayConfig;
