---
sidebar_position: 2
---

# Shiro自定义认证

## 一、自定义Realm

**`AuthenticatingRealm`**：Realm 接口的顶级抽象实现，它只实现身份验证支持（登录）操作，并将授权（访问控制）行为留给子类；可以继承`AuthenticatingRealm`抽象类来实现自定义认证

```java title="UserRealm.java"
/**
 * @author 追梦路上的孩子
 * @version 1.0
 * @date 2024/1/15 20:51
 */
@Service
public class UserRealm extends AuthenticatingRealm {
    @Autowired
    private UserMapper userMapper;

    /**
     * 从数据库中查询用户信息
     *
     * @param token the authentication token containing the user's principal and credentials.
     * @return AuthenticationInfo
     * @throws AuthenticationException
     */
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
        String username = (String) token.getPrincipal();
        User user = userMapper.selectUserByUsername(username);
        if (ObjectUtils.isEmpty(user)) {
            throw new UnknownAccountException("用户名或密码错误");
        }
        if (user.getDelStatus() != 0) {
            throw new LockedAccountException("用户被锁定");
        }
        /*
        Object principal –从数据库中获取的对象
        Object hashedCredentials –从数据库中获取的密码
        ByteSource credentialsSalt –加密盐
        String realmName –用户名
        */
        return new SimpleAuthenticationInfo(user, user.getPassword(), null, username);
    }
}

```

![image-20240117194446585](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202401171944629.png)

## 二、配置加密方式

编写工具类

```java title="ShiroUtils.java"
/**
 * @author 追梦路上的孩子
 * @version 1.0
 * @date 2024/1/17 20:06
 */
public class ShiroUtils {
    public static final Integer HASH_ITERATIONS = 10;

    /**
     * MD5加密
     *
     * @param keyword 需要加密的数据
     * @param salt    盐
     * @return 加密后的数据
     */
    public static String encrypt(String keyword, String salt) {
        return new SimpleHash(Md5Hash.ALGORITHM_NAME, keyword, salt, HASH_ITERATIONS).toString();
    }

    /**
     * MD5加密
     * @param keyword 需要加密的数据
     * @return 加密后的数据
     */
    public static String encrypt(String keyword) {
        return encrypt(keyword, null);
    }
}
```

添加Shiro配置类

```java title="ShiroConfig.java"
/**
 * @author 追梦路上的孩子
 * @version 1.0
 * @date 2024/1/15 20:00
 */
@Configuration
public class ShiroConfig {
    @Bean
    public HashedCredentialsMatcher hashedCredentialsMatcher() {
        HashedCredentialsMatcher hashedCredentialsMatcher = new HashedCredentialsMatcher();
        //设置加密算法为MD5
        hashedCredentialsMatcher.setHashAlgorithmName(Md5Hash.ALGORITHM_NAME);
        //设置散列次数
        hashedCredentialsMatcher.setHashIterations(HASH_ITERATIONS);
        return hashedCredentialsMatcher;
    }
}
```



## 三、设置SecurityManager的身份验证为自定义Realm

```java title="ShiroConfig.java"
/**
 * @author 追梦路上的孩子
 * @version 1.0
 * @date 2024/1/15 20:00
 */
@Configuration
public class ShiroConfig {
    @Bean
    public Realm realm(HashedCredentialsMatcher hashedCredentialsMatcher) {
        UserRealm userRealm = new UserRealm();
        userRealm.setCredentialsMatcher(hashedCredentialsMatcher);
        return userRealm;
    }

    @Bean
    public DefaultWebSecurityManager securityManager(Realm realm) {
        DefaultWebSecurityManager defaultWebSecurityManager = new DefaultWebSecurityManager();
        //注册自定义Realm
        defaultWebSecurityManager.setRealm(realm);
        return defaultWebSecurityManager;
    }

    @Bean
    public HashedCredentialsMatcher hashedCredentialsMatcher() {
        HashedCredentialsMatcher hashedCredentialsMatcher = new HashedCredentialsMatcher();
        //设置加密算法为MD5
        hashedCredentialsMatcher.setHashAlgorithmName(Md5Hash.ALGORITHM_NAME);
        //设置散列次数
        hashedCredentialsMatcher.setHashIterations(HASH_ITERATIONS);
        return hashedCredentialsMatcher;
    }
}
```

