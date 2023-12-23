---
sidebar_position: 2
---

# Spring MVC参数绑定

## 一、支持参数的类型

1. 简单类型参数
2. 内置类型参数
3. 数组类型参数
4. pojo类型参数
5. 复杂pojo类型参数
6. 集合参数
7. 日期类型
8. 特殊类型参数绑定
   用FormattingConversionServiceFactoryBean类管理自定义参数



## 二、基本类型

### 1、说明

八种基本类型数据（包装类型）及String类型数据。

**注意：**  请求中的参数名必须和方法形参名称一致，

### 2、示例

- /base?username='admin'&age=1&flag=true

```java
/**
 * 基本类型参数绑定 
 * /base?username='admin'&age=1&flag=true
 */
@RestController
@Slf4j
public class BaseParamsController {
    @RequestMapping("/base")
    public String base(String username, int age, boolean flag) {
        log.debug("基本类型参数{}", username);
        log.debug("基本类型参数{}", age);
        log.debug("基本类型参数{}", flag);
        return "基本类型参数绑定";
    }
}
```



## 三、数组集合类型

### 1、说明

在请求的url的参数中使用同一个键传递多个值,springmvc中可以定义数组接受参数

如使用List的参数必须结合@RequestParam()注解

**注意：**  请求中的参数名必须和方法形参名称一致，

### 2、示例

- `base/?arr='admin'&arr='test`


```java

@RequestMapping("/base")
public String baseArray(String[] arr) {
	for (String name : arr) {
		log.debug("数组参数{}", name);
	}
	return "数组类型参数绑定";
}
```

**通过ajax发送请求**

```javascript
let arr={params:['admin','test']};
$.ajax({url:请求地址,
            data:arr,
        	  // 注意添加traditional:true,表示不深度序列化参数对象
         		traditional:true, //默认false
            type:"POST",
            success:function(){
            }
        });
```



```java
/**
 * 注意不支持这种写法,会报错 必须结合@RequestParam()
 * 注意不支持这种写法,会报错 必须结合@RequestParam()
 * 注意不支持这种写法,会报错 必须结合@RequestParam()
 */
@RequestMapping("/list")
public String baseList(@RequestParam("arr") List<String> arr) {
    for (String name : arr) {
        log.debug("数组参数{}", name);
    }
    return "集合类型参数绑定";
}
```



## 四、pojo类型

### 1、说明

在请求的方法的形参上使用pojo引用类型和pojo类型参数的名称无关，使用该pojo对像中set方法进行参数绑定。

注意：
 Http请求中参数的key要和该pojo的setter方法的后缀一致，即可以完成参数绑定。

### 2、示例

- `/pojo?uid=1&name=admin`

```java
@RestController
@Slf4j
public class PojoParamsController {
    @RequestMapping("/pojo")
    public String pojoParams(User user) {
        log.debug(user.getUid()+"");
        log.debug(user.getName());
        return "简单对象参数";
    }
}
```



## 五、pojo嵌套类型

### 1、说明

请求的参数中对象里嵌套对象

### 2、示例

**pojo**

```java
public class User {
    private Integer uid;
    private String name;
    private Address address;
}

public class Address {
    private Integer addressId;
    private String city;
}
```



```java
@RestController
@Slf4j
@RequestMapping("/nest")
public class NestPojoController {
    @RequestMapping("/pojo")
    public String nestPojoParams(User user) {
        log.debug(user.getName());
        log.debug(user.getAddress().getCity());
        return "对象嵌套对象";
    }
}
```

![](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202312210922290.png)





## 六、pojo嵌套集合

### 1、说明

springmvc不支持集合类型参数直接绑定形参上。解决方案有两种前面已经演示过了使用@RequestParam注解还可以可以把集合类型参数封装到pojo中，则可以完成参数绑定

**个人建议复杂的嵌套客户端使用json格式上传比较合理**

### 2、例子

**pojo**

```java
@Data
public class User implements Serializable {
    private Integer uid;
    private String name;
    private Address address;
    private List<Address> addressList;
    private Map<String,Address> map;
}

```

**控制层**

```java
@RestController
@RequestMapping("/pojo")
@Slf4j
public class PojoListController {
    @RequestMapping("/list")
    public String nestListParams(User user) {
        log.debug(user.getName());
        log.debug(user.getAddressList().toString());
        return "pojo对象嵌套list";
    }

    @RequestMapping("/map")
    public String nestMapParams(User user) {
        log.debug(user.getMap().get("1").toString());
        return "pojo对象嵌套Map";
    }

}
```

**测试代码**

![](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202312211114905.png)

```html
<form action="pojo/list" method="post">
  <input type="text" name="username">
   <input name="addressList[0].city">
   <input name="addressList[1].city">
   <input type="submit" value="提交">
</form>
```

![](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202312211116299.png)

```html
<form action="" method="post">
  <input type="text" name="name">
  <input type="text" name="map['address1'].city">
  <input type="text" name="map['address2'].city">
  <input type="submit" value="注册">
</form>
```



## 七、内置类型(SpringMVC)

### 1、说明

在控制器方法的形参上使用该类型的变量，则Spring会自动创建相应类型的对像绑定到该形参之上（和形参名无关）

### 2、示例

```java
@RestController
@Slf4j
public class SpringTypeController {
    @RequestMapping("/type")
    private String testSpringType(HttpServletRequest request,
                                  HttpServletResponse response,
                                  HttpSession session,
                                  Model model,
                                  ModelMap modelMap,
                                  Map map) {
        log.debug(request.toString(),
                response.toString(),
                session.toString(),
                model.toString(),
                modelMap.toString(),
                map.toString()

        );
        return "内置类型";
    }
}
```

## 八、日期类型处理

### 1、说明

日期的处理一般分两种普通的请求日期参数转化,另外还有json数据的日期格式,这里说的是普通的日期参数的转化,

**推荐使用注解方式 @DateTimeFormat**

### 2、示例

**自定义的converter**

```java
import org.springframework.core.convert.converter.Converter;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DateConverter implements Converter<String, Date> {
    @Override
    public Date convert(String date) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        // 是否开启严格模式解析
        dateFormat.setLenient(false);
        try {
            return dateFormat.parse(date);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return null;
    }

}
```

**配置文件注册FormattingConversionServiceFactoryBean**

```xml
<bean id="conversionService" class="org.springframework.format.support.FormattingConversionServiceFactoryBean">    
        <property name="converters">    
            <list>    
                <bean class="com.xxx.xxx.DateConverter" />    
            </list>    
        </property>    
    </bean>  
```

**配置文件中的annotation-driven标签中注册**

```xml
<mvc:annotation-driven conversion-service="conversionService" /> 
```

**控制层**

```java
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Date;

@RestController
@RequestMapping("/converter")
@Slf4j
public class DateConverterController {
    @RequestMapping("/date")
    public String testDateConverter(Date joinDate) {
        log.debug(joinDate.getClass().getTypeName());
        return "自定义转化器";
    }
}
```
