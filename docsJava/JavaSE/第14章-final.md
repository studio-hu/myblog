---
sidebar_position: 14
---
### 概述

- final，最终的，就如字面意义，是Java语法中一个重要的关键字
- 主要作用有：
  - **修饰类**，表示该类为最终类，**不能被继承**
  - **修饰变量**，表示变量值**不能被修改**，转化成了**常量**
  - **修饰方法**，表示该方法**不能被覆盖**

### 修饰类

- Java中的类，只要可访问，就能随意的扩展，定义其子类、孙子类等；但在有些情况下，我们是不希望某些类具备子类的；像String类

- 此时，就可以使用final关键字将类定义为最终类，让其不能被继承

- 应用实例

  - 应用实例1，下面的代码是否正确？

    ```java
    package com.bjpowernode.demo;
    
    /**
     * 人类
     */
    public final class People {
    }
    ```

    ```java
    package com.bjpowernode.demo;
    
    /**
     * 中国人类
     */
    public class ChinaPeople extends People {
    }
    ```

### 修饰变量

- 在一些应用场景，变量被赋值之后，希望不能被修改

- 此时，就可以使用final关键字将变量转换成常量，就具备了不可修改特性

- 常量名多使用全大写、下横线连接方式，如MIN_VALUE、HOST_URL_PREFIX等

- 常量主要应用

  - **修饰局部变量**，局部变量就变成了局部常量，**只能赋值一次**，且**常量不能被修改**
  - **修饰类成员变量**，必须赋初值，或使用延后赋值形式，在不同的构造方法中赋不同的值；如从的血型、参加工作时间等特征
  - 注意：
    - 引用类型的常量的子属性是可以修改
    - 接口中的成员变量，是静态常量，使用public static final修饰
    - 常量中尽量不要存放大对象

- 应用实例

  - 应用实例1，修饰成员常量，下面2段代码，是否正确？为什么？

    代码1

    ```java
    package com.bjpowernode.demo;
    
    /**
     * final示例，修饰成员常量
     */
    public class FinalDemo {
        //定义常量，url前缀
        public final String URL_PREFIX;
    }
    ```

    代码2

    ```java
    package com.bjpowernode.demo;
    
    /**
     * final示例，修饰成员常量，可直接初始化，也可以在构造方法中初始化，并且可以在不同的构造方法中初始化不同的值
     */
    public class FinalDemo {
        //修饰成员常量
        public final String URL_PREFIX;
    
        /**
         * 无参构造方法
         */
        public FinalDemo() {
            URL_PREFIX = "http://www.baidu.com";
        }
    
        /**
       * 有参构造方法
         */
      public FinalDemo(String urlPrefix) {
            URL_PREFIX = urlPrefix;
      }
    }
    ```

  - 应用实例2，修饰局部变量，基本数据类型常量，下面的代码是否正确？为什么？

    代码1

    ```java
    package com.bjpowernode.demo;
    
    /**
     * final示例,修饰基本数据类型常量，可在定义时赋值，也可以定义后再赋值，但不能修改常量值
     */
    public class FinalDemo {
        /**
         * 入口方法
         *
         * @param args
         */
        public static void main(String[] args) {
            //定义常量
            final int intVariable;
          //设置初始值
            intVariable = 5;
          //修改值，会有编译错误
            intVariable = 20;
      }
    }
    ```

  - 实例3，修饰局部变量，引用数据类型常量，下面2段的代码，是否正确？为什么？

    代码1

    ```java
    package com.bjpowernode.demo;
    
    /**
     * final示例，修饰引用数据类型，特点跟修饰基本数据类型常量一样，不能修改常量值
     */
    public class FinalDemo {
        //姓名
        private String name;
    
        /**
         * 入口方法
         *
         * @param args
         */
        public static void main(String[] args) {
            //定义常量
            final FinalDemo finalDemo;
          //设置初始值
            finalDemo = new FinalDemo();
          //修改值，会有编译错误
            finalDemo = new FinalDemo();
        }
    }
    ```

    代码2

    ```java
    package com.bjpowernode.demo;
    
    /**
     * final示例，修饰引用数据类型常量，虽然不能修改常量的值，但常量指向对象的子属性值可以修改
     */
    public class FinalDemo {
        //姓名
        String name;
    
        /**
         * 入口方法
         *
         * @param args
         */
        public static void main(String[] args) {
            //定义常量
            final FinalDemo finalDemo;
            //设置初始值
            finalDemo = new FinalDemo();
            //修改常量子属性值，可以修改
            finalDemo.name = "尼古拉斯";
            finalDemo.name = finalDemo.name + ".赵四";
        }
    }
    ```

  - 实例4，接口（类）中的静态常量

    工作接口

    ```java
    package com.bjpowernode.demo;
    
    /**
     * 工作接口
     */
    public interface IWork {
        //可以定义一些应用于工作实现类需要使用，与工作业务相关的静态常量，如一些阈值
        int MIN_AGE = 0;    //最小年龄
        int MAX_AGE = 150;  //最大年龄
        int MIN_WORK_AGE = 16;  //法定工作年龄
    //    int OTHER_AGE;      //常量必须初始化，否则会报错
    
        /**
         * 操作
         */
        void operating();
    }
    ```

    工作接口示例

    ```java
    package com.bjpowernode.demo;
    
    /**
     * 工作接口示例
     */
    public class WorkDemo {
        public static void main(String[] args) {
    //        IWork.MIN_AGE = 33;  //常量不能修改，会报错误
            
            //使用接口静态常量
            System.out.println("最小年龄：" + IWork.MIN_AGE);
            System.out.println("最大年龄：" + IWork.MAX_AGE);
            System.out.println("最小工作年龄：" + IWork.MIN_WORK_AGE);
        }
    }
    ```

### 修饰方法

- 在有一些应用场景中，在类可被任意扩展（被继承）的情况下，希望某些方法行为是不可被子类重新定义的（即不需要多态特性）

- 此时，也可使用final关键字修饰这些方法，使得子类不仅具备了该方法，且需要严格按照父类该方法的逻辑来完成业务

- 应用实例

  - 应用实例1，下面的代码是否正确？

    ```java
    package com.bjpowernode.demo;
    
    /**
     * 人类
     */
    public class People {
        /**
         * 打招呼
         */
        public final void speakHi(){
            System.out.println("打了个招呼。");
        }
    }
    ```

    ```java
    package com.bjpowernode.demo;
    
    /**
     * 中国人类
     */
    public class ChinaPeople extends People {
        /**
         * 打招呼
         */
        public void speakHi() {
            System.out.println("中国人打招呼。");
        }
    }
    ```

### 实战和作业

1. 练习演示的内容，完成代码编写
2. 重构程序，将第13章重构后的people项目中，做如下重构，要求如下
   1. 所有国家的人类都**国际歌**属性
   2. 每个国家人类都有**国歌**属性
   3. 中国人、越南人等国家的人，具备是否为社会主义国家属性，且值为是
   4. 给所有国家的人添加一种相同的鼓掌行为
   5. 创建一个新的国家类梵蒂冈，不具备派生能力