## 四、测试登录

通过单元测试添加一条用户信息

```java title="UserMapper.test"
/**
 * @author 追梦路上的孩子
 * @version 1.0
 * @date 2024/1/17 21:36
 */
@Slf4j
@SpringBootTest
class UserMapperTest {

    @Autowired
    private UserMapper userMapper;

    @Test
    void test() {
        User user = new User();
        user.setUsername("小丑一号");
        user.setPassword(ShiroUtils.encrypt("123456"));

        int insert = userMapper.insert(user);
        log.info("插入结果:{}", insert);
    }
}
```

![image-20240117220428487](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202401192148862.png)

放行登录接口

:::caution注意

`chainDefinition.addPathDefinition("/**", "authc")`其余接口全部拦截必须在最后面，否则不生效

:::

```java title="ShiroConfig.java"
/**
 * @author 追梦路上的孩子
 * @version 1.0
 * @date 2024/1/15 20:00
 */
@Configuration
public class ShiroConfig {
    
   	......
        
    @Bean
    public ShiroFilterChainDefinition shiroFilterChainDefinition() {
        DefaultShiroFilterChainDefinition chainDefinition = new DefaultShiroFilterChainDefinition();
        //放行登录接口
        chainDefinition.addPathDefinition("/account/login", "anon");
        //其余接口全部拦截
        chainDefinition.addPathDefinition("/**", "authc");
        return chainDefinition;
    }
}
```

登录测试

```java title="AccountInfoController.java"
/**
 * @author 追梦路上的孩子
 * @version 1.0
 * @date 2024/1/15 20:02
 */
@Slf4j
@RestController
@RequestMapping("/account")
public class AccountInfoController {
    @PostMapping("/login")
    public String adminConfig(String username, String password) {
        Subject currentUser = SecurityUtils.getSubject();
        try {
            UsernamePasswordToken token = new UsernamePasswordToken(username, password);
            currentUser.login(token);
        } catch (UnknownAccountException | IncorrectCredentialsException uae) {
            throw new RuntimeException("账号密码错误");
        } catch (LockedAccountException lae) {
            throw new RuntimeException("账号被锁定");
        } catch (AuthenticationException ae) {
            throw new RuntimeException("登录失败");
        }
        User user = (User) SecurityUtils.getSubject().getPrincipal();
        log.info("{}登录成功", user);
        return "登录成功";
    }
}
```

![image-20240117220543220](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202401192148052.png)

## 五、测试未登录访问

:::caution注意

访问接口前，记得清空cookie

:::

```java
@Slf4j
@RestController
@RequestMapping("/account")
public class AccountInfoController {
   
    ......

    @GetMapping("/info")
    public String info() {
        return "info测试";
    }

    @GetMapping("/need-auth")
    public String needAuth() {
        return "请先登录";
    }

}
```

配置默认登录接口

```xml title="application.yml"
shiro:
  loginUrl: /account/needAuth
```

放行接口

```java title="ShiroConfig.java"
/**
 * @author 追梦路上的孩子
 * @version 1.0
 * @date 2024/1/15 20:00
 */
@Configuration
public class ShiroConfig {
    
   	......
        
    @Bean
    public ShiroFilterChainDefinition shiroFilterChainDefinition() {
        DefaultShiroFilterChainDefinition chainDefinition = new DefaultShiroFilterChainDefinition();
        //放行登录接口
        chainDefinition.addPathDefinition("/account/login", "anon");
        //放行登录接口
        chainDefinition.addPathDefinition("/account/need-auth", "anon");
        //其余接口全部拦截
        chainDefinition.addPathDefinition("/**", "authc");
        return chainDefinition;
    }
}
```

未登录访问会重定向至登录接口

![1705586668343](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202401192148394.png)

## 六、自定义SessionManager

:::caution注意

自定义的`SessionManager`，会在请求头中获取传入的`sessionId`

:::

