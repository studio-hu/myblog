---
sidebar_position: 4
---

### 注释

#### 概述

- 注释是一个项目重要的组成部分，增加.java源代码的可阅读性、可维护性
- 在重要的类、方法、变量、代码块前面，优秀的开发人员都会添加注释
- 注释并不是越多越好，先争取使用代码就能表达相应的需求，再辅助以注释
- 只用于程序.java源代码，不会带入.class字节码，更不会影响程序逻辑

#### 注释分类

- **文档注释**，用于描述整个文件、类或方法；以/**开始，以\*/结尾

  ```java
  package com.bjpowernode.demo;
  
  /**
   * Main类，作为命令行程序的入口类。--文档注释
   */
  public class Main {
      /**
      * 入口main方法 --文档注释
      */
      public static void main(String[] args) {
          System.out.println("你好，世界！");
      }
  }
  ```

- **多行注释**，用于解释一段代码的作用；以/*开始，以\*/结尾

  ```java
  package com.bjpowernode.demo;
  
  public class Main {
  
      public static void main(String[] args) {
          /*
            下面一段代码主要是做控制台输出
             比如会输出“你好，世界！”
             --多行注释
           */
          System.out.println("你好，世界！");
      }
  }
  ```

- **单行注释**，用于解释一行代码的作用，可置于一行的前面或代码的后面；以//开始

  ```java
  package com.bjpowernode.demo;
  
  public class Main {
  
      public static void main(String[] args) {
          //输出“你好，世界！”--单行注释
          System.out.println("你好，世界！");       //输出“你好，世界！”--单行注释
      }
  }
  ```

【练习】

1. 编写程序，设计类，然后在类中定义入口main方法；在适当的位置添加文档注释、多行注释、单行注释，并运行

### 关键字

- 所有的编程语言，都是一套英语的语法规则，俗称**关键字**，也会有少部分的**保留字**，Java亦是如此

- Java中的这些关键字具备特别的语法意义，或是用于定义类、方法等，或是用于流程控制等

- **有着严格的使用规则**，就像注册公司名，"有限公司"、"集团"都只能作为后缀

- 自定义的标识符（包括包名、类名、方法名、变量名等）都**不能与这些关键字同名**

- 具体有哪些关键字，详细内容参考百度百科：https://baike.baidu.com/item/java%E5%85%B3%E9%94%AE%E5%AD%97

- **提问**：有哪些认识？

  ![Java关键字](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202308301525301.jpg)

  <center>Java关键字</center>

- 这些关键字，在持续学习的过程中都会讲解，并且大部分都要记住

### 标识符

- Java程序开发过程中各种自定义的名称，如包名、类名、接口名、方法名、变量名、参数名等
- 要遵守以下规则
  - **不能使用关键字**
  - **以字母、下划线_或$开头，其后可以是字母、数字、下划线_或$**
  - **区分大小写**
  - **中间不能有空格**
- 命名建议
  - 使用单词，如name，age等，不要使用a、b、a1、a2、method1、method2这种
  - 使用**大驼峰**、**小驼峰**、**全大写**等命名规范，如StudentCourse、addStudent、MAX_VALUE等
  - 长单词简写，一般关键字超过15个字符，进行简写，如arguments缩写成args

【练习】

1. 提问：下列的标识符，哪些合法，哪些不合法？说明原因
   1. myName
   2. 姓名
   3. My_name
   4. Points
   5. $points
   6. _sys_ta
   7. OK
   8. 23b
   9. 3
   10. #name
   11. 25name
   12. class
   13. &time
   14. if
   15. Hello World
2. 编写程序，使用标识符定义规则定义如下标识符
   1. 类：定义学生类（使用大驼峰）
   2. 成员变量：其中定义姓名、年龄、性别、家庭住址等成员变量（使用小驼峰）
   3. 普通方法：给学生类添加入学方法、打篮球方法（使用小驼峰）
   4. 入口方法：给学生类添加main入口方法
   5. 局部变量：在入口方法中定义成绩、排名等变量（使用小驼峰）

### 字面量

- 见字如面，符合实际情况，比如：称了一下体重，今天是100kg、下午买了30块钱的下午茶、新来的同事叫“赵四”，上面的100、30、"赵四"，都是字面量

- 用于表达源代码中一个固定值的表示法 

- 常见的字面量如：250、250L、2999.98、2999.98f、true、'a'、'\n'、"他是一个Java大佬"

- 每种基本数据类型和字符串（String），都有自身特点的字面量

- 应用实例

  - 实例1，字面量实例

    ```java
    package com.bjpowernode.demo;
    
    /**
     * 字面量实例
     */
    public class LiteralDemo {
        public static void main(String[] args) {
            //整数字面量
            System.out.println(38);     //年龄
            System.out.println(53023232323l);   //GDP
    
            //小数字面量
            System.out.println(2500.25);    //金额
            System.out.println(3.14159265358979323846);   //pai
    
            //字符字面量
            System.out.println('a');
    
            //布尔字面量，只有true和false
            System.out.println(true);
            System.out.println(false);
    
            //字符串字面量
            System.out.println("你是一个Java大佬。");
            System.out.println("Nice to meet you.");
        }
    }
    ```

【练习】

1.  使用System.out输出上述几种常见的字面量

### 基本数据类型

- 生活中，存在不同的数据种类，如：描述身高170cm，用的是整数；今天兼职151.28，用的是小数；家里的小狗叫“旺财”，用的是字符串或文本

- Java语言中，根据实际生活中的特点，定义了**8种基本数据类型**，并使用这8种基本数据类型定义变量（一种标识符），用于存储程序中的动态变化的值

- 为了方便记忆，**分成4类**

  - **整数型**（不带小数的数字）：**byte**,**short**,**int**,**long**
  - **浮点型**（带小数的数字）：**float**,**double**
  - **字符型**（文字，单个字符）：**char**
  - **布尔型**（真和假）：**boolean**

- 8种基本数据类型的详细特点如下

  注意：float只能保证小数位后6~7位（十进制）精度；double只能保证15位（十进制）精度；

  ![基本数据类型](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202308301525813.jpg)

  <center>8种基本数据类型</center>

- 应用实例

  - 实例1，基本数据类型使用

    ```java
    package com.bjpowernode.demo;
    
    /**
     * 基本数据类型实例
     */
    public class TypeDemo {
        public static void main(String[] args) {
            //byte
            byte studentAge = 24;
            System.out.println("学生年龄：" + studentAge);
    
            //short
            short schoolStudentCount = 15324;
            System.out.println("学校人数：" + schoolStudentCount);
    
            //int
            int graduateStudentCount = 8500001;
            System.out.println("全国去年毕业生人数：" + graduateStudentCount);
    
            //long
            long gdp = 5302302323232l;
            System.out.println("全国去年GDP：" + gdp);
    
            //float
            float learningPrice = 5235.68f;
            System.out.printf("学费：" + learningPrice);
    
            //double
            double schoolArea = 23562.495;
            System.out.println("学校占地面积：" + schoolArea);
    
            //char
            char sex = '男';
            System.out.println("性别：" + sex);
    
            //boolean
            boolean isSuperMan = false;
            System.out.println("是否为超人？" + isSuperMan);
        }
    }
    ```

  【练习】

