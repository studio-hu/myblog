---
sidebar_position: 3
---

# OpenFeign

## JAVA 项目中如何实现接口调用？

**1）Httpclient**

HttpClient 是 Apache Jakarta Common 下的子项目，用来提供高效的、最新的、功能丰富的支持 Http 协议的客户端编程工具包，并且它支持 HTTP 协议最新版本和建议。HttpClient相比传统 JDK 自带的 URLConnection，提升了易用性和灵活性，使客户端发送 HTTP 请求变得容易，提高了开发的效率。

**2）Okhttp**

一个处理网络请求的开源项目，是安卓端最火的轻量级框架，由 Square 公司贡献，用于替代HttpUrlConnection 和 Apache HttpClient。OkHttp 拥有简洁的 API、高效的性能，并支持多种协议（HTTP/2 和 SPDY）。

**3）HttpURLConnection**

HttpURLConnection 是 Java 的标准类，它继承自 URLConnection，可用于向指定网站发送GET 请求、POST 请求。HttpURLConnection 使用比较复杂，不像 HttpClient 那样容易使用。

**4）RestTemplate WebClient**

RestTemplate 是 Spring 提供的用于访问 Rest 服务的客户端，RestTemplate 提供了多种便捷访问远程 HTTP 服务的方法，能够大大提高客户端的编写效率。

## 1. 什么是Feign

Feign是Netflix开发的声明式、模板化的HTTP客户端，其灵感来自Retrofit、JAXRS-2.0以及WebSocket。Feign可帮助我们更加便捷、优雅地调用HTTP API。

Feign支持多种注解，例如Feign自带的注解或者JAX-RS注解等。(**原生注解**已基本不用)

![image-20240614200715614](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406142007724.png)

**Spring Cloud openfeign对Feign进行了增强，使其支持Spring MVC注解，另外还整合了Ribbon（已启用替换为loadbalancer）和Nacos，从而使得Feign的使用更加方便**

**优势：**

> Feign可以做到使用 HTTP 请求远程服务时就像调用本地方法一样的体验，开发者完全感知不到这是远程方法，更感知不到这是个 HTTP 请求。它像 Dubbo 一样，consumer 直接调用接口方法调用 provider，而不需要通过常规的 Http Client 构造请求再解析返回数据。它解决了让开发者调用远程接口就跟调用本地方法一样，无需关注与远程的交互细节，更无需关注分布式环境开发

## 2.Spring Cloud Alibaba快速整合OpenFeign

### 1）导入依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

负载均衡依赖：

```xml
 <dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-loadbalancer</artifactId>
</dependency>
```

### 2）在启动类上添加@EnableFeignClients注解

```java
@SpringBootApplication
@EnableFeignClients
public class FeignDemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(FeignDemoApplication.class, args);
    }
}
```

### 3）编写调用接口+@FeignClient注解

`value`：服务名称，`path`：访问前缀

```java
@FeignClient(value = "order-service",path = "/order")
public interface OrderFeignClient {
    @GetMapping("/findOrderByUserId/{userId}")
    public R findOrderByUserId(@PathVariable("userId") Integer userId);
}
```

### 4）发起调用

```java
@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private OrderFeignClient orderFeignClient;
    
    @RequestMapping(value = "/findOrderByUserId/{id}")
    public R findOrderByUserId(@PathVariable("id") Integer id) {
        //feign调用
        R result = orderFeignClient.findOrderByUserId(id);
        return result;
    }
}
```

## 3.日志配置

- **NONE**【性能最佳，适用于生产】：不记录任何日志（默认值）。
- **BASIC**【适用于生产环境追踪问题】：仅记录请求方法、URL、响应状态代码以及执行时间。
- **HEADERS**：记录BASIC级别的基础上，记录请求和响应的header。
- **FULL**【比较适用于开发及测试环境定位问题】：记录请求和响应的header、body和元数据。

**Feign的日志基本为debug，Spring Boot默认的日志级别是info，设置日志显示基本为debug**

```
logging:
  level:
    top.hyqstudio.user.feign: debug
```



### 1）全局配置

- **方法一**：配置类

```java
@Configuration
public class FeignConfig {
    @Bean
    public Logger.Level feignLoggerLevel() {
        return Logger.Level.FULL;
    }
}
```

- **方法二**：配置文件

```yml
feign:
  client:
    config:
      default:
        # 日志级别
        logger-level: full
```

### 2）局部配置

- **方法一**：配置参数

**注意：此方法配置类不能添加@Configuration注解**

![image-20240614204119064](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406142041108.png)

- **方法二**：配置文件

```yml
feign:
  client:
    config:
      # 配置单个服务(服务名称)
      order-service:
        logger-level: full
```

## 4.超时时间配置和重试

