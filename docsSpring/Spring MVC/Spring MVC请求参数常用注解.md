---
sidebar_position: 5
---

# Spring MVC请求参数常用注解

## 概要

处理方法参数绑定常用的注解,我们根据他们处理的Request的不同内容部分分为三大类

1. 处理request header部分的注解： @RequestHeader, @CookieValue;
2. 处理request body部分的注解：@RequestParam,  @RequestBody;
3. 处理attribute类型是注解： @SessionAttributes, @ModelAttribute;

## 一、@RequestParam（重点）

### 作用

在处理方法入参处使用 @RequestParam 可以把请求参数传递给请求方法，

1. 当客服端请求的参数名跟请求方法的参数名字不一样时可以使用,
2. 当客服端必传参数的时候
3. 当需要给参数赋默认值的时候

### 源码

```java
@Target({ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface RequestParam {
    @AliasFor("name")
    String value() default "";
    @AliasFor("value")
    String name() default "";
    boolean required() default true;
    String defaultValue() default "\n\t\t\n\t\t\n\ue000\ue001\ue002\n\t\t\t\t\n";
}
```

### 属性

| 属性                  | 说明                                                         |
| --------------------- | ------------------------------------------------------------ |
| String value()        | 请求参数中的名称，等同于name                                 |
| boolean required()    | 请求参数中是否必须提供此参数。默认值：true。表示必须提供，如果不提供将报错。 |
| String defaultValue() | 提供默认值                                                   |

### 示例

**给参数起别名**

```java
@Controller
@RequestMapping("/params")
public class RequestParamController {
    @RequestMapping("/test1")
    public String method1(@RequestParam(value = "name") String username) {
        System.out.println(username);
        return "参数别名"
    }
}
//请求地址 /params/test1?name='乔碧萝殿下'
```

**使用默认值参数**

```java
@RestController
@RequestMapping("/params")
public class RequestParamController {
  	// 请求地址  /params/test2?page=1 或者/params/test2?page=1&size=10
    @RequestMapping("/test2")
    public String method2(@RequestParam(value = "page", defaultValue = "1") int page ,
                          @RequestParam(value = "size",required = false,defaultValue = "10") int size) {
        System.out.println(page);
        System.out.println(size);
        return "使用默认值参数+可选参数";
    }
}
```

## 二、@RequestBody（重点）

### 作用

该注解用于读取Request**请求的body部分数据**(get请求没有请求体,所以不能使用)

应用场景是`POST`或者`PUT`,DELETE 的数据是JSON格式或者XML格式,而不是普通的键值对形式

### 注意

单个参数不用加@RequestBody、可以用@RequestParam

### 源码

```java
@Target({ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface RequestBody {
    boolean required() default true;
}
```

### 属性

| 参数               | 说明                                               |
| ------------------ | -------------------------------------------------- |
| boolean required() | 是否必须有请求体。默认值是:true。当取值为 true 时, |

### 前期准备工作

**导入包默认使用jackson转化**

```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.16.0</version>
</dependency>
```

### 示例

**基本使用**

```java
@Controller
@RequestMapping("/body")
public class RequestBodyController {
    @RequestMapping(value = "/test1", method = RequestMethod.POST)
    public String method1(@RequestBody String name) {
       // 获取的是json字符串
        System.out.println(name);
        return "请求体参数";
    }
}
```

**自动解析成对象**

```java
// java bean
public class Shop implements Serializable {
    private Integer shopId;
    private String  name;
    private String title;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createDate;
    ... 省略其它
}
```

```java
// 控制层
@RestController
@RequestMapping("/shop")
public class ShopController {
    @RequestMapping(value = "/add",method = RequestMethod.POST)
    public Shop add(@RequestBody Shop shop) {
      	// 数据库保存
        return shop;
    }
}
```

```javascript
    <script>
        $(function () {
            const SHOP_URL = "http://localhost:8080/shop/add";
            /*定义字面量对象*/
            let shop = {
                name: "娃娃",
                title: "白天么么哒"
            };
            let data = JSON.stringify(shop);
            $.ajax(SHOP_URL, {
                type: "POST",
                data: data,
                dataType:"json",
                contentType:"application/json",
                success:function (results) {
                    alert(results)
                }
            })
        })
    </script>
```

## 三、@PathVariable（重点）

### 作用

> 用于绑定url中的占位符,从请求路径中获取参数

### 源码

```java
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface PathVariable {
	@AliasFor("name")
	String value() default "";

	@AliasFor("value")
	String name() default "";

	boolean required() default true;

}

```

### 属性

| 属性       | 说明                      |
| ---------- | ------------------------- |
| value/name | 用于指定url中占位符的名称 |
| required   | 是否必须提供占位符        |

### 示例

请求路径

> `path/5/10`

```java
@GetMapping("/path/{page1}/{size}")
public String testPath(@PathVariable(value = "page1") Integer page, @PathVariable Integer size) {
    return "从请求路径中获取参数";
}
```

## 三、@RequestHeader

### 作用

可以把Request请求header部分的值绑定到方法的参数上。

### 源码

```java
@Target({ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface RequestHeader {
    @AliasFor("name")
    String value() default "";
    @AliasFor("value")
    String name() default "";
    boolean required() default true;
    String defaultValue() default "\n\t\t\n\t\t\n\ue000\ue001\ue002\n\t\t\t\t\n";
}

```

### 属性

| 属性                  | 说明                                                         |
| --------------------- | ------------------------------------------------------------ |
| String value()        | 请求参数中的名称，等同于name                                 |
| boolean required()    | 请求参数中是否必须提供此参数。默认值：true。表示必须提供，如果不提供将报错。 |
| String defaultValue() | 提供默认值                                                   |

### 示例

```java
@RestController
public class RequestHeaderController {
    @RequestMapping(value = "/getHeader", method = RequestMethod.GET)
    public String getHeader(
            @RequestHeader("Host") String host,
            @RequestHeader("User-Agent") String userAgent,
            @RequestHeader("Accept") String accept,
            @RequestHeader("Accept-Language") String acceptLanguage,
            @RequestHeader("Accept-Encoding") String acceptEncoding,
            @RequestHeader("Connection") String conn) {
        System.out.println(host);
        System.out.println(userAgent);
        System.out.println(accept);
        System.out.println(host);
        return "请求头参数";
    }
}
```

## 四、@CookieValue

### 作用

用来获取Cookie中的值

### 源码

```java
@Target({ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface CookieValue {
    @AliasFor("name")
    String value() default "";
    @AliasFor("value")
    String name() default "";
    boolean required() default true;
    String defaultValue() default "\n\t\t\n\t\t\n\ue000\ue001\ue002\n\t\t\t\t\n";
}
```

### 属性

| 属性                  | 说明                                                         |
| --------------------- | ------------------------------------------------------------ |
| String value()        | 请求参数中的名称, 等同于name                                 |
| boolean required()    | 请求参数中是否必须提供此参数。默认值：true。表示必须提供，如果不提供将报错。 |
| String defaultValue() | 提供默认值                                                   |

### 示例

```java
@RestController
public class RequestHeaderController {
    @RequestMapping(value="/getHeader")
    public String getHeader(
            @CookieValue("JSESSIONID") String sessionId){
        return "获取Cookie中的参数";
    }
}
```