1. 编写程序，使用每种数据类型定义一个变量（标识符），注意名称要有意义，并使用字面量进行赋值，然后输出

### 进制

- 基本数据类型中是**占用字节数**其实是基于计算机中使用二进制转换而来

- 在计算机中，所有数据都使用二进制表达，俗称位（bit，简写为b），使用0、1表示两种状态

- 同时，为了方便处理，习惯将将8位（bit）组合成一个字节（byte，简写为B）进行表达；8位二进制可以表达256（2^8^）种状态，即1byte=8bit

- 在生活中，普遍使用十进制，所以会将各种基本数据类型、字面量的数值，使用十进制描述，系统会将其转换成二进制处理

- **各种进制的字面量**

  - **默认**，十进制
  - **0b**，二进制，如0b10表示十进制2
  - **0**，八进制，如010表示十进制8
  - **0x**，十六进制，如0x10表示十进制16

- 另外，在计算机领域，也会多使用十六进制来表达二进制数据，占用空间少、直观，如MAC地址、加密后的密码等；其所有的状态有：0、1、2、3、4、5、6、7、8、9、a、b、c、d、e、f【扩展】

- 还有，要熟练掌握二进制、十进制、十六进制之间的转换，转换规则如下：【扩展】

  - 十进制转其他进制，使用整除，然后反向取余法

    ![Java基础语法-进制-进制转换](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202308301526313.jpg)

  - 其他进制转十进制，按位累加

    - 二进制转十进制，按位相加，参考如下示例
      - 二进制：10111
      - 转换规则：1\*2^4^+0\*2^3^+1\*2^2^+1*2^1^+1\*2^0^
      - 转换结果：23
    - 八进制转十进制，按位相加，参考如下示例
      - 八进制：127
      - 转换规则：1\*8^2^+2*8^1^+7\*8^0^
      - 转换结果：87
    - 十六进制转十进制，按位相加，参考如下示例
      - 八进制：A1F
      - 转换规则：10\*16^2^+1*16^1^+15\*16^0^
      - 转换结果：2591

【练习】

1. 编写程序，使用二进制、八进制、十六进制字面量，输出十进制的数31
2. 在作业本上，将237分别转二进制、八进制、十六进制
3. 在作业本上，将二进制10111101、八进制376、十六进制3ec分别转成十进制

### 编码

- ASCII(American Standard Code for Information Interchange)码

  - 美国信息交换标准代码，是基于拉丁字母的一套电脑编码系统，主要用于显示现代英语和其他西欧语言；是计算机中主要的编码体系
  - 使用8位二进制表示，由128个字符组成，包括大小写字母、数字0-9、标点符号、非打印字符（换行符、制表符等4个）以及控制字符（退格、响铃等）组成
  - 后面也增加到256个字符，但对于一些如亚洲语言体系国家编码来说是不够的
  - char数据类型中就可以存储所有的标准ASCII码字符

- 其他编码

  - 由于ASCII码不能完全满足要求，各个国家衍生了各种电脑编码系统，如占用两个字节的GB、GBK，也有1到6个字节的UTF-8及两个字节的UTF-16,但UTF-8包含全世界所有国家需要用到的字符，长度灵活，资源利用率更高，是国际编码，通用性强

- **ASCII码表**，具体见下表；了解0\~9的ASCII码值是48\~57，A\~Z的ASCII码值是65\~90，a\~z的ASCII码值是97\~122

  ![](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202308301527063.jpg)

<center>ASCII码表（图片来自网络）</center>

- 应用实例

  - 实例1，ASCII码输出字符

    ```java
    package com.bjpowernode.demo;
    
    /**
     * ASCII码实例
     */
    public class ASCIIDemo {
        /**
         * 入口方法
         * @param args
         */
        public static void main(String[] args) {
            //'0'字符
            char char0 = 48;    //方式1
            //char char0 = '0';   //方式2，效果与方式1一样
            System.out.println(char0);
    
            //'A'字符
            char charA = 65;    //方式1
            //char charA = 'A';   //方式2，效果与方式1一样
            System.out.println(charA);
    
            //'a'字符
            char chara = 97;    //方式1
            //char chara = 'a';   //方式2，效果与方式1一样
            System.out.println(chara);
    
            //'中'字符
            char charZhong = 20013;    //方式1
            //char charZhong = '中';   //方式2，效果与方式1一样
            System.out.println(charZhong);
        }
    }
    ```

【练习】

1. 练习演示的内容，完成代码编写

2. 编写程序，使用ASCII码值输出如下内容：

   a-b-c x-y-z

   A-B-C X-Y-Z

   0-1-2 7-8-9

### 变量

#### 概述

- 变量是用于**存储数据的容器**，主要用于存放程序运行过程中的临时数据
- 顾名思义，定义后，**其内容可以进行修改**
- 变量是一种标识符，遵守标识符命名规则，使用小驼峰，如myAge、parentNode

#### 定义变量

- 定义变量方式多种：

  - 方式1，只定义，不赋初值：数据类型 变量名称;

    ```java
    //只定义，不赋初值
    int myAge;	//变量
    Student student;	//变量，也叫引用
    String name;
    ```

  - 方式2，定义并赋初值：数据类型 变量名称 = 字面量; 

    ```java
    //定义并赋初值
    int myHeight = 170;
    Student student = new Student();  //student是变量，也叫引用
    String name = "张三";  //name是变量，也叫引用引用
    ```

  - 方式3，定义多个相同类型变量：数据类型 变量名称1 = 字面量1,变量名称2 = 字面量2;

    ```java
    //定义多个相同类型变量，不推荐
    int myAge = 18,myWeight,myHeight = 170;
    Student student1,student2;
    ```

- 其中

  - **数据类型**：可以是8种基本数据类型，也可以是String等Java自带的类型、第三方类型、自定义类型
  - **变量名称**：必须符合标识符命名规则
  - **字面量**：使用与数据类型匹配的字面量

#### 使用变量

- 变量需要**先定义，再使用**

- 使用的方式主要有

  - **修改**变量初值为新的值
  - 使用变**量参与计算**，后面讲运算符会使用到
  - 将变量**输出**
  - 将变量**持久化**，以后会讲
  - ...

