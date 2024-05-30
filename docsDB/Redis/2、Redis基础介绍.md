## 一、Redis基础知识

1. 端口：6379
2. 默认16个数据库，下标从0开始
3. 单线程：redis是单线程+io多路复用：检查文件描述的就绪状态

## 二、常用操作

### 1、key

1. 说明

> Key 不能太长，比如1024字节,也不能太短,能表达清楚意思才好,用":"分隔域，用"."作为单词间的连接
>
> 我们对redis key的设计一般有以下两种格式：
>
> - key 表名：主键值：列名 　　
>
> - value 列值
>
>   

2. key的相关操作

   | 键                      | 说明                                             |
   | ----------------------- | ------------------------------------------------ |
   | exists `<key>`          | 判断是否存在key                                  |
   | del `<key>`             | 删除某个键                                       |
   | expire `<key> <second>` | 设置键过期时间 单位是s秒                         |
   | ttl `<key>`             | 查看还有多少秒过期 -1表示用不过期 -2表示已经过期 |
   |                         |                                                  |
   |                         |                                                  |
   |                         |                                                  |
   |                         |                                                  |

### 2、value

#### 1、string

1. 说明

   string是redis最基本的类型，一个key对应一个value。

   string类型是二进制安全的。意思是redis的string可以包含任何数据。比如jpg图片或者序列化的对象 。

   string类型是Redis最基本的数据类型，一个键最大能存储512MB

2. 操作命令

   | get` <key>`                  | 查看对应的键值                           |
   | ---------------------------- | ---------------------------------------- |
   | set` <key> <value>`          | 添加键值对                               |
   | append `<key> <value>`       | 将给定的value 追加到原值的末尾           |
   | strlen `< key >`             | 获取值得长度                             |
   | setnx `<key> <value>`        | 当key 不存在的时候设置key值              |
   | incr` <key>`                 | 将key中储存的数字加1，如果为空，则值为1  |
   | decr `<key>`                 | 将key中储存的数字减1，如果为空，则值为-1 |
   | incrby/decrby` <key> <步长>` | 将key中的数字增减                        |

3. 批量处理

   | mset `<key1> <value1> <key2> <value2>`   | 同时设置多个键值对                 |
   | ---------------------------------------- | ---------------------------------- |
   | mget `<key1> <key 2>`                    | 同时获得多个值                     |
   | msetnx` <key1> <value1> <key2> <value2>` | 当给定的key都不存在                |
   | getrange` <key> <start> <stop>`          | 类似sunstring                      |
   | setrange `<key> <start> <stop>`          | 类似sunstring覆盖原始值            |
   | setex` <key> <过期时间> <value>`         | 设置键值的同时，给定过期时间       |
   | getset `<key> <value>`                   | 以旧换新，设置了新的值同时得到旧值 |


#### 2、Hash（哈希）

1. 说明

   Redis hash 是一个键值(key=>value)对集合。

   Redis hash是一个string类型的field和value的映射表，hash特别适合用于存储对象。

   每个 hash 可以存储 232 -1 键值对（40多亿

2. 举个栗子

   ```
   
   ```

#### 3、List（列表）

1. 说明

   单键多值

   Redis 列表是简单的字符串列表，按照插入顺序排序。你可以添加一个元素到列表的头部（左边）或者尾部（右边）

   底层是双向链表，对两端的操作性能很高，通过下标查询性能很低

   列表最多可存储 232 - 1 元素 (4294967295, 每个列表可存储40多亿)
   
2. 操作命令

   

#### 4、Set（集合）

1. 操作命令

   | 命令                           | 说明                                     |
   | ------------------------------ | ---------------------------------------- |
   | sadd `<key> <value1> <value2>` | 将多个元素加入到key中，重复值忽略        |
   | smembers` <key>`               | 取出该集合的所有值                       |
   | sismember `<key> <value>`      | 判断集合key中是否有该value值 有就1 没有0 |
   | scard `<key>`                  | 返回该集合的元素个数                     |
   | srem `<key> <value1> <value2>` | 删除集合中的某个元素                     |
   | spop `<key>`                   | 随机吐出该集合一个值                     |
   | srandmember `<key> <n>`        | 随机从集合中取出n个值，不会从集合中删除  |
   | smove` <key1> <key2> <value>`  | 将key1中的value 移动到key2 中            |
   | sinter` <key1> <key2>`         | 返回两个集合的交集元素                   |
   | sunion `<key1> <key2>`         | 返回两个集合的并集                       |

3. 键值对集合操作

   | 命令                                               | 说明                           |
   | -------------------------------------------------- | ------------------------------ |
   | hset `<key> <filed> <value>`                       | 给key 集合中的file 键赋值value |
   | hget` <key1> <field>`                              | 从key1 集合file取出value       |
   | hmset` <key1> <field1> <value1> <field2> <value2>` | 批量设置hash的值               |
   | hexists `<key> <field>`                            | 查看key中的field 是否存在      |
   | hkeys `<key>`                                      | 列出key中所有的filed           |
   | hvals `<key>`                                      | 列出该hash集合中所有的value    |


#### 5、zset

1. 说明

   与set集合非常相似，每个成员都关联了score，可以用来排序

2. 操作命令

   | 命令                                           | 说明                                          |
   | ---------------------------------------------- | --------------------------------------------- |
   | zadd`<key><score1><value1><score2><value2>`    | 将一个或多个元素以及score加入zset             |
   | zrange`<key><start><stop> `withscore           | 返回下标在区间内的集合，带有score             |
   | zrangebyscore` <ket> <min> <max>`withscore     | 返回key中 score介于min和max中的成员，升序排列 |
   | zrevrangerbyscore `<key> <min> <max>`withscore | 降序                                          |
   | zincrby` <key> <increment> <value>`            | 在key集合中的value上增加increment             |
   | zrem `<key> <value>`                           | 删除key集合下的指定元素                       |
   | zcount `<key> <min><max>`                      | 统计 区间内的元素个数                         |
   | zcord `<key>`                                  | 获取集合中的元素个数                          |
   | zrank `<key><value>`                           | 查询value在key中的排名，从0开始               |