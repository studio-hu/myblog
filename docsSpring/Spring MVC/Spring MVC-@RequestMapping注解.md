---
sidebar_position: 4
---

# Spring MVC-@RequestMapping注解

## 一、作用

这个注解主要作用其实就是一个路径.专业名字叫关系映射，可以对HTTP请求方式进行限定

- @RequestMapping标识一个类：设置映射请求的请求路径的初始信息
- @RequestMapping标识一个方法：设置映射请求请求路径的具体信息

## 二、源码

```java
@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Mapping
public @interface RequestMapping {
    String name() default "";
    @AliasFor("path")
    String[] value() default {};
    @AliasFor("value")
    String[] path() default {};
    RequestMethod[] method() default {};
    String[] params() default {};
    String[] headers() default {};
    String[] consumes() default {};
    String[] produces() default {};
}
```

## 三、说明

### 1、属性

| 参数                     | 说明                                                         |
| ------------------------ | ------------------------------------------------------------ |
| String[] value()         | **(重点)**指定请求的实际地址，指定的地址可以是URI Template 模式 等同path；value属性是一个字符串类型的数组，表示该请求映射能够匹配多个请求地址（不过一般不这么用） |
| RequestMethod[] method() | 所对应的请求**(重点)**指定请求的method类型， RequestMethod.GET、RequestMethod.POST、RequestMethod.PUT、RequestMethod.DELETE等；默认为RequestMethod.GET； |
| String[]consumes         | 指定处理请求的提交内容类型（Content-Type），例如application/json, text/html; |
| String[] produces        | 指定返回的内容类型，仅当request请求头中的(Accept)类型中包含该指定类型才返回； |
| String[] params()        | **(掌握)**指定限制请求参数的条件。支持简单的表达式。就是请求地址上的key=value |
| String[] headers()       | 指定request中必须包含某些指定的header值，才能让该方法处理请求； |

**注意：**对于处理指定请求方式的控制器方法，SpringMVC中提供了@RequestMapping的派生注解，以下为常用的4种注解

- `@GetMapping`：处理get请求的映射
- `@PostMapping`：处理post请求的映射
- `@PutMapping`：处理put请求的映射
- `@DeleteMapping`：处理delete请求的映射



**附:**

 常见的媒体格式类型如下：

    text/html   ：HTML格式
    text/plain  ：纯文本格式      
    text/xml    ：XML格式
    image/gif   ：gif图片格式    
    image/jpeg  ：jpg图片格式 
    image/png   ：png图片格式

以application开头的媒体格式类型：

```
application/xhtml+xml             ：XHTML格式
application/xml                   ：XML数据格式
application/atom+xml              ：Atom XML聚合格式    
application/json                  ：JSON数据格式
application/pdf                   ：pdf格式  
application/msword                ：Word文档格式
application/octet-stream          ：二进制流数据（如常见的文件下载）
application/x-www-form-urlencoded ：<form encType="">中默认的encType，form表单数据被编码为key/value格式发送到服务器（表单默认的提交数据的格式）

```





### 2、http中八种请求

| 请求方式   | 说明                                                         |
| ---------- | ------------------------------------------------------------ |
| **GET**    | 请求指定的页面信息，并返回实体主体。                         |
| **HEAD**   | 类似于get请求，只不过返回的响应中没有具体的内容，用于获取报头 |
| **POST**   | 向指定资源提交数据进行处理请求（例如提交表单或者上传文件）。数据被包含在请求体中。POST请求可能会导致新的资源的建立和/或已有资源的修改。 |
| **PUT**    | 从客户端向服务器传送的数据取代指定的文档的内容。             |
| **DELETE** | 请求服务器删除指定的页面。                                   |
| OPTIONS    | 允许客户端查看服务器的性能。                                 |
| TRACE      | 回显服务器收到的请求，主要用于测试或诊断。                   |
| PATCH      | 实体中包含一个表，表中说明与该URI所表示的原内容的区别        |

### 3、使用说明

如果使用在**类**上。就相当于应用的根路径。他的主要作用是为了使我们的 URL 可以按照模块化管理(restful):

```
商品模块
/shop/add
/shop/update
...
/order/list
/order/add
```

如果使用在**方法**上。相当于二级请求地址

## 四、示例

**在类和方法上使用**

```java
@Controller
@RequestMapping("/account")
public class AccountController {
    //  访问地址  /account/login
    @RequestMapping("/login")
    public String login() {
        return "登录";
    }
}
```

**method属性** 

```java
@Controller
@RequestMapping("/account")
public class AccountController {
    // 只允许post请求访问
    @RequestMapping(value = "/register", method =RequestMethod.POST)
    public String register() {
        return "注册";
    }
        // 允许 GET请求 POST请求访问
    @RequestMapping(value = "/register", method = {RequestMethod.GET,RequestMethod.POST})
    public String register1() {
        return "注册";
    }
}
```

**params属性**

```java
@Controller
@RequestMapping("/account")
public class AccountController {
    // 参数中必须包含 id,balance 并且 余额大于0.00
    @RequestMapping(value = "/update", method = RequestMethod.POST, params = {"id", "balance>0.00","!page"})
    public String update() {
        return "修改成功";
    }
}  
```

- id：表示请求必须包含名为id的请求参数
- !page：表示请求不能包含名为page的请求参数
- balance !> 0.00：表示balance 并且 余额大于0.00

```java
@RequestMapping(value = "/params", params = {"username=admin"})
public String testParameters(String username) {
    return "限制请求参数";
}

@RequestMapping(value = "/headers", headers = {"auth=1234"})
@DeleteMapping
public String testHeader() {
    return "限制请求头参数";
}

@RequestMapping(value = "/consumes", consumes = "text/plain;charset=UTF-8")
public String testConsumes() {
    return "限制请求头中Content-Type的内容";
}

@RequestMapping(value = "/produces", produces = {"image/*"})
public String testProduces() {
    return "限制请求头中Content-Type的内容";
}
```



## 五、补充

### 1、Ant风格资源地址支持3种通配符(了解)

#### 说明

1、?   : 匹配文件名中的一个字符

2、* : 匹配文件名中的任意多个字符（至少有一个字符）

3、** : 匹配多层路径（至少有一层）

#### 示例

```
/user/create??       匹配/user/createXX、/user/createYY等URL （??匹配任意两个字符）
/user/*/createUser   匹配/user/xx/createUser、/user/yy/createUser等URL （*匹配任意字符）
/user/**/createUser  匹配/user/createUser、/user/xxx/yyy/createUser等URL （**匹配任意多层路)
注意：其?和*必须要有，如果为空，则不符合
```

 