```java title="CustomSessionManager.java"
/**
 * @author 追梦路上的孩子
 * @version 1.0
 * @date 2024/1/18 22:06
 */
public class CustomSessionManager extends DefaultWebSessionManager {

    private static final String AUTHORIZATION_TOKEN = "Authorization";
    private static final String REFERENCED_SESSION_ID_SOURCE = "Stateless request";

    @Override
    protected Serializable getSessionId(ServletRequest request, ServletResponse response) {
        //从请求头获取sessionId
        String id = WebUtils.toHttp(request).getHeader(AUTHORIZATION_TOKEN);
        if (!ObjectUtils.isEmpty(id)) {
            //以下为通过配置
            request.setAttribute(ShiroHttpServletRequest.SESSION_ID_URL_REWRITING_ENABLED, isSessionIdUrlRewritingEnabled());
            request.setAttribute(ShiroHttpServletRequest.REFERENCED_SESSION_ID_SOURCE, REFERENCED_SESSION_ID_SOURCE);
            request.setAttribute(ShiroHttpServletRequest.REFERENCED_SESSION_ID, id);
            request.setAttribute(ShiroHttpServletRequest.REFERENCED_SESSION_ID_IS_VALID, Boolean.TRUE);
            return id;
        } else {
            return super.getSessionId(request, response);
        }
    }
}
```

## 七、将自定义SessionManager注册到SecurityManager

```java title="ShiroConfig.java"
@Configuration
@EnableConfigurationProperties(ShiroConfigProperties.class)
public class ShiroConfig {
   
    ......
    
    @Bean
    public DefaultWebSecurityManager securityManager(Realm realm, CustomSessionManager customSessionManager) {
        DefaultWebSecurityManager defaultWebSecurityManager = new DefaultWebSecurityManager();
        //注册自定义Realm
        defaultWebSecurityManager.setRealm(realm);
        //注册自定义SessionManager
        defaultWebSecurityManager.setSessionManager(customSessionManager);
        return defaultWebSecurityManager;
    }

    @Bean
    public CustomSessionManager customSessionManager() {
        CustomSessionManager customSessionManager = new CustomSessionManager();
        // session的过期时间
        //   -1   表示永不过期
        //    0   表示浏览器断开连接就会失效
        //   >0   表示设置具体的过期时间
        customSessionManager.setGlobalSessionTimeout(7 * 24 * 60 * 60 * 1000);
        //启用会话ID（Session ID）的Cookie
        customSessionManager.setSessionIdCookieEnabled(true);
        //禁用会话ID的URL重写
        //http://example.com/page?JSESSIONID=abcdef123456
        //禁用后，URL重写会变成http://example.com/page
        //使用其他方式来传递JSESSIONID
        customSessionManager.setSessionIdUrlRewritingEnabled(false);
        return customSessionManager;
    }
}
```

## 八、测试JSESSIONID作为令牌

修改登录接口返回值为`currentUser.getSession().getId().toString()`

```java title="AccountInfoController.java"
/**
 * @author 追梦路上的孩子
 * @version 1.0
 * @date 2024/1/15 20:02
 */
@Slf4j
@RestController
@RequestMapping("/account")
public class AccountInfoController {
    @PostMapping("/login")
    public String adminConfig(String username, String password) {
        Subject currentUser = SecurityUtils.getSubject();
        try {
            UsernamePasswordToken token = new UsernamePasswordToken(username, password);
            currentUser.login(token);
        } catch (UnknownAccountException | IncorrectCredentialsException uae) {
            throw new RuntimeException("账号密码错误");
        } catch (LockedAccountException lae) {
            throw new RuntimeException("账号被锁定");
        } catch (AuthenticationException ae) {
            throw new RuntimeException("登录失败");
        }
        User user = (User) SecurityUtils.getSubject().getPrincipal();
        log.info("{}登录成功", user);
        return currentUser.getSession().getId().toString();
    }

    @GetMapping("/info")
    public String info() {
        return "info测试";
    }

    @GetMapping("/need-auth")
    public String needAuth() {
        return "请先登录";
    }

}
```

登录获取JSESSIONID

![image-20240120021609671](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202401200216900.png)

清空以下cookie

![image-20240120021703214](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202401200217336.png)

在请求头中添加JSESSIONID访问需要登录的接口

![image-20240120021837643](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202401200218749.png)

获取数据成功，JSESSIONID可以作为**前后端分离项目**的令牌