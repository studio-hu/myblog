---
sidebar_position: 5
---

## 依赖注入（自动装配）

### 一、概要

自动装配是指Spring 在装配 Bean 的时候，根据指定的自动装配规则，将某个 Bean 所需要引用类型的 Bean 注入进来。可以在类的成员变量上,构造方法,setter方法使用,常用的主要有以下三种

- **@Autowired：**属于Spring 的org.springframework.beans.factory.annotation包下,可用于为类的属性、构造器、方法进行注值 

- **@Resource：**不属于spring的注解，而是来自于JSR-250位于java.annotation包下

- **@Inject：**属于由JSR-330提供

### 二、@Autowired 

### 1、说明

这个注解相当于我们之前在xml文件中配置的autowire="constructor/byName/byType",只不过我们这里使用@Autowired方式注解方式，且默认是通过类型判断，意思就是不使用byName,和construtor。通过@Autowired注解，spring会自动去容器中查找对应的类型，注入到该属性中，且bean类中，使用@Autowired注解其属性，我们可以不用提供getter,setter方法

默认情况下必须要求依赖对象必须存在，如果要允许null值，可以设置它的required属性为false，如果我们想使用按照名称装配，可以结合@Qualifier注解一起使用

### 2、属性注入（方便）

1. 说明

   将Autowired注解声明在属性上面,

2. 示例代码

   ```java
   @Component
   public class User {
       private String name;
       private String password;
       @Autowired
       //@Autowired(required = false)
       private Address address;
       
   @Component
   public class Address {
       private String province;
       private String city;
   }
       
   // 测试代码
   private static void testUser() {
           ApplicationContext context = new ClassPathXmlApplicationContext("spring-context.xml");
           User user = context.getBean("user", User.class);
           System.out.println(user.getAddress().toString());
       }   
   ```

3. 优点

   - 代码简洁

4. 缺点

   - 对于IOC容器以外的环境,无法复用该实现类

### 3、构造注入（官方推荐）

1. 说明

   将Autowired注解声明在构造方法上面,在Spring4.x版本中推荐的注入方式

2. 示例代码

   ```java
   @Component
   public class User {
       private String name;
       private String password;
       private final Address address;
       
       @Autowired
       public User(Address address) {
           this.address = address;
       }
   
   @Component
   public class Address {
       private String province;
       private String city;
   }
   
   ```

3. 优点

   - **能确保依赖组件不可变：**主要是属性通过final修饰
   - **能确保依赖不为空：**当要实例化Bean的时候，由于自己实现了有参数的构造函数，所以不会调用默认构造函数，那么就需要Spring容器传入所需要的参数，当我们Spring容器中有该种类型的参数直接传入,没有该种类型的参数直接报错，无需判断依赖对象是否null
   - **保证返回客户端（调用）的代码的时候是完全初始化的状态：**向构造器传参之前，要确保注入的内容不为空，那么肯定要调用依赖组件的构造方法完成实例化。而在Java类加载实例化的过程中，构造方法是最后一步（之前如果有父类先初始化父类，然后自己的成员变量，最后才是构造方法）所以返回来的都是初始化之后的状态
   - **保证必要属性在Bean实例化时就得到设置**

4. 缺点

   - **可读性较差：**当注入参数较多时，代码臃肿。
   - **灵活性不强：**在有些属性是可选的情况下，如果通过构造函数注入，也需要为可选的参数提供一个null值
   - **不利于类的继承和拓展：**因为子类需要引用父类复杂的构造函数

5. 备注(官方说明)

   The Spring team generally advocates constructor injection as it enables one to implement application components as *immutable objects* and to ensure that required dependencies are not `null`. Furthermore constructor-injected components are always returned to client (calling) code in a fully initialized state.



   Spring团队通常提倡构造函数注入，因为它能够保证注入的**组件不可变**，并且确保需要的**依赖不为null**。此外。此外，构造器注入的组件总是以**完全初始化的状态**返回给客户机(调用)代码。

### 4、方法注入（不推荐）

1. 说明

   将Autowired注解声明在方法上面，Spring3.x的时候，官方推荐使用的注入

