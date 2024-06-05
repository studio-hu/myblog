---
sidebar_position: 1
---

# Nacos部署

## 一、Windows下部署

### 1.下载安装包

在[Nacos](https://nacos.io/)的GitHub页面，提供有下载链接，可以下载编译好的Nacos服务端或者源代码：

GitHub主页：https://github.com/alibaba/nacos

GitHub的Release下载页：https://github.com/alibaba/nacos/releases

如图：（[版本采用2.2.0](https://github.com/alibaba/nacos/releases/tag/2.2.0)）

![image-20240605171935811](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406051719847.png)

### 2.下载已经编译好的server压缩包解压

![image-20240605172230420](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406051722448.png)

目录说明：

- bin：启动脚本
- conf：配置文件

### 3.修改配置文件

> 在2.2.0.1和2.2.1版本时，必须执行此变更，否则无法启动；其他版本为建议设置。

修改`conf`目录下的`application.properties`文件。

> 注意，文档中的默认值`SecretKey012345678901234567890123456789012345678901234567890123456789`和`VGhpc0lzTXlDdXN0b21TZWNyZXRLZXkwMTIzNDU2Nzg=`为公开默认值，可用于临时测试，实际使用时请**务必**更换为自定义的其他有效值。

### 4.启动服务

进入bin目录执行启动命令(standalone代表着单机模式运行，非集群模式):

`startup.cmd -m standalone`

### 5.结果

成功运行，默认用户名和密码均为`nacos`

![image-20240605172646603](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406051726639.png)

## 二、Linux下部署

### 1.Clone项目

```shell
git clone https://github.com/nacos-group/nacos-docker.git
cd nacos-docker
```

2.单机启动

如果希望使用MySQL5.7

```shell
docker-compose -f example/standalone-mysql-5.7.yaml up
```

如果希望使用MySQL8

```shell
docker-compose -f example/standalone-mysql-8.yaml up
```

