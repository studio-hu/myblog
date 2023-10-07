---
sidebar_position: 0
---

# MySQL 8.0.34安装

## 一、解压缩安装

### 1.下载安装包并解压

压缩包官方[下载地址](https://dev.mysql.com/downloads/mysql/)

![image-20231007203113486](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202310072031549.png)

### 2.配置环境变量

bin文件夹路径添加到系统变量Path中，前后以 ; 开头结尾假设mysql8的安装目录路径为E:\mysql8，那么需要添加到path最前面的信息为E:\mysql8\bin

![image-20231007203956695](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202310072039724.png)

### 3.配置初始化的my.ini文件（自行创建即可）

![image-20231007204219275](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202310072042324.png)

```xml
[mysqld]
# 设置3306端口
port=3306
# 设置mysql的安装目录
basedir=E:\\mysql8   # 切记此处一定要用双斜杠\\，单斜杠部分机器会出错
# 设置mysql数据库的数据的存放目录
datadir=E:\\mysql8\\Data   # 此处同上
# 允许最大连接数
max_connections=200
# 允许连接失败的次数。这是为了防止有人从该主机试图攻击数据库系统
max_connect_errors=10
# 服务端使用的字符集默认为UTF8
character-set-server=utf8mb4
# 创建新表时将使用的默认存储引擎
default-storage-engine=INNODB
# 默认使用“mysql_native_password”插件认证
default_authentication_plugin=mysql_native_password
[mysql]
# 设置mysql客户端默认字符集
default-character-set=utf8mb4
[client]
# 设置mysql客户端连接服务端时默认使用的端口
port=3306
default-character-set=utf8mb4
```

### 4.以**管理员**身份运行cmd安装mysql

#### （1）执行命令初始化默认用户、密码

在MySQL安装目录的 bin 目录下执行该命令，**注意要保存执行结果第2行root@localhost:后面的密码**

```powershell
mysqld --initialize --console
```

#### （2） 安装服务

**注意：上述命令中的mysql8为服务名，没有提供时默认为mysql，若电脑上安装了多个MySQL服务，需要设定不同的服务名**

```powershell
mysqld --install mysql
```

#### （3）启动服务

```powershell
net start mysql
```

![image-20231007205605062](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202310072056088.png)

**关闭服务命令为：**

```powershell
net stop mysql
```

![image-20231007205641547](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202310072056576.png)

### 5、更改默认的root用户的密码

#### （1）连接mysql服务器：

```powershell
mysql -u root -p
```

#### （2）在mysql中执行命令修改用户密码（假设新密码为root）：

```powershell
alter user 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';
```

#### （3）查看mysql版本

```powershell
select  version();
```

#### （4）查看mysql服务器中现有的数据库

```powershell
show databases;
```

#### （5）退出mysql服务器

```powershell
exit;
```

## 二、使用安装包安装

### 1.下载离线安装包

安装包官方[下载地址](https://dev.mysql.com/downloads/installer/)

![image-20231007202138137](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202310072021214.png)

### 2.进入安装类型选择界面

![image-20231007211323805](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202310072113860.png)

### 3.执行

![image-20231007211654825](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202310072116871.png)

### 4.下一步

![image-20231007211729250](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202310072117296.png)

![image-20231007211759725](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202310072117774.png)

### 5.配置端口号

![image-20231007212018089](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202310072120153.png)

### 6.密码验证方式

第一个是强密码校验，mysql推荐使用最新的数据库和相关客户端，MySQL8换了加密插件，所以如果选第一种方式，低版本的navicat等客户端连不上mysql8。

**使用低版本的navicat选第二个，如：navicat版本9.X，它链接mysql用的是就是这个加密算法**

![image-20231007212207123](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202310072122179.png)

### 7.密码设置

![image-20231007212513942](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202310072125992.png)

### 8.服务名称设置

![image-20231007212656945](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202310072126997.png)

### 9.权限配置

![image-20231007212831062](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202310072128111.png)

### 10.执行安装

![image-20231007212907747](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202310072129796.png)

**最后安装完成点击finish即可**