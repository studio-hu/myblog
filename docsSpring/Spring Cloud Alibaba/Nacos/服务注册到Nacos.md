---
sidebar_position: 2
---

# 服务注册到Nacos

## 一、导入依赖

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
```

**注意：**导入Nacos依赖的前提要在父工程中引入Spring Cloud Alibaba依赖

```xml
<properties>
    <spring-cloud-alibaba.version>2021.0.5.0</spring-cloud-alibaba.version>
</properties> 
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-alibaba-dependencies</artifactId>
            <version>${spring-cloud-alibaba.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

## 二、配置Nacos服务地址

在配置文件application.yml中添加Nacos地址：

**注意：**服务名称也要配置，否则无法注册到Nacos中

```yml title='application.yml'
spring:
  application:
    name: order-service
  cloud:
    nacos:
      discovery:
        server-addr: 127.0.0.1:8848
```



## 三、重启服务

重启服务，在Nacos管理页面可以查看服务信息

![image-20240605214229289](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406052142357.png)
