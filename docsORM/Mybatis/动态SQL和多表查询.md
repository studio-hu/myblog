---
sidebar_position: 4
---

# 动态SQL和多表查询

## 自定义映射resultMap

- resultMap：设置自定义映射
  - 属性
    - id：表示自定义映射的唯一标识
    - type：查询的数据要映射的实体类的类型
- 子标签
  - id：设置主键的映射关系
  - result：设置普通字段的映射关系
  - association：设置多对一的映射关系
  - collection：设置一对多的映射关系
  - property：设置映射关系中实体类中的属性名
  - column：设置映射关系中表中的字段名

```xml
<select id="selectAllUser" resultMap="userMap">
    select *
    from user
</select>
<resultMap id="userMap" type="user">
    <id property="id" column="id"/>
    <result property="name" column="name"/>
    <result property="age" column="age"/>
    <result property="email" column="email"/>
</resultMap>
```

> 若字段名和实体类中的属性名不一致，但是字段名符合数据库的规则（使用_），实体类中的属性名符合Java的规则（使用驼峰）
>
> - 在MyBatis的核心配置文件中设置一个全局配置信息mapUnderscoreToCamelCase，可以在查询表中数据时，自动将_类型的字段名转换为驼峰
>
> 例如：字段名user_name，设置了mapUnderscoreToCamelCase，此时字段名就会转换为userName

## 准备工作

### 实体类

```java title=Order.java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Order {
    private Long id;
    private Long userId;
    private String name;
    private Integer price;
    private Integer num;
    private User user;
}
```

```java title=User.java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    private Long id;
    private String username;
    private String address;
    private List<Order> orderList;
}
```

### 数据库

tb_order

![image-202311072203897.png](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202311072203897.png)

tb_user

![image-20231107220537492](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202311072205515.png)



### 一对一查询

**association处理映射关系**

```xml
 <select id="selectAllOrder" resultMap="orderMap">
        select o.id oid,
               o.user_id,
               o.name,
               o.price,
               o.num,
               u.id uid,
               u.username,
               u.address
        from tb_order o
                 left join
             tb_user u
             on
                 o.user_id = u.id
    </select>
    <resultMap id="orderMap" type="order">
        <id property="id" column="oid"/>
        <result property="userId" column="user_id"/>
        <result property="name" column="name"/>
        <result property="price" column="price"/>
        <result property="num" column="num"/>
        <association property="user" javaType="user" >
            <id property="id" column="uid"/>
            <result property="username" column="username"/>
            <result property="address" column="address" />
        </association>
    </resultMap>
```



### 一对多查询

**collection处理映射关系**

```xml
<select id="selectAllUser" resultMap="userMap">
    select u.id uid,
           u.username,
           u.address,
           o.id oid,
           o.user_id,
           o.name,
           o.price,
           o.num
    from tb_user u
             left join
         tb_order o
         on u.id = o.user_id
</select>
<resultMap id="userMap" type="user">
    <id property="id" column="uid"/>
    <result property="username" column="username"/>
    <result property="address" column="address"/>
    <collection property="orderList" ofType="order">
        <id property="id" column="oid"/>
        <result property="userId" column="user_id"/>
        <result property="name" column="name"/>
        <result property="price" column="price"/>
        <result property="num" column="num"/>
    </collection>
</resultMap>
```



## 动态SQL

### 1.if

>if标签可通过test属性的表达式进行判断，若表达式的结果为true，则标签中的内容会执行；反之标签中的内容不会执行

```xml
<select id="selectUserByMoreCondition" resultType="user">
    select id, name, age, email
    from user
    where 1=1
    <if test="name != '' and name != null">
        and name=#{name}
    </if>
    <if test="age != '' and age != null">
        and age=#{age}
    </if>
    <if test="email != '' and email != null">
        and email=#{email}
    </if>
</select>
```

注意：单独使用`if`时` where 1=1`的使用显得冗余，可以配合下面的`where`一起使用

### 2.where

> where和if一般结合使用 
>
> - 若where标签中的if条件都不满足，则where标签没有任何功能，即不会添加where关键字
> - 若where标签中的if条件满足，则where标签会自动添加where关键字，并将条件最前方多余的and或or去掉

```xml
<select id="selectUserByMoreCondition" resultType="user">
    select id, name, age, email
    from user
    <where>
        <if test="name != '' and name != null">
            and name=#{name}
        </if>
        <if test="age != '' and age != null">
            and age=#{age}
        </if>
        <if test="email != '' and email != null">
            and email=#{email}
        </if>
    </where>
</select>
```

### 3.trim

>trim用于去掉或添加标签中的内容
>
>- prefix：在trim标签中的内容的前面添加某些内容
>- prefixOverrides：在trim标签中的内容的前面去掉某些内容
>- suffix：在trim标签中的内容的后面添加某些内容
>- suffixOverrides：在trim标签中的内容的后面去掉某些内容

```xml
<select id="selectUserByMoreCondition" resultType="user">
    select id, name, age, email
    from user
    <trim prefix="where" prefixOverrides="and">
        <if test="name != '' and name != null">
            and name=#{name}
        </if>
        <if test="age != '' and age != null">
            and age=#{age}
        </if>
        <if test="email != '' and email != null">
            and email=#{email}
        </if>
    </trim>
</select>
```

### 4.choose、when、otherwise

> choose、when、 otherwise相当于if...else if..else

```xml
<select id="selectUserByMoreCondition" resultType="user">
    select id, name, age, email
    from user
    <where>
        <choose>
            <when test="name != '' and name != null">
                and name=#{name}
            </when>
            <when test="email != '' and email != null">
                and email=#{email}
            </when>
            <otherwise>
                and age>18
            </otherwise>
        </choose>
    </where>
</select>
```



### 5.set

> *set* 元素会动态地在行首插入 SET 关键字，并会删掉额外的逗号（这些逗号是在使用条件语句给列赋值时引入的）

```xml
<update id="updateUser">
    update user
    <set>
        <if test="name != null and name != ''">
            name=#{name},
        </if>
        <if test="age != null and age != ''">
            age=#{age},
        </if>
        <if test="email != null and email != ''">
            email=#{email}
        </if>
    </set>
    where id={id}
</update>
```



### 6.foreach

> 常见使用场景是对集合进行遍历（尤其是在构建 IN 条件语句的时候）

批量删除

```java
Integer deleteByIds(@Param("ids") List<Long> ids);
```

```xml
<delete id="deleteByIds">
    delete from user where id in
    <foreach collection="ids" item="item" separator="," open="(" close=")">
        #{item}
    </foreach>
</delete>
```











