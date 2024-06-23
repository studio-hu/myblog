---
sidebar_position: 2
---

# 初识Seata

Seata是 2019 年 1 月份蚂蚁金服和阿里巴巴共同开源的分布式事务解决方案。致力于提供高性能和简单易用的分布式事务服务，为用户打造一站式的分布式解决方案。

其中的文档、播客中提供了大量的使用说明、源码分析，官网地址：https://seata.apache.org/zh-cn/

## 一、Seata的架构

Seata事务管理中有三个重要的角色：

- **TC (Transaction Coordinator) -** **事务协调者：**维护全局和分支事务的状态，协调全局事务提交或回滚。

- **TM (Transaction Manager) -** **事务管理器：**定义全局事务的范围、开始全局事务、提交或回滚全局事务。

- **RM (Resource Manager) -** **资源管理器：**管理分支事务处理的资源，与TC交谈以注册分支事务和报告分支事务的状态，并驱动分支事务提交或回滚。

整体的架构如图：

![image-20210724172326452](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406221441251.png)

Seata基于上述架构提供了四种不同的分布式事务解决方案：

- XA模式：强一致性分阶段事务模式，牺牲了一定的可用性，无业务侵入
- TCC模式：最终一致的分阶段事务模式，有业务侵入
- AT模式：最终一致的分阶段事务模式，无业务侵入，也是Seata的默认模式
- SAGA模式：长事务模式，有业务侵入

无论哪种方案，都离不开TC，也就是事务的协调者。

## 二、docker-compose部署TC-server服务

官方文档：https://seata.apache.org/zh-cn/docs/v1.6/ops/deploy-by-docker-compose

### 注意事项

