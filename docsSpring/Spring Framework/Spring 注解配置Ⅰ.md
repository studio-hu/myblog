---
sidebar_position: 4
---

## 注入声明

### 一、前期说明

注解本身没有功能的，就和xml一样。注解和xml都是一种元数据，元数据即解释数据的数据，这就是所谓配置。

Spring3的基于注解实现Bean依赖注入支持如下三种注解：

- **Spring自带依赖注入注解：**Spring自带的一套依赖注入注解；
- **JSR-250注解：**Java平台的公共注解，是Java EE 5规范之一，在JDK6中默认包含这些注解，从Spring2.5开始支持。
- **JSR-330注解**：Java 依赖注入标准，Java EE 6规范之一，从Spring3开始支持；

### 注解配置对比XML配置

- 注解配置比XML配置更简洁，Spring注解方式减少了配置文件内容，更加便于管理，并且使用注解可以大大提高了开发效率！
- XML注入会在注解注入之后执行，所以XML配置将覆盖注解配置。

### 启用注解配置

默认情况下，Spring容器没有启用注解配置。需要在Bean的XML配置文件里打开组件扫描功能，启用注解配置。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       <!-- 加入context -->
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
                           http://www.springframework.org/schema/beans/spring-beans.xsd
                           http://www.springframework.org/schema/context 
                           http://www.springframework.org/schema/context/spring-context.xsd">
<!-- base-package 扫描包下所有的注解bean -->
<context:component-scan base-package="top.hyqstudio"/>
</beans>
```

## 二、注册bean的注解

Spring容器扫描指定包路径下的所有类，每当找到1个`@Component`注解，就会注册Bean，同时设置Bean ID。

**注: **默认情况下Bean ID就是类名，但首字母小写。如果类名以连续几个大写字母开头，首字母不小写。（即HELLOService -> HELLOService）

常用Spring的声明的注解，

| 注解         | 作用域                           | 说明                                                         |
| ------------ | -------------------------------- | ------------------------------------------------------------ |
| @Component   | 注解在类上，可以作用在任何层次。 | 泛指组件，当组件不好归类的时候，我们可以使用这个注解进行标注。是一个泛化的概念，仅仅表示一个组件 (Bean) ，将一个实体类，放入Spring中。 |
| @ Service    | 注解在类上                       | 用于标注业务层组件                                           |
| @ Controller | 注解在类上                       | 用于标注控制层组件                                           |
| @ Repository | 注解在类上                       | 用于标注数据访问组件，即DAO组件。                            |

### 1、Component

#### 说明

表示 Spring IoC 会把这个类扫描成一个 bean实例，而其中的 `value` 属性代表这个类在 Spring 中的 `id`，这就相当于在 XML 中定义的 Bean 的 id，甚至直接写成 `@Component`，对于不写的，Spring IoC 容器就默认以类名来命名作为 `id`，只不过首字母小写，配置到容器中。

#### 示例

```java
import org.springframework.stereotype.Component;
// 方式一 设置bean的id,理论上只要符合java的命名规范的名字都可以,但是必须是唯一的
@Component(value = "user")
public class User {
}
// 方式二 注解中value命名的属性可以省略不写
@Component("user")
public class User {
}
// 方式三 甚至可以直接什么都不加
@Component
public class User {
}
```

### 2、Controller

#### 说明

当一个组件代表业务层时，可以使用@Controller进行注解，bean 的ID 默认为类名称开头字母小写 

#### 示例

```java
@Controller('accountController')
public class AccountController {
    ...
}

//或者,
@Controller
public class AccountController {
    ...
}
```

### 3、Service

#### 说明

通常用于注解Service类，也就是服务层

#### 示例

```java
@Service
public class AccountServiceImpl implements AccountService {
    ...
}
```

### 4、Repository

#### 说明

当一个组件代表数据访问层（DAO）的时候，使用@Repository进行注解 ，bean 的ID默认为类名称开头字母小写

#### 示例

```java
@Repository
public class UserDaoImpl implements UserDao {
	...
}
//或者
@Repository("userDao")
public class UserDaoImpl implements UserDao {
	...
}
```

## 三、总结

1. 被注解的java类当做Bean实例，Bean实例的名称默认是Bean类的首字母小写，其他部分不变。

2. Controller 、@Repository、@Controller、 @Service可以自定义Bean名称，理论上只要符合java的命名规范的名字都可以，但是必须是唯一的,

3. 尽量使用对应组件注解的类替换@Component注解，在spring未来的版本中，@Controller，@Service，@Repository会携带更多语义。并且便于开发和维护！

4. 指定了某些类可作为Spring Bean类使用后，在Spring配置文件加入如下配置

   ```xml
   <context:component-scan base-package="自动扫描指定包及其子包下的所有Bean类"/>
   ```