- 使用示例

  ```java
  //定义变量，并赋初值
  int first = 5;
  int second = 20;
  //定义变量
  int third;
  
  //修改变量值
  first = 15;
  second = 30;
  
  //使用变量，进行计算
  third = first + second;
  
  //使用变量，输出
  System.out.println(first +"+"+second+"="+third);
  ```

【练习】

1. 练习实例内容，完成代码编写
2. 编写程序，要求如下：
   1. 定义一个学生的姓名（字符串）、年龄（整数）、身高（小数）、性别（字符）4个变量，并赋初值，再使用System.out输出这4个变量
   2. 修改上述该学生的年龄、身高，使用System.out输出这4个变量
   3. 再次修改上述学生的姓名、身高，使用System.out输出这4个变量
   4. 每次学生信息输出后，再输出一行"-----------------------"分隔

#### 变量分类

- **按定义位置分类**

  - 其类型主要有，一般分为局部变量和成员变量两类，静态变量相对特殊

    - **局部变量**
      - 定义：在方法内任意位置
      - 使用：定义后，直接通过变量名使用
      - 作用域：从定义那行开始，到最近的一个右大括号结束，都可以使用，在子代码块中也可以使用
    - **成员变量**，主要用于面向对象，后续课程将会详细讲解
      - 定义：在类中进行定义，一般放在类声明后，方法之前
      - 使用：创建对象后，一般通过“**对象.成员变量**”使用；后续课程将会详细讲解
      - 作用域：对象存在，成员变量一直可以使用
    - 静态成员变量
      - 定义：与成员变量类似，多在类中进行定义
      - 使用，类定义后，在代码的任意位置都可以使用，并且是所有类的对象共用，一般通过“**类名.静态变量**”使用；后续课程将会详细讲解
      - 作用域：类加载后，一直可以使用

  - 应用实例

    - 实例1，按定义位置分类变量

      学生管理类

      ```java
      package com.bjpowernode.demo;
      
      /**
       * 学生管理类
       */
      public class StudentManagement {
          //静态变量
          public static int studentCount;     //学生数量
      
          //成员变量
          public String name;     //学生姓名
          public int age;         //年龄
          public double weight;   //体重
          public char sex;     //性别
      }
      ```

      学生管理测试类

      ```java
      package com.bjpowernode.demo;
      
      /**
       * 学生管理类测试类
       */
      public class StudentManagementTest {
          /**
           * 入口方法
           *
           * @param args 参数
           */
          public static void main(String[] args) {
              //局部变量
              String signInRoom;  //签到教室
              int seatNo;  //座位号
      
              //局部变量使用，直接使用
              //赋值
              signInRoom = "大阶梯教室1";
              seatNo = 15;
              //输出
              System.out.println("签到教室：" + signInRoom);
              System.out.println("座位号：" + seatNo);
      
              //成员变量使用，通过对象.属性名使用；必须先通过new关键字生成对象，才能使用，后续会讲
              StudentManagement studentManagement = new StudentManagement();
              //赋值
              studentManagement.name = "张三";
              studentManagement.age = 18;
              studentManagement.weight = 149.38;
              studentManagement.sex = '男';
              //输出
              System.out.println("姓名：" + studentManagement.name);
              System.out.println("年龄：" + studentManagement.age);
              System.out.println("体重：" + studentManagement.weight);
              System.out.println("性别：" + studentManagement.sex);
      
              //静态变量使用，通过类.属性名称
              //赋值
              StudentManagement.studentCount = 35;
              //studentManagement.studentCount = 24;  //可以，但尽量不要用这种方式
              //输出
              System.out.println("学生数量：" + StudentManagement.studentCount);
          }
      }
      ```

- **按数据类型分类**

  - **基本数据类型变量**
    - 变量定义时，变量类型为8种基本数据类型，就是基本数据类型变量
    - 上面实例代码的seatNo就是基本数据类型变量
    - 还有一些其他特性，后续会讲
    - 如：int myAge；doube price
  - **引用数据类型变量**（先了解，后面会详细讲解）
    - 变量定义时，如果不是8种基本数据类型，就是引用数据类型变量
    - 上面实例代码的signInRoom、StudentManagement就是引用数据类型变量
    - 还有一些其他特性，后续会讲
    - 如：String teacherName；StudentCourse studentCourse;

【练习】

1. 练习实例内容，完成代码编写

2. 编写程序，定义一个StudentCourse类，包含一个main方法，并定义如下变量，然后使用System.out输出这些变量：

   1. 定义成员变量学生姓名、课程、学分、是否主课
   2. 定义局部变量成绩（小数）
   3. 定义静态变量学生选课计数，用于每创建一个对象这个值加1

   最后，在main方法中测试这个类的多个对象，并赋值、修改、再输出

### 基本数据类型应用

#### 概述

- 8种基本数据类型在实际的开发过程中应用非常广泛
- 需要熟练掌握基本数据类型的应用

#### 整数型

- 类型关键关：**byte**、**short**、**int**、**long**

- 占用字节数：1、2、4、8

- 对应字面量：普通整数，默认为int类型；如果赋值给其他类型，会进行自动类型转换；如果需要赋值给long类型变量，则可在字面量后加L标记该字面量为long类型，如250L

- 应用场景：

  - 实际需求中表达一些数值，如年龄、数量等
  - 有些场景也用于表达几种不同的情况，如某个业务返回中，0表示成功、999表示失败、1表示请求数据格式不正确

- 注意：**整数字面量默认是int类型的字面量**，如98、257等

- 应用实例

  - 实例1，int类型字面量、long类型字面量

    ```java
    //定义int类型变量，并赋值；使用int类型最大值赋值
    int intVariable = 2147483647;   //整数默认为int类型字面量
    //输出
    System.out.println("int类型：" + intVariable);
    
    //定义long类型变量，并赋值；使用int类型最大值+1赋值，必须添加L后缀，表示long类型字面量
    long longVariable = 2147483648L;   //尾部添加L，标识是long类型的字面量
    //输出
    System.out.println("long类型：" + longVariable);;
    ```

  - 实例2，整数型变量之间的赋值

    ```java
    //变量定义
    byte byteVariable = 10; //正常操作，换成128呢?
    short shortVariable = 20;       //正常操作，换成65535呢？
    int intVariable = 30;   //正常操作
    long longVariable = 40; //正常操作
    
    //变量间相互赋值
    longVariable = intVariable;     //正常
    longVariable = shortVariable;   //正常
    longVariable = byteVariable;    //正常
    
    intVariable = longVariable;     //异常
    intVariable = shortVariable;    //正常
    intVariable = byteVariable;     //正常
      
    shortVariable = longVariable;   //异常
    shortVariable = intVariable;    //异常
    shortVariable = byteVariable;   //正常
    
    byteVariable = longVariable;   //异常
    byteVariable = intVariable;    //异常
    byteVariable = shortVariable;  //异常
    ```

  - 实例3，超出类型数值范围，会报错；强制转换，则会导致数据失真

    ```java
    byte byteVariable = 127;    //正常
    byte byteVariable = 129;    //报错,字面量是int类型数值范围内，但超过了byte类型的最大长度
    byte byteVariable = (byte)129;    //编译正常，但会导致数据失真，数据没有意义，使用的是强制类型转换
    
    long longVariable = 1234567890123;   //报错，字面量超过int类型数值范围
    long longVariable = 1234567890123L;    //正常，字面量调整为long类型，在long类型范围内
    ```

