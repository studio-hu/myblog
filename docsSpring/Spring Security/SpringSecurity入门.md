# Spring Security入门

## 1.简介

Spring Security是一个Java框架，用于保护应用程序的安全性。它提供了一套全面的安全解决方案，包括身份验证、授权、防止攻击等功能。Spring Security基于过滤器链的概念，可以轻松地集成到任何基于Spring的应用程序中。它支持多种身份验证选项和授权策略，开发人员可以根据需要选择适合的方式。此外，Spring Security还提供了一些附加功能，如集成第三方身份验证提供商和单点登录，以及会话管理和密码编码等。总之，Spring Security是一个强大且易于使用的框架，可以帮助开发人员提高应用程序的安全性和可靠性。

Spring Security是一个框架，提供 认证（authentication）、授权（authorization）和 保护，以抵御常见的攻击。它对保护命令式和响应式应用程序有一流的支持，是保护基于Spring的应用程序的事实标准

## 2.Spring Security初体验

### 2.1.初始化一个Spring Boot 3项目

```xml
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-web</artifactId>
</dependency>
```



### 2.2依赖导入

注意：Spring Boot3.0默认使用SpringSecurity6的版本

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

其他依赖

```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
    <version>3.5.3.1</version>
</dependency>
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
</dependency>
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid-spring-boot-starter</artifactId>
    <version>1.2.16</version>
</dependency>
<dependency>
    <groupId>com.auth0</groupId>
    <artifactId>java-jwt</artifactId>
    <version>4.4.0</version>
</dependency>
<dependency>
    <groupId>com.alibaba.fastjson2</groupId>
    <artifactId>fastjson2</artifactId>
    <version>2.0.41</version>
</dependency>
```



### 2.3声明一个测试接口

```java
@RestController
@RequestMapping("/user")
public class UserController {
    /**
     * 测试接口
     *
     * @return 返回ok
     */
    @GetMapping
    public String test() {
        return "ok";
    }
}
```

### 2.4启动项目

打开浏览器访问`http://localhost:8080/user`，浏览器将弹出一个需要进行身份验证的对话框，如图所示

![image-20231026193317854](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202310261933943.png)

在引入Spring Security项目之后，虽然没有进行任何相关的配置或编码，但Spring Security有一个默认的运行状态，要求在经过HTTP基本认证后才能访问对应的URL资源，其默认使用的用户名为**user**，密码则是动态生成并打印到控制台的一串随机码。翻看控制台的打印信息，可以看到如图所示的输出

密码为：`a84966d6-f2ac-4a26-a191-7afb330c110d`

![image-20231026194135349](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202310261941388.png)

**在SecurityProperties类中源代码：**

![image-20231026195807779](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202310261958824.png)



输入用户名和密码后，单击“登录”按钮即可成功访问

![image-20231026194359003](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202310261943042.png)

**修改默认账号和密码**

在yml配置文件中添加如下配置：

```yaml
spring:
  security:
    user:
      name: admin
      password: 123456
```

重启程序，控制台不在打印密码，使用我们自定义的账号和密码即可登录

## 3.认证

### 3.1Spring Security原理

Spring Security的实际上是由16个过滤器组成的过滤器链，如下图：

![4efbdc14f3073d3385377fb4d9b4a97](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202310262009322.png)

其中核心过滤器为：

![image-20211214144425527](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202310262011960.png)

**UsernamePasswordAuthenticationFilter：**负责处理我们在登陆页面填写了用户名密码后的登陆请求。Spring Security初体验的认证工作主要由它负责

**ExceptionTranslationFilter：**处理过滤器链中抛出的`AccessDeniedException`和`AuthenticationException`

**FilterSecurityInterceptor：**负责权限校验的过滤器



![image-20231026202559859](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202310262025929.png)

**Authentication接口：**它的实现类，表示当前访问系统的用户，封装了用户相关信息

**AuthenticationManager接口：**定义了认证Authentication的方法 

**UserDetailsService接口：**加载用户特定数据的核心接口。里面定义了一个根据用户名查询用户信息的方法。

**UserDetails接口：**提供核心用户信息。通过UserDetailsService根据用户名获取处理的用户信息要封装成UserDetails对象返回。然后将这些信息封装到Authentication对象中

### 3.2自定义认证核心思路（重点）

- 自定义登录接口
  - 调用**`ProviderManager`**的**`authenticate`**方法去认证

- 自定义实现`UserDetailsService`
  - 重写**`loadUserByUsername`**方法去数据库查询用户

### 3.3核心实现

#### 1）定义一个`UserDetailsService`的实现类

UserDetailsServiceImpl.java

