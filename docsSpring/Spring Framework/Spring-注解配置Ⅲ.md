---
sidebar_position: 6
---

# Spring-注解配置Ⅲ

## 注册组件到容器

### @Qualifier

> 当引入的对象存在多个实例配合使用与@Autowired一起使用的。@Qualifier可以被用在单个构造器或者方法的参数上。当上下文有几个相同类型的bean, 使用@Autowired则无法区分要绑定的bean，此时可以使用@Qualifier来指定名称。

### @Primary

> 就是当Spring容器扫描到某个接口的多个 bean 时，如果某个bean上加了@Primary 注解 ，则这个bean会被优先选用

### @Lazy

> Spring框架中的@Lazy注解是一种用于标记组件（beans）的方式，它告诉Spring容器在需要时才初始化被注解的bean。当一个bean被标记为@Lazy时，在容器启动时并不会立即创建这个bean的实例，而是在第一次被使用时才会被实际初始化和创建

### @PostConstruct

> `@PostConstruct` 是 Java EE（现在的 Jakarta EE）和 Spring 框架中的一个注解，用于标记一个方法，在实例化 bean 之后立即执行，但在将 bean 返回给调用者之前。它可以被用来在初始化阶段执行一些逻辑或准备工作，例如设置初始值、建立连接等等。被 `@PostConstruct` 注解的方法将在依赖注入和其他配置之后立即执行
>
> 它保证了方法在 bean 的依赖注入和初始化之后才会被调用，确保了这些方法在 bean 可用时执行所需的操作。这在需要在 bean 初始化后执行一些逻辑或者预处理工作的场景下非常有用。

### @PreDestory

> `@PreDestroy` 是 Java EE（现在的 Jakarta EE）和 Spring 框架中的一个注解，用于标记一个方法，在容器销毁 bean 之前立即执行。当 bean 被容器销毁之前，这个注解所标记的方法将被调用，用来执行一些清理工作或者释放资源的操作
>
> 这个注解保证了在容器销毁 bean 之前执行所需的操作，可以在 bean 生命周期结束时执行必要的清理步骤，确保资源的正确释放和应用程序的稳定性

### @DependsOn

> `@DependsOn` 是 Spring 框架中的一个注解，用于指定 bean 初始化的顺序，即用来声明 bean 之间的依赖关系。通过 `@DependsOn` 注解，你可以明确地指定一个或多个 bean 在另一个 bean 之前进行初始化，确保特定的 bean 在其依赖的 bean 初始化之后再进行初始化。
>
> 注意的是，使用 `@DependsOn` 只是为了确保初始化顺序，它并不会影响 bean 的销毁顺序。这个注解允许你在声明 bean 之间的初始化顺序时提供更多的控制和透明性

```java
// BeanA.java
public class BeanA {
    public BeanA() {
        System.out.println("BeanA Initialized");
    }
}

// BeanB.java
import org.springframework.beans.factory.annotation.DependsOn;

@DependsOn("beanA")
public class BeanB {
    public BeanB() {
        System.out.println("BeanB Initialized");
    }
}

```

`BeanB` 使用 `@DependsOn` 注解来指定它依赖于名为 `beanA` 的 Bean。这样，在 Spring 容器初始化这些 Bean 时，它会确保 `BeanA` 在 `BeanB` 之前被初始化。

### @Bean

> - 默认获取到的是工厂Bean调用getObject创建的对象
> - 要获取工厂Bean本身，需要在id前面加一个&

## 初始化和销毁方法

> 1. 通过@Bean(initMethod="init",destoryMethod="destory")方法
>
> 2. 通过bean实现InitializingBean来定义初始化逻辑，DisposableBean定义销毁逻辑
>
> 3. 可以使用JSR250：@PostConstruct：初始化方法；@PreDestory：销毁方法。
>
> 4. BeanPostProcessor：bean的后置处理器，在bean初始化前后进行一些处理工作
>
>    postProcessBeforeInitialization：在初始化之前工作
>
>    postProcessAfterInitialization：在初始化工作之后工作

## Bean属性

### @Scope

## 单元测试

### @RunWith

运行器，Spring中通常用于对JUnit的支持

### @ContextConfiguration

用来加载配置配置文件，其中classes属性用来加载配置类。