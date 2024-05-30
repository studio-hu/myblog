### 一、reids常见数据结构

- **基本类型**
  - String： 普通key-value
  - Hash： 类似hashMap
  - List： 双向链表
  - Set： 不可重复
  - SortedSet： 不可重复、有序、hash+跳表
- **特殊类型**
  - GEO：地理位置
  - BitMap：位图形式，实现签到
  - HyperLog：uv统计（独立访客一天一个用户只记录一次），pv统计（用户点击行为，用于衡量网站流量）

### 二、redis通用命令

- keys： 所有key
- del： 删除key
- exists：判断是否存在
- expire： 设置有效期
- ttl：查看剩余失效时间

### 三、Redis常见命令

#### string类型

- **特性：**
  - string：普通字符串
  - int（默认优化）：可以自增自减
  - float（默认优化）：可以自增自减
  - 最大空间不能超过512m
- **常见命令：**
  - set：无则添加、有则覆盖
  - get：获取key的值
  - mset：批量添加键值对
  - mget：批量获取key的值
  - incr：让一个整形自增
  - incrBy：让整形自增指定步长
  - incrByFloat：让一个浮点类型的数字自增并指定步长
  - setNx：无则新增、有则不执行
  - setEx：添加一个string类型的键值对、并且指定有效期

#### hash类型

- **特性：**
  - hash类型、也叫散列、其value是一个无序字典、类似java中hashMap
- **常见命令：**
  - hset：添加或则修改hash类型的key的值
  - hget：获取value值
  - hmset：批量hash新增
  - hmget：批量hash查询
  - hgetAll：获取一个hash类型中的所有key-vlues键值对
  - hkeys：获取一个hash类型的key中所有的key
  - hvals：获取一个hash类型的key中所有的值
  - hincrBy：让一个hash类型的key的字段值自增并指定步长
  - hsetNx：添加一个hash类型的值、有则不添加、前提这个key不存在、否则不知想

#### list类型

- **特性：**
  - 类似java中的linkedList、可以看作一个双向链表、既可以支持正向检索、也可反向
  - 有序
  - 元素可以重复
  - 插入和删除块
  - 查询速度一般
  - 常用来存储一个有序数据例如、点赞、评论列表
- **常见命令**
  - lpush：向列表左侧插入一个或多个元素
  - lpop：移除并返回左侧第一个元素、没有则返回nil
  - rpush：列表右侧插入一个或者多个元素
  - lrange 返回一个角标范围内的所有元素
  - blpop和brpop、没有元素时等待指点时间、而不是之家返回nil
- **场景**
  - 1.模拟栈
  - 入口和出口在同一边、先进后出
  - 2.模拟队列
  - 入口和出口不在同一边、先进先出
  - 3.阻塞队列
  - 入口出口不在同一边、出队时候才有blpop或者brpop

#### set类型

- **特性：**
  - 可以看作value为null的hashMap
  - 无序
  - 元素不可重复
  - 查找快
  - 支持交并差
- **常见命令**
  - sadd：添加一个或者多个元素
  - srem：移除指定元素
  - scard：返回个数
  - sismember、判断元素是否存在
  - smembers：获取所有元素
  - sinter k1 k2 ：求交集
  - sdiff k1 k2 ：求差集
  - sunion k1 k2 ： 求并集

#### sortedSet类型

- **特性**
  - 可排序的set集合、每个元素有个score属性、可以基于score对元素进行排序、底层是跳表加hash表
  - 可排序
  - 元素不重复
  - 查询速度块
  - 常用来实现排行榜
- **常见命令**
  - zadd： 添加一个或多个如果已存在则更新score值
  - zrem ：删除指定一个元素
  - zscore：获取指定key的分值
  - zRank：获取指定元素的排名
  - zCard、获取元素个数
  - zCount key min mak：统计分值在指定范围内的所有元素的个数
  - zincrby：指定步长自增
  - zrange：获取指定排名范围内元素
  - zrangebyscore：获取指定分值范围内的元素
  - zdiff、zinter、zunion：求差集、交集并集
  - 所有的排名默认都是升序

#### Geo类型

- 概述
  - 允许地理坐标信息，帮助我们通过经纬度来检索数据
