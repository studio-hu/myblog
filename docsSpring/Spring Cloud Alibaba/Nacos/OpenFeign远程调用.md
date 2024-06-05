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