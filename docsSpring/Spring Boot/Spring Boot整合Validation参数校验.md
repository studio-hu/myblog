---
sidebar_position: 1
---

# Spring Boot整合Validation参数校验

## 一、Spring Validation

- 基于 `Bean Validation` 标准：`Spring Validation` 是基于 `Bean Validation` 标准的参数校验框架，可以实现对 `Java Bean` 属性和方法参数的校验，提供了一套完整的校验规范和 `API`，可以很方便地进行扩展和定制。

- 支持多种校验注解：`Spring Validation` 支持多种校验注解，比如 `@NotNull、@Size、@Min、@Max` 等，可以满足不同的校验需求，同时也支持自定义校验注解。

- 集成方便：`Spring Validation` 是 `Spring` 框架提供的参数校验框架，与 `Spring` 框架集成非常方便，可以通过简单的配置实现参数校验。

- 可扩展性强：`Spring Validation` 提供了很好的扩展性，可以自定义校验注解和校验器，满足不同的校验需求。

## 二、依赖导入

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

## 三、`@Valid`和`@Validated`区别

`@Valid` 是 JSR303 声明的，JSR是`Java Specification Requests`的缩写，其中 JSR303 是JAVA EE 6 中的一项子规范，叫做 Bean Validation，为 JavaBean 验证定义了相应的元数据模型和 API，需要注意的是，JSR 只是一项标准，它规定了一些校验注解的规范，但没有实现，而 `Hibernate validation` 对其进行实现。

`Spring Validation` 验证框架对参数的验证机制提供了`@Validated`（Spring JSR-303规范，是标准JSR-303的一个变种）。

![image-20240125094714550](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202401250947666.png)

## 四、基本使用

### 1.对象参数使用

使用对象参数接收分为两种，一种是使用 `@RequestBody`注解的`application/json`提交，还有一种不使用 `@RequestBody`注解的 `multipart/form-data`提交。

- 使用对象接收参数，在需要校验对象的参数上加入校验注解

下面是一份表格，列出了常用的 Spring Validation 注解及其用法示例：

| 注解           | 描述                                        | 示例                                                         |
| -------------- | ------------------------------------------- | ------------------------------------------------------------ |
| `@NotNull`     | 标记字段不能为空                            | `@NotNull `<br/>` private String name;`                      |
| `@NotEmpty`    | 验证集合或字符串不为空                      | `@NotEmpty `<br/>` private List<String> emails;`             |
| `@NotBlank`    | 验证字符串不为空，且长度大于 0              | `@NotBlank `<br/>`private String username;`                  |
| `@Size`        | 验证集合或字符串的大小在指定范围内          | `@Size(min = 2, max = 50) `<br/>`private String address;`    |
| `@Pattern`     | 基于正则表达式验证字符串                    | `@Pattern(regexp = "^[a-zA-Z0-9]{5,10}$")`<br/>` private String password;` |
| `@Valid`       | 嵌套验证，对对象的属性进行验证              | `public class User {`<br/> &nbsp;&nbsp;&nbsp;`@Valid` <br/>&nbsp;&nbsp;&nbsp;`private Address address;`<br/>&nbsp;&nbsp;&nbsp;`//other fields and methods`<br/>`}` |
| `@Min`         | 最小值验证                                  | `@Min(18)` <br/>`private int age;`                           |
| `@Max`         | 最大值验证                                  | `@Max(100) `<br/>`private int points;`                       |
| `@Email`       | 邮箱格式验证                                | `@Email `<br/>`private String email;`                        |
| `@DecimalMin`  | 最小值（包括）验证，适用于数字类型          | `@DecimalMin(value = "0.0", inclusive = true) `<br/>`private BigDecimal amount;` |
| `@DecimalMax`  | 最大值（包括）验证，适用于数字类型          | `@DecimalMax(value = "100.00", inclusive = true) `<br/>`private BigDecimal total;` |
| `@AssertTrue`  | 对 boolean 类型的字段进行验证，确保为 true  | `@AssertTrue`<br/>` private boolean isActive;`               |
| `@AssertFalse` | 对 boolean 类型的字段进行验证，确保为 false | `@AssertFalse `<br/>`private boolean isDeleted;`             |
| `@Validated`   | 类级别验证，激活验证功能                    | `@Validated `<br/>`public class User { ... }`                |

这些注解提供了多种验证方式，可以应用于不同类型的数据，确保数据符合预期的规则和条件。

`message`是校验不通过的提示信息

