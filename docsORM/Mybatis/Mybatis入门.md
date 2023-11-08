---
sidebar_position: 2
---

# Mybatis入门

## 一、导入核心依赖

```xml
<dependency>
	<groupId>org.mybatis</groupId>
	<artifactId>mybatis</artifactId>
	<version>3.5.14</version>
</dependency>
```

## 二、创建MyBatis的核心配置文件


```xml title=mybatis-config.xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
  PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
  "https://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
   <!--
	  MyBatis核心配置文件中，标签的顺序：
	  properties?,settings?,typeAliases?,typeHandlers?,
	  objectFactory?,objectWrapperFactory?,reflectorFactory?,
	  plugins?,environments?,databaseIdProvider?,mappers?
  -->
  <!--导入properties文件-->
  <properties resource="db.properties"/>
  <settings>
      <!--打印日志-->
      <setting name="logImpl" value="STDOUT_LOGGING"/>
      <!--开启驼峰命名自动映射-->
      <setting name="mapUnderscoreToCamelCase" value="true"/>
  </settings>
  <!--设置类型别名-->
  <typeAliases>
      <package name="top.hyqstudio.pojo"/>
  </typeAliases>
  <!--设置数据库的连接环境-->
  <environments default="development">
    <environment id="development">
      <transactionManager type="JDBC"/>
      <dataSource type="POOLED">
        <property name="driver" value="${driver}"/>
        <property name="url" value="${url}"/>
        <property name="username" value="${username}"/>
        <property name="password" value="${password}"/>
      </dataSource>
    </environment>
  </environments>
  <!--引入映射文件-->
  <mappers>
    <mapper resource="mapper/UserMapper.xml"/>
  </mappers>
</configuration>
```

### properties配置

```xml title=db.properties
driver=com.mysql.cj.jdbc.Driver
url=jdbc:mysql://localhost:3306/mybatis_plus?characterEncoding=utf-8&useSSL=false&&serverTimezone=UTC
username=root
password=root
```

## 三、创建mapper接口

```java title=UserMapper.java
@Mapper
public interface UserMapper {
    /**
    * 查询所有用户
    */
    List<User> selectAllUser();
}
```

## 四、创建映射文件

```xml title=userMapper.xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<!--namespace的命名是对应接口的全类名-->
<mapper namespace="top.hyqstudio.mapper.UserMapper">
    <!--此处配置了别名可以使用简介，如没配置别名需要使用类的全类名top.hyqstudio.pojo.User-->
    <select id="selectAllUser" resultType="user">
        select * from user
    </select>
</mapper>
```

## 五、测试

```java
@Test
public void test1() throws Exception {
    InputStream inputStream = Resources.getResourceAsStream("mybatis-config.xml");
    SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
    SqlSession sqlSession = sqlSessionFactory.openSession();
    UserMapper mapper = sqlSession.getMapper(UserMapper.class);
    List<User> users = mapper.selectAllUser();
    users.forEach(System.out::println);
}
```

查询结果

![image-20231107201836520](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202311072018631.png)