- 避免直接拉取latest版本镜像，latest版本并不一定是稳定版本，为避免不必要的问题，请到[docker镜像仓库](https://hub.docker.com/r/seataio/seata-server/tags)确定要拉取的镜像版本。
- Seata Server 1.5.0版本开始，配置文件改为application.yml，所以在使用自定义配置的时候，需要先把原生配置拷贝出来。

### 使用自定义配置文件

为了获取seata server 1.6.1的配置文件，我们需要先启动一个seata server 1.6.1的服务，然后再从启动的容器实例中把默认的配置文件复制出来，再进行修改。

```yaml title="docker-compose.yaml"
version: "3.1"
services:
  seata-server:
    image: seataio/seata-server:1.6.1
    ports:
      - "7091:7091"
      - "8091:8091"
```



接下来通过`docker cp`命令把容器中`/seata-server/resources`位置的资源文件拷贝到宿主机指定位置。 在宿主机指定位置我们就可以看到对应的`application.yml`配置文件，相关的配置只需要修改这个文件即可。

### 1.获取`/seata-server/resources`

启用服务，若无执行权限可以执行`chmod +x docker-compose.yaml`命令

> docker-compose up -d 

![image-20240622160838857](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406221608996.png)

查看运行中的容器

> docker ps

![image-20240622161022440](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406221610480.png)

容器id为：d047d628313c

docker cp命令获取资源文件

>docker cp d047d628313c:/seata-server/resources /home/hyq/test

![image-20240622161155624](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406221611657.png)

![image-20240622161323465](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406221613493.png)

### 2.停掉服务

> docker-compose down

![image-20240622162018847](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202406221620877.png)

### 3.修改`/resources`下的`application.yml`配置文件

注意nacos地址修改为实际地址

根据官方文档修改后的配置为：

```yml
server:
  port: 7091

spring:
  application:
    name: seata-server

logging:
  config: classpath:logback-spring.xml
  file:
    path: ${user.home}/logs/seata
  extend:
    logstash-appender:
      destination: 127.0.0.1:4560
    kafka-appender:
      bootstrap-servers: 127.0.0.1:9092
      topic: logback_to_logstash

console:
  user:
    username: seata
    password: seata

seata:
  config:
    # support: nacos, consul, apollo, zk, etcd3
    type: nacos
    nacos:
      # 填写自己的nacos地址
      server-addr: 127.0.0.1:8848
      group: SEATA_GROUP
      username: nacos
      password: nacos
      data-id: seataServer.properties

  registry:
    # support: nacos, eureka, redis, zk, consul, etcd3, sofa
    type: nacos
    nacos:
      application: seata-server
      # 填写自己的nacos地址
      server-addr: 127.0.0.1:8848
      group: DEFAULT_GROUP
      # tc集群名称
      cluster: default
      username: nacos
      password: nacos
#  server:
#    service-port: 8091 #If not configured, the default is '${server.port} + 1000'
  security:
    secretKey: SeataSecretKey0c382ef121d778043159209298fd40bf3850a017
    tokenValidityInMilliseconds: 1800000
    ignore:
      urls: /,/**/*.css,/**/*.js,/**/*.html,/**/*.map,/**/*.svg,/**/*.png,/**/*.ico,/console-fe/public/**,/api/v1/auth/login
```

### 4.准备数据库

> db模式需要在数据库创建对应的表结构，[[建表脚本\]](https://github.com/apache/incubator-seata/tree/develop/script/server/db)

新建数据库`seata-server`并执行下列建表SQL

```sql
-- -------------------------------- The script used when storeMode is 'db' --------------------------------
-- the table to store GlobalSession data
CREATE TABLE IF NOT EXISTS `global_table`
(
    `xid`                       VARCHAR(128) NOT NULL,
    `transaction_id`            BIGINT,
    `status`                    TINYINT      NOT NULL,
    `application_id`            VARCHAR(32),
    `transaction_service_group` VARCHAR(32),
    `transaction_name`          VARCHAR(128),
    `timeout`                   INT,
    `begin_time`                BIGINT,
    `application_data`          VARCHAR(2000),
    `gmt_create`                DATETIME,
    `gmt_modified`              DATETIME,
    PRIMARY KEY (`xid`),
    KEY `idx_status_gmt_modified` (`status` , `gmt_modified`),
    KEY `idx_transaction_id` (`transaction_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- the table to store BranchSession data
CREATE TABLE IF NOT EXISTS `branch_table`
(
    `branch_id`         BIGINT       NOT NULL,
    `xid`               VARCHAR(128) NOT NULL,
    `transaction_id`    BIGINT,
    `resource_group_id` VARCHAR(32),
    `resource_id`       VARCHAR(256),
    `branch_type`       VARCHAR(8),
    `status`            TINYINT,
    `client_id`         VARCHAR(64),
    `application_data`  VARCHAR(2000),
    `gmt_create`        DATETIME(6),
    `gmt_modified`      DATETIME(6),
    PRIMARY KEY (`branch_id`),
    KEY `idx_xid` (`xid`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- the table to store lock data
CREATE TABLE IF NOT EXISTS `lock_table`
(
    `row_key`        VARCHAR(128) NOT NULL,
    `xid`            VARCHAR(128),
    `transaction_id` BIGINT,
    `branch_id`      BIGINT       NOT NULL,
    `resource_id`    VARCHAR(256),
    `table_name`     VARCHAR(32),
    `pk`             VARCHAR(36),
    `status`         TINYINT      NOT NULL DEFAULT '0' COMMENT '0:locked ,1:rollbacking',
    `gmt_create`     DATETIME,
    `gmt_modified`   DATETIME,
    PRIMARY KEY (`row_key`),
    KEY `idx_status` (`status`),
    KEY `idx_branch_id` (`branch_id`),
    KEY `idx_xid` (`xid`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE IF NOT EXISTS `distributed_lock`
(
    `lock_key`       CHAR(20) NOT NULL,
    `lock_value`     VARCHAR(20) NOT NULL,
    `expire`         BIGINT,
    primary key (`lock_key`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

INSERT INTO `distributed_lock` (lock_key, lock_value, expire) VALUES ('AsyncCommitting', ' ', 0);
INSERT INTO `distributed_lock` (lock_key, lock_value, expire) VALUES ('RetryCommitting', ' ', 0);
INSERT INTO `distributed_lock` (lock_key, lock_value, expire) VALUES ('RetryRollbacking', ' ', 0);
INSERT INTO `distributed_lock` (lock_key, lock_value, expire) VALUES ('TxTimeoutCheck', ' ', 0);
```





### 5.准备nacos配置中心配置

>在nacos新建配置，此处dataId为seataServer.properties

注意修改数据库名，数据库用户名和密码

```properties
store.mode=db
#-----db-----
store.db.datasource=druid
store.db.dbType=mysql
# 需要根据mysql的版本调整driverClassName
# mysql8及以上版本对应的driver：com.mysql.cj.jdbc.Driver
# mysql8以下版本的driver：com.mysql.jdbc.Driver
store.db.driverClassName=com.mysql.cj.jdbc.Driver
store.db.url=jdbc:mysql://127.0.0.1:3306/seata-server?useUnicode=true&characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useSSL=false
store.db.user=root
store.db.password=root
# 数据库初始连接数
store.db.minConn=1
# 数据库最大连接数
store.db.maxConn=20
# 获取连接时最大等待时间 默认5000，单位毫秒
store.db.maxWait=5000
# 全局事务表名 默认global_table
store.db.globalTable=global_table
# 分支事务表名 默认branch_table
store.db.branchTable=branch_table
# 全局锁表名 默认lock_table
store.db.lockTable=lock_table
# 查询全局事务一次的最大条数 默认100
store.db.queryLimit=100


# undo保留天数 默认7天,log_status=1（附录3）和未正常清理的undo
server.undo.logSaveDays=7
# undo清理线程间隔时间 默认86400000，单位毫秒
server.undo.logDeletePeriod=86400000
# 二阶段提交重试超时时长 单位ms,s,m,h,d,对应毫秒,秒,分,小时,天,默认毫秒。默认值-1表示无限重试
# 公式: timeout>=now-globalTransactionBeginTime,true表示超时则不再重试
# 注: 达到超时时间后将不会做任何重试,有数据不一致风险,除非业务自行可校准数据,否者慎用
server.maxCommitRetryTimeout=-1
# 二阶段回滚重试超时时长
server.maxRollbackRetryTimeout=-1
# 二阶段提交未完成状态全局事务重试提交线程间隔时间 默认1000，单位毫秒
server.recovery.committingRetryPeriod=1000
# 二阶段异步提交状态重试提交线程间隔时间 默认1000，单位毫秒
server.recovery.asynCommittingRetryPeriod=1000
# 二阶段回滚状态重试回滚线程间隔时间  默认1000，单位毫秒
server.recovery.rollbackingRetryPeriod=1000
# 超时状态检测重试线程间隔时间 默认1000，单位毫秒，检测出超时将全局事务置入回滚会话管理器
server.recovery.timeoutRetryPeriod=1000
```

### 6.修改docker-compose.yaml文件

注意修改SEATA_IP为实际ip

```yaml
version: "3.1"
services:
  seata-server:
    image: seataio/seata-server:1.6.1
    ports:
      - "7091:7091"
      - "8091:8091"
    environment:
      - STORE_MODE=db
      # 以SEATA_IP作为host注册seata server
      - SEATA_IP=127.0.0.1
      - SEATA_PORT=8091
    volumes:
      - "/usr/share/zoneinfo/Asia/Shanghai:/etc/localtime" #设置系统时区
      - "/usr/share/zoneinfo/Asia/Shanghai:/etc/timezone"  #设置时区
      - "./resources:/seata-server/resources"
```

### 7.执行`docker-compose up -d`命令启动服务

