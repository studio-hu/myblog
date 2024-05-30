# Redis数据库

## 一、简介

> redis是一个key-value存储系统。和Memcached类似，它支持存储的value类型相对更多，包括string(字符串)、list(链表)、set(集合)、zset(sorted set --有序集合)和hash（哈希类型）。这些数据类型都支持push/pop、add/remove及取交集并集和差集及更丰富的操作，而且这些操作都是原子性的。在此基础上，redis支持各种不同方式的排序。与memcached一样，为了保证效率，数据都是缓存在内存中。区别的是redis会周期性的把更新的数据写入磁盘或者把修改操作写入追加的记录文件，并且在此基础上实现了master-slave(主从)同步。
>
> Redis 是一个高性能的key-value数据库。 redis的出现，很大程度补偿了memcached这类key/value存储的不足，在部 分场合可以对关系数据库起到很好的补充作用。它提供了Python，Ruby，Erlang，PHP客户端，使用很方便,Redis支持主从同步。数据可以从主服务器向任意数量的从服务器上同步，从服务器可以是关联其他从服务器的主服务器。这使得Redis可执行单层树复制。从盘可以有意无意的对数据进行写操作。由于完全实现了发布/订阅机制，使得从数据库在任何地方同步树时，可订阅一个频道并接收主服务器完整的消息发布记录。

## 二、特点

- Redis支持数据的持久化，可以将内存中的数据保存在磁盘中，重启的时候可以再次加载进行使用。
- Redis不仅仅支持简单的key-value类型的数据，同时还提供list，set，zset，hash等数据结构的存储。
- Redis支持数据的备份，即master-slave模式的数据备份。
- 性能极高 – Redis能读的速度是110000次/s,写的速度是81000次/s 。
- 丰富的数据类型 – Redis支持二进制案例的 Strings, Lists, Hashes, Sets 及 Ordered Sets 数据类型操作。
- Redis的所有操作都是原子性的，意思就是要么成功执行要么失败完全不执行。单个操作是原子性的。多个操作也支持事务，即原子性，通过MULTI和EXEC指令包起来。
- 丰富的特性 – Redis还支持 publish/subscribe, 通知, key 过期等等特性。

## 三、为什么使用

1. 解决应用服务器的cpu和内存压力
2. 减少io的读操作，减轻io的压力
3. 关系型数据库的扩展性不强，难以改变表结构

## 四、优点：

1. nosql数据库没有关联关系，数据结构简单，拓展表比较容易
2. nosql读取速度快，对较大数据处理快

## 五、适用场景：

1. 数据高并发的读写
2. 海量数据的读写
3. 对扩展性要求高的数据

## 六、不适场景：

1. 需要事务支持（非关系型数据库）
2. 基于sql结构化查询储存，关系复杂

## 七、Redis结构：

1. Redis是一个开源的key—value型数据库，
2. 支持string、list、set、zset和hash类型数据。对这些数据的操作都是原子性的，redus为了保证效率会定期持久化数据。

## 八、使用场景：

1. 配合关系型数据库做高速缓存

- 缓存高频次访问的数据，降低数据库io
- 分布式架构，做session共享

2. 可以持久化特定数据。

- 利用zset类型可以存储排行榜
- 利用list的自然时间排序存储最新n个数据

## 九、安装

### 1、windows安装

1. 下载redis

   https://github.com/MicrosoftArchive/redis/releases

### 2、linux安装

1. 安装

   ```
   #ubuntu
   sudo apt-get update
   sudo apt-get install redis-server
   #centos
   sudo yum instal redis-server
   ```

2. 启动redis

   ```
   redis-server
   ```

3. 查看 redis 是否启动

   ```
   redis-cli
   redis 127.0.0.1:6379>
   ```

