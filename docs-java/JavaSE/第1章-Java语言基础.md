## 第1章-Java语言基础

### 什么是Java语言

- 是Sun Microsystems 公司的James Gosling 在1990 年创建的，于1995 年公布于世（一般说Java 诞生于1995 年）

- 是一门**面向对象**的编程语言，吸收了C++语言的各种优点，并摒弃了 C++里难以理解的多继承、指针等概念，

- 具有功能强大、简单易、安全性高、应用广泛等特征

- 作为面向对象编程语言的代表，极好地实现了面向对象理论，允许程序员以优雅的思维方式进行复杂的编程

  ![Java语言之父](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202308291553995.jpg)

<center>Java语言之父-James Gosling</center>

### Java语言发展历程

- 最早，由是美国Sun公司（Stanford University Network）在1995年推出

- 之后，于2009年，Sun公司被甲骨文公司收购，所以我们现在访问oracle官网即可下载相关资源和工具，地址：https://www.oracle.com

- 并且，随着产业的发展，以及编程语言思维的持续演进，也在持续进行版本迭代，最新的版本是19.0

- 现在企业中广泛应用的版本是**JDK8.0**（1.8）

- **LTS**（long-term support）：长期支持版本

  ![JDK历史](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202308291553781.jpg)

<center>JDK版本历史（图片来自网络）</center>

### Java平台分类

- Java是一门编程语言，也是系列技术的统称

