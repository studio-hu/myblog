## 一、概要

[中文文档](https://www.redis.net.cn/order/3609.html)

Redis 支持 5 中数据类型：string（字符串），hash（哈希），list（列表），set（集合），zset（sorted set：有序集合）。

## 二、字符串类型操作

### 1、特点

- 自增、自减
- 位运算

### 2、常用命令

set/get/decr/incr/mget/incr

### 3、常用应用场景

- 利用 `setbit、getbit、bitcount` 统计用户签到、活跃用户（注意：bitcount的start、end参数指的是字符串的位置，不是对应位的位置）
- 利用 `INCR`做原子计数器，生成唯一序列号
- 设置 key 有效期，上操作锁或者防止短时间内频繁发送短信验证

### 4、实现原理

String在redis内部存储默认就是一个字符串，被redisObject所引用，当遇到incr、decr等操作时会转成数值型进行计算，此时redisObject的encoding字段为int。

### 5、命令详解

#### set

1. 说明

   设置键值

2. 方法名

   ```
   SET key value [EX seconds] [PX milliseconds] [NX|XX]
   ```

3. 参数说明

   - `EX second` ：设置键的过期时间为 `second` 秒。 `SET key value EX second` 效果等同于 `SETEX key second value` 。
- `PX millisecond` ：设置键的过期时间为 `millisecond` 毫秒。 `SET key value PX millisecond` 效果等同于 `PSETEX key millisecond value` 。
   - `NX` ：只在键不存在时，才对键进行设置操作。 `SET key value NX` 效果等同于 `SETNX key value` 。
- `XX` ：只在键已经存在时，才对键进行设置操作。
4. 栗子

   ```
   set 1 '小红'
   set 2 '小姐姐' 
   set key-with-expire-time "hello" EX 60
   ```

#### setnx

   1. 说明

      设置键值(key不存在则设置，否则不做操作)

   2. 语法格式

      ```
      setnx(key,value)
      ```

   3. 参数说明

      - key：键
      - value：值

#### get

1. 说明

   通过键获取值

2. 方法

   ```
   get(key)
   ```
   

#### setbit

1. 说明

   对二进制表示位进行操作,将值对应的ASCII码变换成二进制后再进行索引

2. 命令

   ```
   setbit key offset value
   ```

3. 参数

   - key

     键

   - offset

     偏移量,也就是位的索引（将值对应的ASCII码变换成二进制后再进行索引）

   - value

     值只能是 1 或 0 

4. 栗子

   ```
   # 当前的字母是:h, 对应的ASC码是: 104, 对应的二进制数据是: 01101000
   # 当前的字母是:e, 对应的ASC码是: 101, 对应的二进制数据是: 01100101
   # 当前的字母是:l, 对应的ASC码是: 108, 对应的二进制数据是: 01101100
   # 当前的字母是:l, 对应的ASC码是: 108, 对应的二进制数据是: 01101100
   # 当前的字母是:o, 对应的ASC码是: 111, 对应的二进制数据是: 01101111
   
   setbit hello 21 0  # 将第三个l变成h   
   
   
    
   ```

#### getset

1. 说明

   设置新值，返回原值

2. 方法

   ```
   getset key value
   ```

3. 参数

   - key

     键

   - value

     新的值

4. 返回值

   如果存在返回旧的值,否则返回null

5. 举个栗子

   ```
   getset 'key'  '小红'
   ```

#### incr

1. 说明

   自增mount对应的值，当mount不存在时，则创建mount＝amount，否则，则自增,amount为自增数(整数)

2. 方法

   ```
   incr key  amount=1
   ```

3. 参数

   - key

     键

   - amount

     当mount不存在时，则创建mount＝amount 默认1，否则，则自增,amount为自增数(整数) 

4. 返回值

   返回一个整数，增加后键的值

5. 举个栗子

   ```python
   incr 'count1' 
   rds.incr 'count2', 2
   ```

#### getbit

1. 说明

   获取值

2. 命令

   ```
   getbit key offset
   ```

3. 参数

   - key

     键

   - offset

     偏移量,也就是位的索引（将值对应的ASCII码变换成二进制后再进行索引）

4. 栗子

   ```
   """
   hello
   01101000|[8]01[10]100101|01101100|01101100|01101111
   """  
   getbit hello  8  # 0
   getbit hello  10 # 1
   ```

#### bitcount

1. 说明

   获取Bitmaps指定范围值为1的个数

2. 命令

   ```
   bitcount hello
   ```

## 三、list操作

### 1、常用命令

lpush/rpush/lpop/rpop/lrange等；

### 2、应用场景

Redis list的应用场景非常多，也是Redis最重要的数据结构之一，比如微博的关注列表，粉丝列表等都可以用Redis的list结构来实现

### 3、实现原理

> Redis list的实现为一个双向链表，即可以支持反向查找和遍历，更方便操作，不过带来了部分额外的内存开销，Redis内部的很多实现，包括发送缓冲队列等也都是用的这个数据结构。

### 4、命令详解

#### lpush

1. 说明

   在key对应的list中添加元素，每个新的元素都添加到列表的最左边

2. 方法

   ```
   lpush kye values...
   ```

3. 参数

   - key

     键

   - values

     要添加的值

4. 返回值

   值的长度

5. 举个栗子

   ```
   lpush "li" 2 3 4 5
   ```

#### rpush

1. 说明

   同lpush，但每个新的元素都添加到列表的最右边

#### lpushx

1. 说明

   在key对应的list中添加元素，只有key已经存在时，值添加到列表的最左边

2. 方法

   ```
   lpushx key value
   ```

3. 参数

   同上

4. 栗子

5. ```
   lpushx li 1
   ```

#### lrange

1. 说明

    分片获取元素

2. 命令

   ```
   lrange key start stop
   ```

3. 参数

   - key  键
   - start  开始索引位置
   - stop  结束的索引位置

4. 举个栗子

   ```
   lrange li 0 -1
   ```

#### lpop/rpop

1. 说明

   移除列表的左侧第一个元素

2. 命令

   ```
   lpop key
   ```

3. 参数

   key 键

4. 栗子

   ```
   lpop li
   ```

## 四、hash操作

### 常用命令

hget/hset/hgetall等

### 应用场景

redis中的Hash在内存中一个键。对应一个map来存储 我们要存储一个用户信息对象数据，其中包括用户ID、用户姓名、手机，通过用户ID我们希望获取该用户的姓名或者其它信息

### 实现原理

set 的内部实现是一个 value永远为null的HashMap，实际就是通过计算hash的方式来快速排重的，这也是set能提供判断一个成员是否在集合内的原因。

### 命令详解

hget/hset/hgetall

#### hset

1. 说明

   key对应的hash中设置一个键值对（不存在，则创建，否则，修改）

2. 语法

   ```
    hset key key value
   ```

3. 参数

   - key redis的键
   - key hash的键
   - value hash对应的值
   
4. 栗子

   ```
   hset user userkey qq123456 
   ```

#### hset

1. 说明

   获取key对应的hash中值

2. 语法

   ```
    hset key key 
   ```

3. 参数

   - key redis的键
   - key hash的键

4. 栗子

   ```
   hget user userkey 
   ```

#### hgetall

1. 说明

   获取hash中对应值的所有键

2. 语法

   ```
   hgetall key
   ```

3. 参数

   key: 键

4. 栗子

   ```
   hset user phone 110
   
   hagetall user
   ```

####  其它

   - hincrby 对应的hash的值递增

   -  hlen  获取元素的个数

   - hkeys 是否包含key

   - hvals   是否包含值

   - hdel  删除键支持简单的正则

     

## 五 、set相关操作

### 1、说明

Redis set对外提供的功能与list类似是一个列表的功能，特殊之处在于set是可以自动排重的，当你需要存储一个列表数据，又不希望出现重复数据时，set是一个很好的选择

### 2、常用命令

sadd/spop/smembers/sunion等

### 3、特点

- 唯一性
- 差集、并集

### 4、常用应用场景

- 利用交并集操作，可以查找共同好友、好友推荐
- 利用差集操作，可以求出新增用户（[利用Redis集合（Set）统计新增用户和次日留存率）
- 利用唯一性，可以统计网站UV

### 5、命令详解

#### sadd

1. 说明

   添加集合

2. 语法格式

   ```
   sadd key value.. 
   ```

3. 参数说明

   - key：键
   - value：值

4. 举个栗子

   ```
   sadd numbers 1 2 3 1 1 
   sadd k1 "hello" "niuniu"
   sadd k2 "jiaojiao" "hello" "world"
   ```

#### sdiff

1. 说明

   返回给定键所有集合的差集

2. 语法格式

   ```
   SDIFF key [key ...]
   ```

3. 参数说明

   - key：键
   - key：键

4. 举个栗子  ​

   ```
   sadd k1 "hello" "niuniu"
   sadd k2 "jiaojiao" "hello" "world"
   SDIFF k1 k2
   ```

#### smembers

1. 说明

   获取集合中的所有的成员。 不存在的集合 key 被视为空集合

2. 语法格式

   ```
   SMEMBERS KEY VALUE 
   ```

3. 参数说明

   key：键

   value：值

4. 栗子

   ```
   sadd k1 "hello"
   sadd k1 "niuniu"
   SMEMBERS k1
   ```

#### spop

1. 说明

   移除key对应集合中最右边(即最后面)的元素

2. 语法格式

   ```
   spop key 
   ```

3. 参数说明

   - key：键

4. 举个栗子

   ```
   spop k1
   ```

#### sunion

1. 说明

   令返回给定集合的并集。不存在的集合 key 被视为空集

2. 语法格式

   ```
   SUNION KEY KEY1..KEYN
   ```

3. 参数说明

   - key：集合的键

4. 栗子

   ```
   sadd k1 "hello"
   sadd k1 "niuniu"
   sadd k2 "jiaojiao"
   sadd k2 "hello"
   sadd k2 "world"
   
   SUNION k1 k2
   ```

## 六、有序集合相关操作

### 1、常用命令

zadd/zrange/zrem/zcard等

### 2、特点

- 有序，自由实现堆、栈的功能
- 轮询监控
- 索引取区间

### 3、常用应用场景

- 利用 `LTRIM key start stop`获取网站最后5个访问用户、最新消息排行榜
- 利用`PUSH` `POP`当成队列，进行多任务处理
- 利用`BRPOPLPUSH key1 key1 time`,使用相同的key作为BRPOPLPUSH的两个参数，无限循环整个列表，比如：一个服务器监控程序，并行检查一组网站，确保网站的可访问性
- 利用`BRPOP key time`进行事件提醒，在新元素到达时立即处理，新元素未到达一直阻塞住，避免轮询占用资源

### 4、实现原理

set 的内部实现是一个 value永远为null的HashMap，实际就是通过计算hash的方式来快速排重的，这也是set能提供判断一个成员是否在集合内的原因。

### 5、命令详解

#### zincrby

1. 说明

   命令对有序集合中指定成员的分数加上增量 increment

   可以通过传递一个负数值 increment ，让分数减去相应的值，比如 ZINCRBY key -5 member ，就是让 member 的 score 值减去 5 。

   当 key 不存在，或分数不是 key 的成员时， ZINCRBY key increment member 等同于 ZADD key increment member 。

   当 key 不是有序集类型时，返回一个错误。

   分数值可以是整数值或双精度浮点数。

2. 语法格式

   ```
   zincrby  key increment member
   ```

3. 参数说明

   - key：键
   - increment：值
   - amount：分数自增值

4. 举个栗子  ​

   ```
   ZINCRBY hot 1 "华为mate30发布会"
   ZINCRBY hot 1 "华为mate30发布会"
   ZINCRBY hot 1 "华为mate30发布会"
   ZINCRBY hot 1000 "华为mate30发布会"
   ZINCRBY hot 1 "杨紫荷叶边半裙"
   ZINCRBY hot 1 "杨紫荷叶边半裙"
   ZINCRBY hot 1 "杨紫荷叶边半裙"
   # 按分数升序
   zrange 'hot' 0 -1 
   # 按分数降序
   zrevrange 'hot'  0 -1
   
   ```

#### zadd

1. 说明

   在name对应的有序集合中添加元素，分数越小，越靠前

2. 语法格式

   ```
     zadd key_name score value.. score value
   ```

3. 参数说明

   - key_name：键
   - score 分数
   - value 

4. 举个栗子

   ```
   zadd hot 1 "华为mate发布会" 2 "斗鱼三骚"
   ```

#### zcard

1. 说明

   获取key对应的有序集合的元素个数

2. 语法格式

   ```
   zcard key
   ```

3. 参数说明

   key：键

4. 举个栗子  

   ```
   zcard hot
   ```

#### zcount

1. 说明

   获取key对应的有序集合中，min<=分数<=max中的元素个数

2. 语法格式

   ```
   zcount key,min,max 
   ```

3. 参数说明

   - name：键
   - min：小值(分数)
   - max：大值(分数)

4. 举个栗子  ​

   ```
   zcount hot 1 9 
   ```

#### zrange

1. 说明

   获取name对应的有序集合中,start<=下标<=end的所有数据。

2. 语法格式

   ```
   ZRANGE key start stop [WITHSCORES]
   ```

3. 参数说明

   - name：键
   - start：起始位置
   - end：结束位置
   - withscores：是否获取分数,默认False

4. 举个栗子  ​

   ```
   zrange 'hot' 0 -1 WITHSCORES
   ```

#### zrem

1. 说明

   移除有序集中的一个或多个成员，不存在的成员将被忽略

2. 语法格式

   ```
   zrem  key member
   ```

3. 参数说明

   - name：键
   - member 

4. 举个栗子  ​

   ```
   zrem hot "华为mate发布会"
   ```