2. 示例代码

   ```java
   @Component
   public class User {
       private String name;
       private String password;
       private  Address address;
       
       @Autowired
       public void setAddress(Address address) {
           this.address = address;
       }
   
   @Component
   public class Address {
       private String province;
       private String city;
   }
   ```

3. 优点

   - 相比构造器注入，当注入参数太多或存在非必须注入的参数时，不会显得太笨重，Spring在创建Bean实例时，需要同时实例化器依赖的全部实例，因而导致性能下降。而使用设值注入，则能避免这些问题
   - 允许在类构造完成后重新注入

4. 缺点

   - 对一些必要参数需要做代码检查
   - 开发的效率相对来说比较低(增加了代码量)
   - 可读性不是很好

### 5、@Qualifier

##### 1、说明

> 当Spring容器中存在多个具有相同类型的 bean 时，并且想要用一个属性只为它们其中的一个进行装配，在这种情况下，你可以使用 **@Qualifier** 注释和 **@Autowired** 注释通过指定哪一个真正的 bean 将会被装配来消除混乱。
>
> 该注解可以使用字段、方法、参数、注解上

##### 2、基础使用

1. DataSource

   ```java
   public interface DataSource {
        void connection();
   }
   ```

2. MysqlDataSource

   ```java
   @Component("mysql")
   public class MysqlDataSource implements DataSource {
       @Override
       public void connection() {
           System.out.println("mysql database connecting");
       }
   }
   ```

3. OracleDataSource

   ```java
   @Component("oracle")
   public class OracleDataSource implements DataSource {
       @Override
       public void connection() {
           System.out.println("oracle database connecting");
       }
   }
   ```

4. DataSourceManager

   ```java
   // 在属性上使用
   @Component
   public class DataSourceManager {
       @Autowired
       @Qualifier("oracle")
       private DataSource dataSource;
   	
       public DataSource getDataSource() {
           return dataSource;
       }
   }
   
   // 或者在参数上使用
   @Component
   public class DataSourceManager {
       private DataSource dataSource;
   	
       @Autowired
       public DataSourceManager(@Qualifier("oracle") DataSource dataSource) {
           this.dataSource = dataSource;
       }
   
       public DataSource getDataSource() {
           return dataSource;
       }
   }
   
   // 在方法上使用
   @Component
   public class DataSourceManager {
       private DataSource dataSource;
    
       @Autowired
       @Qualifier(value = "oracle")
       public void setDataSource(DataSource dataSource) {
           this.dataSource = dataSource;
       }
   	
       public DataSource getDataSource() {
           return dataSource;
       }
   }
   
   ```

##### 3、自定义Qualifier

1. 说明

   对@Qualifier的扩展来提供细粒度选择候选者；具体使用方式就是自定义一个注解并使用@Qualifier注解其即可使用

2. 示例代码

   ```java
   import org.springframework.beans.factory.annotation.Qualifier;
   
   import java.lang.annotation.ElementType;
   import java.lang.annotation.Retention;
   import java.lang.annotation.RetentionPolicy;
   import java.lang.annotation.Target;
   // 定义两个自定义注解类一个OracleQualifier 一个MysqlQualifier
   @Target({ElementType.TYPE, ElementType.FIELD, ElementType.PARAMETER})
   @Retention(RetentionPolicy.RUNTIME)
   @Qualifier
   public @interface OracleQualifier {
   }
   
   
   @Target({ElementType.TYPE, ElementType.FIELD, ElementType.PARAMETER})
   @Retention(RetentionPolicy.RUNTIME)
   @Qualifier
   public @interface MysqlQualifier {
   }
   
   ```

   ```java
   // 在实现类上使用自定义Qualifier
   @Component("mysql")
   @MysqlQualifier
   public class MysqlDataSource implements DataSource {
       @Override
       public void connection() {
           System.out.println("mysql database connecting");
       }
   }
   
   @Component("oracle")
   @OracleQualifier
   public class OracleDataSource implements DataSource {
       @Override
       public void connection() {
           System.out.println("oracle database connecting");
       }
   }
   
   ```

   ```java
   @Component
   public class DataSourceManager {
       @Autowired()
       @MysqlQualifier
       private DataSource mysqlDataSource;
   }
   
   ```

   其它方式自行参考其它资料

