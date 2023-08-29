## 第2章-第一个Java程序

### 安装JDK

- 是进行**Java开发的前提条件**

- 可去官网下载，或使用附件中提供的安装包，注意安装**JDK8**（也叫JDK1.8）64位版本；安装过程中，使用默认目录即可

- 是否安装成功？进入命令行提示符界面，使用**java -version**命令，如果看到如下内容，表示安装成功、并完整配置了环境变量

  ![Java查看版本命令](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202308291602968.jpg)

  <center>Java查看版本命令</center>

- 安装成功后，会在默认目录（或指定目录）创建一系列支持文件，一般在**C:\Program Files\Java\jdk1.8.0_171**目录下

- 在安装目录下，主要包括下面几个目录和文件

  - **bin目录**，包含主要的程序编译、执行、打包、监控、诊断工具命令，如javac、java、jvisualvm等，主要命令有：
    - **javac**，编译.java源代码文件，生成字节码文件.class
    - **java**，执行Java类，找到其中的main方法入口，运行程序
  - **jre目录**，一个完整的Java运行环境目
  - **jre\lib目录**，包含Java类库和其他库文件，为Java程序提供最基础的依赖
  - include目录，通过c或c++实现，完成Java开发需要的一些头文件
  - db目录，一个小型的数据库，即JavaDB
  - src.zip文件，JDK核心类的源代码文件

<span style={{fontSize:"20px",fontWeight:"bold",color:"green"}}>【练习】</span>

1. 完成JDK安装，可去官网下载，或使用附件工具中的安装文件

### 设置环境变量

- 可选项，一般安装JDK时，都会默认配置好环境变量（也称快捷路径），但要了解其意义

- 主要是为了快捷使用JDK安装目录的bin目录下的命令，如可在任意目录下使用javac、java命令

- 常说的环境变量有两个，分别是

  - **JAVA_HOME**，Java安装目录位置，用于使用Java环境的工具快速找到Java环境，像Tomcat、IDEA等依赖Java的工具会在环境变量中查找此变量
  - **Path**，快捷命令目录，表示配置在该变量的目录下.exe、.bat等可执行文件，无需指定路径，可以直接运行；用于在任意位置快捷使用JDK自带的开发工具命令

- 设置方式（Windows 10操作系统）

  - **JAVA_HOME**

    1. 在桌面，“我的电脑”上右键，选择“属性”，打开设置弹窗，如下图；并点击“相关设置”下的“高级系统设置”

       ![环境配置-设置](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202308291603356.jpg)

    2. 会弹出”系统属性“弹窗，如下图；点击右下角的"环境变量(N)..."

       ![环境配置-系统属性](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202308291603196.jpg)

    3. 会弹出”环境变量“弹窗，如下图1；在”系统变量(S)"部分，下拉找到JAVA_HOME的配置（如果没有，则创建该变量），并双击或点击编辑，确保该系统变量的值为安装的JDK的根目录**C:\Program Files\Java\jdk1.8.0_171**，如下图

       <img src="D:/sz2308/1-%25E8%25AF%25BE%25E4%25BB%25B6/images/%25E7%258E%25AF%25E5%25A2%2583%25E9%2585%258D%25E7%25BD%25AE-%25E7%258E%25AF%25E5%25A2%2583%25E5%258F%2598%25E9%2587%258F-JAVA_HOME.jpg" />

       <center>图1</center>

       ![环境配置-编辑环境变量-JAVA_HOME](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202308291604007.jpg)

     <center>图2</center>

- **Path**

  1. 在桌面，“我的电脑”上右键，选择“属性”，打开设置弹窗，如下图；并点击“相关设置”下的“高级系统设置”

     ![环境配置-设置](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202308291603356.jpg)

  2. 会弹出”系统属性“弹窗，如下图；点击右下角的"环境变量(N)..."

     ![环境配置-系统属性](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202308291603196.jpg)

  3. 会弹出”环境变量“弹窗，如下图1；在”系统变量(S)"部分，下拉找到Path的配置，并双击或点击编辑

     ![环境配置-环境变量-Path](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202308291605544.jpg)

  4. 在弹窗中，要确保列表中包括了安装的JDK的bin目录的快捷路径配置，**C:\Program Files\Java\jdk1.8.0_171\bin**或**%JAVA_HOME%\bin**,如下图：**注意**：%JAVA_HOME%格式为引用其他环境变量语法

     ![环境配置-编辑环境变量-Path](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202308291606992.jpg)

  <span style={{fontSize:"20px",fontWeight:"bold",color:"blue"}}>【演示】</span>

  1. 使用附件\mycommand.bat文件演示配置环境变量与不配置的效果

  <span style={{fontSize:"20px",fontWeight:"bold",color:"green"}}>【练习】</span>

  1. 练习演示的内容，熟悉环境变量的作用
  2. **保证javac、java命令能直接运行**

### 开发第一个Java程序

#### 1、编写HelloWorld.java源代码

- 新建一个Java源文件HelloWorld.java，要注意：Java源代码文件的扩展名为.java，并且是一个文本文件（即与.txt文件一样）
- 按要求编写代码

```java
public class HelloWorld{
    public static void main(String[] args){
		System.out.println("Hello World!");
	}
}
```

代码解释：

- public: 访问控制修饰符，public表示任意地方都可以访问
- class：声明类的关键字 
- HelloWorld: 类名
- static: 静态特性修饰符，修改方法表示静态方法
- void: 表示无返回值
- main: java程序或应用的入口方法（函数），一般的非组件类型的项目，都会有一个main入口方法
- String [ ] args：参数数组
- System.out.println：打印到控制台的方法
- "Hello World"：打印字符串

