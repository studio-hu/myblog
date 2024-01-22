---
sidebar_position: 2
---

# java-jwt库用法（推荐）

[Github仓库地址](https://github.com/auth0/java-jwt)

## 依赖导入

```xml
<dependency>
  <groupId>com.auth0</groupId>
  <artifactId>java-jwt</artifactId>
  <version>4.4.0</version>
</dependency>
```

## 编写JWT工具类

:::caution 注意
设置jti(JWT ID)，该ID可以避免重放攻击
:::

```java title="JwtUtils.java"
/**
 * @author 追梦路上的孩子
 * @version 1.0
 * @date 2023/11/18 20:14
 */
@Component
@EnableConfigurationProperties(JwtUtilsProperties.class)
public class JwtUtils {
    public static final String CLAIM_USER_ID = "userId";
    public static final String CLAIM_USERNAME = "username";
    @Autowired
    private JwtUtilsProperties jwtUtilsProperties;

    public String generateToken(User user) {
        return JWT.create()
                //签发者
                .withIssuer(jwtUtilsProperties.getIssUser())
                //面向的用户
                .withAudience(user.getUsername())
                //JWTid
                .withJWTId(user.getUserId().toString())
                //自定义数据
                .withClaim(CLAIM_USER_ID, user.getUserId())
                //自定义数据
                .withClaim(CLAIM_USERNAME, user.getUsername())
                //过期时间
                .withExpiresAt(new Date(System.currentTimeMillis() + jwtUtilsProperties.getExpiration().toMillis()))
                //签发时间
                .withIssuedAt(new Date())
                //加密算法
                .sign(Algorithm.HMAC256(jwtUtilsProperties.getSecretKey()));
    }

    public DecodedJWT verifyToken(String token) {
        return JWT.require(Algorithm.HMAC256(jwtUtilsProperties.getSecretKey()))
                .build()
                .verify(token);
    }
}
```

```java title="JwtUtilsProperties.java"
/**
 * @author 追梦路上的孩子
 * @version 1.0
 * @date 2024/1/19 21:02
 */
@Data
@ConfigurationProperties("jwt")
public class JwtUtilsProperties {
    /**
     * 签发者
     */
    private String issUser;
    /**
     * 过期时间
     */
    private Duration expiration;
    /**
     * 签名密钥
     */
    private String secretKey;
}
```

```xml title="application.yml"
#jwt配置
jwt:
  iss-user: OA系统
  expiration: 2h
  secret-key: mySecretKey
```

## 测试

### 生成JWT

```java
/**
 * @author 追梦路上的孩子
 * @version 1.0
 * @date 2024/1/19 21:33
 */
@SpringBootTest
class JwtUtilsTest {
    @Autowired
    private JwtUtils jwtUtils;

    @Test
    void generateToken() {
        User user = new User();
        user.setUserId(12345L);
        user.setUsername("test");
        String s = jwtUtils.generateToken(user);
        System.out.println(s);
    }
}
```

```xml title="jwt"
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJPQeezu-e7nyIsImF1ZCI6InRlc3QiLCJqdGkiOiIxMjM0NSIsInVzZXJJZCI6MTIzNDUsInVzZXJuYW1lIjoidGVzdCIsImV4cCI6MTcwNTg5ODY1MSwiaWF0IjoxNzA1ODkxNDUxfQ.IfAeUf5HAK1GQwHoQe_TsY9vKylGk1x6x69rTGy-L28
```

### 解析JWT

```java
/**
 * @author 追梦路上的孩子
 * @version 1.0
 * @date 2024/1/19 21:33
 */
@SpringBootTest
class JwtUtilsTest {
    @Autowired
    private JwtUtils jwtUtils;

    @Test
    void verifyToken() {
        DecodedJWT decodedJWT = jwtUtils.verifyToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJPQeezu-e7nyIsImF1ZCI6InRlc3QiLCJqdGkiOiIxMjM0NSIsInVzZXJJZCI6MTIzNDUsInVzZXJuYW1lIjoidGVzdCIsImV4cCI6MTcwNTg5NjIxOCwiaWF0IjoxNzA1ODg5MDE4fQ.NAmDC0z57NPJ_Ditiq1L2f5NnA7-SXTgq4PPuURg_CM");
        assertNotNull(decodedJWT);
        System.out.println(decodedJWT.getClaim(CLAIM_USER_ID).asLong());
        System.out.println(decodedJWT.getClaim(CLAIM_USERNAME).asString());
    }
}
```

![image-20240122104553856](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202401221046982.png)





