```java
/**
 * @author 追梦路上的孩子
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "用户登录DTO")
public class LoginDTO implements Serializable {

    /**
     * 用户名/手机号/邮箱
     */
    @NotNull(message = LOGIN_NOTNULL_MESSAGE)
    @Pattern(regexp = LOGIN_VALID_REGEXP, message = LOGIN_VALID_MESSAGE)
    private String username;

    /**
     * 用户密码
     */
    @NotEmpty(message = PASSWORD_NOTNULL_MESSAGE)
    @Pattern(regexp = PASSWORD_VALID_REGEXP, message = PASSWORD_VALID_MESSAGE)
    private String password;


    @Serial
    private static final long serialVersionUID = 1L;
}
```



```java
/**
 * @author 追梦路上的孩子
 * @version 1.0
 * @date 2024/1/17 16:38
 */
public interface UserConstants {
    interface UserValidation {
        String PASSWORD_VALID_REGEXP = "^[a-zA-Z0-9]{6,20}$";
        String PASSWORD_VALID_MESSAGE = "密码由6~20位数字或字母组成";
        String PASSWORD_NOTNULL_MESSAGE = "用户名不能为空";
    }

    interface LoginValidation {
        String LOGIN_NOTNULL_MESSAGE = "用户名/手机号/邮箱不能为空";
        String LOGIN_VALID_REGEXP = "^(?:[\\u4e00-\\u9fa5a-zA-Z0-9_-]{3,16}|1[3456789]\\d{9}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})$";
        String LOGIN_VALID_MESSAGE = "用户名/手机号/邮箱格式错误";
    }
}
```



#### 使用 @RequestBody

- 在需要校验的对象前面加 `@RequestBody`注解以及`@Validated`或者`@Valid`注解，如果校验失败，会**抛出`MethodArgumentNotValidException`异常**。

```java
/**
 * 登录模块
 *
 * @author 追梦路上的孩子
 * @version 1.0
 * @date 2023/11/18 22:34
 */
@RestController
@Tag(name = "登录模块")
public class LoginController {
    @Autowired
    private LoginService loginService;

    /**
     * 用户登录
     *
     * @param loginDTO 用户实体
     * @return 统一响应对象
     */
    @PostMapping("/login")
    @Operation(summary = "用户登录接口")
    @ApiResponses({
            @ApiResponse(responseCode = "000000", description = "登录成功"),
            @ApiResponse(responseCode = "400", description = "登录失败")
    })
    public ResponseResult<Map<String, String>> loginHandler(@Validated @RequestBody LoginDTO loginDTO) {
        return ResponseResult.success(ResultStatus.LOGIN_SUCCESS, loginService.loginCheck(loginDTO));
    }
}
```



#### 不使用 @RequestBody

- 在需要校验的对象前面加`@Validated`注解或者`@Valid`注解，如果校验失败，会**抛出`BindException`异常**。

:::caution 注意

在Spring Boot 2.7版本中，会抛出`BindException`异常，但是在Spring Boot 3.0的版本中，还是抛`MethodArgumentNotValidException`异常；`MethodArgumentNotValidException`异常为`BindException`的子异常

![image-20240125111427831](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202401251114903.png)

:::

```java
/**
 * 登录模块
 *
 * @author 追梦路上的孩子
 * @version 1.0
 * @date 2023/11/18 22:34
 */
@RestController
public class LoginController {
    @Autowired
    private LoginService loginService;

    /**
     * 用户登录
     *
     * @param loginDTO 用户实体
     * @return 统一响应对象
     */
    @PostMapping("/login")
    public ResponseResult<Map<String, String>> loginHandler(@Validated LoginDTO loginDTO) {
        return ResponseResult.success(ResultStatus.LOGIN_SUCCESS, loginService.loginCheck(loginDTO));
    }
}
```



### 2.基本类型使用

- 也路径传参，在参数前面加上相对应的校验注解，**必须在`Controller`类上加 `@Validated`注解**。如果校验失败，会**抛出`ConstraintViolationException`异常**

