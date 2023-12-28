---
sidebar_position: 8
---

# Spring AOP代理模式

## 一、代理模式

### 1.静态代理

- 一个代理类只能代理一个接口

**示例**

```java
/**
 * @author 追梦路上的孩子
 * @version 1.0
 * @date 2023/12/27 19:17
 */
public interface TestService {
    void test();
}
```

```java
/**
 * @author 追梦路上的孩子
 * @version 1.0
 * @date 2023/12/27 19:19
 */
public class TestServiceImpl implements TestService {
    @Override
    public void test() {
        System.out.println("test中的核心方法");
    }
}
```

**创建静态代理类：**

```java
/**
 * @author 追梦路上的孩子
 * @version 1.0
 * @date 2023/12/27 19:49
 */
public class TestServiceProxy implements TestService {
    private final TestService target;

    public TestServiceProxy(TestService target) {
        this.target = target;
    }

    @Override
    public void test() {
        System.out.println("静态代理===>调用核心方法前");
        target.test();
        System.out.println("静态代理===>调用核心方法后");
    }
}
```

**测试**

```java
@Test
public void testStaticProxy() {
    TestService testServiceProxy = new TestServiceProxy(new TestServiceImpl());
    testServiceProxy.test();
}
```



![image-20231227195724219](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202312271957331.png)

> 静态代理确实实现了解耦，但是由于代码都写死了，完全不具备任何的灵活性。将来其他地方也需要使用代理，那还得再声明更多个静态代理类，那就产生了大量重复的代码，功能还是分散的，没有统一管理。



### 2.动态代理

- JDK动态代理：JDK原生的实现方式，需要被代理的目标类必须实现接口。因为这个技术要求**代理对象和目标对象实现同样的接口**
- Cglib 类代理：通过**继承被代理的目标类**实现代理，所以不需要目标类实现接口

#### JDK动态代理

- **JDK动态代理所用到的代理类在程序调用到代理类对象时才由JVM真正创建，JVM根据传进来的业务实现类对象 以及方法名 ，动态地创建了一个代理类并执行，然后通过该代理类对象进行方法调用。**我们需要做的，只需指定代理类的预处理、调用后操作即可
- 目前Java开发包中包含了对动态代理的支持，但是其实现只支持对**接口**的的实现。 其实现主要通过java.lang.reflect.Proxy类和java.lang.reflect.InvocationHandler接口。 
- Proxy类主要用来获取动态代理对象，
 - InvocationHandler接口用来约束调用者实现

##### **Proxy类**

- 这是 Java 动态代理机制的主类，它提供了一组静态方法来为一组接口动态地生成代理类及其对象

| 返回值                   | 方法                                                         | 说明                                                         |
| ------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| static InvocationHandler | getInvocationHandler(Object proxy)                           | 方法返回指定接口的代理类的实例，这些接口将调用方法调用到指定的调用处理程序。 |
| static Class             | getProxyClass(ClassLoader loader, Class[] interfaces)        | 用于获取关联于指定类装载器和一组接口的动态代理类的类对象     |
| static boolean           | isProxyClass(Class cls)                                      | 该方法用于判断指定类对象是否是一个动态代理类                 |
| staticObject             | newProxyInstance(ClassLoader loader, Class[] interfaces, InvocationHandler h) | 用于为指定类装载器、一组接口及调用处理器生成动态代理类实例   |

##### **InvocationHandler接口**

- 这是调用处理器接口，它自定义了一个 invoke 方法，用于集中处理在动态代理类对象上的方法调用，通常在该方法中实现对委托类的代理访问

```java
// 该方法负责集中处理动态代理类上的所有方法调用。，第二个参数是被调用的方法对象
// 第三个方法是调用参数。调用处理器根据这三个参数进行预处理或分派到委托类实例上发射执行
Object invoke(Object proxy, Method method, Object[] args)
```

- proxy

  第一个参数既是代理类实例

- method

  被调用的方法对象

- args

  调用参数。调用处理器根据这三个参数进行预处理或分派到委托类实例上发射执行



**创建JDK动态代理类**

