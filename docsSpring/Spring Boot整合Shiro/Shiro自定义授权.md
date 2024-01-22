---
sidebar_position: 3
---


# Shiro自定义授权

## 一、构建RBAC模型

![image-20240120162136210](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202401201621304.png)

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

 Date: 20/01/2024 16:24:54
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for menu
-- ----------------------------
DROP TABLE IF EXISTS `menu`;
CREATE TABLE `menu`  (
  `menu_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `menu_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `perm_key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`menu_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of menu
-- ----------------------------
INSERT INTO `menu` VALUES ('1', '删除用户', 'system:user:delete');
INSERT INTO `menu` VALUES ('2', '禁用用户', 'system:user:disable');
INSERT INTO `menu` VALUES ('3', '查看用户', 'system:user:list');

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role`  (
  `role_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `role_key` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`role_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO `role` VALUES ('1', '管理员', 'ROLE_ADMIN');
INSERT INTO `role` VALUES ('2', '用户', 'ROLE_USER');

-- ----------------------------
-- Table structure for role_menu
-- ----------------------------
DROP TABLE IF EXISTS `role_menu`;
CREATE TABLE `role_menu`  (
  `role_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `menu_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`role_id`, `menu_id`) USING BTREE,
  INDEX `menu_id`(`menu_id` ASC) USING BTREE,
  CONSTRAINT `role_menu_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role` (`role_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `role_menu_ibfk_2` FOREIGN KEY (`menu_id`) REFERENCES `menu` (`menu_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of role_menu
-- ----------------------------
INSERT INTO `role_menu` VALUES ('1', '1');
INSERT INTO `role_menu` VALUES ('1', '2');
INSERT INTO `role_menu` VALUES ('1', '3');
INSERT INTO `role_menu` VALUES ('2', '3');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `user_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1717548751612645378', '玛卡巴卡', '4a95737b032e98a50c056c41f2fa9ec6');

-- ----------------------------
-- Table structure for user_role
-- ----------------------------
DROP TABLE IF EXISTS `user_role`;
CREATE TABLE `user_role`  (
  `user_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `role_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`user_id`, `role_id`) USING BTREE,
  INDEX `role_id`(`role_id` ASC) USING BTREE,
  CONSTRAINT `user_role_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `user_role_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `role` (`role_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_role
-- ----------------------------
INSERT INTO `user_role` VALUES ('1717548751612645378', '1');
INSERT INTO `user_role` VALUES ('1717548751612645378', '2');

SET FOREIGN_KEY_CHECKS = 1;


```

## 二、查询用户角色和权限

```java title="UserMapper.java"
/**
 * @author 追梦路上的孩子
 * @version 1.0
 * @date 2024/1/20 13:16
 */
@Mapper
public interface UserMapper extends BaseMapper<User> {
    List<Role> selectRolesAndOperations(@Param("userId") Long userId);

    default User selectUserByUsername(String username) {
        return this.selectOne(new LambdaQueryWrapper<User>().eq(User::getUsername, username));
    }

}
```



```xml title="UserMapper.xml"
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "https://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="top.hyqstudio.shiro.authorization.mapper.UserMapper">
    <resultMap id="RoleBaseResultMap" type="top.hyqstudio.shiro.authorization.entity.Role">
        <id property="roleId" column="role_id"/>
        <result property="name" column="name"/>
        <result property="roleKey" column="role_key"/>
    </resultMap>
    <resultMap id="MenuBaseResultMap" type="top.hyqstudio.shiro.authorization.entity.Menu">
        <id property="menuId" column="menu_id"/>
        <result property="menuName" column="menu_name"/>
        <result property="permKey" column="perm_key"/>
    </resultMap>

    <resultMap id="BaseResultMap" type="top.hyqstudio.shiro.authorization.entity.Role" extends="RoleBaseResultMap">
        <collection property="menuList" resultMap="MenuBaseResultMap"/>
    </resultMap>

    <select id="selectRolesAndOperations" resultMap="BaseResultMap">
        SELECT r.role_id,
               r.name,
               r.role_key,
               m.menu_id,
               m.menu_name,
               m.perm_key
        FROM user_role ur
                 LEFT JOIN role r ON ur.role_id = r.role_id
                 LEFT JOIN role_menu rm ON r.role_id = rm.role_id
                 LEFT JOIN menu m ON rm.menu_id = m.menu_id
        WHERE ur.user_id = #{userId}
    </select>
</mapper>
```

![image-20240120170022321](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202401201700363.png)





## 三、自定义Realm

在自定义认证中，继承的是**`AuthenticatingRealm`**抽象类，该类只支持认证不提供授权；我们可以实现其抽象子类**`AuthorizingRealm`**来自定义认证和授权

**`AuthorizingRealm`**：添加授权（访问控制）支持，扩展 `AuthenticatingRealm`的功能

![image-20240120131107462](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202401201311501.png)

```java title="Realm.java"
/**
 * @author 追梦路上的孩子
 * @version 1.0
 * @date 2024/1/20 13:14
 */

@Service
public class UserRealm extends AuthorizingRealm {
    @Autowired
    private UserMapper userMapper;

    /**
     * 授权
     */
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
        User user = (User) principals.getPrimaryPrincipal();
        List<Role> roles = userMapper.selectRolesAndOperations(user.getUserId());
        //获取所有角色
        Set<String> roleList = roles.stream().map(Role::getRoleKey).collect(Collectors.toSet());
        //获取所有权限
        Set<String> menuList = roles.stream().flatMap(role -> role.getMenuList().stream()).map(Menu::getPermKey).collect(Collectors.toSet());
        SimpleAuthorizationInfo simpleAuthorizationInfo = new SimpleAuthorizationInfo();
        simpleAuthorizationInfo.setRoles(roleList);
        simpleAuthorizationInfo.setStringPermissions(menuList);
        return simpleAuthorizationInfo;

    }

    /**
     * 认证
     */
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
        String username = (String) token.getPrincipal();
        User user = userMapper.selectUserByUsername(username);
        if (ObjectUtils.isEmpty(user)) {
            throw new UnknownAccountException("用户名或密码错误");
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



## 四、shiro配置

```java title="ShiroConfig.java"
/**
 * @author 追梦路上的孩子
 * @version 1.0
 * @date 2024/1/20 13:14
 */
@Configuration
@EnableConfigurationProperties(ShiroConfigProperties.class)
public class ShiroConfig {
    private final String ANON = "anon";
    private final String AUTHC = "authc";
    @Autowired
    private ShiroConfigProperties shiroConfigProperties;

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

    @Bean
    public ShiroFilterChainDefinition shiroFilterChainDefinition() {
        DefaultShiroFilterChainDefinition chainDefinition = new DefaultShiroFilterChainDefinition();
        //放行登录接口
        shiroConfigProperties.getAnonList().forEach(urlList -> chainDefinition.addPathDefinition(urlList, ANON));
        //其余接口全部拦截
        chainDefinition.addPathDefinition("/**", AUTHC);
        return chainDefinition;
    }
}
```

```java title="ShiroConfigProperties.java"
/**
 * @author 追梦路上的孩子
 * @version 1.0
 * @date 2024/1/20 13:25
 */
@Data
@ConfigurationProperties("shiro.white")
public class ShiroConfigProperties {
    private List<String> anonList;
}
```

```xml title="application.yml"
shiro:
  loginUrl: /account/need-auth
  white:
    anon-list:
      - /account/need-auth
      - /account/login
```


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



## 五、给接口添加访问权限

**`@RequiresRoles`**：要求当前 `Subject` 具有所有指定的**角色**。如果没有指定的角色，则不会执行该方法并抛出`AuthorizationException`异常

:::caution注意

当设置多个角色时，默认逻辑操作为`AND`，即`Subject`需要包含所有指定的角色才能访问；可修改逻辑操作为`OR`，即包含其中一个角色就可访问

:::

```java
public @interface RequiresRoles {
    String[] value();
    Logical logical() default Logical.AND; 
}
```

**`@RequiresPermissions`**：要求当前 `Subject` 具有所有指定的**权限**。如果没有指定的权限，则不会执行该方法并抛出`AuthorizationException`异常

:::caution注意

当设置多个权限时，默认逻辑操作为`AND`，即`Subject`需要包含所有指定的权限才能访问；可修逻辑操作改为`OR`，即包含其中一个权限就可访问

:::

```java
public @interface RequiresPermissions {
    String[] value();
    Logical logical() default Logical.AND; 
}
```

:::caution注意

同时使用`@RequiresRoles`和`@RequiresPermissions`时，需要`Subject`包含所指定的角色和权限才能访问，仅包含其中一个角色，或者权限，禁止访问

:::

接口测试：

```java 
/**
 * @author 追梦路上的孩子
 * @version 1.0
 * @date 2024/1/20 17:08
 */
@Slf4j
@RestController
@RequestMapping("/account")
public class AccountController {
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

    @GetMapping("/role")
    @RequiresRoles("ROLE_ADMIN")
    public String role() {
        return "角色测试";
    }

    @GetMapping("/user")
    @RequiresRoles("ROLE_NO")
    public String roleUser() {
        return "无角色测试";
    }

    @GetMapping("/permissions")
    @RequiresPermissions("system:user:list")
    public String permissions() {
        return "权限测试";
    }

    @GetMapping("/role-permissions")
    @RequiresRoles(value = {"ROLE_ADMIN", "ROLE_USER"}, logical = Logical.OR)
    @RequiresPermissions("system:user:lisasast")
    public String roleAndPermissions() {
        return "角色权限测试";
    }

    @GetMapping("/need-auth")
    public String needAuth() {
        return "请先登录";
    }

}
```

## 六、错误捕获

权限不足时，会抛出`AuthorizationException`异常，可在全局异常中捕获处理

```java
/**
 * @author 追梦路上的孩子
 * @version 1.0
 * @date 2024/1/20 17:56
 */
@RestControllerAdvice
public class GlobalHandlerException {
    @ExceptionHandler(AuthorizationException.class)
    public String handler() {
        return "没有权限";
    }
}
```











