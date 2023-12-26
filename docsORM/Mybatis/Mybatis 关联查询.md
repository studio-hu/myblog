---
sidebar_position: 6
---

# Mybatis 关联查询（新增）

> 1. 一对一    (将从表的外键字段设置成唯一约束)
> 2. 一对多    
> 3. 多对多(两个一对多)
>
> 外键字段 (主表主键作为从表字段)

用户表

1. 用户id

收货地址表

1. 用户id

## 一对一

1. 外键字段  user_id
2. 外键字段 使用唯一约束
3. 需要通过外键字段查询从表的数据   外键字段要设置索引

### SQL

```mysql
CREATE TABLE sys_user
(
    user_id     int AUTO_INCREMENT COMMENT '主键'           PRIMARY KEY,
    username    varchar(18)                        NOT NULL COMMENT '用户名',
    password    varchar(128)                       NOT NULL COMMENT '密码',
    phone       varchar(11)                        NOT NULL COMMENT '手机号',
    del_status  int(1)   DEFAULT 0                 NOT NULL COMMENT '1 表示删除  0表示正常',
    create_date datetime DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '创建时间',
    CONSTRAINT phone       UNIQUE (phone),
    CONSTRAINT username UNIQUE (username)
);
```

```mysql
CREATE TABLE sys_user_detail
(
    user_detail_id int PRIMARY KEY AUTO_INCREMENT COMMENT '主键',
    user_id        int UNIQUE KEY NOT NULL COMMENT '用户ID',
    city           varchar(64)    NOT NULL COMMENT '所在城市',
    birthday       date           NOT NULL COMMENT '生日',
    create_date    datetime                DEFAULT NOW(0) NOT NULL COMMENT '创建时间',
    del_status     INT            NOT NULL DEFAULT 0 COMMENT '0 正常 1 删除'
) COMMENT '用户详情';
```

### 对象模型

```java
@Data
public class SysUser {
    /**
     * 主键
     */
    private Integer userId;
    /**
     * 用户名
     */
    private String username;
    /**
     * 密码
     */
    private String password;
    /**
     * 手机号
     */
    private String phone;

    /**
     * 1 表示删除  0表示正常
     */
    private Integer delStatus;
    /**
     * 创建时间
     */
    private Date createDate;
    /**
     * 一对一 关系
     */
    private SysUserDetail sysUserDetail;
}
```

```
@Data
public class SysUserDetail {
    /**
     * 主键
     */
    private Integer userDetailId;

    /**
     * 所在城市
     */
    private String city;

    /**
     * 生日
     */
    private Date birthday;

    /**
     * 用户ID
     */
    private Integer userId;

    /**
     * 创建时间
     */
    private Date createDate;

    /**
     * 0 正常 1 删除
     */
    private Integer delStatus;
}
```

通过用户名查询用户的信息与用户详细信息

### ResultMap

- association
  - property对关联对象属性
  - resultMap 对应关联对象的resultMap

```
<resultMap id="BaseResultMap" type="com.qf.ssm.entity.SysUser">
    <id property="userId" column="user_id"/>
    <result property="username" column="username"/>
    <result property="password" column="password"/>
    <result property="phone" column="phone"/>
    <result property="createDate" column="create_date"/>
    <result property="delStatus" column="del_status"/>
</resultMap>

<resultMap id="SysUserDetailResultMap" type="com.qf.ssm.entity.SysUserDetail">
    <id property="userDetailId" column="user_detail_id"/>
    <result property="userId" column="user_id"/>
    <result property="city" column="city"/>
    <result property="createDate" column="create_date"/>
    <result property="birthday" column="birthday"/>
    <result property="delStatus" column="del_status"/>
</resultMap>

<!--    多表查询  查询用户信息跟用户详情表-->
<!--    association  一对一标签-->
<!--    property   关联对象的属性名称 -->
<!--    resultMap  对应子表的ResultMap-->
<resultMap id="SysUserAndDetailResultMap" type="com.qf.ssm.entity.SysUser" extends="BaseResultMap">
    <association property="sysUserDetail" resultMap="SysUserDetailResultMap"/>
</resultMap>
```

Mapper.xml

```xml
<select id="selectUserByName" resultMap="SysUserAndDetailResultMap">
    SELECT u.user_id,
           u.username,
           u.password,
           u.phone,
           u.del_status,
           u.create_date,
           ud.user_detail_id,
           ud.city,
           ud.birthday,
           ud.user_id,
           ud.create_date,
           ud.del_status
    FROM sys_user u
             INNER JOIN sys_user_detail ud ON u.user_id = ud.user_id
    WHERE u.username = #{username}
</select>
```

## 一对多

