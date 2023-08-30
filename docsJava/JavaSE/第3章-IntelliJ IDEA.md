---
sidebar_position: 3
---
### IDE简介

- IDE（Integrated Development Environment），集成开发环境， 是用于工程化的软件开发的工具
- 在开发中大型的多人协同的项目时，一个项目可能有几十、上百个各类文件需要开发和管理，普通的文本编辑器，不足以胜任这类项目的开发，需要专业的IDE，常见的IDE有IntelliJ IDEA、Eclipse、VS Code等
- 一般的IDE都提供或集成丰富的功能，以加速开发人员的效率，包括项目管理、源代码管理、自动备份、自动补全、语法检查等

### IntelliJ IDEA简介

- 众多Java从业人员的首选IDE
- 业界公认的最好的IDE，也是后续课程大家天天使用的工具
- 为开发人员提供丰富的功能，包括各类项目模板、智能代码助手、代码自动提示、重构、Java EE支持、各类版本工具集成(git、svn等)、代码分析、 创新的GUI设计等方面
- 为后续的各类项目学习提供模板支持，如Spring、Spring Boot等

### IntelliJ IDEA安装

- 付费

- 版本更新迭代快

- 官网：https://www.jetbrains.com/idea/

- 使用附件提供安装包安装，步骤见附件\第3章\IDEA2020\idea2020激活.docx文档

  【演示】

  1. 安装IntelliJ IDEA 2020

  【练习】

  1. 练习演示的内容，在自己电脑上安装IntelliJ IDEA 2020

### IntelliJ IDEA创建一个新项目

- 创建一个HelloWorld，步骤如下

  1. 打开IntelliJ IDEA，第一次打开，会进入欢迎界面，同时提示是创建还是打开项目；后续打开，则会直接进入IDEA主界面；然后，点击”Create New Project"按钮

     ![IDEA-欢迎](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202308301502747.jpg)

     <center>IDEA创建项目-欢迎界面</center>

  2. 进入新项目界面，可以选择JDK版本、项目模板、额外的依赖包和框架，其中会将本地安装的JDK版本都列出来，此时，可配置如下选项；选择好后，点击“Next”按钮

     1. 选择JDK版本，在顶部Project SDK使用1.8版本即可

     2. 选择左侧项目类型，基础阶段选择Java，也可以选择Empty Project

     3. 根据选择的项目类型，还可以添加额外的依赖包和框架，不选择

        ![IDEA-新建项目-1](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202308301502127.jpg)

        <center>IDEA创建项目-选择JDK和项目类型</center>

  3. 进入选择模板界面，勾选“Create project from template”，并选中模板列表中的”Command Line App“；此模板会创建一个默认的Main类，类中会带一个入口的main方法；选择好后，点击”Next“

     ![IDEA-新建项目-2](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202308301503192.jpg)

     <center>IDEA创建项目-选择模板</center>

  4. 进入项目信息输入界面，分别输入如下内容；输入好后，点击”Finish"

     1. 项目名称，输入一个符合需求的项目名称，如my-first-project
     2. 项目路径，规划一个合理的项目文件存放位置，并使用项目名称做为项目的根目录，如在d:\project\java目录下创建项目，完成的项目代码放置于d:\project\java\my-first-project目录下
     3. 包，规划一个合理的包，一般用域名的倒置，加上项目名称；后面会讲

     ![IDEA-新建项目-3](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202308301503977.jpg)

     <center>IDEA创建项目-输入项目信息</center>

  5. 此时，一个工程化的命令行项目就已经创建完成；其中左侧就列出了项目的所有工程化的内容

     1. src目录，主要的开发目录，一般规划有包，包下面规划有类，如自动生成的Main类

     2. .idea目录，IDEA项目辅助目录，不要修改

     3. my-first-project.iml文件，项目或模块信息，不要修改或删除

     4. External Libraries项，列出了当前项目的所有第三方依赖信息

        ![IDEA-新建项目-4](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202308301503257.jpg)

        <center>IDEA创建项目-项目代码</center>

### IntelliJ IDEA 编写代码

- 在打开的Main.java文件中，已经生成了一个模板，包含main入口方法

- 在main方法中，可编写Java代码，如写入如下代码

  ```java
  package com.bjpowernode.demo;
  
  public class Main {
  
      public static void main(String[] args) {
  	// write your code here
          System.out.println("你好，世界！");
      }
  }
  ```

### IntelliJ IDEA运行代码

- IDEA中对于带有main方法的入口类，都会在类上标识一个可运行箭头，直接右键选择"Run..."，即可运行

- 运行后，将会在底部的运行窗口，输出：“你好，世界！”

- 如果提示”Error:java: 无效的源发行版: 11“错误，点击File->Project Structure...菜单，在弹窗中，修改指定项目的Project language level为8

  ![IDEA-新建项目-运行错误](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202308301504128.jpg)

- 此过程相当于执行了javac、java两个命令

- 注意：观察源代码目录中的如下内容：

  - src目录，包与目录层次匹配特点
  - out目录，运行时，会动态生成该目录，以及目录下的.class字节码文件

### IntelliJ IDEA主要界面

- 作为开发过程经持续使用的工具，熟悉主要界面和常用功能，十分重要

- 主要由菜单区、项目文件区、代码编写区和辅助功能区组成，提供一个高效的项目开发工具

  - 顶部菜单区，集成了所有功能
  - 左侧项目文件区，列出了工程化的项目结构图
  - 中间代码编写区，能进行各类代码的编写
  - 底部辅助功能区，提供调试、运行结果、代码管理等实时结果信息

  ![IDEA-新建项目-4](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202308301504870.jpg)

- 另外，在File菜单中，有两个非常重要的功能，在后续的工作中也会经常使用

  - Settings...，进行IDEA开发中的一些基础配置，一般不依赖于项目，如皮肤、字体、字号、编码等
  - Project Sturcture...，进行当前项目的一些基础配置，如JDK、模块、依赖等
  - Other Settings->Settings for New Projects...，与Settings类似，针对后续所有 新建项目
  - Other Settings->Sturcturefor New Projects...，与Project Sturcture类似，针对后续所有 新建项目

【演示】

1. 使用IDEA创建一个HelloWorld项目，编写简单代码，并成功运行

【练习】

1. 练习演示的内容，完成使用IDEA进行项目创建、代码编写，并成功运行

### IntelliJ IDEA快捷键

- psvm/main：自动补全main方法
- sout：自动补全输出语句
- Ctrl + Shift + F10：运行
- Ctrl + Shift + F12：当前窗口最大化/还原
- Ctrl + /：添加/删除单行注释
- Ctrl + Shift + /：添加/删除多行注释
- Alt + Enter：自动导入包，自动修正
- Ctrl + Y：删除当前行
- Ctrl + D：复制当前行
- Ctrl + Alt + L：代码格式化
- Ctrl + Z：撤消操作
- Ctrl + Shift + Z：重做操作
- Shift + F6：重命名
- Ctrl + S：保存当前文件
- ...

### 实战和作业

1. 熟悉IDEA界面、Settings...和Project Stucture...功能、快捷键

2. 使用IDEA编写程序，输出学生的基本信息，输出结果如下图所示，要求如下

   1. 学号和1111111要使用两条语句输出，其他类似

   ![输出学生信息截图](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202308301505010.jpg)