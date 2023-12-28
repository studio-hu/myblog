---
sidebar_position: 9 
---

# Spring AOP基于注解

## 一、依赖导入

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context</artifactId>
    <version>6.1.0</version>
</dependency>
<!-- spring-aspects依赖 -->
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-aspects</artifactId>
    <version>6.1.0</version>
</dependency>
```



## 二、启用@AspectJ支持

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/context https://www.springframework.org/schema/context/spring-context.xsd http://www.springframework.org/schema/aop https://www.springframework.org/schema/aop/spring-aop.xsd">
    <context:component-scan base-package="top.hyqstudio"/>
    <!--开启AOP自动代理-->
    <aop:aspectj-autoproxy/>
</beans>
```



## 三、准备一个被代理的类

```java
public interface TestService {
    void test();
}

@Service
public class TestServiceImpl implements TestService {
    @Override
    public void test() {
        System.out.println("test中的核心方法");
    }
}
```



## 四、声明一个切面

```java
/**
 * @author 追梦路上的孩子
 * @version 1.0
 * @date 2023/12/28 9:41
 */
@Aspect
@Component
public class LogAdvice {

}
```



## 五、声明一个切入点

### @Pointcut核心注解

```java
@Pointcut(value="", argNames = "")
```

| 属性     | 说明                                                         | 备注 |
| -------- | ------------------------------------------------------------ | ---- |
| value    | 指定切入点表达式                                             |      |
| argNames | 指定命名切入点方法参数列表参数名字，可以有多个用“，”分隔，这些参数将传递给通知方法同名的参数 | 说明 |

```java
/**
 * @author 追梦路上的孩子
 * @version 1.0
 * @date 2023/12/28 9:41
 */
@Aspect
@Component
public class LogAdvice {

    @Pointcut("execution(* top.hyqstudio.service.TestService.test(..))")
    public void pointCut() {
    }
}
```
![image-20231228193835707](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202312281938757.png)



## 六、定义通知

```java
/**
 * @author 追梦路上的孩子
 * @version 1.0
 * @date 2023/12/28 9:41
 */
@Aspect
@Component
public class LogAdvice {

    @Pointcut("execution(* top.hyqstudio.service.TestService.test(..))")
    public void pointCut() {
    }

    @Before("pointCut()")
    public void before() {
        System.out.println("前置通知");
    }

    @AfterReturning("pointCut()")
    public void afterRunning() {
        System.out.println("返回通知");
    }

    @AfterThrowing(value = "pointCut()", throwing = "ex")
    public void afterThrowing(RuntimeException ex) {
        System.out.println("异常通知");
    }

    @After("pointCut()")
    public void after() {
        System.out.println("后置通知");
    }

    @Around("pointCut()")
    public Object around(ProceedingJoinPoint pjp) throws Throwable {
        System.out.println("环绕通知前");
        // 执行核心方法
        Object proceed = pjp.proceed();
        System.out.println("环绕通知后");
        return proceed;
    }
}
```



**测试**

```java
/**
 * @author 追梦路上的孩子
 * @version 1.0
 * @date 2023/12/27 19:22
 */
@ExtendWith(SpringExtension.class)
@ContextConfiguration({"classpath:spring-ioc.xml"})
public class TestProxy {
    @Autowired
    private TestService testService;

    @Test
    public void  testAop() {
        testService.test();
    }

}
```

![image-20231228194358327](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202312281943366.png)



## 七、切面的优先级

在同一个连接点上应用不止一个切面时, 除非明确指定, 否则它们的优先级是不确定的

- 切面的优先级可以通过实现 Ordered 接口或利用 @Order 注解指定.
  实现 Ordered 接口, getOrder() 方法的返回值越小, 优先级越高.

- 若使用 @Order 注解, 序号出现在注解中，**值越小优先级越高**

**示例**

```java
@Order(2)
@Aspect
@Component
public class LogAdvice {

    @Pointcut("execution(* top.hyqstudio.service.TestService.test(..))")
    public void pointCut() {
    }

    @Before("pointCut()")
    public void before() {
        System.out.println("advice===>前置通知");
    }

    @AfterReturning("pointCut()")
    public void afterRunning() {
        System.out.println("advice===>返回通知");
    }

    @AfterThrowing(value = "pointCut()", throwing = "ex")
    public void afterThrowing(RuntimeException ex) {

        System.out.println("advice===>异常通知");
    }

    @After("pointCut()")
    public void after() {
        System.out.println("advice===>后置通知");
    }

    @Around("pointCut()")
    public Object around(ProceedingJoinPoint pjp) throws Throwable {
        System.out.println("advice===>环绕通知前");
        Object proceed = pjp.proceed();
        System.out.println("advice===>环绕通知后");
        return proceed;
    }
}
```

```java
@Order(1)
@Aspect
@Component
public class LogAdvice2 {

    @Pointcut("execution(* top.hyqstudio.service.TestService.test(..))")
    public void pointCut() {
    }

    @Before("pointCut()")
    public void before() {
        System.out.println("advice2===>前置通知");
    }

    @AfterReturning("pointCut()")
    public void afterRunning() {
        System.out.println("advice2===>返回通知");
    }

    @AfterThrowing(value = "pointCut()", throwing = "ex")
    public void afterThrowing(RuntimeException ex) {

        System.out.println("advice2===>异常通知");
    }

    @After("pointCut()")
    public void after() {
        System.out.println("advice2===>后置通知");
    }

    @Around("pointCut()")
    public Object around(ProceedingJoinPoint pjp) throws Throwable {
        System.out.println("advice2===>环绕通知前");
        Object proceed = pjp.proceed();
        System.out.println("advice2===>环绕通知后");
        return proceed;
    }
}
```

**结果：越小优先级越高**

![image-20231228195319306](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202312281953343.png)

![image-20231228195937319](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202312281959366.png)



