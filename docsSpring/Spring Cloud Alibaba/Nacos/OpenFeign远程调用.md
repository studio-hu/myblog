---
sidebar_position: 3
---
# OpenFeign远程调用

## 一、基本使用

### 1.导入依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

负载均衡依赖

```xml
 <dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-loadbalancer</artifactId>
</dependency>
```

缺少`loadbalancer`依赖启动会报以下错误

![image-20240605225656555](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406052256618.png)

### 2.添加注解

在启动类上添加`@EnableFeignClients`

```java
@EnableFeignClients
@SpringBootApplication
public class UserServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(UserServerApplication.class, args);
    }
}
```



### 3.编写FeignClient

新建一个接口

```java
@FeignClient("order-service")
public interface OrderFeignClient {
    @GetMapping("/order/test")
    String test();
}
```

这个客户端主要是基于SpringMVC的注解来声明远程调用的信息，比如：

- 服务名称：order-service
- 请求方式：GET
- 请求路径：/order/test
- 请求参数：无
- 返回值类型：String

### 4.测试

```java
@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private OrderFeignClient orderFeignClient;

    @GetMapping("/test")
    public String test() {
        //使用OpenFeign调用order-service的接口，发起http请求
        String res = orderFeignClient.test();
        return "user-service远程访问结果：" + res;
    }
}
```

order-service服务的接口

```java
@RestController
@RequestMapping("/order")
public class OrderController {
    @GetMapping("/test")
    public String test() {
        System.out.println("order-server:我被访问了");
        return "order-server服务";
    }
}
```

测试结果

![image-20240605230950285](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406052309339.png)

## 二、负载均衡

> 默认的负载均衡策略为：**轮询**策略
>
> SpringCloud新版本（2021.x.x）中负载均衡器用LoadBalancer替代了Ribbon，默认只提供了2种负载均衡策略：RandomLoadBalancer 和 RoundRobinLoadBalancer。
> SpringCloud Alibaba Nacos 2021.1版本提供了基于Nacos注册中心的轮询策略 NacosLoadBalancer 是基于权重的策略。

### 1.开启Nacos权重负载均衡

> NacosLoadBalancer的权重策略默认是关闭的。**仅识别流量值为0（不引入流量）和非0（引入流量），不支持按照Nacos实例中的流量值进行流量负载均衡。** 如果要使用基于权重的负载策略要手动开启。

![image-20240605232404865](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406052324900.png)

### 2.在Nacos中配置权重

>Nacos提供了权重配置来控制访问频率，权重越大则访问频率越高（0~1）

![image-20240605232520757](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406052325797.png)

![image-20240605232501962](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406052325997.png)

### 3.配置集群

- 部署GZ集群（order-service和user-service）

![image-20240606215634247](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406062156282.png)

- 部署SZ集群（order-service）

#### 1）复制一份运行配置

![image-20240606215422967](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406062154028.png)

#### 2）修改端口号和集群

![image-20240606215529423](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406062155472.png)

![image-20240606215534122](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406062155164.png)

- 重启服务

![image-20240606215935650](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406062159683.png)

> 目前order-service有SZ和GZ两个集群，SZ集群一个实例，GZ集群两个实例
>
> user-service只有GZ集群一个实例

![image-20240606220145411](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406062201452.png)

order-service：

![image-20240606220205802](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406062202846.png)

user-service：

![image-20240606220238936](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406062202971.png)

**user-service发起远程调用时，优先访问同集群下的服务，同集群内随机挑选；当同集群不可用时，再跨集群调用**

## 三、环境隔离

Nacos提供了namespace来实现环境隔离功能。

- nacos中可以有多个namespace
- namespace下可以有group、service等
- 不同namespace之间相互隔离，例如不同namespace的服务互相不可见

### 1.创建namespace为dev

> 默认情况下，所有service、data、group都在同一个namespace，名为public

