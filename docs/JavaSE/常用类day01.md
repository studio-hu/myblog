# 常用类01 

## 学习内容

- API使用
- 工具类的设计
- 单例模式
- 八大基本类型的包装类
- 装箱和拆箱
- 包装类的缓存设计
- BigDecimal类
- String类
- StringBuilder和StringBuffer类

## 学习目标

- [ ] 熟练查看API，熟悉方法调用
- [ ] 了解工具的两种设计方案，公共静态方法和单例模式
- [ ] 掌握单例模式的编写
- [ ] 掌握八大基本数据类型的包装类
- [ ] 了解基本类型和包装类的区别
- [ ] 掌握什么是装箱和拆箱，什么是自动装箱和拆箱
- [ ] 掌握BigDecimal的加减乘除和保留精度操作
- [ ] 熟练运用String类中的常用方法
- [ ] 掌握StringBuilder的操作
- [ ] 掌握String、StringBuilder、StringBuffer三者的区别



## API概述

​		Java　API(Java　Application　Programming　Interface)是Java应用程序编程接口的缩写，Java中的API，就是JDK提供的具有各种功能的Java类，由于Java类库非常庞大，而且在不断壮大，本文不可能一一介绍所有类的使用方法，读者应该养成查阅Java　API文档的习惯，就像查询字典一样，在需要用到某个类的时候，可以从Java　API文档中获得这个类的详细信息。

Java　API的帮助文档可到 **http://docs.oracle.com/javase/8/docs/api/** 下载，灵活使用Java　API能够提高使用Java语言编写程序的效率，下面对Java中提供的最常用的包进行介绍。

- java.lang：Java语言包, 该包中提供了利用Java语言进行程序设计的基础类，比如String、Math、System类，在任何类中，**该包中的类不需要使用import语句进行导入，都会被自动导入**。
- java.util：该包中主要包含一些实用的工具类，比如集合框架类、日期处理类、字符串解析类、随机数生成类等。
- java.awt：该包中主要包含处理用户界面和绘制图形图像的各种类。
- java.io：该包中主要包含处理输入、输出编程的各种类。
- java.net：该包中主要包含处理网络编程的各种类。
- java.sql：该包中主要包含处理数据库编程的各种类。

java.lang包中常用的类如表1-1所示。

​																			表1-1　java.lang包中的常用类

| Boolean   | Object         | Error                  |
| --------- | -------------- | ---------------------- |
| Byte      | String         | Throwable              |
| Character | StringBuffer   | Exception              |
| Double    | StringBuilder  | ClassNotFoundException |
| Float     | System         | NullPointerException   |
| Integer   | Math           | NumberFormatException  |
| Long      | Runnable(接口) | RuntimeException       |
| Short     | Thread         | ArithmeticException    |

java.util包中常用的类如表1-2所示。

​																		    表1-2　java.util包中的常用类

| Collection(接口)   | Arrays    | Calendar    |
| ------------------ | :-------- | ----------- |
| Iterator(接口)     | Set(接口) | Date        |
| ListIterator(接口) | HashSet   | Random      |
| List(接口)         | TreeSet   | Scanner     |
| ArrayList          | Map(接口) | Collections |
| LinkedList         | HashMap   |             |
| Vector             | Hashtable |             |
| Stack              | TreeMap   |             |

java.IO包中常用的类如表1-3所示。

​																			表1-3　java.io包中的常用类

| BufferedInputStream  | FileReader         | PrintWriter           |
| -------------------- | ------------------ | --------------------- |
| BufferedOutputStream | FileWriter         | Reader                |
| BufferedReader       | InputStream        | Writer                |
| BufferedWriter       | InputStreamReader  | Serializable(接口)    |
| DataInputStream      | OutputStream       | Externalizable接口)   |
| DataOutputStream     | OutputStreamWriter | IOException           |
| File                 | ObjectInputStream  | FileNotFoundException |
| FileInputStream      | ObjectOutputStream | InvalidClassException |
| FileOutputStream     | PrintStream        |                       |

## 1. 工具类的设计

一般的，把很多完成通用功能的方法分类存放到类中，这些类就叫工具类。

