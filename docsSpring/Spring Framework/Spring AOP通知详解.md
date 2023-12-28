---
sidebar_position: 10
---

# Spring AOP通知详解

## 一、概要

>  通知是跟一个切入点表达式关联起来的，并且在切入点匹配的方法执行之前或者之后或者前后运行。 切入点表达式可能是指向已命名的切入点的简单引用或者是一个已经声明过的切入点表达式，通知的类型就是我们前面提到过的类型

## 二、前置通知

> 在关注点执行前运行的方法，切面里使用 `@Before` 注解声明前置通知

### @Before注解

```java
@Before(value = "", argNames = "")
```

| 属性     | 说明                                                         |
| -------- | ------------------------------------------------------------ |
| value    | 指定切入点表达式或切入点名字；                               |
| argNames | 用来接收AspectJ表达式中的参数,并指定通知方法中的参数，一般不会用 |



### 示例代码

```java
import org.springframework.stereotype.Component;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.annotation.Before;
@Aspect
@Component
public class LogAspect {
    /**
     * @Pointcut() 切入点表达式
     */
    @Pointcut("execution(* com.wener.example.aop.aspect.*.*(..))")
    public void logPointcut() {

    }
    /**
     * @Before 前置通知
     * value：指定切入点表达式或命名切入点；
     * argNames： 参数
     */
    @Before("logPointcut()")
    public void before() {
        System.out.println("前置通知");
    }
}
```

## 三、后置通知(最终通知)

> 不论一个方法是如何结束的，最终通知都会运行。使用`@After` 注解来声明。最终通知必须准备处理正常返回和异常返回两种情况。通常用它来释放资源。相当于异常处理里finally的代码

### @After

```java
@After(value = "", argNames = "")
```

| 属性     | 说明                                                 |
| -------- | ---------------------------------------------------- |
| value    | 指定切入点表达式或切入点名字；                       |
| argNames | 用来接收AspectJ表达式中的参数,并指定通知方法中的参数 |

### 示例

```java
import org.springframework.stereotype.Component;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Before;

@Aspect
@Component
public class LogAspect {
    /**
     * @Pointcut() 切入点表达式
     */
    @Pointcut("execution(* com.wener.example.aop.aspect.*.*(..))")
    public void logPointcut() {

    }
    /**
     * @After 后置通知 
     */
    @After(value = "logPointcut()")
    public void after() {
        System.out.println("后置通知");
    }
}
```

## 四、返回通知

>  返回后通知通常在一个匹配的方法返回的时候执行。使用 `@AfterReturning` 注解来声明

### @AfterReturning

```java
@AfterReturning(value="",pointcut="",returning="",argNames="")
```

| 属性            | 说明                                                         |
| --------------- | ------------------------------------------------------------ |
| **value**：     | 指定切入点表达式或切入点名字；                               |
| **pointcut**：  | 指定切入点表达式或命名切入点，如果指定了将覆盖value属性的，pointcut具有高优先级； |
| **returning**： | 如果你想获取方法的返回值可以使用该参数,在通知方法中定义参数就可以了 |
| **argNames**：  | 用来接收AspectJ表达式中的参数,并指定通知方法中的参数         |

### 示例

```java
@Aspect
@Component
public class LogAspect {
    /**
     * @Pointcut() 切入点表达式
     */
    @Pointcut("execution(* com.wener.example.aop.aspect.*.*(..))")
    public void logPointcut() {

    }
    /**
     * 不获取方法的返回值
     */
    @AfterReturning(value = "logPointcut()")
    public void AfterReturning1() {
        System.out.println("异常通知");
    }
    /**
     * 获取方法的返回值
     * returning的赋值的名字,必须跟通知方法中参数的名字保持一致
     */
    @AfterReturning(value = "logPointcut()", returning = "val")
    public Object afterReturning(Object val) {
        System.out.println("返回后通知");
        return val;
    }
}
```

## 五、异常通知

>  抛出异常通知在一个方法抛出异常后执行。使用`@AfterThrowing`注解来声明

### @AfterThrowing

```java
@AfterThrowing(value="",pointcut="",throwing="",argNames="")
```

| 属性     | 说明                                                         |
| -------- | ------------------------------------------------------------ |
| value    | 指定切入点表达式或命名切入点；                               |
| pointcut | 指定切入点表达式或命名切入点，如果指定了将覆盖value属性的，pointcut具有高优先级 |
| throwing | 异常类型；并且在通知方法中定义异常参数；                     |
| argNames | 用来接收AspectJ表达式中的参数,并指定通知方法中的参数         |

### 示例