【练习】

1. 练习实例内容，完成代码编写

#### 浮点型

- 类型关键关：**float**、**double**

- 占用字节数：4、8

- 对应字面量：普通小数，默认为double类型；如果赋值给其浮点类型，会进行自动类型转换；如果需要赋值给float类型变量，则可在字面量后加F标记该字面量为float类型，如250f

- 应用场景：

  - 实际需求中表示带小数的数据，如存款余额、完成比例等
  - 有些还要考虑小数位置、精度问题、四舍五入等情况

- 注意：**小数字面量默认是double类型的字面量**，如3.5、2500.48等

- 应用实例

  - 实例1，float类型字面量

    ```java
    //定义float类型变量，并赋值
    float floatVariable = 168.88F;   //尾部添加F，标识是float类型的字面量
    //输出
    System.out.println("float类型：" + floatVariable);
    
    //定义double类型变量，并赋值
    double doubleVariable = 168.88;   //小数默认为double类型字面量
    //输出
    System.out.println("double类型：" + doubleVariable);
    ```

    

  - 实例2，浮点型变量之间的赋值

    ```java
    //定义float类型变量
    float floatVariable = 25.0;     //异常，将更长的默认double类型的字面量赋值给float
    float floatVariable = 25.0f;    //正常，使用float类型字面量赋值给float类型变量
    float floatVariable = (float)25.0;    //正常，使用强制类型转换
    
    //定义double类型变量
    double doubleVariable = 38.0;       //正常
    
    //变量相互赋值
    doubleVariable = floatVariable;     //正常，会进行自动数据类型转换
    floatVariable = doubleVariable;     //异常，不能将double类型的变量赋值给float
    floatVariable = (float)doubleVariable;     //正常，但强制类型转换会带来精度丢失
    ```

  - 实例3，超出类型精度范围，会导致精度丢失

    ```java
    //float类型能保证6到7位的精度
    float floatVariable1 = 0.1234567F;
    System.out.println("float类型（未丢失精度）：" + floatVariable1);
    float floatVariable2 = 0.123456789F;
    System.out.println("float类型（丢失精度）：" + floatVariable2);
    
    //double类型能保证16到17位的精度
    double doubleVariable1 = 0.1234567890123456;
    System.out.println("double类型（未丢失精度）：" + doubleVariable1);
    double doubleVariable2 = 0.1234567890123456789;
    System.out.println("double类型（丢失精度）：" + doubleVariable2);
    ```

【练习】

1. 练习实例内容，完成代码编写

#### 字符型

- 类型关键关：char

- 占用字节数：2（支持中文）

- 对应字面量：以单引号''包括起来，包含一个单一的字母、汉字或特殊字符，如'a'、'爱',29233等

- 应用场景：

  - 主要用于表达单个字符的需求，应用不是太广泛

- 应用实例

  - 实例1，正常使用

    ```java
    //定义字符变量
    char myWord = 'a';
    //输出
    System.out.println(myWord);
    ```

  - 实例2，尝试使用多个字符定义字符类型字面量，会产生编译错误

    ```java
    //定义字符变量
    char myWord = 'ab';		//此处会产生编译错误
    //输出
    System.out.println(myWord);
    ```

  - 实例3，使用中文

    ```java
    //定义字符变量
    char myWord = '爱';
    //输出
    System.out.println(myWord);
    ```

  - 实例4，使用整数

    ```java
    //定义字符变量
    char myWord = 29233;   //换成97试试
    //输出
    System.out.println(myWord);
    ```

  - 实例5，使用转义字符

    ```java
    //定义字符变量
    char myWord = '\t';  //换成\n试试
    //输出
    System.out.println("我的字符：|" + myWord + "|");
    ```

【练习】

1. 练习实例内容，完成代码编写

#### 布尔型

- 类型关键关：boolean

- 对应字面量：true、false

- 应用场景：

  - 多用于表达是与否的判断，如婚否、是否有小孩、是否感染过
  - 一些表达式计算后返回的也是布尔型的结果，如逻辑表达式、关系表达式

- 应用实例

  - 实例1，常用方式

    ```java
    //布尔型变量
    boolean isRichMan = true;   //真
    boolean isSuperMan = false; //假
    boolean isHaHa = "true";    //是否可以？
    ```

【练习】

1. 练习实例内容，完成代码编写

#### 数据类型转换

- 在实际的项目中，由于存在异构系统间的交互等原因，很多情况下会存在基本数据类型之间的相互转换