- 工具类起名：XxxUtil、XxxUtils、XxxTool、XxxTools等，其中Xxx表示一类事物，比如ArrayUtil、StringUtil、JdbcUtil。
- 工具类存放的包起名：util、utils、tool、tools等 

**工具类如何设计，在开发中有两种设计：**

- 如果工具方法全部使用public static修饰
  - 此时只需要使用工具类名调用工具方法
  - 此时必须把工具类的构造器私有化，防止创建工具类的对象来调用静态方法

- 如果工具方法没有使用static修饰

  - 此时必须使用工具类的对象去调用工具方法
  - 此时必须把工具类设计为**单例模式**

  一般的出于简单考虑，首选第一种，如JDK中提供的工具java.util.Arrays类。

### **1.1.** 公共静态方法（掌握）

比如使用公共静态方法的方式，设计一个数组的工具类。

公共静态工具方法设计如下：

1. 私有化构造器
2. 提供公共静态的方法

3. 调用者直接使用工具类名.工具方法名称完成调用即可。

### **1.2.** 单例模式（掌握）

​		设计模式（Design pattern）：是一套被反复使用的代码设计经验总结。使用设计模式是为了可重用代码、让代码更容易被他人理解、保证代码可靠性。 

设计模式：https://www.runoob.com/design-pattern/singleton-pattern.html

​		比如使用单例模式的方式，设计一个数组的工具类。

​		单例设计模式（singleton）：最常用、最简单的设计模式，单例的编写有N种写法。

​		**目的：保证在整个应用中某一个类有且只有一个实例（一个类在堆内存只存在一个对象）。**

写单例模式的步骤（单讲饿汉式）：

1. 必须在该类中，自己先创建出一个私有静态对象 

2. 私有化自身的构造器，防止外界通过构造器创建新的工具类对象

3. 向外暴露一个公共的静态方法用于返回自身的对象

## **2.** 包装类

### **2.1.** 基本类型包装类（掌握）

​		需求：使用double类型来表示学生的考试成绩，此时怎么区分考试成绩为0和没有成绩两种情况?使用double是不行的，只能表示0.0的情况，此时要解决该问题就得使用基本类型的包装类。

double score = 0.0; 

double score = null; 

​		模拟定义一个类来封装int类型的值。

```java
public class IntWrapper {
      private int value;	//值
      public IntWrapper(int value) {
           this.value = value;
      }
}
```

使用该int的包装类。

```java
IntWrapper wrapper = null;		 		//没有对象,没有数据
IntWrapper wrapper = new IntWrapper(0);	//有对象，表示数据0
```

**此时能发现，模拟的int包装类IntWrapper既可以表示0，也可以表示null。**

**基本数据类型和包装类对应关系：**

![图片 138](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img%E5%9B%BE%E7%89%87%20138.png)

除了Integer和Character外，其他都是将基本类型的首字母大写。讲课单以Integer举例。

#### **2.1.1.** 装箱和拆箱（了解）

> 装箱：把基本类型数据转成对应的包装类对象。
>
> 拆箱：把包装类对象转成对应的基本数据类型。
>

什么时候装箱?什么时候拆箱?

装箱操作：

```java
方式一：	Integer num1 = new Integer(17);  // 过时
方式二：	Integer num2 = Integer.valueOf(17);	//建议
```

拆箱操作：

```java
Integer	num3  =  Integer.valueOf(17);	//装箱操作
int val = num3.intValue();	//拆箱操作
```

从Java5开始提供了的自动装箱（AutoBoxing）和自动拆箱（AutoUnBoxing）功能：

​	自动装箱：可把一个基本类型变量直接赋给对应的包装类变量。

​	自动拆箱：可以把包装类对象直接赋给对应的基本数据类型变量。

```java
Integer	num4  =  17;		//装箱操作
int val2 = num4;		//拆箱操作
```

自动装箱和拆箱，在底层依然是手动装箱和拆箱。

思考Object obj = 17;代码正确吗？为什么？

```java
Integer i = 17;		//自动装箱操作
Object obj = i;		//把子类对象赋给父类变量
```

**把字符串转换为int类型操作：**

```java
int num = Integer.parseInt("123a");
```

如果传入的数据是非数字组成，如“123SB”，此时报错**NumberFormatException**（数字格式化异常）。

#### **2.1.2.** 缓存设计（了解）