### 6、循环引入的问题

1. 属性注入

   ```java
   @Component
   public class User {
       private String name;
       private String password;
       @Autowired
       private Address address;
       
       public Address getAddress() {
           return address;
       }
   }
   
   @Component
   public class Address {
       private String province;
       private String city;
       @Autowired
       private User user;
       public User getUser() {
           return user;
       }
   }
   
    // 测试代码 
       private static void testUser() {
           ApplicationContext context = new ClassPathXmlApplicationContext("spring-context.xml");
           User user = context.getBean("user", User.class);
           System.out.println(user.getAddress());
       }
   //异常信息 BeanCurrentlyInCreationException
   
   ```

2. 构造方法注入

   ```java
   @Component
   public class User {
       private String name;
       private String password;
       private Address address;
       
       @Autowired
       public User(Address address) {
           this.address = address;
       }
   }    
   
   @Component
   public class Address {
       private String province;
       private String city;
       private User user;
   
       @Autowired
       public Address(User user) {
           this.user = user;
       }
   
   // 测试代码
   private static void testUser() {
           ApplicationContext context = new ClassPathXmlApplicationContext("spring-context.xml");
           User user = context.getBean("user", User.class);
           System.out.println(user.toString());
       }  
    // 异常信息 BeanCurrentlyInCreationException
   
   ```

3. 区别

   **如果使用构造器注入，在spring项目启动的时候，就会抛出：BeanCurrentlyInCreationException从而提醒你避免循环依赖，如果是属性注入的话，启动的时候不会报错，在使用那个bean的时候才会报错**。

### 7、总结

> @Autowired的三种用法其实没有所谓的孰优孰劣，存在即是合理。个人建议，**对于依赖关系无需变化的注入，可以采用构造注入；而其他的依赖关系的注入，则考虑采用设值注入，不过个人比较喜欢用属性多点**

## 三、@Resource(推荐)

### 1、说明

- @Resource是JSR250标准中的一个注解，Spring2.5+对其提供了支持。

- @Resource的作用相当于 @Autowired，只不过 `@Autowired` 按 byType 自动注入，而`@Resource` 默认按  byName 自动注入罢了。

- @Resource可以使用在类，属性，set方法上，也可以是普通的非set方法上，注意对应方法只允许接收一个参数

- @Resource有两个属性是比较重要的，分是name和type

### 2、属性注入

#### 说明

将@Resource注解声明在属性上面

#### 栗子

```java
import org.springframework.stereotype.Component;
import javax.annotation.Resource;

@Component
public class User {
    private String name;
    private String password;
    // 会如果什么都不写 会根据属性的名字来查找
    // 如果找不到与名称匹配的bean时才按照类型进行装配,找不到直接报错
    @Resource
    // 如果写了name,那只会按着name来查找,找不到就直接报错
    // @Resource(name = "address")
    // @Resource(name = "address", type = Address.class)
    private Address address;
 }   

@Component
public class Address {
    private String province;
    private String city;
}

//测试代码
private static void testUser() {
    ApplicationContext context = new ClassPathXmlApplicationContext("spring-context.xml");
    User user = context.getBean("user", User.class);
    System.out.println(user.getAddress().toString());
}

```

### 3、方法注入

#### 说明

在方法上使用@Resource

#### 栗子

```java
@Component
public class User {
    private String name;
    private String password;
    private Address address;

    public Address getAddress() {
        return address;
    }
    
	// 当注解写在方法上时，默认取字段名进行安装名称查找
    @Resource
    // @Resource(name = "address")
    // @Resource(name = "address", type = Address.class)
    public void setAddress(Address address) {
        this.address = address;
    }
    
//    或者
//    @Resource
//    @Resource(name = "address")
//    @Resource(name = "address", type = Address.class)
//    public void initAddress(Address address) {
//        this.address = address;
//    }
    
    
   // 错误的案例
   // 注意修饰方法的时候,有且只能有一个参数,多余一个参数直接报错
   @Resource
    public void initAddress(Address address, String name) {
        this.address = address;
        this.name = name;
    }
}
// @Resource annotation requires a single-arg method

```

### 4、重要属性说明