```java
/**
 * @author 追梦路上的孩子
 * @version 1.0
 * @date 2023/12/27 11:14
 */
public class DynamicProxy implements InvocationHandler {
    private Object target;

    /**
     * newProxyInstance()：创建一个代理实例
     * 其中有三个参数：
     * 1、classLoader：加载动态生成的代理类的类加载器
     * 2、interfaces：目标对象实现的所有接口的class对象所组成的数组
     * 3、invocationHandler：设置代理对象实现目标对象方法的过程，即代理类中如何重写接
     * 口中的抽象方法
     */
    public Object newProxyInstance(Object target) {
        this.target = target;
        return Proxy.newProxyInstance(target.getClass().getClassLoader(), target.getClass().getInterfaces(), this);
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        System.out.println("动态代理===>核心方法执行前");
        Object result = method.invoke(target, args);
        System.out.println("动态代理===>核心方法执行后");
        return result;
    }
}
```

**测试**

```java
@Test
public void testDynamicProxy() {
    DynamicProxy dynamicProxy = new DynamicProxy();
    TestService proxyInstance = (TestService) dynamicProxy.newProxyInstance(new TestServiceImpl());
    proxyInstance.test();
}
```



![image-20231227200544522](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202312272005554.png)

#### CGLIB动态代理

- JDK实现动态代理需要实现类通过接口定义业务方法，对于没有接口的类，如何实现动态代理呢，这就需要CGLib了。CGLib采用了非常底层的字节码技术，其原理是通过字节码技术为一个类创建子类，并在子类中采用方法拦截的技术拦截所有父类方法的调用，顺势织入横切逻辑。
- JDK动态代理与CGLib动态代理均是实现Spring AOP的基础。 

**导入依赖**

```xml
<dependency>
    <groupId>cglib</groupId>
    <artifactId>cglib</artifactId>
    <version>3.3.0</version>
</dependency>
```

**定义代理类**

```java
/**
 * @author 追梦路上的孩子
 * @version 1.0
 * @date 2023/12/27 20:55
 */
public class User {
    public void add() {
        System.out.println("添加用户");
    }
}
```

**定义CGLIB动态代理类**

```java
/**
 * @author 追梦路上的孩子
 * @version 1.0
 * @date 2023/12/27 20:55
 */
public class CglibProxy implements MethodInterceptor {
    private Enhancer enhancer = new Enhancer();

    public Object getProxy(Class clazz) {
        enhancer.setSuperclass(clazz);
        enhancer.setCallback(this);
        return enhancer.create();
    }

    /**
     * 实现MethodInterceptor接口方法
     * 拦截被代理对象的方法
     *
     * @param o    代理类实例
     * @param method 被代理类所调用的被代理的方法
     * @param objects   参数值列表
     * @param methodProxy  生成的代理类对方法的代理引用
     * @throws Throwable
     */
    @Override
    public Object intercept(Object o, Method method, Object[] objects, MethodProxy methodProxy) throws Throwable {
        System.out.println("CGLIB动态代理===>核心方法执行前通知");
        Object result = methodProxy.invokeSuper(o, objects);
        System.out.println("CGLIB动态代理===>核心方法执行后通知");
        return result;
    }
}
```

**测试**

```java
@Test
public void testCglibProxy() {
    CglibProxy cglibProxy = new CglibProxy();
    User proxy = (User) cglibProxy.getProxy(User.class);
    proxy.add();
}
```

**注意：**

高版本JDK会报错误

![image-20231228165630843](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202312281656899.png)

需要在在VM中添加`--add-opens java.base/java.lang=ALL-UNNAMED`

![image-20231228165811029](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202312281658081.png)

![image-20231228165854860](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202312281658892.png)





#### **CGLib与JDK动态代理的区别**