- 常见命令
  - [GEOADD](https://redis.io/commands/geoadd)：添加一个地理空间信息，包含：经度（longitude）、纬度（latitude）、值（member）
  - [GEODIST](https://redis.io/commands/geodist)：计算指定的两个点之间的距离并返回
  - [GEOHASH](https://redis.io/commands/geohash)：将指定member的坐标转为hash字符串形式并返回
  - [GEOPOS](https://redis.io/commands/geopos)：返回指定member的坐标
  - [GEORADIUS](https://redis.io/commands/georadius)：指定圆心、半径，找到该圆内包含的所有member，并按照与圆心之间的距离排序后返回。6.2以后已废弃
  - [GEOSEARCH](https://redis.io/commands/geosearch)：在指定范围内搜索member，并按照与指定点之间的距离排序后返回。范围可以是圆形或矩形。6.2.新功能

#### BitMap类型

- 概述

  - **Redis\****中**是利用string类型数据结构实现**BitMap，**因此最大上限是512M，转换为bit则是 2^32个bit位

- 常见命令

  - [SETBIT](https://redis.io/commands/setbit)：向指定位置（offset）存入一个0或1
  - [GETBIT](https://redis.io/commands/getbit) ：获取指定位置（offset）的bit值
  - [BITCOUNT](https://redis.io/commands/bitcount) ：统计BitMap中值为1的bit位的数量
  - [BITFIELD](https://redis.io/commands/bitfield) ：操作（查询、修改、自增）BitMap中bit数组中的指定位置（offset）的值
  - [BITFIELD_RO](https://redis.io/commands/bitfield_ro) ：获取BitMap中bit数组，并以十进制形式返回
  - [BITOP](https://redis.io/commands/bitop) ：将多个BitMap的结果做位运算（与 、或、异或）
  - [BITPOS](https://redis.io/commands/bitpos) ：查找bit数组中指定范围内第一个0或1出现的位置

- 场景

  - 什么叫做连续签到天数？

    从最后一次签到开始向前统计，直到遇到第一次未签到为止，计算总的签到次数，就是连续签到天数

  - 如何得到本月到今天为止的所有签到数据？

    BITFIELD key GET u[dayOfMonth] 0

  - 如何从后向前遍历每个bit位？

    与 1 做与运算，就能得到最后一个bit位。

    随后右移1位，下一个bit位就成为了最后一个bit位。

#### HyperLogLog类型

- 概述

  - HLL是基于string结构实现的，单个HLL的内存永远小于16kb！作为代价，其测量结果是概率性的，有小于0.81％的误差

- 常见命令

  ![img](https://img2022.cnblogs.com/blog/2226570/202204/2226570-20220422001951188-2103695573.png)

   

   

- 作用

  - 做海量数据统计

- 优点

  - 内存占用极低
  - 性能非常好

- 缺点

  - 有一定的误差

### redis应用场景

- 基于list实现点赞列表
- 基于sortebSet实现排行榜
- 基于set实现共同关注、共同好友
- 基于bitMap实现签到数据统计
- 基于hyperLogLog实现Uv统计
- geoHash实现地理位置
- Lua分布式锁、计数器
- 热点数据查询
- 共享session
- 时效性数据、短信验证码
- 全局唯一id
- 分布式锁

### 四、Redis缓存优缺点

- **作用：**
  - 降低后端负载
  - 提高读写效率、降低响应时间
- **成本：**
  - 数据一致性成本
  - 代码维护性成本
  - 运维成本

### 五、Redis缓存更新策略

- **低一致性**：
  - 超时时间机制、内存默认淘汰机制

- **高一致性：**
  - 主动更新、超时剔除作为兜底、修改直接删除缓存、提高一致性、先删除数据库数据、再删除缓存数据、查询时候在添加缓存

### 六、缓存穿透、击穿、雪崩

#### 穿透

- **出现原因：**
  - 请求缓存数据库中不存在的值

- **解决方案：**
  - 缓存短时间空值/布隆过滤器/增加id复杂度/做好基础格式校验/加强用户权限校验/做好限流

#### 击穿

- **出现原因**
  - 热点数据失效、大并发打入数据库

- **解决方案**
  - 互斥锁：互斥更新只允许一个线程去查库重建缓存、其他等待递归、没有额外的内存消耗、保证一致性、实现简单、线程需要等待性能影响、可能会死锁
  - 逻辑过期：线程无序等待、但是不保证一致性、有额外的内存消耗、实现复杂

#### 雪崩

- **出现原因**
  - 大批量key同时失效、并发同时打入数据库/reids宕机

- **解决方案**
  - 随机秒数稀释缓存失效时间

- redis高可用

### 七、分布式锁

**满足分布式系统或集群下多进程可见并且互斥的锁**

#### setNx实现方案

- **实现思路**
- 利用setnx获取锁、并设置过期时间、保存线程标识
- 释放锁先判断线程标识是否与自己一致、一致则删除(原因：不加标识如果线程阻塞、锁超时释放、则其他线程获取到该锁、如果没有唯一标识则可能会删别人的锁、造成并发问题)
- **特性**
  - 利用setNx满足互斥
  - 利用超时时间避免死锁
  - 利用redis集群保证高可用高并发
- **出现问题**
  - 不可重入：同一个线程无法多次获取同一把锁
- 不可重试：获取锁只尝试一次没有重试机制的话会造成500人1秒并发进行抢购100商品、可能会出现商品还有剩余
  - 超时释放：如果线程执行较长、导致锁释放、存在隐患
- 主从一致性：如果redis主从存在延迟、当主节点宕机、如果存在数据部分未同步、主从出现了切换、存在隐患

#### Redission实现方案

- ##### 原理

  - **可重入原理**
    - 利用hash结构实现锁，分别存储所得名称，线程标识，重入次数
  - **可重试**
    - 利用信号量和PubSub功能实现等待，唤醒，获取锁失败的重试机制
  - **超时续约**
    - 利用wathDog，每隔一段时间（releaseTime、3），重置超时事件

- **缺陷**

  - redis宕机引起琐失效

#### redission的mulyLock实现方案（连锁）

- **原理**
  - 多个独立的redis节点，必须所有节点都获取重入锁才算获取锁成功
- **缺陷**
  - 运维成本很高

### 八、秒杀设计思路

- 先利用redis完成库存余量、单数限制，完成抢单业务
- 再将下单业务放入队列，进行异步下单

### 九、redis消息队列

- 实现方案
  - list结构：基于list结构模拟消息队列
    - 优点：
      - 利用reids存储，不受jvm内存限制
      - 基于redis持久化，数据安全性有保证
      - 可以满足消息有序性
    - 缺点
      - 无法避免消息丢失
      - 只支持单消费者
  - PubSub：基本的点对点消息模型，订阅发布模式
    - 优点
      - 采用发布订阅模式，支持多生产，多消费
    - 缺点
      - 不支持数据持久化
      - 无法避免消息丢失
      - 消息堆积有上限，超出时数据丢失
  - Stream：5.0版本比较完善的消息队列模型
    - 特点
      - 消息可回溯
      - 消息可被多消费
      - 可以阻塞读取
      - 有消息漏读风险
    - 基于stream的XREADGROUP（消息组）
      - 消息可回溯
      - 可以争抢消费
      - 可以阻塞读取
      - 没有漏读风险
      - 有消息确认机制。保证消息至少消费一次

### 十、Redis持久化

- 持久化方案
  - RDB持久化
  - AOF持久化

#### RDB方式

内存快照

- 执行时机

  - 执行save命令（阻塞）

  - 执行bgsave命令（异步）

  - reids正常停机时

  - 触发RDB条件时

    ```
    # 900秒内，如果至少有1个key被修改，则执行bgsave ， 如果是save "" 则表示禁用RDB
    save 900 1  
    save 300 10  
    save 60 10000 
    ```

- 原理

  - bgsave开始时会fork主进程得到子进程，子进程共享主进程的内存数据。完成fork后读取内存数据并写入 RDB 文件。
  - fork采用的是copy-on-write技术：
    - 当主进程执行读操作时，访问共享内存；
    - 当主进程执行写操作时，则会拷贝一份数据，执行写操作。

- bgsave基本流程

  - fork主进程得到一个子进程，共享内存空间
  - 子进程读取内存数据并写入RDB文件
  - 用新的RDB文件替换旧的文件

- RDB缺点

  - 数据有丢失风险
  - fork子进程、压缩、写出RDB文件都比较耗时

#### AOF方式

Redis处理的每一个写命令都会记录在AOF文件，可以看做是命令日志文件。

- 默认AOF为关闭状态，命令记录频率策略

  ```
  # 表示每执行一次写命令，立即记录到AOF文件
  appendfsync always 
  # 写命令执行完先放入AOF缓冲区，然后表示每隔1秒将缓冲区数据写到AOF文件，是默认方案
  appendfsync everysec 
  # 写命令执行完先放入AOF缓冲区，由操作系统决定何时将缓冲区内容写回磁盘
  appendfsync no
  ```

- 策略对比

  ![img](https://zhangwei-imgs.oss-cn-beijing.aliyuncs.com/work/imgs/202307121650813.png)

   

   

### 十一、主从

单节点Redis的并发能力是有上限的，要进一步提高Redis的并发能力，就需要搭建主从集群，实现读写分离。

- **主从同步流程**：

  - slave节点请求增量同步
  - master节点判断replid，发现不一致，拒绝增量同步
  - master将完整内存数据生成RDB，发送RDB到slave
  - slave清空本地数据，加载master的RDB
  - master将RDB期间的命令记录在repl_baklog，并持续将log中的命令发送给slave
  - slave执行接收到的命令，保持与master之间的同步

- **注意：**

  - repl_balLog：大小有上限，写满后会覆盖最早数据，环形覆盖，如果slav断开太长，长时间位同步，偏移量被覆盖则会再次触发全量同步

- **全量和增量区别**

  - 全量同步：master将完整内存数据生成RDB，发送RDB到slave。后续命令则记录在repl_baklog，逐个发送给slave。
  - 增量同步：slave提交自己的offset到master，master获取repl_baklog中从offset之后的命令给slave

- **什么时候全量，什么时候增量**

  - 全量

    slave首次连接master节点

    slave断开太久，偏移量已被覆盖

  - 增量

    slave断开又恢复，偏移量没有被覆盖

- **优化方案**

  - 在master中配置repl-diskless-sync yes启用无磁盘复制，避免全量同步时的磁盘IO。
  - Redis单节点上的内存占用不要太大，减少RDB导致的过多磁盘IO
  - 适当提高repl_baklog的大小，发现slave宕机时尽快实现故障恢复，尽可能避免全量同步
  - 限制一个master上的slave节点数量，如果实在是太多slave，则可以采用主-从-从链式结构，减少master压力

### 十二、哨兵

Redis提供了哨兵（Sentinel）机制来实现主从集群的自动故障恢复。

- 作用

  - **监控**：Sentinel 会不断检查您的master和slave是否按预期工作
  - **自动故障恢复**：如果master故障，Sentinel会将一个slave提升为master。当故障实例恢复后也以新的master为主
  - **通知**：Sentinel充当Redis客户端的服务发现来源，当集群发生故障转移时，会将最新信息推送给Redis的客户端

- 工作原理

  - 每隔1秒发送一次ping命令，如果超过一定时间没有相向则认为是主观下线
  - 如果大多数sentinel都认为实例主观下线，则判定服务下线

- 故障转移

  - 当被判定为节点客观下线哨兵首先投票选举出一个哨兵去做故障转移
  - 被选举出的哨兵选定一个slave作为新的master，执行slaveof no one
  - 然后让所有节点都执行slaveof 新master
  - 修改故障节点配置，添加slaveof 新master

- java集成哨兵配置

  ```
  spring:
    redis:
      sentinel:
        master: sentinelmaster
        nodes:
          - 192.168.3.161:27001
          - 192.168.3.161:27002
          - 192.168.3.161:27003
  ```

- java配置读写分离

  ```
  @Bean
  public LettuceClientConfigurationBuilderCustomizer clientConfigurationBuilderCustomizer(){
      // MASTER：从主节点读取
      //MASTER_PREFERRED：优先从master节点读取，master不可用才读取replica
      //REPLICA：从slave（replica）节点读取
      //REPLICA _PREFERRED：优先从slave（replica）节点读取，所有的slave都不可用才读取master
      return clientConfigurationBuilder -> clientConfigurationBuilder.readFrom(ReadFrom.REPLICA_PREFERRED);
  }
  ```

   

### 十三、分片集群

- 为了解决
  - 海量数据存储问题

- 高并发写的问题

- 特征

  - 集群中有多个master，每个master保存不同数据
  - 每个master都可以有多个slave节点
  - master之间通过ping监测彼此健康状态
  - 客户端请求可以访问集群任意节点，最终都会被转发到正确节点

- 如何定位hash槽

  - 根据有效key进行hash，对16384取余
  - 余数作为插槽，寻找插槽所在位置即可

- 如何将同一类数据固定的保存在同一个Redis实例？

  - 这一类数据使用相同的有效部分，例如key都以{typeId}为前缀

- java分片集群配置

  ```
  spring:
    redis:
      cluster:
        nodes:
          - 192.168.3.161:7001
          - 192.168.3.161:7002
          - 192.168.3.161:7003
          - 192.168.3.161:8001
          - 192.168.3.161:8002
          - 192.168.3.161:8003
  ```