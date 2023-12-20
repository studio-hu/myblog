---
sidebar_position: 7
---

# Spring JavaConfig配置

## 一、概要

> 前面介绍了Bean的XML配置方法，从Spring 3.0开始，可以使用java代码配置Bean，替代XML配置。Java配置与注解配置不同，Java配置是把Java代码文件当作配置文件，注解配置是在实际Java类中使用注解设置依赖关系。Java配置也会用到一些注解，主要有：`@Configuration`、`@ComponentScan`和`@Bean`。
>
> **Spring Boot中彻底抛弃了xml配置 后期推荐使用此种方式**

## 二、通过@Configuration注解创建Java配置类

> `@Configuration`注解标注的类是配置类，用于配置Bean之间依赖关系。
>
> `@Import`注解允许从另一个配置Java/XML文件加载bean定义。

**栗子**

```java
// 表明这是个Bean的Java配置类
@Configuration 
public class DruidConfig {
}
```

## 三、 通过@Bean注解定义Bean

> 要定义一个Bean，可以通过：
>
> 1. 给一个方法加`@Bean`注解
> 2. 方法返回Bean实例
>
> Spring容器会注册这个Bean，并将方法名作为Bean ID

```java
@Configuration 
public class SpringConfig {

 // 定义 App Bean
 // 指定初始化回调，销毁回调
 @Bean(initMethod = "init", destroyMethod = "close" ) 
 // 设置Bean作用域
 @Scope("prototype")
 public App app() { 
 // 返回App Bean
  return new App();
 }
}
```

## 四、注入Bean依赖关系

> 可以通过让一个Bean方法调用另一个Bean方法注入依赖项。

```java
@Configuration
public class SpringConfig {

  // 定义 App Bean
  @Bean
  public App app() 
    // 调用Bean方法logger()注入Logger Bean实例
    return new App(); 
  }
}
```

## 五、 读取配置类

> 可以使用`AnnotationConfigApplicationContext`读取配置类。

```java
public class Test {
public static void main(String[] args) {
  // 使用`AnnotationConfigApplicationContext`读取配置类
  ApplicationContext context = new AnnotationConfigApplicationContext(SpringConfig.class);
 }
}
```

## 六、通过Spring容器获取bean

```java
App app = context.getBean("app", App.class);
```