```java
@Aspect
@Component
public class LogAspect {
    /**
     * @Pointcut() 切入点表达式
     */
    @Pointcut("execution(* com.wener.example.aop.aspect.*.*(..))")
    public void logPointcut() {
		
    }
    /**
     * @AfterThrowing 异常通知 
     * 	value：指定切入点表达式或命名切入点；
     * 	throwing：异常类型。
     */
    @AfterThrowing("logPointcut()")
    public void afterThrowing() {
        System.out.println("异常通知");
    }
    /**
     * 如果想要限制通知只在某种特定的异常被抛出的时候匹配，同时还想知道异常的一些信息。 
     * 那我们就需要使用throwing属性声明响应
     */
	@AfterThrowing(value = "logPointcut()", throwing = "exception")
    public void afterThrowing(Exception exception) {
        System.out.println("异常通知");
    }
}
```

## 六、环绕通知

> 环绕通知在一个方法执行之前和之后执行。它使得通知有机会 在一个方法执行之前和执行之后运行。而且它可以决定这个方法在什么时候执行，如何执行，甚至是否执行。 环绕通知经常在某线程安全的环境下，你需要在一个方法执行之前和之后共享某种状态的时候使用。 请尽量使用最简单的满足你需求的通知。（比如如果简单的前置通知也可以适用的情况下不要使用环绕通知）。
>
> - 使用`@Around`注解；
> - 环绕通知需要携带ProceedingJoinPoint类型的参数；
> - 且环绕通知必须有返回值，返回值即为有目标方法的返回值。

### @Around

```java
@Around(value = "", argNames = "")
```

| 属性           | 说明                                                 |
| -------------- | ---------------------------------------------------- |
| **value :**    | 指定切入点表达式或切入点名字                         |
| **argNames: ** | 用来接收AspectJ表达式中的参数,并指定通知方法中的参数 |

### 示例

```java
@Aspect
@Component
public class LogAspect {
    /**
     * @Pointcut() 切入点表达式
     */
    @Pointcut("execution(* com.wener.example.aop.aspect.*.*(..))")
    public void logPointcut() {

    }
    /**
     * @Around 环绕通知
     * 比如 缓存切面，如果缓存中有值，就返回该值，否则调用proceed()方法
     * value：指定切入点表达式或命名切入点；
     * 注意 第一个参数必须是 ProceedingJoinPoint对象 具体这个类的更多详细使用看附录:
     */
    @Around(value = "logPointcut()")
    public Object around(ProceedingJoinPoint pjp) throws Throwable {
        System.out.println("环绕通知1");
        Object obj = pjp.proceed();
        System.out.println("环绕通知2");
        return obj;
    }
}
```

## 七、通知参数处理

### 说明

> 若想要在通知方法获取被通知方法的参数共有两种方式：自动获取、手动指定
>
> - 自动获取参数：通知类型可以通过参数JoinPoint或者 ProceedingJoinPoint 自动获取被通知方法的参数值并调用该方法
>
> - 手动指定参数：即在配置切面时，需在切面的通知与切面的切点中明确指定参数。
>
> 1. 手动指定
>
>    - 在@pointcut中切入表达式中使用args声明匹配的参数,注意使用&&连接args
>
>    - 在@pointcut中切入表达式中使用参数argNames用来接收AspectJ表达式中的参数，
>
>      argNames属性是用于指定在表达式中应用的参数名与Advice方法参数是如何对应的
>
>    - 在通知方法中定义参数

### 手动获取指定参数

```java
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;
@Aspect
@Component
public class LogAdviceParamsAspect {
	// 注意参数的个数必须一致,否则匹配不到
    @Before(value = "execution(* com.wener.example.aop.aspect.*.*(..))&& args(id,name)", argNames = "id,name")
    public void testArgs(Object id, Object name) {
        System.out.println(id);
        System.out.println(name);
    }
}
```

### 混用使用

> **当同时采用自动获取参数与手动指定参数时，自动获取参数必须是第一个参数，即ProceedingJoinPoint 等参数并需是通知方法定义的第一个参数**

```java
@Aspect
@Component
public class LogAdviceParamsAspect {
  // args、argNames的参数名与testArgs()方法中参数名 保持一致
    @Before(value = "execution(* com.wener.example.aop.aspect.*.*(..))&& args(id,name)", argNames = "id,name")
    public void testArgs(Object id, Object name) {
        System.out.println(id);
        System.out.println(name);
    }
	// 也可以不用argNames
    @Before(value = "execution(* com.wener.example.aop.aspect.*.*(..))&& args(id,name)")
    public void testArgs(Object id, Object name) {
        System.out.println(id);
        System.out.println(name);
    }
    
    @Around(value = "execution(* com.wener.example.aop.aspect.*.*(..))&&(args(id,name,..))", argNames = "pjp,id,name")
    public Object testAroundArgs(ProceedingJoinPoint pjp, Object id, Object name) throws Throwable {
        System.out.println("Around之前");
        Object obj = pjp.proceed();
        System.out.println();
        return obj;
    }
}
```

## 八、通知执行顺序

### Spring 5.2.7以下

![通知执行的顺序](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202312282006401.png)

### Spring 5.2.7以上

![image-20220830174226586](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202312282007862.png)









