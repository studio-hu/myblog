## 一、 配置redis：

配置信息在/etc/redis/redis.conf下，打开sudo vi /etc/redis/redis.conf。

**核心配置选项：**

绑定ip：bind 127.0.0.1

端口号：port 6379

是否以守护进程运行：daemonize yes　　必须改为yes

数据库文件：dbfilename dump.db　　

数据库文件存储路径：dir /var/lib/redis　　可改可不改，改的话提前创建好文件夹

日志文件：logfile /var/log/redis/redis-server.log　　必须要改，提前创建好文件夹

数据库，默认有16个：database 16

主从复制：slaveof

配置小结：主要更改两块：1，守护进程；2.日志文件路径

## 二、启动redis

根据配置文件启动redis服务器

```
sudo redis-server /etc/redis/redis.conf 
```

启动redis客户端

```
redis-cli
```

输入ping命令测试

```
127.0.0.1:6379> pingPONG
```

关闭redis服务器

```
ps aux|grep redis # 查看redis进程号kill -9 pid redis进程号 # 关闭redis服务器
```

切换数据库：默认有16个，通过0-15来标识，默认是第一个数据库0号数据库。

```
select n
```

## 三、redis的数据操作

### 1、概要

redis的存储格式为key-value格式。

key是字符串类型，

value的类型有5种：string、hash、list、set、zset。**

### 2、redis中关于键的常见的操作

#### 关于key的操作

1. 查看所有的键：keys  | scan

   ```
   # 慎用
   keys * 
   SCAN cursor [MATCH pattern] [COUNT count]
   ```

2. 查看某个键是否存在，存在返回1不存在返回0

   ```
   exists key
   ```

3. 查看键的值对应的数据类型

   ```
   type key1
   ```

4. 删除键值对

   ```
   del key1 key2
   ```

5. 设置键的过期时间，如果没有指定默认一直存在

   ```
   expire key seconds
   ```

6. 查看键的有效时间：

   ```
   ttl key1
   ```

7. 清空数据库

   ```
   flushall
   ```

#### string类型的基本操作

1. 保存单个键值对

   ```
   set key value
   ```

2. 保存多个值

   ```
    mset key1 value1 key2 value2　　
   ```

3. 设置过期时间

   ```
   setex key seconds value
   ```

4. 获取值

   ```
   # 单个
   get key
   # 获取多个
   mget key1 key2　　 　
   ```

5. 删除

   ```
   del key
   ```

####  hash类型的基本操作

1. 保存

```
#设置单个属性
hset key field value 
#设置多个属性
hmset key field1 value1 field2 value2 ... 
```

2. 获取

```
# 获取指定键的所有属性
hkeys key 
# 获取单个属性的值
hget key field 
# 获取多个属性的值
hmget key field1 field2 ... 
# 获取所有属性的值
hvals key 
```

3. 删除

```
# 删除整个hash的键和值
del key 
# 删除属性和属性对应的值
hdel key field1 field2 ... 
```

#### list类型的基本操作

1. 保存

```
lpush key value1 value2 ... #从左侧依次插入数据
rpush key value1 value2 ... #从右侧依次插入数据
linsert key before或after 现有元素 新元素 #从指定元素的前或后插入新元素
```

2. 获取

```
lrange key start stop 
# start、stop为元素的下标索引，从左侧开始，第一个元素为0，-1标识最后一个元素。获取所有的元素：lrange key 0 -1
```

3. 删除指定元素

```
lrem key count value
```

将列表中前count次出现的值为value的元素移除。

count > 0: 从头到尾移除

count < 0: 从尾到头移除

count = 0: 移除所有

#### set类型的基本操作

特点：无序集合、元素唯一性不重复、没有修改操作

1增加元素

```
sadd key member1 member2 ...
```

2获取元素

```
smembers key # 返回所有元素
```

3删除指定元素

```
srem key member1 member2 ...
```

#### zset类型的数据操作

特点：有序集合、元素唯一性不重复、没有修改操作、每个元素都会关联一个double类型的权重，根据权重从小到大排列

1. 增加

```
zadd key score1 member1 score2 member2 ...
```

2. 获取

```
zrange key start stop　　# 根据索引获取

zrangebyscore key min max　　# 获取权重在min和max之间的数据
zscore key member　　# 返回成员member的score值
```

3. 删除

```
zrem key member1 member2 ... # 删除指定元素
zremrangebyscore key min max #删除权重在指定范围的元素
```