```java
/**
 * 用户模块
 *
 * @author 追梦路上的孩子
 * @version 1.0
 * @date 2023/11/17 23:51
 */
@Slf4j
@RestController
@RequestMapping("/user")
@Validated
public class UserController {
    @Autowired
    private UserService userService;

    /**
     * 获取用户列表
     *
     * @param currentPage 当前页
     * @param pageSize    每页显示的条数
     * @return 统一响应对象
     */
    @GetMapping("/list/{current-page}/{page-size}")
    public ResponseResult<Page<UserVO>> getUserHandler(
            @Min(value = 1, message = "当前页参数最小值只能为1") @PathVariable("current-page") Long currentPage,
            @Min(value = 2, message = "每页显示的条数参数最小值只能为2") @PathVariable("page-size") Long pageSize
    ) {
        return ResponseResult.success(ResultStatus.USER_LIST_SELECT_SUCCESS, userService.queryUserList(currentPage, pageSize));
    }
}
```

### 3.错误捕获

**对象参数错误捕获**

```java
/**
 * 对象参数校验异常处理
 *
 * @param ex BindException
 * @return ResponseResult
 */
@ExceptionHandler(BindException.class)
public ResponseResult<List<ArgsErrorInfoVO>> bindExceptionHandler(BindException ex) {
    log.error("参数校验错误:{}", ex.getMessage());
    return ResponseResult.error(ResultStatus.VALIDATE_FAILED, ex.getBindingResult().getFieldErrors().stream()
            .map(fieldError -> ArgsErrorInfoVO.builder()
                    .filedName(fieldError.getField())
                    .errorMessage(fieldError.getDefaultMessage())
                    .build()).toList()
    );
}
```



**基本类型参数错误捕获**	

```java
/**
 * 普通参数校验异常处理
 *
 * @param ex ConstraintViolationException
 * @return ResponseResult
 */
@ExceptionHandler(ConstraintViolationException.class)
public ResponseResult<List<ArgsErrorInfoVO>> constraintViolationExceptionHandler(ConstraintViolationException ex) {
    log.error("参数校验错误:{}", ex.getMessage());
    return ResponseResult.error(ResultStatus.VALIDATE_FAILED, ex.getConstraintViolations().stream().map(constraintViolation -> {
        List<Path.Node> nodeList = (List<Path.Node>) ReflectUtil.getFieldValue(constraintViolation.getPropertyPath(), "nodeList");
        return ArgsErrorInfoVO.builder()
                .filedName(nodeList.get(nodeList.size() - 1).getName())
                .errorMessage(constraintViolation.getMessage())
                .build();
    }).toList());
}
```









## 五、分组使用

### 1.定义分组接口，继承`Default`接口

:::caution 注意

自定义接口要继承 `Default`接口，不然没分组的字段校验，在自定义分组中会失效，例：在`UserDTO`对象中，`email`字段的效验，默认的组为 `Default`。

:::

```java
/**
 * @author 追梦路上的孩子
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO implements Serializable {
  	
    ......

    public interface insertUser extends Default {
    }

    public interface selectUser extends Default {
    }

    public interface updateUser extends Default {
    }
}
```

在需要区分组的字段上加 groups 参数。例：

- 在 `userId`加了`groups `参数，值为 `updateUser.class`，代表对组为 `updateUser`的进行`userId`参数校验。
- 在 `username`加了`groups `参数，值为 `insertUser.class`，代表对组为 `insertUser`的进行`username`参数校验。
- 在 `password`加了`groups `参数，值为 `insertUser.class`，代表对组为 `insertUser`的进行`password`参数校验。
- 在 `phone`加了`groups`参数，值为 `insertUser.class`，代表对组为 `insertUser`的进行`phone`参数校验。

```java
/**
 * @author 追梦路上的孩子
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "用户DTO")
public class UserDTO implements Serializable {
    /**
     * 用户id
     */
    @NotNull(message = USER_ID_NOTNULL_MESSAGE, groups = {updateUser.class})
    @Schema(description = "用户id", requiredMode = Schema.RequiredMode.AUTO)
    private Long userId;

    /**
     * 用户名
     */
    @NotNull(message = USERNAME_NOTNULL_MESSAGE, groups = {insertUser.class})
    @Pattern(regexp = USERNAME_VALID_REGEXP, message = USERNAME_VALID_MESSAGE)
    @Schema(description = "用户名", requiredMode = Schema.RequiredMode.AUTO)
    private String username;

    /**
     * 用户密码
     */
    @NotNull(message = PASSWORD_NOTNULL_MESSAGE, groups = {insertUser.class})
    @Pattern(regexp = PASSWORD_VALID_REGEXP, message = USERNAME_VALID_MESSAGE)
    @Schema(description = "密码", requiredMode = Schema.RequiredMode.AUTO)
    private String password;

    /**
     * 用户手机号
     */
    @NotNull(message = PHONE_NOTNULL_MESSAGE, groups = {insertUser.class})
    @Pattern(regexp = PHONE_VALID_REGEXP, message = PHONE_VALID_MESSAGE)
    @Schema(description = "用户手机号", requiredMode = Schema.RequiredMode.AUTO)
    private String phone;

    /**
     * 用户邮箱
     */
    @Email(message = EMAIL_VALID_MESSAGE)
    @Schema(description = "用户邮箱", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String email;

    @Serial
    private static final long serialVersionUID = 1L;

    public interface insertUser extends Default {
    }

    public interface selectUser extends Default {
    }

    public interface updateUser extends Default {
    }
}
```

