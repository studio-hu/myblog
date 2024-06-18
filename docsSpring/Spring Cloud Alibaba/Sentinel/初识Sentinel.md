---
sidebar_position: 1
---

# 初识Sentinel

## 一、雪崩问题及解决方案

### 1.雪崩问题

微服务中，服务间调用关系错综复杂，一个微服务往往依赖于多个其它微服务。

![1533829099748](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406171730337.png)

如图，如果服务提供者I发生了故障，当前的应用的部分业务因为依赖于服务I，因此也会被阻塞。此时，其它不依赖于服务I的业务似乎不受影响。

![1533829198240](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406171741298.png)

但是，依赖服务I的业务请求被阻塞，用户不会得到响应，则tomcat的这个线程不会释放，于是越来越多的用户请求到来，越来越多的线程会阻塞：

![1533829307389](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406171742480.png)

服务器支持的线程和并发数有限，请求一直阻塞，会导致服务器资源耗尽，从而导致所有其它服务都不可用，那么当前服务也就不可用了。

那么，依赖于当前服务的其它服务随着时间的推移，最终也都会变的不可用，形成级联失败，雪崩就发生了：

![image-20210715172710340](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406171742147.png)

解决雪崩问题的常见方式有四种：

### 2.超时处理

设定超时时间，请求超过一定时间没有响应就返回错误信息，不会无休止等待

![image-20240617174449792](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406171744829.png)

### 3.仓壁模式

仓壁模式来源于船舱的设计：船舱都会被隔板分离为多个独立空间，当船体破损时，只会导致部分空间进入，将故障控制在一定范围内，避免整个船体都被淹没。

![image-20210715172946352](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406171745880.png)

于此类似，我们可以限定每个业务能使用的线程数，避免耗尽整个tomcat的资源，因此也叫**线程隔离**

![image-20210715173215243](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406171746964.png)

### 4.断路器

断路器模式：由**断路器**统计业务执行的异常比例，如果超出阈值则会**熔断**该业务，拦截访问该业务的一切请求。

断路器会统计访问某个服务的请求数量，异常比例：

![image-20210715173327075](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406171746716.png)

当发现访问服务D的请求异常比例过高时，认为服务D有导致雪崩的风险，会拦截访问服务D的一切请求，形成熔断：

![image-20210715173428073](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406171747940.png)

### 5.限流

**流量控制**：限制业务访问的QPS，避免服务因流量的突增而故障。

![image-20210715173555158](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406171749630.png)

## 二、Sentinel介绍和安装

Sentinel是阿里巴巴开源的一款微服务流量控制组件。官网地址：https://sentinelguard.io/zh-cn/index.html

Sentinel 具有以下特征:

•**丰富的应用场景**：Sentinel 承接了阿里巴巴近 10 年的双十一大促流量的核心场景，例如秒杀（即突发流量控制在系统容量可以承受的范围）、消息削峰填谷、集群流量控制、实时熔断下游不可用应用等。

•**完备的实时监控**：Sentinel 同时提供实时的监控功能。您可以在控制台中看到接入应用的单台机器秒级数据，甚至 500 台以下规模的集群的汇总运行情况。

•**广泛的开源生态**：Sentinel 提供开箱即用的与其它开源框架/库的整合模块，例如与 Spring Cloud、Dubbo、gRPC 的整合。您只需要引入相应的依赖并进行简单的配置即可快速地接入 Sentinel。

•**完善的** **SPI** **扩展点**：Sentinel 提供简单易用、完善的 SPI 扩展接口。您可以通过实现扩展接口来快速地定制逻辑。例如定制规则管理、适配动态数据源等。

### 1.Sentinel 控制台安装

Sentinel 提供了开箱即用的控制台，方便我们对系统做限流设置。

可以从 [Release 页面](https://github.com/alibaba/Sentinel/releases) 下载最新版本的控制台 jar 包下载。

![image-20240617175836663](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406171758694.png)

### 2.运行

Sentinel 控制台是一个标准的 Spring Boot 应用，以 Spring Boot 的方式运行 jar 包即可。

```shell
java -Dserver.port=8080 -Dcsp.sentinel.dashboard.server=localhost:8080 -Dproject.name=sentinel-dashboard -jar sentinel-dashboard.jar
```

如果要修改Sentinel的默认端口、账户、密码，可以通过下列配置：

| **配置项**                       | **默认值** | **说明**   |
| -------------------------------- | ---------- | ---------- |
| server.port                      | 8080       | 服务端口   |
| sentinel.dashboard.auth.username | sentinel   | 默认用户名 |
| sentinel.dashboard.auth.password | sentinel   | 默认密码   |

### 3.访问

访问http://localhost:8080页面，就可以看到sentinel的控制台了，默认用户名和密码都为：sentinel

![image-20240617180303660](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406171803695.png)

## 三、微服务整合Sentinel

整合sentinel，并连接sentinel的控制台，步骤如下：

### 1.引入依赖

```xml
  <dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
</dependency>
```

### 2.配置控制台

```yml
spring:
  cloud:
    sentinel:
      transport:
        dashboard: localhost:8099
```

### 3.访问user-service的任意端点

打开浏览器，访问网关`http://localhost:9000/userApi/user/config`转发到user-service处理，这样才能触发sentinel的监控，或者直接访问user-service也可以

![image-20240617201658509](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406172016581.png)













