# midway-nacos
use nacos in midwayjs。

这是基于 midway 3.0 的 nacos 组件模块，基于 [nacos模块](https://github.com/nacos-group/nacos-sdk-nodejs) 封装

## 引入组件

首先，引入 组件，在 src/configuration.ts 中导入

```ts
import { Configuration } from '@midwayjs/decorator';
import * as nacos from 'midway-nacos';
import { join } from 'path';

@Configuration({
  imports: [
    // ...
    nacos, // 导入 nacos 组件
  ],
  importConfigs: [join(__dirname, 'config')],
})
export class ContainerLifeCycle {}
```

## 配置

单客户端配置

```ts
// src/config/config.default.ts
export default {
  // ...
  nacos: {
    'registry': {     //注册中心
      client: {     //单实例 https://midwayjs.org/en/docs/service_factory#%E5%8D%95%E4%B8%AA%E5%AE%9E%E4%BE%8B
        serverList: '127.0.0.1:8848', // replace to real nacos serverList
        namespace: 'public',
      }
    },
    'config': {     //配置中心
      client: {
        serverAddr: '127.0.0.1:8848',
      }
    }
  }
};
```

## 使用

```ts
import { NacosNamingFactoryService } from 'midway-nacos';
import { join } from 'path';

@Provide()
export class UserService {
  
  @Inject()
  nacosNamingFactoryService: NacosNamingFactoryService;
  
  async invoke() {
    
    const namingIns = this.nacosNamingFactoryService.get();
    
    let status = await namingIns.getServerStatus();     //namingIns 就是 https://github.com/nacos-group/nacos-sdk-nodejs NacosNamingClient实例

  }
}
```