### 1）超时时间配置

默认连接超时时间为10s，请求处理超时时间为60s

![image-20240614210729864](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406142107913.png)

- **方法一**：配置类

```java
@Configuration
public class FeignConfig {
    @Bean
    public Logger.Level feignLoggerLevel() {
        return Logger.Level.FULL;
    }

    @Bean
    public Request.Options feignOptions() {
        /**
         * 配置Feign超时时间
         * 第一个参数是连接的超时时间2s
         * 第二个参数是读取（请求处理）的超时时间5s
         */
        return new Request.Options(2, TimeUnit.SECONDS, 5, TimeUnit.SECONDS, true);
    }
}
```

- **方法二**：配置文件

```yml
feign:
  client:
    config:
      default:
        # 日志级别
        logger-level: full
        connect-timeout: 2000
        read-timeout: 5000
```

### 2）重试机制配置

OpenFeign 默认情况下是不会自动开启超时重试机制的，所以想要使用超时重试功能，需要手动配置

**注意：开启重试机制要特别注意接口的幂等性处理**

- **方法一**：配置类

```java
@Configuration
public class RetryerConfig {
    @Bean
    public Retryer retryer(){
        /**
         * 第一个参数1000ms：初始重试间隔，单位为毫秒
         * 第二个参数1000ms：最大重试间隔，单位为毫秒
         * 第三个参数3：最大重试次数
         */
        return new Retryer.Default(1000, 1000, 3);
    }
}
```

- **方法二**：配置文件

```yml
feign:
  client:
    config:
      default:
        # 日志级别
        logger-level: full
        connect-timeout: 2000
        read-timeout: 5000
        # 开启默认超时重试机制
        retryer: feign.Retryer.Default
```

默认机制：初始重试间隔100ms，最大重试间隔时间1s，最大重试次数5次

![image-20240614211733558](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406142117607.png)



## 5.底层客户端组件配置

Feign 中默认使用 JDK 原生的 URLConnection 发送 HTTP 请求，我们可以集成别的组件来替换掉 URLConnection，比如 Apache HttpClient，OkHttp

### 1）配置Apache HttpClient

**引入依赖**

```xml
<!-- HttpClient替换Feign底层客户端实现 -->
<dependency>
    <groupId>io.github.openfeign</groupId>
    <artifactId>feign-httpclient</artifactId>
</dependency>
```

**修改配置文件**

```java
feign:
  httpclient:
    enabled: true
    max-connections: 200  # 最大的连接数
    max-connections-per-route: 50 # 每个路径的最大连接数
```

### 2）配置 OkHttp

**引入依赖**

```xml
<!-- OKHttp替换Feign底层客户端实现 -->
<dependency>
    <groupId>io.github.openfeign</groupId>
    <artifactId>feign-okhttp</artifactId>
</dependency
```

**修改配置文件**

```yml
feign:
  httpclient:
    enabled: false
    max-connections: 200  # 最大的连接数
    max-connections-per-route: 50 # 每个路径的最大连接数
  okhttp:
    enabled: true
```



## 6.契约配置

Spring Cloud 在 Feign 的基础上做了扩展，使用 Spring MVC 的注解来完成Feign的功能。原生的 Feign 是不支持 Spring MVC 注解的，如果你想在 Spring Cloud 中使用原生的注解方式来定义客户端也是可以的，通过配置契约来改变这个配置，Spring Cloud 中默认的是 SpringMvcContract。

Spring Cloud  早期版本就是用的原生Fegin. 随着netflix的停更替换成了Open feign

- **方法一**：配置类

```java
@Configuration
public class FeignConfig {
    @Bean
    public Logger.Level feignLoggerLevel() {
        return Logger.Level.FULL;
    }

    @Bean
    public Request.Options feignOptions() {
        /**
         * 配置Feign超时时间
         * 第一个参数是连接的超时时间2s
         * 第二个参数是读取（请求处理）的超时时间5s
         */
        return new Request.Options(2, TimeUnit.SECONDS, 5, TimeUnit.SECONDS, true);
    }

    /**
     * 修改契约配置，使其支持Feign原生的注解
     */
    @Bean
    public Contract feignContract() {
        return new Contract.Default();
    }
}
```

- **方法二**：配置文件

```yml
feign:
  client:
    config:
      # 配置单个服务(服务名称)
      order-service:
        logger-level: full
        contract: feign.Contract.Default
```

**注意：修改契约配置后，将不再支持springmvc的注解，需要使用Feign原生的注解**

使用Feign原生的注解：

```java
@FeignClient(value = "order-service",path = "/order")
public interface OrderFeignService {
    @RequestLine("GET /findOrderByUserId/{userId}")
    public R findOrderByUserId(@Param("userId") Integer userId);
}
```



















