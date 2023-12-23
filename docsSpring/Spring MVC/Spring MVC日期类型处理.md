---
sidebar_position: 3
---

# Spring MVC日期类型处理

## 一、整合Jackson

### 依赖导入

```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.16.0</version>
</dependency>
```

### 方式一：配置全局时间处理

```xml
<mvc:annotation-driven>
    <mvc:message-converters>
        <bean class="org.springframework.http.converter.json.MappingJackson2HttpMessageConverter">
            <property name="objectMapper">
                <bean class="com.fasterxml.jackson.databind.ObjectMapper">
                    <property name="dateFormat">
                        <bean class="java.text.SimpleDateFormat">
                            <constructor-arg type="java.lang.String" value="yyyy-MM-dd HH:mm:ss"/>
                        </bean>
                    </property>
                </bean>
            </property>
        </bean>
    </mvc:message-converters>
</mvc:annotation-driven>
```

### 方式二：使用注解

- 在实体类中添加`@JsonFormat`注解，并配置格式化样式：`@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")`

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Brand {
    private Integer brandId;
    private Integer brandOriginId;
    private String brandNameCn;
    private String brandNameEn;
    private String brandLog;
    private String description;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createDate;
    private Integer delStatus;
}
```

**注意：**

如何使用`LocalDateTime`还需要添加序列化和反序列化配置，否则会报如下错误

![image-20231223155332059](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202312231553160.png)

**添加`jackson-datatype-jsr310`依赖**

```xml
<dependency>
    <groupId>com.fasterxml.jackson.datatype</groupId>
    <artifactId>jackson-datatype-jsr310</artifactId>
    <version>2.16.0</version>
</dependency>
```



- ` @JsonDeserialize(using = LocalDateTimeDeserializer.class)`
- `@JsonSerialize(using = LocalDateTimeSerializer.class)`

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Brand {
    private Integer brandId;
    private Integer brandOriginId;
    private String brandNameCn;
    private String brandNameEn;
    private String brandLog;
    private String description;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime createDate;
    private Integer delStatus;
}
```

## 二、整合fastjson

### 依赖导入

```xml
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>fastjson</artifactId>
    <version>1.2.83</version>
</dependency>
```

### 方式一：配置全局时间处理

```xml
<mvc:message-converters>
    <bean class="com.alibaba.fastjson.support.spring.FastJsonHttpMessageConverter">
        <property name="supportedMediaTypes">
            <list>
                <value>application/json;charset=utf-8</value>
            </list>
        </property>
    </bean>
</mvc:message-converters>
```

### 方式二：使用注解

- 配置fastjson

```xml
<mvc:message-converters>
    <bean class="com.alibaba.fastjson2.support.spring6.http.converter.FastJsonHttpMessageConverter">
        <property name="supportedMediaTypes">
            <list>
                <value>application/json;charset=utf-8</value>
            </list>
        </property>
    </bean>
</mvc:message-converters>
```

- 添加注解`@JSONField`，并配置格式化样式：`@JSONField(format= "yyyy-MM-dd HH:mm:ss")`

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Brand implements Serializable {
    private Integer brandId;
    private Integer brandOriginId;
    private String brandNameCn;
    private String brandNameEn;
    private String brandLog;
    private String description;
    @JSONField(format="yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createDate;
    private Integer delStatus;
}
```



## 三、整合fastjson 2.0

### 依赖导入

```xml
<dependency>
    <groupId>com.alibaba.fastjson2</groupId>
    <artifactId>fastjson2</artifactId>
    <version>2.0.42</version>
</dependency>
<dependency>
    <groupId>com.alibaba.fastjson2</groupId>
    <artifactId>fastjson2-extension-spring6</artifactId>
    <version>2.0.42</version>
</dependency>
```



### 方式一：配置全局时间处理

```xml
<mvc:message-converters>
    <bean class="com.alibaba.fastjson2.support.spring6.http.converter.FastJsonHttpMessageConverter">
        <property name="supportedMediaTypes">
            <list>
                <value>application/json;charset=utf-8</value>
            </list>
        </property>
        <property name="fastJsonConfig">
            <bean class="com.alibaba.fastjson2.support.config.FastJsonConfig">
                <property name="dateFormat" value="yyyy-MM-dd HH:mm:ss"/>
            </bean>
        </property>
    </bean>
</mvc:message-converters>
```

### 方式二：使用注解

- 配置fastjson2

```xml
<mvc:message-converters>
    <bean class="com.alibaba.fastjson2.support.spring6.http.converter.FastJsonHttpMessageConverter">
        <property name="supportedMediaTypes">
            <list>
                <value>application/json;charset=utf-8</value>
            </list>
        </property>
    </bean>
</mvc:message-converters>
```

- 添加注解`@JSONField`，并配置格式化样式：`@JSONField(format= "yyyy-MM-dd HH:mm:ss")`

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Brand implements Serializable {
    private Integer brandId;
    private Integer brandOriginId;
    private String brandNameCn;
    private String brandNameEn;
    private String brandLog;
    private String description;
    @JSONField(format="yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createDate;
    private Integer delStatus;
}
```