从性能上考虑，把常用数据存储到缓存区域，使用时不需要每次都创建新的对象，可以提高性能。

- Byte、Short、Integer、Long：缓存范围[-128，127]；

- Character：缓存范围[0，127]；

Integer的部分源代码如下：

**![图片 139](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img%E5%9B%BE%E7%89%87%20139.png)**

如果把上述代码中的123换成250，则结果都为false。

如果要比较两个对象的数据是否相等，必须使用equals方法来判断。

==比较的是两个数据的内存空间是否是同一块，equals比较的是存储数据是否相等。

**int类型的默认值为0，Integer的默认值为null，在开发中建议使用Integer。**

- **Integer既可以表示0，也可以表示null。**
- **成员使用包装类型，局部使用基本数据类型**

#### 2.1.3. Integer中常用的方法

| 返回值类型     | 方法签名                          | 含义                                                         |
| -------------- | --------------------------------- | ------------------------------------------------------------ |
| static int     | **parseInt(String str)**          | 将数字的字符串转换为int类型的值；                            |
| int            | intValue()                        | 将包装类对象转换为对应的基本数据类型                         |
| static Integer | valueOf(int value)                | 将基本数据类型转换为对应的包装类对象                         |
| static int     | compare(int a,int b)              | 比较两个值:如果值相等则返回0，如果值A小于值B则返回-1，如果值A大于值B返回1 |
| int            | compareTo(Integer anotherInteger) | 比较两个 `Integer`对象传入的数值：<br />如果值相等返回0，如果值A小于值B则返回-1，如果值A大于值B返回1 |
| static String  | **toString(int i)**               | 将int类型转换为对应 的String类型                             |
| static int     | max(int a,int b)                  | 返回两个参数中最大值                                         |
| static int     | min(int a,int b)                  | 返回两个参数中最小值                                         |
| static int     | sum(int a,int b)                  | 返回两个参数加法运算后的和                                   |

## 3. BigDecimal（掌握）

float和double都不能表示精确的小数，使用BigDecimal类可以解决该问题，BigDecimal用于处理金钱或任意精度要求高的数据。

BigDecimal不能直接把赋值和运算同时操作，只能通过构造器传递数据，**而且必须使用字符串类型的构造器**，操作BigDecimal主要是加减乘除四个操作。

```java
package com.powernode.class1;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class BigDecimalDemo1 {

    public static void main(String[] args) {

        double d1 = 0.01;
        double d2 = 0.09;
        System.out.println(d1 + d2); // 0.09999999999999999

        BigDecimal b1 = new BigDecimal("0.01");
        BigDecimal b2 = new BigDecimal("0.09");
        BigDecimal b3 = new BigDecimal("99.89");
        BigDecimal b4 = new BigDecimal("4578.784");
        // 实现加法运算 add()
        System.out.println(b1.add(b2)); // 0.10
        // 减法运算 subtract()
        System.out.println(b3.subtract(b4)); // 54.101
        // 乘法运算 multiply()  实现四舍五入 并设置保留位数
        // int newScale 保留位数
        // RoundingMode roundingMode 实现四舍五入
        // public BigDecimal setScale(int newScale, RoundingMode roundingMode)
        BigDecimal multiply = b3.multiply(b4);
        System.out.println(multiply); // 4573.86321
        System.out.println(multiply.setScale(2, RoundingMode.HALF_UP)); // 4573.86
        // 除法运算 divide()  运算时 必须做四舍五入
        // System.out.println(b3.divide(b2)); //  ArithmeticException 算数异常
        System.out.println(b3.divide(b2, 2, RoundingMode.HALF_UP)); // 1109.89
    }
}
```



## 4. 字符串

字符串（字符序列），表示把多个字符按照一定得顺序排列起来。

字符串的分类（根据同一个对象，内容能不能改变而区分）：

- **不可变的字符串——String**：当String对象创建完毕之后，该对象的内容是不能改变的，一旦内容改变就变成了一个新的对象。"ABC"  "ABCD"

- **可变的字符串——StringBuilder/StringBuffer**：当StringBuilder对象创建完毕之后，对象的内容可以发生改变，当内容发生改变的时候，对象保持不变。

**字符串的本质是char[]，char表示一个字符，char[]表示同一种类型的多个字符。**