- 转换分为自动类型转换和强制类型转换，其特点为

  - **自动类型转换**

    - 如果是所占字节数小的变量或字面量赋值给所占字节数长的变量或字面量，程序会自动进行类型转换，不需要代码干预

    - 应用实例

      - 实例1，自动类型转换分类

        ```java
        package com.bjpowernode.demo;
        
        /**
         * 数据类型转换
         */
        public class TypeConvertDemo {
            /**
             * 入口方法
             * @param args
             */
            public static void main(String[] args) {
                //1、字面量自动类型转换
                long longVariable = 2563;       //2563默认是int类型字面量，赋值给long类型变量，自动进行类型转换
        
                //2、变量自动类型转换
                float floatVariable = 9.123456f;
                double doubleVariable = floatVariable;      //floatVariable是float类型的变量，赋值给double类型的变量，自动进行类型转换
        
                //3、表达式自动类型转换
                int first = 25;
                long result = first + 37;   //int类型的变量与int类型的字面量进行计算后，赋值给long类型的变量，自动进行类型转换
        
                //4、方法返回值自动类型转换
                //...学习完方法后处理
            }
        }
        ```

      - 实例2，自动类型转换实例

        ```java
        package com.bjpowernode.demo;
        
        /**
         * 自动类型转换实例
         */
        public class TypeConvertDemo {
            /**
             * 入口方法
             * @param args
             */
            public static void main(String[] args) {
                //1、byte转其他
                byte byteVariable = 10;
                short shortVariable = byteVariable;
                int intVariable = byteVariable;
                long longVariable = byteVariable;
                float floatVariable = byteVariable;
                double doubleVariable = byteVariable;
                
                //2、short转其他
                intVariable = shortVariable;
                longVariable = shortVariable;
                floatVariable = shortVariable;
                doubleVariable = shortVariable;
                //byteVariable = shortVariable;       //异常，需要强制类型转换
        
                //3、int转其他
                longVariable = intVariable;
                floatVariable = intVariable;
                doubleVariable = intVariable;
                //byteVariable = intVariable;       //异常，需要强制类型转换
                //shortVariable = intVariable;       //异常，需要强制类型转换
        
                //4、long转其他
                floatVariable = longVariable;
                doubleVariable = longVariable;
                //byteVariable = longVariable;       //异常，需要强制类型转换
                //shortVariable = longVariable;      //异常，需要强制类型转换
                //intVariable = longVariable;        //异常，需要强制类型转换
        
                //5、float转其他
                doubleVariable = floatVariable;
                //byteVariable = floatVariable;       //异常，需要强制类型转换
                //shortVariable = floatVariable;      //异常，需要强制类型转换
                //intVariable = floatVariable;        //异常，需要强制类型转换
                //longVariable = floatVariable;        //异常，需要强制类型转换
        
                //6、double转其他
                doubleVariable = doubleVariable;
                //byteVariable = doubleVariable;       //异常，需要强制类型转换
                //shortVariable = doubleVariable;      //异常，需要强制类型转换
                //intVariable = doubleVariable;        //异常，需要强制类型转换
                //longVariable = doubleVariable;        //异常，需要强制类型转换
                //floatVariable = doubleVariable;       //异常，需要强制类型转换  
        
                //7、char转byte
                char charVariable = 65;
                //byteVariable = charVariable;            //异常，需要强制类型转换
                
                //8、byte转char
        //        charVariable = byteVariable;            //异常，需要强制类型转换
            }
        }
        ```

  - **强制类型转换**

    - 如果是将所占字节数长的变量或字面量赋值给所占字节数小的变量，一般需要强制转换

    - 强制类型转换可能**会导致数据失真或数据精度丢失**

    - 强制类型转换语法：

      ```java
      目标数据类型 变量 = (目标数据类型)变量或表达式;
      ```

    - 如：long类型的变量赋值给short类型的变量，需要手动进行强制转换

    - 应用实例

      - 应用实例1，强制类型转换

        ```java
        package com.bjpowernode.demo;
        
        /**
         * 数据类型转换
         */
        public class TypeConvertDemo {
            /**
             * 入口方法
             * @param args
             */
            public static void main(String[] args) {
                //1、字面量强制类型转换
                byte byteVariable1 = 127;           //成功，127默认是int类型字面量，赋值给byte类型变量，如果不超过2的7次方-1，即127，自动进行类型转换
                byte byteVariable2 = 128;           //失败，不是short数据的范围，不能进行自动类型转换
                byte byteVariable3 = (byte) 129;    //语法成功，人工进行【强制类型转换】，会导致数据失真，结果为-127
        
                //2、变量强制类型转换
                double doubleVariable = 0.123456789012345;
                float floatVariable1 = doubleVariable;           //失败，不能将所占字节数长的的变量直接赋值给所占字节数少的变量，不能进行自动类型转换
                float floatVariable2 = (float)doubleVariable;    //语法成功，人工进行【强制类型转换】，会有精度丢失
        
                //3、表达式强制类型转换
                long first = 25;
                int intVariable1 = first + 37;        //失败，long类型的变量与int类型的字面量进行计算后，将会是long类型，赋值给int类型的变量，不能进行自动类型转换
                int intVariable2 = (int)(first + 37);   //语法成功，人工进行【强制类型转换】，会导致数据失真
        
                //4、方法返回值强制类型转换
                //...学习完方法后处理
            }
        }
        ```

- 如果需要进行类型转换，遵守以下原则

  - 8种基本数据类型中，除boolean 类型、char类型不能转换，剩下6种类型之间都可以进行转换
  - 如果int类型字面量没有超出 byte,short,char 的取值范围，可以直接将其赋值给byte,short,char 类型的变量，会进行自动类型转换
  - 所占字节数小的向所占字节数大转换可进行自动类型转换，其排序为：**byte > short > int > long > float > double**
  - 所占字节数大的向所占字节数小转换需要进行强制类型转换，使用格式为”(强制转换类型)"格式进行，并且运行时可能出现数据失真或数据精度损失，**谨慎使用** 
  - byte,short,char 类型混合运算时，先各自转换成int 类型再做运算
  - 多种数据类型混合运算，各自先转换成容量最大的那一种再做运算

【练习】

1. 练习实例内容，完成代码编写

#### 原码、补码和反码【扩展】

**问题**：下面的代码，是否有问题？

```java
byte byteVariable = (byte) 129;    //语法成功，人工进行【强制类型转换】，会导致数据失真，输出结果为-127
```

**答**：是因为将一个大于byte最大值127的值强制赋值给了byte类型变量，导致数据失真

- 这其实涉及到了一个计算机中有符号数表示问题，**了解即可**
- 计算机中的有符号数有三种表示方法，即原码、反码和补码。三种表示方法均有**符号位**和**数值位**两部分，符号位（第1位）都是用0表示“正”，用1表示“负”，而数值位，三种表示方法各不相同
- 并且，在计算机系统中，数值一律用补码来表示和存储
- 原码、反码和补码的规则如下
  - **正数**：原码、反码、补码一样
  - **负数**：原码转换成二进制表示后，非符号位取反，得到反码；加1，得到补码
- 上面的问题中，整数129转byte后的过程如下：
  1. 129是int类型的原码（未强制转换前，4个字节，32位），二进制表示法为**0**000000 0000000 0000000 10000001，
  2. 使用（byte）进行强制转换后，直接截取后8位，作为byte类型字面量的**补码**，即10000001
  3. 由于byte存储的是有符号的数，故**补码**为上述的**1**0000001，其中粗体1为符号位
  4. **反码**为补码减1，得到**1**0000000
  5. **补码**为反码取反，得到**1**1111111
  6. 重新输出后，会输出的byte类型的二进制转十进制的值-127

### 字符串

#### 概述

- 字符串是Java语言体系里最重要的一种引用数据类型
- 在实际的业务中，应用广泛
- Java的基础工具包中，提供了很多对字符串进行操作的方法
- 类型名称为String

#### 语法

- 定义

```java
//方式1，使用字面量直接赋值
String s1 = "helloworld";
//方式2，使用常用新建对象方式赋值
String s2 = new String("helloworld");
```

