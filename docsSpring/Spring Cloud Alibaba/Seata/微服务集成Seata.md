---
sidebar_position: 3
---

# 微服务集成Seata

## 1.引入依赖

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-seata</artifactId>
</dependency>
```

## 2.配置TC地址

在application.yml中，配置TC服务信息，通过注册中心nacos，结合服务名称获取TC地址：

```yaml
seata:
  registry: # TC服务注册中心的配置，微服务根据这些信息去注册中心获取tc服务地址
   # 参考tc服务自己的registry.conf/application.yml中的配置，如下图
    type: nacos # 注册中心类型 nacos
    nacos:
      server-addr: 127.0.0.1:8848 # nacos地址
      namespace: "" # namespace，默认为空
      group: DEFAULT_GROUP # 分组，默认是DEFAULT_GROUP
      application: seata-server # tc服务在nacos中的服务名称
      username: nacos
      password: nacos
  tx-service-group: seata-demo # 事务组名称,根据这个获取tc服务的cluster名称
  service:
    vgroup-mapping: # 事务组与cluster的映射关系
      seata-demo: DEFAULT # 默认cluster是DEFAULT
```

tc中`applicationyml`的配置：

![image-20240622182839462](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406221828503.png)



微服务如何根据这些配置寻找TC的地址呢？

我们知道注册到Nacos中的微服务，确定一个具体实例需要四个信息：

- namespace：命名空间
- group：分组
- application：服务名
- cluster：集群名



namespace为空，就是默认的public