```java
@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    private UserMapper userMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        //查询用户信息（此处使用了Mybatis-Plus）
       	LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(User::getUsername, username);
        User user = userMapper.selectOne(queryWrapper);
        if (Objects.isNull(user)) {
            throw new UsernameNotFoundException("用户不存在");
        }
        //TODO 查询用户权限信息并返回
        
        return new USERDETAILS(user);
    }
}
```

USERDETAILS.java

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class USERDETAILS implements UserDetails {
    
    private User user;
	
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        //TODO 返回权限信息，目前先返回null
        return null;
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    //指示用户帐户是否已过期。过期的帐户无法进行身份验证
   	//true 如果用户的帐户有效（即未过期）， false 如果不再有效（即已过期）
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    
	//指示用户是锁定还是解锁。无法对锁定的用户进行身份验证。
	//true 如果用户未锁定， false 否则
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }
	
	//指示用户的凭据（密码）是否已过期。过期的凭据会阻止身份验证。
	//true 如果用户的凭据有效（即未过期），如果不再有效（即已过期 false ）
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

	//指示用户是启用还是禁用。无法对已禁用的用户进行身份验证。
	//true 如果用户已启用， false 否则
    @Override
    public boolean isEnabled() {
        return true;
    }
}
```



#### 2）登录接口实现

```java
@Service
public class LoginServiceImpl implements LoginService {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Override
    public ApiResponse login(User user) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword());
        Authentication authenticate = authenticationManager.authenticate(authenticationToken);
        USERDETAILS principal = (USERDETAILS) authenticate.getPrincipal();
        String token = JwtUtils.generateToken(principal.getUser());
        HashMap<String, String> map = new HashMap<>();
        map.put("token", token);
        return new ApiResponse(HttpStatus.OK.value(), "登录成功", map);
    }
}

```

JwtUtils

```java
public class JwtUtils {
    private static final String SECRET = "mySecretKey";
    //毫秒为单位
    private static final Long EXPIRATION = 1000 * 60 * 60 * 2L;

    public static String generateToken(User user) {
        return JWT.create()
                .withAudience(JSONObject.toJSONString(user))
                .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION))
                .withIssuedAt(new Date())
                .sign(Algorithm.HMAC256(SECRET));
    }

    public static User verifyToken(String token) throws Exception {
        String json = JWT.require(Algorithm.HMAC256(SECRET))
                .build()
                .verify(token)
                .getAudience()
                .get(0);
        return JSONObject.parseObject(json, User.class);
    }
}
```



#### 3）认证过滤器实现

:::tip

在Spring Boot项目中`Filter`您可以从OncePerRequestFilter扩展，而不是实现，它是过滤器的基类，每个请求仅调用一次，并提供`doFilterInternal`带有`HttpServletRequest`和`HttpServletResponse`参数的方法

:::

```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Autowired
    private UserService userService;
    @Autowired
    private UserMapper userMapper;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json;charset=UTF-8");
        String token = request.getHeader("Authorization");
        if (!StringUtils.hasText(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            //从token中解析出用户
            User user = JwtUtils.verifyToken(token);
            USERDETAILS userdetails = new USERDETAILS(user, authorize);
            //TODO 查询用户权限信息并返回
            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(userdetails, null, null);
            //将Authentication存入SecurityContextHolder
            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(authenticationToken);
            SecurityContextHolder.setContext(context);
            filterChain.doFilter(request, response);
        } catch (TokenExpiredException e) {
            String json = JSONObject.toJSONString(new ApiResponse<>(HttpStatus.FORBIDDEN.value(), "token过期"),
                    JSONWriter.Feature.WriteNulls);
            response.getWriter().println(json);
        } catch (Exception e) {
            String json = JSONObject.toJSONString(new ApiResponse<>(HttpStatus.FORBIDDEN.value(), "token无效"),
                    JSONWriter.Feature.WriteNulls);
            response.getWriter().println(json);
        }

    }
}