> 实现方式两种
>
> 1. 关联查询(一个SQL语句)
>
>    **主要性能问题?**
>
> 2. 嵌套查询(执行多个SQL)

### SQL

```mysql
CREATE TABLE user_delivery_address
(
    address_id      int PRIMARY KEY AUTO_INCREMENT COMMENT '主键',
    user_id         int              NOT NULL COMMENT '用户ID',
    delivery_city   varchar(18)      NOT NULL COMMENT '城市',
    delivery_phone  VARCHAR(11)      NOT NULL COMMENT '收货人手机号',
    delivery_detail varchar(255)     NOT NULL COMMENT '详细信息',
    create_date     datetime         NOT NULL COMMENT '创建时间',
    del_status      int(1) DEFAULT 0 NOT NULL COMMENT '0正常 1删除'
) COMMENT '用户收货地址表';

# 创建索引
CREATE INDEX idx_delivery_address_user_id ON user_delivery_address (user_id);
```

### 对象模型

```java
@Data
public class SysUser {
	//...
    private List<UserDeliveryAddress> userDeliveryAddressList;
}
```

```
@Data
public class UserDeliveryAddress {
}
```

### 关联查询



#### mapper.xml

```xml
<select id="selectUserAndDeliveryAddress" resultMap="">
    SELECT u.user_id,
           u.username,
           u.password,
           u.phone,
           u.del_status,
           u.create_date,
           da.address_id,
           da.user_id,
           da.delivery_city,
           da.delivery_phone,
           da.delivery_detail,
           da.create_date,
           da.del_status
    FROM sys_user u
             INNER JOIN user_delivery_address da ON u.user_id = da.user_id
    WHERE u.username = #{username}
</select>
```

#### resultMap

```xml
    <resultMap id="AddressBaseResultMap" type="com.qf.ssm.entity.UserDeliveryAddress">
        <id property="addressId" column="address_id"/>
        <result property="deliveryCity" column="delivery_city"/>
    </resultMap>

    <resultMap id="DeliveryAddressListResultMap" type="com.qf.ssm.entity.SysUser" extends="BaseResultMap">
        <collection property="userDeliveryAddressList" resultMap="AddressBaseResultMap"/>
    </resultMap>

```

#### Mapper接口

```
public interface SysUserMapper {
    /**
     * @param username
     * @return
     */
    SysUser selectUserAndDeliveryAddress(@Param("username") String username);

}

```

#### 业务层

```
/**
 * @author zhangwei
 */
public interface SysUserService {
    /**
     * 获取用户以及用户收货地址信息
     *
     * @return
     */
    SysUser getUserDeliveryAddress(String username);
}


@Service
public class SysUserServiceImpl implements SysUserService {
    @Autowired
    private SysUserMapper sysUserMapper;


    @Override
    public SysUser getUserDeliveryAddress(String username) {
        return sysUserMapper.selectUserAndDeliveryAddress(username);
    }
}

```

#### 控制层

```java
@RestController
@RequestMapping("/user")
public class SysUserController {
    @Autowired
    private SysUserService sysUserService;

    /**
     * 获取用户信息以及用户的所有收货地址信息
     */
    @GetMapping("/user/addresses")
    public ResponseResult<SysUser> getUserDeliveryAddress(@RequestParam String username) {
        ResponseResult<SysUser> result = null;
        try {
            result = ResponseResult.success(sysUserService.getUserDeliveryAddress(username));
        } catch (Exception exception) {
            result = ResponseResult.error();
        }
        return result;
    }
}
```

### 嵌套查询

#### Mapper.xml

```
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "https://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.qf.ssm.mapper.SysUserMapper">
    <!--    嵌套查询  select ="对应子表的查询语句" column="将主表的列的数据传递给子表查询语句" -->
    <!--1 查询主表-->
    <select id="selectUserAndDeliveryAddress" resultMap="AddressListResultMap">
        SELECT *
        FROM sys_user
        WHERE username = #{username}
          AND del_status = 0
    </select>
	  <!--2 查询主表-->
    <select id="selectAddressList" resultMap="AddressBaseResultMap">
        SELECT *
        FROM user_delivery_address
        WHERE user_id = #{userId}
        LIMIT 0,10
    </select>
</mapper>
```

#### ReslutMap

1. select 对应子表查询的SQL语句

2. column 将主表的列的数据传到子表的查询用户

   ```
   column={键=值}
   ```

   在子查询中使用#{键}