- 字符串类型的变量一般用来存储一串文字信息

- 字符串可以跟任意类型的数据进行拼接得到新的字符串，拼接使用字符串连接运算符“+”，如

```java
String firstName = "shirley";
String lastName = "yang";
String fullName = firstName + lastName +18;
```

#### 字符串比较

- String是一个相对特殊的类型，属于引用数据类型的异类，后续大家慢慢会学习到
- 当希望比较两个字符串是否相等时，不能使用后面学习的运算符"=="进行，会有副作用
- 建议使用字符串的equals方法进行比较

#### 常用方法

- length：返回字符串长度
- trim：去掉字符串首、尾空格，不能去掉中间的空格
- isEmpty：判断字符串是否为空字符串
- equals：比较两个字符串是否相同，包括大小写也要完全一致；运算符也是比较是否相同，但一般尽量使用equals比较，有一些副作用
- equalsIgnoreCase：比较两个字符串是否相同，忽略大小写
- contains：判读一个字符串是否包含另外一个字符串
- startsWith：判读一个字符串是否以另外一个字符串作为开头
- endsWith：判读一个字符串是否以另外一个字符串作为结尾
- replace：将字符串中指定的内容替换成新的内容
- substring：取字符串的子串，可指定子串开始位置、结束位置，序号从0开始
- toUpperCase：字符串转换成大写
- toLowerCase：字符串转换成小写
- indexOf：在字符串中查找子字符串第一次出现的位置 
- lastIndexOf：在字符串中查找子字符串最后一次出现的位置 
- split：将字符串使用指定的内容作为分隔，转换成新的字符串数组；数组的内容在后面会学习
- toCharArray：转换成字符数组，即char数组；数组的内容在后面会学习
- ...

#### 应用实例

- 应用实例1，字符串常用方法

  ```java
  package com.bjpowernode.demo;
  
  /**
   * 字符串
   */
  public class StringDemo {
      /**
       * 入口方法
       * @param args
       */
      public static void main(String[] args){
          //1、字符串定义
          System.out.println("----------------------1、字符串定义与拼接----------------------");
          String firstName = "shirley";
          String lastName = "yang";
          String fullName = firstName + " " + lastName;
          System.out.println("全名："+fullName);
  
          //2、转义符，Java字符串中可使用\开头进行转义【扩展】
          System.out.println("----------------------2、转义符【扩展】----------------------");
          String escape = "我叫\"铁蛋\"。\n我的家在东北。\\";
          System.out.println(escape);
  
          //3、常用方法
          System.out.println("----------------------3、常用方法----------------------");
          String normalStr = " 胖子，快跑。 ";
          //3.1、length
          System.out.println("--------length()--------");
          System.out.println("normalStr.length()："+normalStr.length());
          //3.2、trim
          System.out.println("--------trim()--------");
          System.out.println("normalStr.trim()："+normalStr.trim());
          System.out.println("normalStr.trim().length()："+normalStr.trim().length());
          //3.3、isEmpty
          System.out.println("--------isEmpty()--------");
          System.out.println("normalStr.isEmpty()："+normalStr.isEmpty());
          String emptyStr = "";
          System.out.println("emptyStr.isEmpty()："+emptyStr.isEmpty());
          //3.4、equals
          System.out.println("--------equals()--------");
          System.out.println("normalStr.equals(\" 胖子，快跑。 \")："+normalStr.equals(" 胖子，快跑。 "));
          System.out.println("normalStr.equals(\"胖子，快跑。\")："+normalStr.equals("胖子，快跑。"));
          //equals与==在有些时候相同【扩展】
          String compareStr = " 胖子，快跑。 ";
          System.out.println("normalStr.equals(compareStr)："+normalStr.equals(compareStr));
          System.out.println("normalStr == compareStr："+(normalStr==compareStr));
          //==的副作用【扩展】
          String compareStr1 = " 胖子，";
          String compareStr2 = "快跑。 ";
          System.out.println("normalStr.equals(compareStr1+compareStr2)："+normalStr.equals(compareStr1+compareStr2));
          System.out.println("normalStr==(compareStr1+compareStr2)："+(normalStr==(compareStr1+compareStr2)));
          //3.5、equalsIgnoreCase
          System.out.println("--------eqaulsIgnoreCase()--------");
          String equalsIgnoreCaseStr1 = "I am Shirley Yang.";
          String equalsIgnoreCaseStr2 = "i am shirley yang.";
          System.out.println("equalsIgnoreCaseStr1.equals(equalsIgnoreCaseStr2)："+equalsIgnoreCaseStr1.equals(equalsIgnoreCaseStr2));
          System.out.println("equalsIgnoreCaseStr1.equalsIgnoreCase(equalsIgnoreCaseStr2)："+equalsIgnoreCaseStr1.equalsIgnoreCase(equalsIgnoreCaseStr2));
          //3.6、contains()
          System.out.println("--------contains()--------");
          System.out.println("\"胖子，快跑。\".contains(\"快跑\")："+"胖子，快跑。".contains("快跑"));
          System.out.println("\"胖子，快跑。\".contains(\"胖子\")："+"胖子，快跑。".contains("胖子"));
          System.out.println("\"胖子，快跑。\".contains(\"瘦子\")："+"胖子，快跑。".contains("瘦子"));
          //3.7、startsWith()/endsWith()
          System.out.println("--------startsWith()/endsWith()--------");
          System.out.println("\"胖子，快跑。\".startsWith(\"快跑\")："+"胖子，快跑。".startsWith("胖子"));
          System.out.println("\"胖子，快跑。\".startsWith(\"快跑\")："+"胖子，快跑。".startsWith("快跑"));
          System.out.println("\"胖子，快跑。\".endsWith(\"。\")："+"胖子，快跑。".endsWith("。"));
          System.out.println("\"胖子，快跑。\".endsWith(\"快跑\")："+"胖子，快跑。".endsWith("快跑"));
          //3.8、replace
          System.out.println("--------replace()--------");
          String replaceStr = "我是铁蛋，家在东北3省，说正经的普通话，电话：13987654321。";
          System.out.println("replaceStr.replace(\"，\",\"-\")"+replaceStr.replace("，","-"));
          //3.9、replaceAll、支持正则表达式【扩展】
          System.out.println("--------replaceAll()，支持正则表达式【扩展】--------");
          System.out.println("replaceStr.replace(\"\\d\",\"-\")的结果："+replaceStr.replace("\\d","-"));
          System.out.println("replaceStr.replaceAll(\"\\d\",\"-\")的结果："+replaceStr.replaceAll("\\d","-"));
          //3.10、substring
          System.out.println("--------substring()--------");
          System.out.println("\"胖子，快跑。\".substring(3)："+"胖子，快跑。".substring(3));
          System.out.println("\"胖子，快跑。\".substring(3,4)："+"胖子，快跑。".substring(3,4));
          //3.11、toUpperCase
          System.out.println("--------toUpperCase()--------");
          System.out.println("\"I am Shirley Yang.\".toUpperCase()："+"I am Shirley Yang.".toUpperCase());
          //3.12、toLowerCase
          System.out.println("--------toLowerCase()--------");
          System.out.println("\"I am Shirley Yang.\".toLowerCase()："+"I am Shirley Yang.".toLowerCase());
          //3.13、indexOf
          System.out.println("--------indexOf()--------");
          System.out.println("\"I am Shirley Yang, I am from the United States, and I am an ABC.\".indexOf(\"am\")："+"I am Shirley Yang, I am from the United States, and I am an ABC.".indexOf("am"));
          System.out.println("\"I am Shirley Yang, I am from the United States, and I am an ABC.\".indexOf(\"am\",5)："+"I am Shirley Yang, I am from the United States, and I am an ABC.".indexOf("am",5));
          System.out.println("\"I am Shirley Yang, I am from the United States, and I am an ABC.\".indexOf(\"aaaa\")："+"I am Shirley Yang, I am from the United States, and I am an ABC.".indexOf("aaaa"));
          //3.14、lastIndexOf
          System.out.println("--------lastIndexOf()--------");
          System.out.println("\"I am Shirley Yang, I am from the United States, and I am an ABC.\".lastIndexOf(\"am\")："+"I am Shirley Yang, I am from the United States, and I am an ABC.".lastIndexOf("am"));
          System.out.println("\"I am Shirley Yang, I am from the United States, and I am an ABC.\".lastIndexOf(\"aaaa\")："+"I am Shirley Yang, I am from the United States, and I am an ABC.".lastIndexOf("aaaa"));
          //3.15、split
          System.out.println("--------split()--------");
          String splitStr = "I am Shirley Yang.";
          String[] splitArr = splitStr.split(" ");    //空格划分成数组
          for(int i=0;i<splitArr.length;i++) {
              System.out.println(splitArr[i]);
          }
          //3.16、toCharArray
          System.out.println("--------toCharArray()--------");
          String charStr = " 胖子，快跑。 ";
          char[] charArr = charStr.toCharArray();
          for(int i=0;i<charArr.length;i++) {
              System.out.println(charArr[i]);
          }
      }
  }
  ```