|                                    |                             JDK                              |                            CGLib                             |
| ---------------------------------- | :----------------------------------------------------------: | :----------------------------------------------------------: |
| 原理                               | 利用反射机制生成一个实现代理接口的匿名类，在调用具体方法前调用InvokeHandler来处理 | 利用asm开源包，对代理对象类的class文件加载进来，通过修改其字节码生成子类来处理 |
| JDK动态代理和CGLIB字节码生成的区别 |    JDK动态代理只能对实现了接口的类生成代理，而不能针对类     | CGLIB是针对类实现代理，主要是对指定的类生成一个子类，覆盖其中的方法，因为是继承，所以该类或方法最好不要声明成final |
| 速度上                             | 在jdk6以后sun公司对JDK动态代理进行优化,在调用次数较少的情况下，JDK代理效率高于CGLIB代理效率 | 只有当进行大量调用的时候，jdk6和jdk7比CGLIB代理效率低一点，但是到jdk8的时候，jdk代理效率高于CGLIB代理 |





## 二、AOP 简介

AOP（Aspect-Oriented Programming，面向切面编程）是一种设计思想，能够将那些与业务无关，却为业务模块所共同调用的逻辑或责任（例如事务处理、日志管理、权限控制等）封装起来，便于减少系统的重复代码

使用场景：

- Authentication       权限管理
- Log                           日志记录 
- Transactions           事务处理
- Exception               异常处理
- safety control         安全控制
- Caching                   缓存
- DistributedLock     分布式锁
- performance          性能统计     
- ......

### 相关术语

| 术语                         | 描述                                                         |
| ---------------------------- | ------------------------------------------------------------ |
| 方面/切面(`Aspect`)          | 通常是一个类，里面可以定义切入点和通知                       |
| **增强**(`Advice`)           | 有时候也翻译成通知，这是在方法执行之前或之后采取的实际操作。Spring提供了有5种类型的通知 |
| 切入点(`Pointcut`)           | 就是带有通知的连接点，在程序中主要体现为书写切入点表达式，负责往"什么地方"插入代码,"通知"负责插入"什么代码 |
| 加入点(`Join point`)         | 程序执行过程中明确的点，一般是方法的调用,                    |
| 介绍或者引入(`Introduction`) | 允许我们向现有的类添加新的方法或者属性                       |
| 编织(`Weaving`)              | 把切面应用到目标对象来创建新的代理对象的过程(由框架完成)。织入一般发生在如下几个时机:  <br />1.**编译时**(AspectJ的织入编译器)<br />2.**运行时完成**(动态代理技术)<br />3.**类加载时**(使用特殊的`ClassLoader`在目标类被加载到程序之前增强类的字节代码) |
| 目标对象(`Target object`)    | 对象被一个或多个方面通知(`Advice`)，该对象将始终是代理的对象。也称为通知(`Advice`)对象。 |

### 5种通知(Advice)

| 通知节点                  | 对应的接口                                      | 描述                                                         |
|-----------------------| ----------------------------------------------- | ------------------------------------------------------------ |
| Before(前置通知)          | org.apringframework.aop.MethodBeforeAdvice      | 在方法执行之前运行通知。                                     |
| After-returning(返回通知) | org.springframework.aop.AfterReturningAdvice    | 只有方法成功完成后才能在方法执行后运行通知。                 |
| After-throwing(异常通知)  | org.springframework.aop.ThrowsAdvice            | 只有在方法通过抛出异常而退出方法执行之后才能运行通知。       |
| Around(环绕通知)          | org.aopaliance.intercept.MethodInterceptor      | 环绕通知,在目标方法完成前后做增强处理，能在方法调用前后自定义一些操作。环绕通知还需要负责决定是继续处理join point(调用ProceedingJoinPoint的proceed方法)还是中断执行。 |
| After(finally)(后置通知)  | org.springframework.aop.IntroductionInterceptor | 在目标方法执行完成后执行，不管是正常执行完成，还是抛出异常，都会执行返回通知中的内容 |                                              

### 示例图

![](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202312280921034.jpeg)

###  作用

- 简化代码：把方法中固定位置的重复的代码**抽取**出来，让被抽取的方法更专注于自己的核心功能，提高内聚性。

- 代码增强：把特定的功能封装到切面类中，看哪里有需要，就往上套，被**套用**了切面逻辑的方法就被切面给增强了。