```xml
<!--1 用户表-->
<resultMap id="BaseResultMap" type="com.qf.ssm.entity.SysUser">
    <id property="userId" column="user_id"/>
    <result property="username" column="username"/>
    <result property="password" column="password"/>
    <result property="phone" column="phone"/>
    <result property="createDate" column="create_date"/>
    <result property="delStatus" column="del_status"/>
</resultMap>

  <!--2 收货地址表-->
<resultMap id="AddressBaseResultMap" type="com.qf.ssm.entity.UserDeliveryAddress">
    <id property="addressId" column="address_id"/>
    <result property="deliveryCity" column="delivery_city"/>
</resultMap>


<!--3 嵌套查询的结果集  -->
<resultMap id="AddressListResultMap" type="com.qf.ssm.entity.SysUser" extends="BaseResultMap">
    <collection property="userDeliveryAddressList" select="selectAddressList" column="{userId=user_id}"/>
</resultMap>

```

## 多对多

> 1. 中间表

RBAC权限模型

用户

用户角色中间表

角色

### SQL

```mysql
CREATE TABLE role
(
    role_id     int AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
    role_name   varchar(128) UNIQUE KEY NOT NULL COMMENT '角色名称',
    role_desc   varchar(255) COMMENT '说明',
    create_date datetime DEFAULT NOW(0) COMMENT '创建时间',
    del_status  int(1)   DEFAULT 0      NOT NULL COMMENT '0正常  1删除'
) COMMENT '角色表';

CREATE TABLE user_role_relation
(
    id      int AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
    role_id int NOT NULL COMMENT '角色ID',
    user_id int NOT NULL COMMENT '用户iD',
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES sys_user (user_id),
    CONSTRAINT fk_role_id FOREIGN KEY (role_id) REFERENCES role (role_id)
) COMMENT '用户角色关系表';


CREATE TABLE permission
(
    permission_id   int AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
    permission_name varchar(128) UNIQUE KEY NOT NULL COMMENT '权限名称',
    permission_desc varchar(255) COMMENT '说明',
    create_date     datetime DEFAULT NOW(0) COMMENT '创建时间',
    del_status      int(1)   DEFAULT 0      NOT NULL COMMENT '0正常  1删除'
) COMMENT '权限表';

CREATE TABLE role_permission_relation
(
    id            int AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
    role_id       int NOT NULL COMMENT '角色ID',
    permission_id int NOT NULL COMMENT '权限ID',
    CONSTRAINT fk_role_id FOREIGN KEY (role_id) REFERENCES role (role_id),
    CONSTRAINT fk_permission_id FOREIGN KEY (permission_id) REFERENCES permission (permission_id)
) COMMENT '用户角色关系表';

```

### 对象模型

```
@Data
public class SysUser {
    private List<Role> roles;
}

@Data
public class Permission {
}
```

Mapper.xml







## 分页插件PagerHelper（推荐用法）

### 导入依赖

```
<!-- https://mvnrepository.com/artifact/com.github.pagehelper/pagehelper -->
<dependency>
    <groupId>com.github.pagehelper</groupId>
    <artifactId>pagehelper</artifactId>
    <version>5.3.3</version>
</dependency>
```

### 配置spring-mybatis.xml

```
<bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
  <!-- 注意其他配置 -->
  <property name="plugins">
    <array>
      <bean class="com.github.pagehelper.PageInterceptor">
        <property name="properties">
          <!--使用下面的方式配置参数，一行配置一个 -->
          <value>
                reasonable=true
          </value>
        </property>
      </bean>
    </array>
  </property>
</bean>
```

### 使用

#### 数据层

mapper接口

```java
public interface BrandMapper {
    List<Brand> selectList();
}
```

mapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "https://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.qf.ssm.mapper.BrandMapper">
    <resultMap id="BaseResultMap" type="com.qf.ssm.entity.Brand">
        <id property="brandId" column="brand_id"/>
        <result property="brandNameCn" column="brand_name_cn"/>
    </resultMap>
    <select id="selectList" resultMap="BaseResultMap">
        SELECT b.brand_id, b.brand_name_cn
        FROM brand b
    </select>
</mapper>
```

#### 业务层

```java
@Override
public PageInfo<Brand> list(int page, int size) {
    PageInfo<Brand> pageInfo = PageHelper.startPage(page, size).doSelectPageInfo(() -> brandMapper.selectList());
    return pageInfo;
}
```

#### 控制层

```java
@RestController
@RequestMapping("/brand")
public class BrandController {
    @Autowired
    private BrandService brandService;

    @PostMapping("/list/{page}/{size}")
    public ResponseResult<PageInfo<Brand>> list(@PathVariable int page, @PathVariable int size) {
        ResponseResult<PageInfo<Brand>> result = null;
        try {
            result = ResponseResult.success(brandService.list(page, size));
        } catch (Exception exception) {
            result = ResponseResult.error();
        }
        return result;
    }

}
```