#### 常用转义符

![](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202308301530476.jpg)

<center>常用转义符（图片来自网络）</center>

【练习】

1. 练习实例内容，完成代码编写

2. 编写程序，从字符串"I am Shirley Yang, I am from the United States, and I am an ABC."中提取子字符串，要求如下：

   1. 提取子字符串"I am from the United States"（注意，不能直接指定开始位置序号和结束位置序号实现）

   2. 将子串的每个单词隔行输出，效果如下：

      I

      am

      from

      the

      United

      States

### 数组

#### 概述

- 数组是一种基础数据结构，用于在内存中的连续空间存放一组相同类型的数据，是Java中常见的数据结构和存储结构之一
- 使用**[]**，并结合**new**做为定义关键符号和关键字
- 常见的有一维数组和二维数组

#### 特点

* **固定大小**：数组的容量是确定的，也就是说在定义数组的时候必须指定数组的大小
* **固定数据类型：**数组的类型是确定的，也就是在定义数组的时候必须声明数组的类型，一种类型的数组只能存放一种类型的数据；数据类型可以是8种基本数据类型和引用数据类型
* **通过下标（索引）访问**，下标从0开始，如0、1、2、...，但不能超过数组定义的长度越界访问，越界访问将会产生ArrayIndexOutOfBoundsException异常

#### 一维数组

##### 创建一维数组

**语法一**：定义数组，然后赋值

```java
//定义数组
数据类型[] 数组名 = new 数据类型[数组的长度];

//给数组元素赋值
数组名[x] = 字面量或变量;	//x表示下标，从0开始，可以是0、1、2、...，但不能超过数组长度
```

示例

```java
//【基本数据类型】
//定义数组，但不赋值，后续代码赋值，int类型数组，数组长度为2，可访问下标为0、1
int[] intArray = new int[2];

//赋值
intArray[1] = 15;

//输出数组内容
System.out.println(intArray[0]);    //此时输出int类型的默认值0，但引用数据类型为null
System.out.println(intArray[1]);    //此时输出设置的值15
//System.out.println(intArray[2]);  //数组下标越界，将会产生异常

//【引用数据类型】
//字符串类型
String[] names = new String[3];
names[0] = new String("1111");
names[1] = "2222";
names[2] = "3333";

//自定义数据类型
Student[] students = new Student[2];
students[0] = new Student();
students[1] = new Student();
```

**语法二**：定义数组，直接赋值

```java
数据类型[] 数组名 = {值1,值2,值3,值4};
```

示例

```java
//定义数组，并直接赋值，char类型数组，数组长度为6，可访问下标为0、1、2、3、4、5
char[] charArray = {'我','是','中','国','人','。'};

//输出数组内容，通过下标访问获取值
System.out.println(charArray[0]);
System.out.println(charArray[1]);
System.out.println(charArray[2]);
System.out.println(charArray[3]);
System.out.println(charArray[4]);
System.out.println(charArray[5]);
//System.out.println(charArray[6]);     //数组下标越界，将会产生异常
```

##### 获取数组长度属性

```java
数组名.length;
```

示例

```java
//定义数组
int[] temp = new int[28];

//输出长度
System.out.println(temp.length);
```

##### 下标（索引）规则

* 下标可以是整数类型的字面量、变量、表达式

* 下面的代码，使用了变量作为len作为长度定义和下标访问

  ```java
  //定义长度变量
  int len = 5;
  //定义数组，使用变量
  int[] temp = new int[len];
  temp[0] = 1;
  temp[1] = 5;
  temp[2] = 8;
  temp[len - 1] = 45;    //给指定下标的元素赋值，使用变量
  
  //输出
  System.out.println(temp[len - 1]);    //获取指定下标的元素，使用变量
  ```

#### 二维数组【扩展】

内部元素仍然是一维数组的数组。（数组的内部元素不是单个的数据，而是一维数组）

##### 创建二维数组

语法一：创建了一个数组，但是没有初始化数组的元素，这种情况需要显示指定数组的大小。

```java
数据类型[][] 数组名 = new 数据类型[一维长度][二维长度];
```

语法二：创建一个数组，并对二维数组内部每个数组的所有元素进行初始化

```java
数据类型[][] 数组名 = {{值1，值2}，{值1，值2}，{值1，值2}};
如：int[][] myArr = {{1,2},{3,4},{5,6}};
```