- 在后续的发展中，根据不同的应用场景，产生了3个不同，但各有侧重的平台

  - **Java SE**( (Java Standard Edition )，标准版本，旧称J2SE

    - 多用于服务器、桌面、嵌入式环境和实时环境中使用的Java应用程序
    - 包含了支持Java Web服务开发的类，并为Java EE提供基础支持
    - 主要包含Java基础语法、核心技术等功能，是**基础阶段学习的重点**

  - **Java EE** (Java Enterprise Edition) ，企业版本，旧称J2EE

    - 帮助开发和部署可移植、健壮、可伸缩且安全的服务器端Java应用程序
    - 是在Java SE的基础上构建的，它提供Web服务、组件模型、管理和通信API，可以用来实现企业级的面向服务体系结构（service-orientedarchitecture，SOA）和Web2.0应用程序 
    - Jakarta EE
      - 2017 年，Oracle 公司决定将 Java EE 移交给开源组织 Eclipse Foundation（Eclipse 基金会），但Oracle 公司要求，被移交后的 Java EE 不能使用与 Java 相关的商标，于是Eclipse 基金会对 Java EE 进行改名，叫Jakarta EE
    - 主要包含服务器开发、Web开发等面向企业级应用所需的基础技术，是一项得到广泛认可的工作标准；但也有一些优秀的第三方平台或框架，如Spring、Spring Boot等，会更多的应用在企业级项目中

  - **Java ME**( Java Micro Edition )，嵌入式版本， 旧称J2ME

    - 主要应用于移动设备和嵌入式设备（比如手机、PDA、电视机顶盒和打印机）上运行的应用程序提供一个健壮且灵活的环境
    - 包括灵活的用户界面、健壮的安全模型、许多内置的网络协议以及对可以动态下载的连网和离线应用程序的丰富支持
    - 基于Java ME规范的应用程序只需编写一次，就可以用于许多设备，而且可以利用每个设备的本机功能

    ![Java平台](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202308291554184.jpg)

    <center>Java平台对比（图片来自网络）</center>

  <span style={{color:"red"}}>注意：Java SE是学习好Java技术，并进行企业级应用开发的基础</span>


### Java语言特点

- **解释型语言**

  - 本身是解释型语言， JVM将.class文件解释成操作系统指令执行，执行效率相对较低
  - 也具备编译型语言的特性，借助JIT，将热点代码编译了操作系统的指令，加速程序执行效率

- **简单易用**

  - Java 语言底层采用C++语言实现，相对于C++编程来说，使用Java语言编程更简单
  - Java语言摈弃了C++中指针的操作，开发人员不需要再操作复杂的指针
  - 面向对象的继承方面，也放弃了C++对多继承的支持，是只支持单继承，使得类间继承层次更直观
  - 另外，在编程语言的很多方面都进行了简化

- **面向对象**

  - 针对面向对象的设计与开发思想：封装、继承和多态，Java都提供了完整的语法支持
  - 是一门语法严谨的、完全的面向对象的编程语言

- **健壮性**

  - 彻底解决了C++语言开发过程中，极容易产生的内存分配后，未释放，导致程序奔溃问题
  - Java语言不再需要开发人员主动分配、释放内容，这些工作交由Java语言机制中的JVM( Java Virtual Machine )实现
  - Java语言中引入了GC（ Garbage Collection ，垃圾回收）,由JVM自动进行对象资源分配、回收和生命周期管理，让开发人员更加关注于业务

- **多线程**

  - 用于满足实际的企业业务中多个同时进行任务的并发工作
  - 并提供线程的安全机制

- **跨平台**

  - 基于强大的不同平台的JVM
  - 编写的Java源代码不依赖特定的操作系统平台（如Linux、Windows等），真正实现不依赖特定平台，Write Once,Run Anywhere

  ![Java跨平台](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202308291554233.jpg)

  <center>Java跨平台</center>

- **强大的社区支持**

  - 是老而弥坚的一门编程语言，尤其是面向应用领域
  - 是众多企业和组织最主要的语言技术栈
  - 相比其他语言，围绕在Java周边的生态最丰富； 很多新的技术思想也最早有基于Java的支持

### Java基础概念

- **JDK**（Java Development Kit）

  - Java开发工具包，主要供Java开发人员使用，安装于开发机器 
  - 包含了JRE
  - 集成了很多开发、运维、监控工具，方便开发人员进行程序开发

- **JRE**（Java Runtime Environment）

  - Java运行环境，主要用于部署Java软件包
  - 提供了Java软件基础的运行环境、基础依赖包等
  - 可以理解为，其中包含了JVM
  - 多安装于生产、测试环境机器

- **JVM**（Java Virtual Machine）

  - Java虚拟机，是一种规范，类似于虚拟出一台计算设备，仿真进行各种运算，并实现软件功能
  - 主要解释执行Java软件中的.class字节码文件，实现软件功能
  - 常见的虚拟机为HotSpot，通过java -version查看
  - 是一个运行时状态，一般一个Java软件的运行称之为一个JVM进程
  - 是Java跨平台的关键

- **JDK、JRE、JVM之间的关系**

  ![JDK](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202308291555138.jpg)

  <center>JDK、JRE、JVM之间的关系</center>

- 其他基础概念

  - **JIT**：即时编译器(Just In Time Compiler)，对于热点代码编译为本地代码，提高执行效率；主要用于弥补Java语言是解释型语言，执行效率低的不足
  - **javac命令**：将.java源文件编译中.class字节码文件，如：javac com/bjpowernode/demo/HelloWorld.java
  - **java命令**：
    - 基于JRE在操作系统解释执行.class字节码文件，如java com.bjpowernode.demo.HelloWorld
    - 也可以用于查看版本，java -version
  - main方法：所有的Java程序都有一个入口
  - IDE：集成开发环境（Integrated Development Environment），为工程化的Java开发提供工具支持，推荐使用IntelliJ IDEA

### Java程序执行过程

- 需要**先安装JDK或JRE**
- 分**编译阶段**和**运行阶段**
- Java程序的**源代码**都写**在以.java作为扩展名的源代码文件中**
- 编写好的.java源代码文件，并不能直接运行；需要使用**javac命令将.java源代码文件编译成.class字节码文件**
- 然后，使用java命令运行.class字节**码文件中的入口类**（带main方法的类）
- Java程序加载与执行过程如下：

 ![Java程序执行过程](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202308291555585.jpg)

<center>Java程序加载与执行过程</center>

<span style={{fontSize:"20px",fontWeight:"bold",color:"blue"}}>【演示】</span>

- 演示一个Java源代码文件，编译成字节码文件，并执行的过程

<span style={{fontSize:"20px",fontWeight:"bold",color:"green"}}>【练习】</span>

1. 提问
   1. JDK、JRE、JVM的全称与关系
   2. JIT的作用
   3. 讲述一个Java程序的执行过程

### 开发前准备工作

#### 电脑环境

- CPU：Intel Core i5以上
- 内存：8GB/16GB/32GB
- 操作系统：Windows 10及以上

#### 简单开发辅助工具的安装

- **任何文本编辑器都能进行基础的Java源代码编写**，多用于初学者学习，如记事本、EditPlus、Notepad++等，但记事本功能相对较弱，不推荐使用

- EditPlus、Notepad++等工具提供了一系列更灵活的功能，如缩进、自动着色、对通用文件支持（像.java、.xml等）、自动文件保存等功能，非常方便

- EditPlus配置指南

  - 在工具->首先项...下可进行多种设置

  - 字体和自动备份设置

    ![EditPlus-字体和自动保存](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202308291556346.jpg)

  - 缩进

    ![EditPlus-缩进](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202308291557853.jpg)

  - 制表符

    ![EditPlus-制表符](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202308291557427.jpg)

- 附件中提供了EditPlus和Notepad++的安装文件，可直接使用进行安装，也可以去官网下载安装

<span style={{fontSize:"20px",fontWeight:"bold",color:"green"}}>【练习】</span>

1. 安装一个EditPlus或Notepad++文本编辑器，附件\第1章\软件工具下提供了安装文件

#### 常用英文单词

- 由于计算机、主要的编程语言、开发工具大多都是英语系的技术人员研发的，所以掌握一些基础的英文单词是必要的
- 这此英文单词主要包括关键字、异常信息、提示信息、开发工具中的描述等内容
- 附件《Java初学者常用单词.txt》文件中的单词，基本初高中、大学时都有接触过，不复杂，需要过一遍，在课程中也会随着课程的深入给大家介绍
- 大家也可以安装一下网易有道词典，对于一些查询的单词能够生成生词表，方便后续再次练习；地址是： https://cidian.youdao.com/  

#### 打字速度

- 不只是开发岗位，很多岗位都需要对键盘比较熟练
- 要做到主键盘不看键盘输入，大家用文本编辑器中输入一下26个字母和数字尝试
- 附件有一个打字通软件，供大家熟悉键盘并练习

<span style={{fontSize:"20px",fontWeight:"bold",color:"green"}}>【练习】</span>

1. 熟悉一下打字通的使用

#### 操作系统简介

##### 概述

- 从有电脑开始，就有操作系统，英文名为Operating System，也常简称为OS
- 到后来手机、移动设备、物联网的飞速发展，操作系统不再局限于电脑，各种设备都有操作系统，像手机、网络设备、家用电器等
- 常见的现代操作系统有：Windows、Unix、Linux、MacOS、iOS、Android、 HarmonyOS等
- 但，这些所有的现代操作系统，都是后来发展起来的，面向用户侧多为图形化界面的操作系统
- 这些现代操作系统，都起源于较早的命令行式的操作系统，如DOS
- 并且，这些现代操作系统还都提供命令行式的交互方式，多用于一些开发、诊断工作

##### 操作系统特点

- 管理软件、硬件资源的程序
- 控制其他程序运行，管理系统资源并为用户提供操作界面的系统软件的集合
- 负责管理与配置内存、决定系统资源供需的优先次序、控制输入与输出设备、操作网络与管理文件系统等基本事务
- 型态非常多样，不同机器安装的操作系统可从简单到复杂，可从手机的嵌入式系统到超级电脑的大型操作系统

##### DOS

- 磁盘操作系统（ Disk Operating System ），体积小，提供命令式的交互
- 部分资源以一定形式保存在硬盘中，通常称为**文件**
- 具备很多交互命令，一般的软件开发人员需要掌握常用的，
- 在企业级应用中，服务器多为Linux系列，只提供命令式的交互，需要学习常用的Linux使用，与DOS命令方式类似；熟悉DOS命令，为以后学习Linux命令打下基础

#### 文件名与扩展名

-  文件是以计算机硬盘为载体，存储在计算机上的信息集合，文件可以是文本、图片、音频、视频、程序等
-  文件名称主要由主文件名和扩展名组成，主文件名用于描述特征，扩展名用于划分文件类别，如：张三简历.pdf、工资表.xlsx、备忘.txt、hello.java、hello.class等
-  Java开发过程中，源代码文件扩展名必须是.java，编译后的字节码文件将会是.class

#### Windows中使用命令行模式

- 方式1：按住Win键+R，在运行窗口中输出cmd，会进入命令提示符窗口（一般Win键在键盘左下角Ctrl和Alt之间）

- 方式2：点击开始菜单->所有应用->Windows系统->命令提示符，进入命令提示符窗口

- 方式3：在资源管理器目录上输入cmd命令，也能快速进入命令提示符窗口，且当前目录为输入cmd命令时的目录

- 进入命令提示符后，显示界面如下图：

  ![命令提示符](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202308291557223.jpg)

#### 常用的DOS命令

- Windows系统下常用的可作为命令有系统命令、.exe（可执行文件）、.bat（批处理文件）等
- **注意**：要把系统默认隐藏扩展名的去掉
- 路径（目录）相关概念
  - **绝对路径**，从盘符开始的路径，如c:\windows\system32\regedit32.exe、d:\temp\hello.java
  - **相对路径**，从当前路径（.）开始的路径，如当前路径（目录）是d:\，hello.java文件是相对路径为.\temp\hello.java
  - .，表示当前目录
  - ..，表示上一级目录
- 常用命令
  - **dir**，列出当前目录下的所有文件和子目录；主要列出，最后修改日期和时间、是否为目录、文件/目录名称；还可以带/w、/p、/a等参数；如：dir
  - **cd**，切换当前目录，可以使用绝对路径、相对路径；如：cd .\temp、cd d:\temp、cd ..\abc
  - **盘符:**，切换磁盘，cd命令切换成非当前磁盘路径时，如果不会直接切换，此时使用此命令可以切换磁盘；如：d:，将切换到d盘当前目录
  - **cls**，清屏命令，清除所有命令行内容；如：cls，将当前命令行内容清空
  - **exit**，退出命令提示符界面；如：exit，将退出当前命令行窗口
  - mkdir，创建目录，在当前目录下，创建一个子目录；如：mkdir temp，将在当前目录下创建一个名为temp的子目录<span style={{fontWeight:"bold",color:"lightgreen"}}>【扩展】</span>
  - rmdir，删除目录，在当前目录下，删除指定存在的子目录，目录需要是空目录；如：rmdir temp，将删除当前目录下的子目录temp<span style={{fontWeight:"bold",color:"lightgreen"}}>【扩展】</span>
  - tree，以树状显示目录层次，同时查看文件时，使用/F参数；如：tree temp /F，将以树形结构显示temp目录下的所有文件和目录
  - echo，创建文件并添加内容命令，如：<span style={{fontWeight:"bold",color:"lightgreen"}}>【扩展】</span>
    - echo 11111<span style={{color:"red",fontWeight:"bold"}}>></span>test.txt，创建文件test.txt，并将文件内容设置为11111
    - echo 2222<span style={{color:"red",fontWeight:"bold"}}>>></span>test.txt，更新文件test.txt的内容，往文件尾追加2222
  - more，查看文件内容命令；如：more test.txt，将显示test.txt文件内容<span style={{fontWeight:"bold",color:"lightgreen"}}>【扩展】</span>
  - del 文件名，删除指定 文件；如：del file.txt，将删除当前目录下的文件file.txt<span style={{fontWeight:"bold",color:"lightgreen"}}>【扩展】</span>
  - ...

<span style={{fontSize:"20px",fontWeight:"bold",color:"blue"}}>【演示】</span>

1. 演示创建如下目录层次

![演示-创建目录和文件](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202308291557904.jpg)

<span style={{fontSize:"20px",fontWeight:"bold",color:"green"}}>【练习】</span>

1. 完成上述演示，练习目录和文件的创建，熟悉命令使用，并对文件内容有如下要求

   1. file1.txt中包含如下内容

      11

      22

      33

   2. file2.txt中包含如下内容

      aa

      bb

      cc

### <span style={{fontWeight:"bold",color:"green"}}>实战和作业</span>

1. 熟悉几个DOS命令的使用（自己熟悉即可）
2. 背诵附件提供的英文单词（后面的课程中会多次抽查）
3. 打字练习，目标是主键盘盲打