```

:::caution注意

应该创建一个新的 `SecurityContext` 实例，而不是使用`SecurityContextHolder.getContext().setAuthentication(authentication)`，以避免多线程之间的竞争

 接下来，我们创建一个新的 `Authentication` 对象。Spring Security 并不关心在 `SecurityContext` 上设置了什么类型的 `Authentication` 实现。一个更常见的生产场景是 `UsernamePasswordAuthenticationToken(userDetails, password, authorities)`

最后，我们在 `SecurityContextHolder` 上设置 `SecurityContext`。Spring Security 使用这些信息进行 授权

:::

替换UsernamePasswordAuthenticationFilter过滤器为我们自定义的过滤器



![image-20231028175714314](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202310281757358.png)




#### 4）SpringSecurity配置类

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Autowired
    UserDetailsServiceImpl userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .sessionManagement(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authorizationManagerRequestMatcherRegistry ->
                        authorizationManagerRequestMatcherRegistry
                                .requestMatchers("/user/login").permitAll()
                                .requestMatchers("/user/admin2").hasRole("admin2")
                                .anyRequest()
                                .authenticated())
                .addFilterAt(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(exceptionHandling ->
                        exceptionHandling
                                .authenticationEntryPoint(myAuthenticationHandler)
                                .accessDeniedHandler(myAuthenticationHandler)
                )
                //配置跨域
                .cors(AbstractHttpConfigurer::disable);

        return http.build();
    }

    //注入BCrypt密码密码加密对象
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    //注入AuthenticationManager的实现类ProviderManager对象
    @Bean
    public AuthenticationManager authenticationManager(PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
        //设置UserDetailsService的实现类
        daoAuthenticationProvider.setUserDetailsService(userDetailsService);
        //设置密码加密
        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder);
        return new ProviderManager(daoAuthenticationProvider);
    }
}

```

## 4.授权

### 4.1授权的基本流程

​	在SpringSecurity中，会使用默认的FilterSecurityInterceptor来进行权限校验。在FilterSecurityInterceptor中会从SecurityContextHolder获取其中的Authentication，然后获取其中的权限信息。当前用户是否拥有访问当前资源所需的权限。

​	所以我们在项目中只需要把当前登录用户的权限信息也存入Authentication。

​	然后设置我们的资源所需要的权限即可。

### 4.2配置访问资源所需的权限

#### 1）注解

在SecurityConfig的配置类中，开启相关配置

```java
@EnableMethodSecurity
```

![image-20231027215549316](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202310272155405.png)

在需要设置权限的方法中使用注解`@PreAuthorize`

**权限配置：**

```java
@PreAuthorize("hasAuthority('system:user:delete')")
@GetMapping("/admin1")
public String admin1() {
	return "admin1";
}
```

`hasAuthority`表示需要拥有`system:user:delete`权限才可以访问

**角色配置：**

```java
@PreAuthorize("hasRole('admin2')")
@GetMapping("/admin2")
public String admin2() {
	return "admin2";
}
```

`hasRole`表示需要拥有`admin2`角色才可以访问

#### 2）配置类

在SecurityConfig配置类中添加权限

**权限配置：**

![image-20231027220003770](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202310272200813.png)

**角色配置：**

![image-20231027220202209](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202310272202248.png)

### 4.3封装权限信息

- 完善`USERDETAILS.java`中的`TODO`查询用户权限信息并返回

- 完善`UserDetailsServiceImpl`中的`TODO`查询用户权限信息并返回

- 完善`JwtAuthenticationFilter`中的`TODO` 查询用户权限信息并返回

#### 完善后的：USERDETAILS.java

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class USERDETAILS implements UserDetails {
    private User user;
    private List<String> permissions;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
   		//返回权限信息
        return permissions.stream()
                .map(SimpleGrantedAuthority::new)
                .toList();
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}

```



#### 完善后的：UserDetailsServiceImpl

```java
@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    private UserMapper userMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        //查询用户信息（此处使用了Mybatis-Plus）
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(User::getUsername, username);
        User user = userMapper.selectOne(queryWrapper);
        if (Objects.isNull(user)) {
            throw new UsernameNotFoundException("用户不存在");
        }
        // 查询用户权限信息
        List<String> authorize = userMapper.authorize(user.getId());
        //把数据封装成UserDetails返回
        return new USERDETAILS(user, authorize);

    }
}

```

#### 完善后的JwtAuthenticationFilter

```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Autowired
    private UserService userService;
    @Autowired
    private UserMapper userMapper;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json;charset=UTF-8");
        String token = request.getHeader("Authorization");
        if (!StringUtils.hasText(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            //从token中解析出用户
            User user = JwtUtils.verifyToken(token);
            //TODO 查询用户权限信息并返回
            List<String> authorize = userMapper.authorize(user.getId());
            USERDETAILS userdetails = new USERDETAILS(user, authorize);
            UsernamePasswordAuthenticationToken authenticationToken =
                     new UsernamePasswordAuthenticationToken(userdetails, null, userdetails.getAuthorities());
            //将Authentication存入SecurityContextHolder
            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(authenticationToken);
            SecurityContextHolder.setContext(context);
            filterChain.doFilter(request, response);
        } catch (TokenExpiredException e) {
            String json = JSONObject.toJSONString(new ApiResponse<>(HttpStatus.FORBIDDEN.value(), "token过期"),
                    JSONWriter.Feature.WriteNulls);
            response.getWriter().println(json);
        } catch (Exception e) {
            String json = JSONObject.toJSONString(new ApiResponse<>(HttpStatus.FORBIDDEN.value(), "token无效"),
                    JSONWriter.Feature.WriteNulls);
            response.getWriter().println(json);
        }

    }
}

