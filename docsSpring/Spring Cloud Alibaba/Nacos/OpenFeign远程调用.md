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

### 1.开启Nacos权重负载均衡

![image-20240605232404865](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406052324900.png)

### 2.在Nacos中配置权重

![image-20240605232520757](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406052325797.png)

![image-20240605232501962](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406052325997.png)

## 三、最佳实践

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