```java
String  str = "ABCD";	等价于	char[] cs = new char[]{'A','B','C','D'}; 等价于 String str = new String("ABCD");
```

### 4.1. String（掌握）

#### 4.1.1. String概述

​		String类，表示不可变的字符串，当String对象创建完毕之后，该对象的内容是不能改变的，一旦内容改变就变成了一个新的对象，看下面代码。

```java
String str = "龙哥";
str = "龙哥17";
```

**![图片 140](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img202308261500162.png)**

String对象的创建的两种方式：

```java
// 1、直接赋一个字面量:       
String   str1  =  "ABCD";//直接存储在方法区的常量池中,节约内存
// 2、通过构造器创建:         
String   str2  =  new String("ABCD");
```

两种方式有什么区别，分别在内存中如何分布?

![图片 141](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img202308261500990.png)

**String对象的空值：**

```java
  表示引用为空(null)	 ：	 String  str1 = null ;   没有初始化，没有分配内存空间.  
  内容为空字符串		：	String  str2  = "";     已经初始化，同时分配内存空间，不过没有内容
```

判断字符串非空：字符串不为null并且字符内容不能为空字符串(“”)

判断一个字符串非空：

trim()：返回一个字符串，其值为字符串，并删除任何前导和尾随空格。

```java
public static boolean hasLength(String str) {
	return str != null && !"".equals(str.trim());
}
```

字符串的比较操作：

- 使用”==”号：比较两个字符串引用的内存地址是否相同

- 使用equals方法：比较两个字符串的内容是否相同

```java
System.out.println("ABCD" == "ABCD");	//true
System.out.println("ABCD" == new String("ABCD"));	//false
System.out.println("ABCD".equals("ABCD"));	//true
System.out.println("ABCD".equals(new String("ABCD")));	//true
```

#### 4.1.2. String常用方法（要记住）

| 返回值类型 | 方法签名                                | 含义                                    |
| ---------- | --------------------------------------- | --------------------------------------- |
| int        | length()                                | 获取字符串的字符个数                    |
| boolean    | equals(String str)                      | 重写了Object的，比较的值是否相等        |
| boolean    | equalslgnoreCase(String str)            | 忽略大小写 比较内容是否相等             |
| char       | charAt(int index)                       | 获取指定索引的字符                      |
| int        | indexOf(String str)                     | 获取指定字符串中第一次出现的索引位置    |
| String     | subString(int beginIndex)               | 从指定位置截取字符串                    |
| String     | subString(int beginIndex，int endIndex) | 截取指定区域的字符串                    |
| String     | toUpperCase()                           | 将字符串转换为大写                      |
| String     | toLowerCase()                           | 将字符串转换为小                        |
| boolean    | startsWith(String str)                  | 判断是否指定字符串开始                  |
| boolean    | endsWith(String str)                    | 判断是否指定字符串结束                  |
| String     | replace(char oldChar,char newChar)      | 字符串替换                              |
| String     | replaceAll(String re,String str)        | 将给定的字符串替换为正则匹配的每个字符  |
| boolean    | contains(CharSequence c)                | 判断字符串中是否包含此序列              |
| String[]   | split(String regex)                     | 根据传入的正则分隔符 返回一个字符串数组 |

### 4.2. StringBuilder（掌握）

​		Sting是不可变的，每次内容改变都会在内存中创建新的内存区域，如果现在要把N个字符串连接起来，此时需要在内存中创建N块内存空间，性能很低。此时要解决多个字符串做拼接性能低的问题，我们可以使用StringBuilder来搞定。

​		StringBuffer和StringBuilder都表示可变的字符串，功能方法相同的，区别是：

- StringBuffer：StringBuffer中的方法都使用了synchronized（同步）修饰，保证线程安全但性能较低

- **StringBuilder：StringBuilder中的方法没有使用synchronized修饰，线程不安全但是性能较高**

开发中建议使用StringBuilder，具体用法如下：

- 如果事先知道需要拼接多少个字符，可以在创建StringBuilder对象时指定字符数组容量，缺省为16

```java
StringBuilder sb = new StringBuilder(40);
```

使用**append**方法在原字符串后面继续拼接字符串（链式语法）

```java
sb.append("ABC").append(123).append("will");
```

  