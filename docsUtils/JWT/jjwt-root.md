---
sidebar_position: 3
---

# jjwt-root库用法

[GitHub仓库地址](https://github.com/jwtk/jjwt)

## 依赖导入

```xml
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.3</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId> <!-- or jjwt-gson if Gson is preferred -->
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>
<!-- Uncomment this next dependency if you are using:
     - JDK 10 or earlier, and you want to use RSASSA-PSS (PS256, PS384, PS512) signature algorithms.  
     - JDK 10 or earlier, and you want to use EdECDH (X25519 or X448) Elliptic Curve Diffie-Hellman encryption.
     - JDK 14 or earlier, and you want to use EdDSA (Ed25519 or Ed448) Elliptic Curve signature algorithms.    
     It is unnecessary for these algorithms on JDK 15 or later.
<dependency>
    <groupId>org.bouncycastle</groupId>
    <artifactId>bcprov-jdk18on</artifactId> or bcprov-jdk15to18 on JDK 7
    <version>1.76</version>
    <scope>runtime</scope>
</dependency>
-->
```

## 编写JWT工具类

:::caution 注意
设置jti(JWT ID)，该ID可以避免重放攻击
:::

```java title="JwtUtils.java"
/**
 * @author 追梦路上的孩子
 * @version 1.0
 * @date 2024/1/18 9:17
 */

@Component
@EnableConfigurationProperties(JwtUtilsProperties.class)
public class JwtUtils {
    public static final String CLAIM_USER_ID_KEY = "userId";
    public static final String CLAIM_USERNAME_KEY = "username";
    @Autowired
    private JwtUtilsProperties jwtUtilsProperties;

    /**
     * 生成JWT
     * @param userId 用户id
     * @param username 用户名
     * @return jwt
     */
    public String createJwt(String userId, String username) {
        return Jwts.builder()
                //自定义数据
                .claim(CLAIM_USER_ID_KEY, userId)
                //自定义数据
                .claim(CLAIM_USERNAME_KEY, username)
                //签发者
                .issuer(jwtUtilsProperties.getIss())
                //接收者
                .audience().add(username).and()
                //过期时间
                .expiration(new Date(System.currentTimeMillis() + jwtUtilsProperties.getExpiration().toMillis()))
                //JWT的ID，该ID可用于防止重放JWT
                .id(userId)
                //签发时间
                .issuedAt(new Date())
                //签名算法和密钥
                .signWith(SignatureAlgorithm.HS256, generateKey(jwtUtilsProperties.getSecretKey()))
                .compact();
    }


    /**
     * 解析JWT
     * @param jwt jwt字符串
     * @return Claims 自定义数据
     */
    public Claims parseJwt(String jwt) {
        return Jwts.parser()
                .verifyWith(generateKey(jwtUtilsProperties.getSecretKey()))
                .build()
                .parseSignedClaims(jwt).getPayload();
    }

    /**
     * 密钥加密
     * @param secretKey 密钥
     * @return SecretKey
     */
    private SecretKey generateKey(String secretKey) {
        return Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }

}
```

```java title="JwtUtilsProperties.java"
/**
 * @author 追梦路上的孩子
 */
@Data
@ConfigurationProperties("jwt")
public class JwtUtilsProperties {
    /**
     * 签发者
     */
    private String iss;
    /**
     * 过期时间
     */
    private Duration expiration;
    /**
     * 密钥
     */
    private String secretKey;
}
```

```xml title="application.yml"
#jwt配置
jwt:
    iss: "小胡的个人星球"
    expiration: 2h
    secret-key: "57cc50fb-0b09-4c21-8355-6c22507f385a"
```

## 测试

### 生成JWT

```java
/**
 * @author 追梦路上的孩子
 * @version 1.0
 * @date 2024/1/20 21:07
 */
@SpringBootTest
class JwtUtilsTest {
    @Autowired
    private JwtUtils jwtUtils;

    @Test
    void createJwt() {
        System.out.println(jwtUtils.createJwt("123", "张三"));
    }
}
```

```xml title="jwt"
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIxMjMiLCJ1c2VybmFtZSI6IuW8oOS4iSIsImlzcyI6IuWwj-iDoeeahOS4quS6uuaYn-eQgyIsImF1ZCI6WyLlvKDkuIkiXSwiZXhwIjoxNzA1ODIyNzk0LCJqdGkiOiIxMjMiLCJpYXQiOjE3MDU4MTU1OTR9.dqik_4N51Uq6NZce-MhJflRU4c1u_NhSYcJOrj-wbSM
```

### 解析JWT

```java
/**
 * @author 追梦路上的孩子
 * @version 1.0
 * @date 2024/1/20 21:07
 */
@SpringBootTest
class JwtUtilsTest {
    @Autowired
    private JwtUtils jwtUtils;

    @Test
    void parseJwt() {
        Claims claims = jwtUtils.parseJwt("eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIxMjMiLCJ1c2VybmFtZSI6IuW8oOS4iSIsImlzcyI6IuWwj-iDoeeahOS4quS6uuaYn-eQgyIsImF1ZCI6WyLlvKDkuIkiXSwiZXhwIjoxNzA1ODIyNzk0LCJqdGkiOiIxMjMiLCJpYXQiOjE3MDU4MTU1OTR9.dqik_4N51Uq6NZce-MhJflRU4c1u_NhSYcJOrj-wbSM");
        System.out.println(CLAIM_USER_ID_KEY + ":" + claims.get(CLAIM_USER_ID_KEY));
        System.out.println(CLAIM_USERNAME_KEY + ":" + claims.get(CLAIM_USERNAME_KEY));
    }
}
```

![image-20240121134401250](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202401211344464.png)