#### 在controller中使用分组

- 在`addUserHandler` 中声明`@Validated`校验组`UserDTO.insertUser.class`（只有`@Validated`才支持分组）

```java
/**
 * 用户模块
 *
 * @author 追梦路上的孩子
 * @version 1.0
 * @date 2023/11/17 23:51
 */
@Slf4j
@RestController
@RequestMapping("/user")
@Validated
public class UserController {
    @Autowired
    private UserService userService;

    /**
     * 添加用户
     *
     * @param userDTO 用户DTO
     * @return ResponseResult
     */
    @PostMapping
    public ResponseResult<Integer> addUserHandler(@Validated({UserDTO.insertUser.class}) @RequestBody UserDTO userDTO) {
        return ResponseResult.success(ResultStatus.USER_INSERT_SUCCESS, userService.saveUser(userDTO));
    }
}
```



## 六、嵌套校验

- 什么是嵌套使用呢？就是一个对象中包含另外一个对象，另外一个对象的字段也是需要进行校验。示例如下：

```java
@Data
public class UserReq {

    @NotBlank(message = "name为必传参数")
    private String name;

    private String email;
    
    @NotNull(message = "proReq对象不能为空")
    @Valid
    private ProReq proReq;
}
```

嵌套校验需要在效验的对象**加上 `@Valid` 注解**。

```java
@Data
public class ProReq {
    @NotBlank(message = "proName为必传参数")
    private String proName;
}
```

## 七、自定义校验规则

- 实现`ConstraintValidator`约束验证器接口，来自定义手机号格式校验

```java title="PhoneValidator.java"
/**
 * @author 追梦路上的孩子
 * @version 1.0
 * @date 2024/1/25 17:09
 */
public class PhoneValidator implements ConstraintValidator<Phone, String> {
    private static final String PHONE_VALID_REGEXP = "^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\\d{8}$";

    /**
     * @param value 字段值
     *
     * @return 返回true表示验证通过，false表示验证失败
     */
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (ObjectUtils.isEmpty(value)) {
            return false;
        }
        return value.matches(PHONE_VALID_REGEXP);
    }
}
```



- 自定义注解 `@Phone`，`validatedBy`的值要指定我们自定义的**约束验证器**

```java title="Phone.java"
/**
 * @author 追梦路上的孩子
 * @version 1.0
 * @date 2024/1/25 17:06
 */
@Target({ METHOD, FIELD, ANNOTATION_TYPE, CONSTRUCTOR, PARAMETER, TYPE_USE })
@Retention(RUNTIME)
@Documented
@Constraint(validatedBy = {PhoneValidator.class})
public @interface Phone {
    String message() default "手机号格式不正确";

    Class<?>[] groups() default { };

    Class<? extends Payload>[] payload() default { };
}
```

使用`@Phone`注解

```java
/**
 * @author 追梦路上的孩子
 * @version 1.0
 * @date 2024/1/25 9:31
 */
@RestController
@RequestMapping("/user")
@Validated
public class UserController {
    @GetMapping
    public String user(@Phone @RequestParam(required = false) String phone) {
        return phone;
	}
}
```

## 八、校验模式配置

```java title="validationConfig.java"
/**
 * @author 追梦路上的孩子
 * @version 1.0
 * @date 2024/1/12 9:48
 */
@Configuration
public class validationConfig {
    /**
     * 修改校验模式未快速模式（默认为普通模式）
     * 快速模式只会校验第一个出现不合法的字段
     * 普通模式会校验所有出现不合法的字段
     */
    @Bean
    public Validator validator() {
        return Validation.byProvider(HibernateValidator.class)
                .configure()
                //failFast：只要出现校验失败的情况，就立即结束校验，不再进行后续的校验
                .failFast(true)
                .buildValidatorFactory()
                .getValidator();
    }
}

```