<span style={{color:"red",fontWeight:"bold"}}>可能不懂，但没关系，先照着写，找点感觉，这些内容，我们会慢慢会展开讲！</span>

#### 2、运行HelloWorld类

- Java源代码编写完成后，并不能直接运行，需要使用**javac**命令编译成.class文件后，才能使用**java**命令运行

- 具体的过程如下图

  ![Java代码编译和运行](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202308291607694.jpg)

- 具体编译和运行步骤

  1. **编译**，使用javac命令进行编译（<span style={{color:"red"}}>注意：编译的是源文件</span>）

     - 编译成功，会在.java文件目录生成一个字节码文件HelloWorld.class

     - 编译失败，会提示编译时异常信息

     - 命令如下

       ```shell
       #编译.java源代码文件，会输出同名的.class字节码文件
       javac HelloWorld.java
       #如果编译时报乱码异常，可以带-encoding UTF-8指定编码
       #javac HelloWorld.java -encoding UTF-8
       ```

  2. **运行**，使用java命令进行运行（<span style={{color:"red"}}>注意：运行的是类</span>）

    - 运行成功，输出期待的内容”Hello World!“

    - 运行失败，会提示运行时异常信息

    - 命令如下

      ```shell
      #运行类，该类在编译后的.class字节码文件中，必须具有main方法
      java HelloWorld
      ```

  3. **查看结果**，如果运行成功，将会输出如下信息

     ![HelloWorld运行](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202308291607524.jpg)

<span style={{fontSize:"20px",fontWeight:"bold",color:"green"}}>【练习】</span>

1. 练习演示内容，编写第一个Java程序，并运行，要求输出如下内容：

   Hello World!

   你好，世界！

### 带包和参数的Java程序<span style={{fontWeight:"bold",color:"lightgreen"}}>【扩展】</span>

- 在后续的应用中，类都会规划在包中，其作用类似于目录（文件夹），并且有要求：

  - **包层次与目录层次相匹配**，如定义的包为**com.bjpowernode.demo**，则.class字节码文件目录必须在目录**com\bjpowernode\demo**下；如下图的.java源代码文件中指定了com.bjpowernode.demo包，则需要将.class字节码文件放置于绕圈所在目录下

    ![第一个Java程序-带包和参数的Java程序-目录要求](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202308291608342.jpg)

  - **java命令执行要求**，执行时必须在包对应目录外，并且类前要带包名；如上图，执行时，需要在d:\temp目录下运行类

- 同时，运行程序的时候，还可以传递参数给到main方法

- 应用实例：

  - 实例1，带包和参数的Java程序

    示例代码

    ```java
    //定义包
    package com.bjpowernode.demo;
    
    /**
    *  定义带参数的HelloWorld
    */
    public class HelloWorldForParam{  
        /**
    	*   入口main方法，一般一个项目只有一个入口
    	*/
        public static void main(String [] args){
            //标准输出，表示从运行程序的控制台输出
    		System.out.println("你好，世界！");
    		System.out.println(args[0]);
    		System.out.println(args[1]);
    	}
    }
    ```

    编译和运行命令，注意目录

    ```shell
    #编译，将.java源代码文件编译成.class字节码文件
    javac .\com\bjpowernode\demo\HelloWorldForParam.java
    #运行，运行.class字节码文件中类（带main入口方法的类）
    java com.bjpowernode.demo.HelloWorldForParam
    ```

    输出结果

    ![第一个Java程序-带包和参数的Java程序-输出结果](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202308291608218.jpg)

  <span style={{fontSize:"20px",fontWeight:"bold",color:"green"}}>【练习】</span>

  1. 练习演示内容，编写一个Java程序，能够接收多个参数，并输出，然后运行

### Java基本语法规则

- Java语言是一门非常严谨的语言，有着严格语法规则，程序源代码必须完整按照其规则进行编写

- 常见规则有

  - 源代码文件扩展名为.java，字节码文件扩展名为.class

  - 一个源代码文件中，最少有一个类，建议**类名与主文件名相同**，**且为public**

  - 代码以行为单位执行**，每行代码以分号";"结尾**

  - 一般的**项目都有一个启动类**，即该类有一个**main方法**；此main方法必须与下面的代码一模一样

    ```java
    public static void main(String[] args) {
        //方法体，包含逻辑
    }
    ```

  ```
  
  ```

- 运行程序时，直接使用java命令运行main方法所在的类即可

  - ...，其他规则，后续学习中会持续补充

### System.out

- 标准输出流，用于向控制台（命令行）输出内容
- 下面有多个方法
  - println，输出一行文本，并换行
  - print，输出文本，不换行

<span style={{fontSize:"20px",fontWeight:"bold",color:"blue"}}>【演示】</span>

1. 使用System.out输出文本并换行、输出多个文本但不换行

<span style={{fontSize:"20px",fontWeight:"bold",color:"green"}}>【练习】</span>

1. 练习演示的内容，编写代码，并编译运行

### <span style={{fontWeight:"bold",color:"green"}}>实战和作业</span>

1. 使用文本编辑器编写类HelloToSomeone，然后编译、运行；运行时接收2个参数，分别为姓氏、名字；然后输入，输出：“你好，姓氏.名字！”，如：“你好，尼古拉斯.赵四！”

2. 编写程序，输出学生的基本信息，输出结果如下图所示，要求如下

   1. 学号和1111111要使用两条语句输出，其他类似

   ![输出学生信息截图](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202308291608103.jpg)

3. 编写程序，输出京东商城商品列表信息，输出结果如下图所示

   ![输出京东商品信息截图](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202308291608208.jpg)

4. 背诵附件提供的英文单词（后面的课程中会多次抽查）