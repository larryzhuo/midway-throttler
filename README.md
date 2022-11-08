## midway-throttler

midway request throttler component, based on [traffic-throttler](https://www.npmjs.com/package/traffic-throttler)。 It's core design base on [@nestjs/throttler](https://www.npmjs.com/package/@nestjs/throttler), and API will same as [@nestjs/throttler](https://www.npmjs.com/package/@nestjs/throttler).

这是基于 midway 3.0 的限流器组件模块，基于 [traffic-throttler](https://www.npmjs.com/package/traffic-throttler) 封装。核心逻辑来自 [@nestjs/throttler](https://www.npmjs.com/package/@nestjs/throttler), API 用法也尽量与其保持一致


## Install （安装）

> npm i midway-throttler --save

## Usage（用法）

### 1. 引入组件

首先在 src/configuration.ts 中引入组件，并且配置[全局守卫](https://midwayjs.org/docs/guard#%E5%85%A8%E5%B1%80%E5%AE%88%E5%8D%AB)

```typescript
import * as throttler from 'midway-throttler';
import { ThrottlerGuard } from 'midway-throttler';
import * as koa from '@midwayjs/koa';

@Configuration({
  imports: [koa, throttler], //import throttler 组件
  importConfigs: [join(__dirname, './config')],
})
export class ContainerLifeCycle {
  @App()
  app: koa.Application;

  async onReady() {
    //全局守卫配置
    this.app.useGuard(ThrottlerGuard);
  }
}
```

### 2. 配置相关参数

在 config.default.ts 配置文件中，配置如下

```typescript
throttler: {
  ttl?: number,    //时间窗口，在该时间段内限制 limit 个数的请求， 超出限流
  limit?: number,   //请求个数限制
  storage?: IThrottlerStorageOption,    //内部存储配置，支持 memory | redis 两种存储方式
  errorMsg?: string,  //超出限流后的报错信息
}
```

针对某些 Controller 或者某些 Method, 支持

1. 想覆盖全局配置，可以通过 Throttle 装饰器进行配置修改;
2. 想要不限流，可以通过 SkipThrottle 装饰器放开限流

```typescript
import { Controller, Get } from '@midwayjs/decorator';
import { SkipThrottle, Throttle } from 'midway-throttler';

@Throttle(2, 20) //重新配置
@Controller('/')
export class HomeController {
  @Throttle(1, 10) //重新配置
  @Get('/')
  async home(): Promise<string> {
    return 'Hello Midwayjs!';
  }

  @SkipThrottle(true) //该请求不限流
  @Get('/skip')
  async doSkip(): Promise<string> {
    return 'I am skip, no throttle';
  }
}
```

## Example（例子）

1. cd example
2. npm i
3. npm run dev