4. 开机启动

   第一步 编辑文件

   ```
   # 第一步
   sudo vi /etc/init.d/redis
   ```

   第二步 编辑脚本复制如下代码

   **注意**要修改里面redisd的安装路径(通过命令安装默认路径)

   ```
   # chkconfig:   2345 90 10
   # description:  Redis is a persistent key-value database
   PATH=/usr/local/bin
   REDISPORT=6379
   EXEC=/usr/local/bin/redis-server
   REDIS_CLI=/usr/local/bin/redis-cli
   #Redis密码 注意修改成你的
   PASSWORD=123456
   PIDFILE=/var/run/redis.pid
   CONF="/usr/local/reids/conf/redis.conf"
   case "$1" in
       start)
           if [ -f $PIDFILE ]
           then
                   echo "$PIDFILE exists, process is already running or crashed"
           else
                   echo "Starting Redis server..."
                   $EXEC $CONF
           fi
           if [ "$?"="0" ] 
           then
                 echo "Redis is running..."
           fi
           ;;
       stop)
           if [ ! -f $PIDFILE ]
           then
                   echo "$PIDFILE does not exist, process is not running"
           else
                   PID=$(cat $PIDFILE)
                   echo "Stopping ..."
                   $REDIS_CLI -p $REDISPORT -a $PASSWORD SHUTDOWN
                   while [ -x ${PIDFILE} ]
                  do
                       echo "Waiting for Redis to shutdown ..."
                       sleep 1
                   done
                   echo "Redis stopped"
           fi
           ;;
      restart|force-reload)
           ${0} stop
           ${0} start
           ;;
     *)
       echo "Usage: /etc/init.d/redis {start|stop|restart|force-reload}" >&2
           exit 1
   esac
   ```

   第四步 将启动脚本复制到/etc/init.d目录下，本例将启动脚本命名为redisd（通常都以d结尾表示是后台自启动服务)

   ```
   cp redisd /etc/init.d/redisd
   ```

### 3、Mac 安装

1. 安装

   ```
   brew install redis
   ```

2. 启动redis

   ```
   redis-server
   redis 127.0.0.1:6379>
   ```

3. 查看 redis 是否启动

   ```
   redis-cli
   ```

4. 其它

   ```
   开机启动redis命令 
   $ ln -sfv /usr/local/opt/redis/*.plist ~/Library/LaunchAgents

   使用launchctl启动redis server 
   $ launchctl load ~/Library/LaunchAgents/homebrew.mxcl.redis.plist

   使用配置文件启动redis server 
   $ redis-server /usr/local/etc/redis.conf

   停止redis server的自启动 
   $ launchctl unload ~/Library/LaunchAgents/homebrew.mxcl.redis.plist

   redis 配置文件的位置 
   /usr/local/etc/redis.conf

   卸载redis和它的文件 
   brew uninstallredis rm ~/Library/LaunchAgents/homebrew.mxcl.redis.plist

   测试redis server是否启动 
   $ redis-cli ping
   ```

## 十、配置文件

1. linux 系统配置

   ```
   port  7000                                        //端口7000,7002,7003        
   bind 本机ip                                       //默认ip为127.0.0.1 需要改为其他节点机器可访问的ip 否则创建集群时无法访问对应的端口，无法创建集群
   daemonize    yes                               //redis后台运行
   pidfile  /var/run/redis_7000.pid          //pidfile文件对应7000,7001,7002
   cluster-enabled  yes                           //开启集群  把注释#去掉
   cluster-config-file  nodes_7000.conf   //集群的配置  配置文件首次启动自动生成 7000,7001,7002
   cluster-node-timeout  15000                //请求超时  默认15秒，可自行设置
   appendonly  yes                           //aof日志开启  有需要就开启，它会每次写操作都记录一条日志
   ```

   ```
   # 启动redis，显示加载配置redis.conf
   # ./redis-server /path/to/redis.conf

   # 停止redis
   # redis-cli -h IP -p PORT shutdown

   # 可以包含一个或多个其他配置文件，如果多个redis服务器存在标准配置模板，但是每个redis服务器可能有个性化的配置
   # include /path/to/local.conf
   # include /path/to/other.conf

   # bind的是网络接口。对于一个redis服务器来说可以有一个或者多个网卡。比如服务器上有两个网卡：
   # bind 192.168.1.100 192.168.1.101，
   #如果bind bind 192.168.1.100，则只有该网卡地址接受外部请求，如果不绑定，则两个网卡都接受请求
   # bind 192.168.1.100 192.168.1.101
   # bind 127.0.0.1 ::1

   # 监听端口号，默认为6379，如果为0监听任连接
   port 6379

   # TCP连接中已完成队列的长度
   tcp-backlog 511

   #客户端和Redis服务端的连接超时时间，默认为0表示永不超时
   timeout 0

   # 服务端周期性时间（单位秒）验证客户端是否处在健康状态，避免服务端一直阻塞
   tcp-keepalive 300

   # Redis以后台守护进程形式启动
   daemonize yes
   # 配置PID文件路径，当redis以守护进程启动时，它会把PID默认写到 /var/redis/run/redis_6379.pid文件里面
   pidfile "/var/run/redis_6379.pid"
   #Redis日志级别：debug，verbose，notice，warning，级别一次递增
   loglevel notice
   #日志文件路径及名称
   logfile ""
   ```

