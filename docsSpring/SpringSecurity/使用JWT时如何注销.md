# 使用JWT时如何注销

## JSON Web Tokens

JSON Web Tokens(JWT)是一种无状态处理用户身份验证的方法。JWT 有助于组织身份验证，而无需将身份验证状态存储在任何存储中，无论是会话还是数据库。因此，在检查用户的身份验证状态时，您不需要访问会话或执行数据库查询。相反，您可以根据您选择的用户负载生成令牌，并在客户端的请求中使用它来识别服务器上的用户。

因此，基本上，无论何时创建令牌，它都可以永久使用，或者直到过期为止。

但是，如果您想让现有令牌失效该怎么办？当用户选择注销或更改密码时，您实际上需要做什么？



## 使用JWT的弊端

通常情况下，在使用 JWT 身份验证时，客户端会将令牌存储在某处，并将其附加到每个需要身份验证的请求。因此，当用户注销或退出登录时要做的第一件事就是删除存储在客户端（如：浏览器本地存储Local storage）上的令牌。在这种情况下，客户端将没有令牌可放入请求中，从而导致未经授权的响应状态。

问题来了，但这就足够了吗？好吧，虽然客户端（浏览器、应用程序）没有存储身份令牌，但令牌仍然存在于某处并且有效！如果有人之前从请求中复制了令牌，仍然能够代表此用户执行请求！



## 如何处理JWT

使用 JWT 应该是无状态的，这意味着您应该将所需的所有内容存储在有效负载中，并跳过对每个请求执行数据库查询。但是，如果计划拥有严格的注销功能，即使已经从客户端清除了令牌，也无法等待令牌自动过期，那么可能需要忽略无状态逻辑并执行一些查询。

我们可以使用Redis来对已认证的用户进行缓存，用户登录成功后，将用户信息存放在Redis中，客户端携带JWT来进行访问时，从Redis中获取数据。

当用户注销或退出登录时，将Redis中缓存的用户信息进行删除，当用户再拿着旧的令牌去访问时，Redis中查询不到用户信息，则需要用户重新获取新的令牌，即查询登录

## 核心实现

### 引入有关依赖

```xml
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
<dependency>
    <groupId>com.alibaba.fastjson2</groupId>
    <artifactId>fastjson2</artifactId>
    <version>2.0.41</version>
</dependency>
```

### 配置序列化

FastjsonRedisSerializer

```java
public class FastjsonRedisSerializer<T> implements RedisSerializer<T> {
    public static final Charset DEFAULT_CHARSET = StandardCharsets.UTF_8;

    private Class<T> clazz;

    public FastjsonRedisSerializer(Class clazz) {
        super();
        this.clazz = clazz;
    }

    @Override
    public byte[] serialize(T value) throws SerializationException {
        if (value == null) {
            return new byte[0];
        }
        return JSON.toJSONString(value, JSONWriter.Feature.WriteNulls).getBytes(DEFAULT_CHARSET);
    }

    @Override
    public T deserialize(byte[] bytes) throws SerializationException {
        if (bytes == null || bytes.length == 0) {
            return null;
        }
        return JSON.parseObject(new String(bytes), clazz);
    }
}

```

RedisConfig

```java
@Configuration
public class RedisConfig {

    @Bean
    public FastjsonRedisSerializer fastjsonRedisSerializer() {
        return new FastjsonRedisSerializer<>(Object.class);
    }

    @Bean
    public RedisTemplate<Object, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<Object, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        template.setKeySerializer(new StringRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());

        template.setValueSerializer(fastjsonRedisSerializer());
        template.setHashValueSerializer(fastjsonRedisSerializer());

        template.afterPropertiesSet();
        return template;
    }
}

```

### 完善LoginServiceImpl

将认证的用户存入Redis中

```java
//将认证的用户存入Redis中
redisTemplate.opsForValue().set(id, principal);
```

完整代码：

```java
@Service
public class LoginServiceImpl implements LoginService {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private RedisTemplate redisTemplate;

    @Override
    public ApiResponse login(User user) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword());
        Authentication authenticate = authenticationManager.authenticate(authenticationToken);
        USERDETAILS principal = (USERDETAILS) authenticate.getPrincipal();
        String id = principal.getUser().getId();

        //将认证的用户存入Redis中
        redisTemplate.opsForValue().set(id, principal);

        String token = JwtUtils.generateToken(principal.getUser());
        HashMap<String, String> map = new HashMap<>();
        map.put("token", token);
        return new ApiResponse(HttpStatus.OK.value(), "登录成功", map);
    }
}

```

### 完善JwtAuthenticationFilter

从redis中获取用户信息

```java
String json = JSON.toJSONString(redisTemplate.opsForValue().get(id));

USERDETAILS userdetails = JSON.parseObject(json, USERDETAILS.class);
if (Objects.isNull(userdetails)) {
	throw new RuntimeException("用户未登录");
}
```



完整代码

```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Autowired
    private RedisTemplate redisTemplate;

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
            User user = JwtUtils.verifyToken(token);
            String id = user.getId();
            String json = JSON.toJSONString(redisTemplate.opsForValue().get(id));

            USERDETAILS userdetails = JSON.parseObject(json, USERDETAILS.class);
            if (Objects.isNull(userdetails)) {
                throw new RuntimeException("用户未登录");
            }
        
            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(userdetails, null, userdetails.getAuthorities());
            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(authenticationToken);
            SecurityContextHolder.setContext(context);
            filterChain.doFilter(request, response);
        }catch (TokenExpiredException e) {
            String json = JSON.toJSONString(new ApiResponse<>(HttpStatus.FORBIDDEN.value(), "token过期"),
                    JSONWriter.Feature.WriteNulls);
            response.getWriter().println(json);
        } catch (RuntimeException e){
            String json = JSON.toJSONString(new ApiResponse<>(HttpStatus.FORBIDDEN.value(), e.getMessage()),
                    JSONWriter.Feature.WriteNulls);
            response.getWriter().println(json);
        } catch (Exception e) {
            e.printStackTrace();
            String json = JSON.toJSONString(new ApiResponse<>(HttpStatus.FORBIDDEN.value(), "token无效"),
                    JSONWriter.Feature.WriteNulls);
            response.getWriter().println(json);
        }

    }
}

```













