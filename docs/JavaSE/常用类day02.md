## 常用类02

### 学习内容：

- 随机数     
- Date类
- SimpleDateFormat类
- Calendar类
- 正则表达式

### 学习目标：

- [ ] 熟悉查看API，熟悉方法调用
- [ ] 了解随机随机数的操作
- [ ] 掌握日期的转换操作（格式化和解析）
- [ ] 了解日历类获取年月日和增加天数操作
- [ ] 了解正则表达式

 

### **1.** 随机数

#### 1.1. Math（了解）

​		Math 类包含用于执行数学运算的方法，如初等指数、对数、平方根和三角函数等，该类的方法都是static修饰的，在开发中其实运用并不是很多，里面有一个求随机数的方法，偶尔会用到。

常用方法：

| 返回值类型    | 方法签名 | 含义                            |
| ------------- | -------- | ------------------------------- |
| static double | random() | 返回一个(0.0-1.0)之间的随机小数 |
| static int    | Math.max | 返回两个 `int`值中的较大值。    |
| static int    | Math.min | 返回两个 `int`值中的较小值。    |

#### 1.2.Random（了解）

​		Random类用于生产一个伪随机数（通过相同的种子，产生的随机数是相同的），Math类的random方法底层使用的就是Random类的方式。

#### 1.3.UUID （了解）

​		UUID表示通用**唯一**标识符 (Universally Unique Identifier) ，其算法通过电脑的网卡、当地时间、随机数等组合而成，优点是真实的唯一性，缺点是字符串太长了。

### **2.** 日期

#### 2.1.Date（掌握）

​		Date类，日期时间类，表示特定的瞬间，可以解释为年、月、日、小时、分钟和秒值。

​		注意：我们使用的是**java.util.Date类**，而不是java.sql.Date。

​		Date类中的大量方法都标记为已经过时的，即官方不建议使用。在开发中，我们要表示日期（年月日）或时间（时分秒）类型都使用Date类来表示。

#### 2.2.SimpleDateFormat（掌握）

​		打印Date对象时，默认打印的是欧美人的日期时间风格，如果需要输出自定义的时间格式，比如2023年01月17日 12：12:12格式或者2023-01-17 12:12:12，此时可以使用SimpleDateFormat类。

SimpleDateFormat类，顾名思义是**日期的格式化类**，主要包括两个功能的方法：

- 格式化（format）：Date类型转换为String类型：String format(Date date) 
- 解析（parse）：String类型转换为Date类型：Date parse(String source)  
- 简单类型的数据--->复杂类型的数据

无论是格式化还是解析都需要设置日期时间的模式，所谓模式就是一种格式。

**![](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img%E5%9B%BE%E7%89%87%20142.png)**

日期模式举例：

```
yyyy-MM-dd							如2023-01-12
HH:mm:ss							如20：12：12
yyyy-MM-dd HH:mm:ss					如2023-01-12 20：12：12
yyyy/MM/dd HH:mm:ss					如2023/01/12 20：12：12
yyyy年MM月dd日 HH时mm分ss秒			如2023年01月12日 20时12分12秒
```

注意：代码中public static void main(String[] args) throws Exception表示抛出异常，在main方法中不作任何处理，在异常章节再细讲。

#### 2.3.Calendar（了解）

​		Calendar是日历类，**主要用来对日期做相加减，重新设置日期时间功能**，Calendar本身是一个抽象类，通过getInstance方法获取对象，其底层创建的是Calendar的子类对象。

需求：查询某个时间最近一周的信息，如何表示最近这一周的开始时间和结束时间

假如给出时间为：2018-05-18 15:05:30，那么最近一周的开始和结束时间分别为：

开始时间：2018-05-12 00:00:00

结束时间：2018-05-18 23:59:59

### 3.正则表达式（了解）

正则表达式，简写为regex和RE。

正则表达式用来判断某一个字符串是不是符合某一种正确的规则，在开发中通常用于判断操作、替换操作、分割操作等。

**![](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img%E5%9B%BE%E7%89%87%2043_2.png)**

#### 3.1. 正则表达式规则

正则表达式匹配规则一：元字符

**![](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img%E5%9B%BE%E7%89%87%2044_2.png)**

正则表达式匹配规则二：量词&逻辑运算符

**![](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img%E5%9B%BE%E7%89%87%2045_2.png)**

#### 3.2. 正则表达式练习

​		判断一个字符串是否全部有数字组成

​		判断一个字符串是否是手机号码

​		判断一个字符串是否是18位身份证号码

​		判断一个字符串是否6到16位，且第一个字必须为字母

权威：http://www.cppcns.com/wangluo/re/462474.html