##### 二维数组赋值

对数组赋值的方式

* 在创建数组的时候赋值

* 通过操作索引来赋值

  ```java
  int[][] temp = new int [2][3];
  //取出第一个数组赋值：
  temp[0][0] = 11;
  temp[0][1] = 21;
  temp[0][2] = 31;
  //取出第二个数组赋值：
  temp[1][0] = 41;
  temp[1][1] = 51;
  temp[1][2] = 61;
  ```

##### 二维数组取值

* 通过索引来取值

* int [][]a = {{1,2},{3,4},{5,6}};
  索引：开始：0，结束：2。

  示例：

  * 取第一个元素：a[0]；取出此数组的所有内部元素：a\[0][0]，a\[0][1]
  * 取第二个元素：a[1]；取出此数组的所有内部元素：a\[1][0]，a\[1][1]
  * 取第三个元素：a[2]；取出此数组的所有内部元素：a\[2][0]，a\[2][1]

【练习】

1. 练习实例内容，完成代码编写
2. 编写程序，定义一个int类型一维数组，存放一组学号，赋值，并输出
3. 编写程序，定义一个String类型的一维数组，存放一组学生姓名，赋值，并输出

### 包

#### 包的作用

- 类似于目录，对复杂项目中各种资源合理分配
- 区分Java世界中各种同名的类
- 结合访问修饰符做一定的访问限定

#### 包的规则

- 利用**企业或组织申请的域名天然的唯一特性**，使用其**倒置形式**
- 同时，**附加以企业不同项目的不同特性，组合构成**
- 包是像域名一样具备层次的，各个**包与子包间使用点（.）分隔**
- 并且，在源代码规划时，要创建与包层次一致的目录，如类HelloWorld.java定义的包层次为com.bjpowernode.portal，则需要在com\bjpowernode\portal目录下创建HelloWorld.java文件，编译的HelloWorld.class文件也遵循此规则
- 例如，动力节点公司的域名是www.bjpowernode.com，则一般约定使用com.bjpowernode作为包前缀，就不会与世界上的其他公司的前缀相同；同时，不同项目，添加不同的子包，就组成了完整的包，如
  - 门户网站项目，使用包名com.bjpowernode.portal
  - 学生管理项目，使用包名com.bjpowernode.student.management
  - 学生毕业后服务项目，使用包名com.bjpowernode.student.graduation.service

#### 创建包

- 使用**package**关键字定义

- 一般置于源文件的首行

- 包名称全部小写

- 并将源代码按照所在的包，规则好目录层次存放

- 应用实例

  - 实例1，定义包，并定义HomePage类

  ```java
  package com.bjpowernode.portal;
  
  /**
   * 首页
   */
  public class HomePage {
      /**
       * 欢迎
       */
      public void welcome(){
          System.out.println("你好，欢迎光临！");
      }
  }
  ```

#### 导入包

- 使用**import**关键字导入类或包

- 使用非当前包以外的类时，需要导入类或包

- 应用实例，

  - 实例1，导入方式1，直接导入类，一般在当前类包定义后，类定义前导入

    ```java
    package com.bjpowernode.demo;
    
    //方式1：直接导入类
    import com.bjpowernode.portal.HomePage;
    
    public class Main {
    
        public static void main(String[] args) {
            //使用了com.bjpowernode.portal下的HomePage类
            HomePage homePage = new HomePage();
            
            //使用对象的方法
            homePage.welcome();
      }
    }
    ```

  - 实例2，方式2，直接导入类所在包，一般在当前类包定义后，类定义前导入

    ```java
    package com.bjpowernode.demo;
      
    //方式2：直接导入包
    import com.bjpowernode.portal.*;
      
    public class Main {
      
        public static void main(String[] args) {
            //使用了com.bjpowernode.portal下的HomePage类
            HomePage homePage = new HomePage();
            
            //使用对象的方法
            homePage.welcome();
         }
    }  
    ```

    

  - 实例3，方式3，不导入，直接在使用类时，使用全限定名

    ```java
    package com.bjpowernode.demo;
    
    public class Main {
    
        public static void main(String[] args) {
          //方式3：直接在使用类时，使用全限定名
            //使用了com.bjpowernode.portal下的HomePage类
          com.bjpowernode.portal.HomePage homePage = new com.bjpowernode.portal.HomePage();
            
          //使用对象的方法
            homePage.welcome();
      }
    }
    ```

  

#### Java中的包

##### 概述

- Java的类库中提供了众多基础的包，用于方便Java程序开发
- 这些包中的很多类，都需要掌握其使用方法，如String、System等

##### Java中常用的包

- java.lang包，包中包含了String、System、包装类、反射相关子包等很多 类；此包下的类可直接使用，无需导入
- java.util包，包中包含了UUID、集合相关等很多类
- java.io包，包中包含了IO相关的很多类
- java.sql包，包含了数据库操作的很多类
- java.rmi包，包含了RMI相关的很多类
- java.awt包，包含了传统图形化界面的很多类
- ...，还有很多包，以及javax开头的扩展包

【练习】

1. 练习实例内容，完成代码编写
2. 【扩展】编写程序，
   1. 分别定义com.bjpowernode.portal包和com.bjpowernode.demo包
   2. 在com.bjpowernode.portal包下定义MyTool类，包含name成员变量
   3. 在com.bjpowernode.demo包下定义入口main方法，在main方法中导入MyTool类使用，设置并输出name属性（成员变量），使用包的3种引入方式

### 实战和作业

1. 提问：

   1. char 类型变量能不能储存一个中文的汉字，为什么？
   2. float f = 1.0; 代码有问题吗?为什么？
   3. long a = 2147483648; 代码有问题吗?为什么？
   4. char c = 65536; 有问题吗？为什么?
   5. int[] temp={1,2,3}；中的temp是基本数据类型还是引用数据类型？

2. 通过变量来描述学生信息，学生信息包括学号（整型）、姓名（字符串类型）、性别（字符型）、身高（浮点型）、是否为超人（布尔型）；并定义两个学生信息，并按行输出；具体如下图：

   <img src="D:/sz2308/1-%25E8%25AF%25BE%25E4%25BB%25B6/images/part3-homework1.jpg" />

3. 编写程序，练习如下的数组操作，预习了流程控制的同学，也可以使用循环实现输出

   * 请使用两种语法创建数组并输出，数组的元素为{"我","是","最","棒","的"}
   * 请使用两种语法创建数组并输出，数组的元素为{100,200,300,400,500}

4. 编写程序，从英文语句中统计单词个数，有英文语句字符串"I am Shirley Yang, I am from the United States, and I am an ABC."，输出字符串长度、英语单词个数（不考虑去重）