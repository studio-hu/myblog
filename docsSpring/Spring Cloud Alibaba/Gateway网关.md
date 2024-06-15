# Gateway网关

## 一、为什么需要网关

Gateway网关是我们服务的守门神，所有微服务的统一入口。

- **权限控制**：网关作为微服务入口，需要校验用户是是否有请求资格，如果没有则进行拦截。

- **路由和负载均衡**：一切请求都必须先经过gateway，但网关不处理业务，而是根据某种规则，把请求转发到某个微服务，这个过程叫做路由。当然路由的目标服务有多个时，还需要做负载均衡。
- **限流**：当请求流量过高时，在网关中按照下流的微服务能够接受的速度来放行请求，避免服务压力过大。

![image-20210714210131152](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406151709796.png)

## 二、快速入门

路由配置包括：

1. 路由id：路由的唯一标示

2. 路由目标（uri）：路由的目标地址，http代表固定地址，lb代表根据服务名负载均衡

3. 路由断言（predicates）：判断路由的规则，

4. 路由过滤器（filters）：对请求或响应做处理

### 1.引入依赖

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-loadbalancer</artifactId>
</dependency>
```

### 2.编写启动类

```java
@SpringBootApplication
public class GatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }
}
```

### 3.配置文件

gateway是基于WebFlux的，修改web配置为`spring.main.web-application-type:reactive`

符合`Path` 规则的一切请求，都代理到 `uri`参数指定的地址，将 `/orderApi/**`开头的请求，代理到`lb://order-service`，lb是负载均衡，根据服务名拉取服务列表，实现负载均衡

```yml
server:
  port: 9000
spring:
  main:
    web-application-type: reactive
  cloud:
    nacos:
      discovery:
        server-addr: 127.0.0.1:8848
    gateway:
      routes: # 网关路由配置
        - id: order-service # 路由id，自定义，只要唯一即可
          # uri: http://127.0.0.1:8081 # 路由的目标地址 http就是固定地址
          uri: lb://order-service # 路由的目标地址 lb就是负载均衡，后面跟服务名称
          predicates: # 路由断言，也就是判断请求是否符合路由规则的条件
            - Path=/orderApi/** # 这个是按照路径匹配，只要以/orderApi/开头就符合要求
          filters:
            - StripPrefix=1 # 转发之前去掉前缀orderApi
        - id: user-service
          uri: lb://user-service 
          predicates:
            - Path=/userApi/**
          filters:
            - StripPrefix=1
  application:
    name: gateway-service

```

### 4.测试

重启网关，访问`http://localhost:9000/orderApi/order/test`时，符合`/orderApi/**`规则，请求转发到uri：`http://order-service/order/test`，得到了结果：

![image-20240615200930099](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406152009141.png)

## 三、断言工厂

在配置文件中写的断言规则只是字符串，这些字符串会被Predicate Factory读取并处理，转变为路由判断的条件

例如Path=/orderApi/**是按照路径匹配，这个规则是由`org.springframework.cloud.gateway.handler.predicate.PathRoutePredicateFactory`类来处理的，像这样的断言工厂在SpringCloudGateway还有十几个：

官方文档：https://docs.spring.io/spring-cloud-gateway/docs/4.0.9/reference/html/#gateway-request-predicates-factories

| **名称**   | **说明**                       | **示例**                                                     |
| ---------- | ------------------------------ | ------------------------------------------------------------ |
| After      | 是某个时间点后的请求           | -  After=2037-01-20T17:42:47.789-07:00[America/Denver]       |
| Before     | 是某个时间点之前的请求         | -  Before=2031-04-13T15:14:47.433+08:00[Asia/Shanghai]       |
| Between    | 是某两个时间点之前的请求       | -  Between=2037-01-20T17:42:47.789-07:00[America/Denver],  2037-01-21T17:42:47.789-07:00[America/Denver] |
| Cookie     | 请求必须包含某些cookie         | - Cookie=chocolate, ch.p                                     |
| Header     | 请求必须包含某些header         | - Header=X-Request-Id, \d+                                   |
| Host       | 请求必须是访问某个host（域名） | -  Host=**.somehost.org,**.anotherhost.org                   |
| Method     | 请求方式必须是指定方式         | - Method=GET,POST                                            |
| Path       | 请求路径必须符合指定规则       | - Path=/red/{segment},/blue/**                               |
| Query      | 请求参数必须包含指定参数       | - Query=name, Jack或者-  Query=name                          |
| RemoteAddr | 请求者的ip必须是指定范围       | - RemoteAddr=192.168.1.1/24                                  |
| Weight     | 权重处理                       |                                                              |



## 四、过滤器工厂

> GatewayFilter是网关中提供的一种过滤器，可以对进入网关的请求和微服务返回的响应做处理

![image-20210714212312871](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406152022349.png)

### 1.路由过滤器的种类

Spring提供了30多种不同的路由过滤器工厂。官方文档：https://docs.spring.io/spring-cloud-gateway/docs/4.0.9/reference/html/#gatewayfilter-factories

例如：

| **名称**             | **说明**                     |
| -------------------- | ---------------------------- |
| AddRequestHeader     | 给当前请求添加一个请求头     |
| RemoveRequestHeader  | 移除请求中的一个请求头       |
| AddResponseHeader    | 给响应结果中添加一个响应头   |
| RemoveResponseHeader | 从响应结果中移除有一个响应头 |
| RequestRateLimiter   | 限制请求的流量               |
| .....                |                              |



### 2.请求头过滤器

**需求**：给所有进入order-service的请求添加一个请求头：`Authorization=cloud demo`

只需要修改gateway服务的application.yml文件，添加路由过滤即可：

```yml
spring:
  cloud:
    gateway:
      routes:
        - id: order-service 
          uri: lb://order-service
          predicates:
            - Path=/orderApi/** 
          filters:
            - StripPrefix=1 # 转发之前去掉前缀orderApi
            - AddRequestHeader=Authorization, cloud demo # 添加请求头
```

当前过滤器写在order-service路由下，因此仅仅对访问order-service的请求有效。

### 3.默认过滤器

如果要对所有的路由都生效，则可以将过滤器工厂写到default下。格式如下：

```yml
spring:
  cloud:
    gateway:
      routes:
        - id: order-service 
          uri: lb://order-service
          predicates:
            - Path=/orderApi/** 
          filters: # 过滤器
            - StripPrefix=1 # 转发之前去掉前缀orderApi
      default-filters: # 默认过滤项
            - AddRequestHeader=Authorization, cloud demo # 添加请求头
```

## 五、全局过滤器

### 1.全局过滤器作用

官方文档：https://docs.spring.io/spring-cloud-gateway/docs/4.0.9/reference/html/#global-filters

过滤器工厂中每一种过滤器的作用都是固定的，如果我们希望拦截请求，做自己的业务逻辑则没办法实现。全局过滤器的作用也是处理一切进入网关的请求和微服务响应，与GatewayFilter的作用一样。区别在于GatewayFilter通过配置定义，处理逻辑是固定的；而GlobalFilters的逻辑需要自己写代码实现

在filter中编写自定义逻辑，可以实现下列功能：

- 登录状态判断
- 权限校验
- 请求限流等

定义方式是实现GlobalFilter接口。

```java
public interface GlobalFilter {
    /**
     *  处理当前请求，有必要的话通过{@link GatewayFilterChain}将请求交给下一个过滤器处理
     *
     * @param exchange 请求上下文，里面可以获取Request、Response等信息
     * @param chain 用来把请求委托给下一个过滤器 
     * @return {@code Mono<Void>} 返回标示当前过滤器业务结束
     */
    Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain);
}
```

### 2.自定义全局过滤器

需求：定义全局过滤器，拦截请求，判断请求的参数是否满足下面条件：

- 请求头中是否有authorization，

- authorization参数值是否为admin

```java
@Order(1)
@Component
public class AuthorizationFilter implements GlobalFilter {
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String authorization = request.getHeaders().getFirst("Authorization");
        if (!ObjectUtils.isEmpty(authorization) && Objects.equals(authorization, "admin")) {
            return chain.filter(exchange);
        }
        exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
        return exchange.getResponse().setComplete();
    }
}
```

### 3.过滤器执行顺序

请求进入网关后会碰到三类过滤器：当前路由的过滤器、DefaultFilter、GlobalFilters

请求路由后，会将当前路由的过滤器和DefaultFilter、GlobalFilters，合并到一个过滤器链（集合）中，排序后依次执行每个过滤器：

![image-20210714214228409](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406152059636.png)



排序的规则是什么呢？

- 每一个过滤器都必须指定一个int类型的order值，**order值越小，优先级越高，执行顺序越靠前**。
- GlobalFilter通过实现Ordered接口，或者添加@Order注解来指定order值，由我们自己指定
- 路由过滤器和defaultFilter的order由Spring指定，默认是按照声明顺序从1递增。
- 当过滤器的order值一样时，会按照 defaultFilter > 路由过滤器 > GlobalFilter的顺序执行。

## 六、跨域问题

跨域：域名不一致就是跨域，主要包括：

- 域名不同： www.taobao.com 和 www.taobao.org 和 www.jd.com 和 miaosha.jd.com

- 域名相同，端口不同：localhost:8080和localhost8081

跨域问题：浏览器禁止请求的发起者与服务端发生跨域ajax请求，请求被浏览器拦截的问题

### 解决跨域问题

官方文档：https://docs.spring.io/spring-cloud-gateway/docs/4.0.9/reference/html/#cors-configuration

在gateway服务的application.yml文件中，添加下面的配置：

```yml
server:
  port: 9000
spring:
  main:
    web-application-type: reactive
  cloud:
    nacos:
      discovery:
        server-addr: 127.0.0.1:8848
    gateway:
      routes:
        - id: order-service
          uri: lb://order-service
          predicates:
            - Path=/orderApi/**
          filters:
            - StripPrefix=1 # 转发之前去掉前缀orderApi
        - id: user-service
          uri: lb://user-service
          predicates:
            - Path=/userApi/**
          filters:
            - StripPrefix=1
      globalcors: # 全局跨域处理
        add-to-simple-url-handler-mapping: true #解决options请求被拦截问题
        cors-configurations:
          '[/**]':
            allowedOrigins: #允许哪些网站的跨域
              - "*"
            allowedMethods: #允许跨域的ajax请求方式
              - GET
              - POST
              - PUT
              - DELETE
              - PATCH
              - OPTIONS
            allowedHeaders: "*" # 允许在请求头中携带的头信息
            allowCredentials: true #是否允许携带cookie
            maxAge: 3600 # 这次跨域检测的有效期
  application:
    name: gateway-service

```