![image-20240606221132655](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406062211691.png)

点击新增按钮，新增dev命名空间

![image-20240606221227261](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406062212305.png)

![image-20240606221329840](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406062213880.png)

### 2.给微服务配置namespace

修改user-service的application.yml文件为：

```yml
spring:
  application:
    name: user-service
  cloud:
    nacos:
      discovery:
        server-addr: 127.0.0.1:8848
        cluster-name: GZ
        namespace: e675c8c6-3ba5-49d5-b2f8-173fd70569bb # 命名空间
    loadbalancer:
      nacos:
        enabled: true
```

重启服务，访问控制台，可以看到多了一个dev

![image-20240606221752834](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406062217872.png)

![image-20240606221818977](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406062218013.png)

此时访问user-service，因为namespace不同，会导致找不到order-service，控制台会报错：

![image-20240606221941905](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406062219944.png)

## 四、最佳实践

### 1.Feign底层的客户端实现

- Feign 发送 HTTP 请求时，底层会使用到别的客户端

|    HTTP客户端     |              特点              |
| :---------------: | :----------------------------: |
| HttpURLConnection | Feign 的默认实现，不支持连接池 |
| Apache HttpClient |           支持连接池           |
|      OKHttp       |           支持连接池           |

- 其中，`URLConnection` 是 Feign 默认使用的 HTTP 客户端，是 JDK 自带的，但是性能不太好，而且不支持连接池。连接池可以减小 HTTP 连接创建和销毁所带来的性能损耗

![image-20240606171915970](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406061719040.png)

![image-20240606172439755](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406061724799.png)



### 2.更换底层客户端

- #### 切换为`Apache HttpClient`

##### 1）引入依赖

```xml
<!-- HttpClient替换Feign底层客户端实现 -->
<dependency>
    <groupId>io.github.openfeign</groupId>
    <artifactId>feign-httpclient</artifactId>
</dependency>
```

##### 2）修改配置文件

```yml
feign:
  client:
    config:
      default:
        # 日志级别
        logger-level: full
  httpclient:
    enabled: true
    max-connections: 200  # 最大的连接数
    max-connections-per-route: 50 # 每个路径的最大连接数
# springboot默认的日志级别是info，feign的日志级别为dubug
logging:
  level:
    top.hyqstudio.user.feign: debug
```

![image-20240606172905424](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406061729467.png)

- #### 切换为`OKHttp`（推荐）

##### 1）引入依赖

```xml
<!-- OKHttp替换Feign底层客户端实现 -->
<dependency>
    <groupId>io.github.openfeign</groupId>
    <artifactId>feign-okhttp</artifactId>
</dependency>
```

##### 2）修改配置文件

```yml
feign:
  client:
    config:
      default:
        # 日志级别
        logger-level: full
  httpclient:
    enabled: false
    max-connections: 200  # 最大的连接数
    max-connections-per-route: 50 # 每个路径的最大连接数
  okhttp:
    enabled: true
# springboot默认的日志级别是info，feign的日志级别为dubug
logging:
  level:
    top.hyqstudio.user.feign: debug 
```

![image-20240606172652224](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406061726259.png)

### 3.抽取公共部分为API

原项目结构

![image-20240606175425297](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406061754331.png)

order控制层

![image-20240606175646025](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406061756061.png)

##### 

feign客户端

![image-20240606175704722](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406061757752.png)

1.新建order-api模块，抽出公共部分定义为接口

![image-20240606180248624](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406061802669.png)

2.导入order-api模块使用

```xml
<dependency>
    <groupId>top.hyqstudio.order.api</groupId>
    <artifactId>order-api</artifactId>
    <version>0.0.1</version>
</dependency>
```

3.controller去实现api接口

![image-20240606181833492](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406061818527.png)

4.feign继承api接口

![image-20240606181917637](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406061819671.png)

5.抽取完成

![image-20240606182721885](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406061827947.png)