1. 如果同时指定了name和type，则从Spring上下文中找到唯一匹配的bean进行装配，找不到则抛出异常
2. 如果指定了name，则从上下文中查找名称（id）匹配的bean进行装配，找不到则抛出异常
3. 如果指定了type，则从上下文中找到类型匹配的唯一bean进行装配，找不到或者找到多个，都会抛出异常
4. 如果既没有指定name，又没有指定type，则自动按照byName方式进行装配；如果没有匹配，则按类型进行匹配，如果匹配则自动装配
5. 如果既指定了name又指定了type，则按照名字和类型装配，任何一个不匹配都将报错
6. 如果 @Resource用于方法中，默认使用方法名作为beanName,指定名字则使用名字

## 四、@Inject(了解)

### 1、说明

@Inject是JSR-330的一部分。在Spring3中开始支持JSR-330的注解

@Inject支持构造函数、方法和字段注解，也可能使用于静态属性。与@Autowired不同的是强制要求示例必须存在

**注意:** 需要导入第三方的jar包

```xml
<dependency>
 <groupId>javax.inject</groupId>
 <artifactId>javax.inject</artifactId>
 <version>1</version>
</dependency>
```

### 2、属性注入

1. 说明

   在属性上声明，注意属性不能是final的 

2. 示例代码

   ```
   @Component
   public class User {
       @Inject
       private Address address;
   }  
   
   ```

### 3、构造方法注入

1. 说明

   在构造方法上声明，构造函数可以是无参或多个参数的构造函数，@Inject每个类中最多注解一个构造函数。

2. 示例代码

   ```java
   @Component
   public class User {
       private Address address;
   
       @Inject
       public User(Address address) {
           this.address = address;
       }
   }    
   
   ```

### 4、方法注入

1. 说明

   在方法上声明，注意不能是抽象方法，可以有0个或多个参数。

2. 示例代码

   ```java
   @Component
   public class User {
       private Address address;
       public Address getAddress() {
           return address;
       }
   
       @Inject
       public void setAddress(Address address) {
           this.address = address;
       }
   
   ```

### 5、配合@Name使用

1. 说明

   @Inject默认按类型匹配，如果你想按着Bean的名字来使用,可以使用@Name属性使用,一般用来类上面声明Bean的名字@Component的作用,如何在注入的时候在属性上声明相当于@Qualifier

2. 示例代码

   ```java
   // 在类上声明 
   @Named("address1")
   public class Address {
       
   }  
   
   // 配合@Inject一起使用
   @Component
   public class User {
       @Inject
       @Named("address")
       private Address address1;
   }
   
   ```

### 6、与@Autowire的区别

1. @Autowire 有@required标签，允许对象为空 
2. @Inject没有@required标签，强制要求对象不能为空

### 7、其它

1. @Inject 与 @Autowired等效(作用上)
2. @Named 与 @Compenet等效(类上声明时)

## 五、三种注解区别

1. 条件

   | 注解类型                                                     | 所在包                     | 版本支持                          | 作用域                                     |
   | ------------------------------------------------------------ | -------------------------- | --------------------------------- | ------------------------------------------ |
   | [@AutoWired](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/beans/factory/annotation/Autowired.html) | Spring自带的方式           | Spring 2.5+                       | 可以用在构造器、方法、属性、参数、注解上面 |
   | [@Resource](https://docs.oracle.com/javaee/5/tutorial/doc/bncjk.html) | JSR-250标准，JDK6以上自带, | Spring版本要求2.5以上             | 可以用在方法、属性、类上                   |
   | [@Inject](https://docs.oracle.com/javaee/6/api/javax/inject/Inject.html) | JSR-303标准，              | Spring版本3以上。需要导入外部依赖 | 可以用在方法、属性、构造器上               |

2. 使用上

   1、@Autowired、@Inject用法基本一样，不同的是@Autowired有一个required属性

   2、@Autowired、@Inject是默认按照类型匹配的，@Resource是按照名称匹配的

   3、@Autowired如果需要按照名称匹配需要和@Qualifier一起使用，@Inject和@Name一起使用

   4、@Autowired可以允许对象为空,而@Resource与@Inject不允许对象为空