```



## 5.RBAC模型

### 5.1数据库建表

![image-20231027222643366](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202310272226421.png)

```sql
/*
 Navicat Premium Data Transfer

 Source Server         : MySQL
 Source Server Type    : MySQL
 Source Server Version : 80021 (8.0.21)
 Source Host           : localhost:3306
 Source Schema         : security

 Target Server Type    : MySQL
 Target Server Version : 80021 (8.0.21)
 File Encoding         : 65001

 Date: 27/10/2023 22:27:40
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for menu
-- ----------------------------
DROP TABLE IF EXISTS `menu`;
CREATE TABLE `menu`  (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `menu_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `perm_key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role`  (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `role_key` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for role_menu
-- ----------------------------
DROP TABLE IF EXISTS `role_menu`;
CREATE TABLE `role_menu`  (
  `role_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `menu_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`role_id`, `menu_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for user_role
-- ----------------------------
DROP TABLE IF EXISTS `user_role`;
CREATE TABLE `user_role`  (
  `user_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `role_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`user_id`, `role_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;

```

### 5.2代码实现

#### 1）自定义接口

```java
@Mapper
public interface UserMapper extends BaseMapper<User> {
    /**
     * 查询用户权限
     * @param id
     * @return
     */
    List<String> authorize(String id);
}
```

#### 2）配置xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd" >
<mapper namespace="top.hyqstudio.mapper.UserMapper">

    <select id="authorize" resultType="java.lang.String">
        SELECT m.perm_key
        FROM `user` u
                 LEFT JOIN user_role ur ON u.id = ur.user_id
                 LEFT JOIN role r ON ur.role_id = r.id
                 LEFT JOIN role_menu rm ON rm.role_id = r.id
                 LEFT JOIN menu m ON m.id = rm.menu_id
        where u.id = #{id}
    </select>
</mapper>
```

![image-20231028175244607](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202310281752725.png)



## 6.自定义失败处理

- 如果是认证过程中出现的异常会被封装成AuthenticationException然后调用`AuthenticationEntryPoint`对象的方法去进行异常处理。


- 如果是授权过程中出现的异常会被封装成AccessDeniedException然后调用`AccessDeniedHandler`对象的方法去进行异常处理。

### 6.1自定义实现`AuthenticationEntryPoint`和`AccessDeniedHandler`

```java
@Component
public class MyAuthenticationHandler implements AccessDeniedHandler, AuthenticationEntryPoint {
    /**
     * 认证失败处理
     *
     * @param request       that resulted in an <code>AuthenticationException</code>
     * @param response      so that the user agent can begin authentication
     * @param authException that caused the invocation
     * @throws IOException
     * @throws ServletException
     */
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        Class<? extends AuthenticationException> exceptionType = authException.getClass();
        if (exceptionType == BadCredentialsException.class) {
            extracted(request, response, HttpStatus.UNAUTHORIZED, "用户名或密码错误");
            return;
        }
        //未携带token访问或未认证的用户访问
        if (exceptionType == InsufficientAuthenticationException.class) {
            extracted(request, response, HttpStatus.UNAUTHORIZED, "非法访问");
            return;
        }
        if (exceptionType == DisabledException.class) {
            extracted(request, response, HttpStatus.UNAUTHORIZED, "用户被禁用");
            return;
        }
        extracted(request, response, HttpStatus.UNAUTHORIZED, authException.getMessage());

    }

    /**
     * 权限不足处理
     *
     * @param request               that resulted in an <code>AccessDeniedException</code>
     * @param response              so that the user agent can be advised of the failure
     * @param accessDeniedException that caused the invocation
     * @throws IOException
     * @throws ServletException
     */
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {
        extracted(request, response, HttpStatus.FORBIDDEN, "权限不足");
    }

    private static void extracted(HttpServletRequest request, HttpServletResponse response, HttpStatusCode code, String message) throws IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json;charset=UTF-8");
        ApiResponse res = new ApiResponse(code.value(), message);
        String json = JSONObject.toJSONString(res, JSONWriter.Feature.WriteNulls);
        response.getWriter().println(json);
    }
}
```

### 认证异常：

未携带token去访问：报`InsufficientAuthenticationException`错误

用户被禁用：报`DisabledException`错误

用户名或密码错误：报`BadCredentialsException`错误



### 6.2配置

先注入IOC容器中

```java
@Autowired
private MyAuthenticationHandler myAuthenticationHandler;
```

配置

![image-20231027223614407](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202310272236461.png)
