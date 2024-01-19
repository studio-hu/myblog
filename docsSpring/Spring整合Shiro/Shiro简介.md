# Shiro入门

## 一、Shiro简介

**Apache Shiro™**是一个功能强大且易于使用的 Java 安全框架，用于执行身份验证、授权、加密和会话管理。借助 Shiro 易于理解的 API，您可以快速轻松地保护任何应用程序 - 从最小的移动应用程序到最大的 Web 和企业应用程序

![ShiroFeatures](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202401162040172.png)

Shiro 提供了应用程序安全 API 来执行以下方面：

- Authentication**身份验证** - 证明用户身份，通常称为用户“登录”
- Authorization **授权**-访问控制
- Cryptography **加密** - 保护或隐藏数据免遭窥探
- Session Management**会话管理** - 每个用户的时间敏感状态



## 二、Apache Shiro 架构

> Apache Shiro 的设计目标是通过直观且易于使用来简化应用程序安全性，核心设计模拟了大多数人如何看待应用程序安全性
>
> 软件应用程序通常是根据用户故事来设计的。也就是说，您通常会根据用户将（或应该）与软件交互的方式来设计用户界面或服务 API。例如，您可能会说，“如果与我的应用程序交互的用户已登录，我将向他们显示一个按钮，他们可以单击以查看其帐户信息。如果他们未登录，我将显示一个注册按钮
>
> 此示例语句表明应用程序主要是为了满足用户的要求和需要而编写的。即使“用户”是另一个软件系统而不是人类，您仍然可以编写代码来反映基于当前与您的软件交互的人员（或内容）的行为
>
> Shiro 在自己的设计中体现了这些概念；通过与软件开发人员已经直观的功能相匹配，Apache Shiro 在几乎任何应用程序中仍然保持直观且易于使用

## 三、High-Level Overview 高级概述

Shiro 的架构有 3 个主要概念：

- **`Subject`**认证主体
- **`SecurityManager`**安全管理器
- **`Realms`**数据源

![ShiroBasicArchitecture](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202401161937785.png)

**Subject**：`subject`代表应用程序的用户或系统参与者，在安全操作中，`Subject` 是执行安全操作的主体，可以是一个用户、一个系统帐户或者其他实体。Subject 封装了与安全相关的信息，如身份标识、凭证、角色和权限等

**SecurityManager**：`SecurityManager`负责整个安全操作的协调和管理。管理 `Subject` 实例；处理身份验证、授权和会话管理等操作；是 `Apache Shiro` 的核心组件，负责协调和执行安全操作，确保系统的安全性

**Realms**：用于连接应用程序与安全**数据源**（如数据库、LDAP、文件系统等）的桥梁；`Realms` 负责验证用户身份、获取用户权限信息，并将这些信息提供给 `SecurityManager`；应用程序可以配置多个 `Realms`，以便支持不同的身份验证和授权机制，例如数据库身份验证、LDAP身份验证等

## 四、Detailed Architecture 详细架构

![ShiroArchitecture](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202401162023663.png)

**Authenticator**：**身份验证器**；负责执行用户的身份验证（登录）尝试并对其做出反应的组件。当用户尝试登录时，该逻辑由 `Authenticator` 执行。`Authenticator` 知道如何与存储相关用户/帐户信息的一个或多个 `Realms` 进行协调。从这些 `Realms` 中获取的数据用于验证用户的身份，以保证用户的真实身份

**Authentication Strategy** ：身份验证策略 ( `org.apache.shiro.authc.pam.AuthenticationStrategy`) 如果配置了多个 `Realm` ， `AuthenticationStrategy` 将协调 `Realms` 以确定身份验证条件的成功或失败（例如，如果一个数据源成功但其他数据源失败，则该验证是否成功？所有数据源都必须成功吗？还是只要第一个数据源成功？）

**Authorizer** ：**授权**；`Authorizer` ( `org.apache.shiro.authz.Authorizer`)  是负责确定用户在应用程序中访问控制的组件。它是最终决定是否允许用户做某事的机制。与 `Authenticator` 一样， `Authorizer` 也知道如何与多个后端数据源协调来访问角色和权限信息。 `Authorizer` 使用此信息来准确确定是否允许用户执行给定的操作。

**Cryptography** ：**加密**(`org.apache.shiro.crypto.*`) 是企业安全框架的自然补充。 Shiro 的 `crypto` 包包含易于使用和理解的加密密码、哈希和不同编解码器实现的表示。这个包中的所有类都经过精心设计，非常易于使用和理解。任何使用过 Java 原生加密支持的人都知道它是一种难以驯服的动物。 Shiro 的加密 API 简化了复杂的 Java 机制，能够轻松使用加密技术。



## 五、Authentication 身份验证

![ShiroFeatures_Authentication](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202401162053669.png)

### 1.Authenticating Subjects 验证主体身份

验证 `Subject` 的过程可以有效地分为三个不同的步骤：

- 收集`subject`提交的`principals `和`credentials`
  - `principals`：用户名
  - `credentials`：密码
- 提交用户名和密码验证
- 验证通过，则允许访问，否则重新身份验证或拒绝访问

#### Step 1: Collect the Subject’s principals and credentials

我们使用 `UsernamePasswordToken`，支持最常见的用户名/密码身份验证方法。这是 Shiro 的 `org.apache.shiro.authc.AuthenticationToken` 接口的实现，该接口是 Shiro 的身份验证系统用来表示提交的主体和凭证的基本接口

```java
UsernamePasswordToken token = new UsernamePasswordToken(username, password);
```

#### Step 2: Submit the principals and credentials

调用`login`方法，传入我们之前创建的`AuthenticationToken`实列，对 `login` 方法的调用实际上代表了一次身份验证尝试

```java
Subject currentUser = SecurityUtils.getSubject();

currentUser.login(token);
```

#### Step 3: Handling Success or Failure

处理错误

```java
try {
    currentUser.login(token);
} catch ( UnknownAccountException uae ) { ...
} catch ( IncorrectCredentialsException ice ) { ...
} catch ( LockedAccountException lae ) { ...
} catch ( ExcessiveAttemptsException eae ) { ...
} ... catch your own ...
} catch ( AuthenticationException ae ) {
    //unexpected error?
}
```

### 2.Authentication Sequence 认证顺序

![ShiroAuthenticationSequence](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202401162116971.png)

我们获取了之前的架构图，只突出显示了与身份验证相关的组件。每个数字代表身份验证尝试期间的一个步骤：

步骤 1：应用程序代码调用 `Subject.login` 方法，传入表示用户主体的用户名和密码凭构造的 `AuthenticationToken` 实例

步骤 2： `Subject` 实例，通常是 `DelegatingSubject` （或子类）通过调用 `securityManager.login(token)` 委托给应用程序的 `SecurityManager` ，其中实际的认证工作开始

步骤 3： `SecurityManager` 作为基本的“伞”组件，接收令牌并通过调用 `authenticator.authenticate(token)` 简单地委托给其内部 `Authenticator` 实例。 `ModularRealmAuthenticator` 为默认实现，它支持在身份验证期间协调一个或多个 `Realm` 实例。 `ModularRealmAuthenticator` 本质上为 Apache Shiro 提供了 PAM 风格的范例（其中每个 `Realm` 都是 PAM 术语中的一个“模块”）

步骤 4：如果为应用程序配置了多个 `Realm` ，则 `ModularRealmAuthenticator` 实例将利用其配置的 `AuthenticationStrategy` 身份验证尝试。在调用 `Realms` 进行身份验证之前、期间和之后，将调用 `AuthenticationStrategy` 以允许其对每个 Realm 的结果做出反应

步骤 5：查询每个配置的 `Realm` ，看看它是否 `supports` 提交的 `AuthenticationToken` 。如果是这样，将使用提交的 `token` 调用支持 Realm 的`getAuthenticationInfo` 方法。 `getAuthenticationInfo` 方法有效地表示针对特定 `Realm` 的单次身份验证尝试。我们将很快介绍 `Realm` 身份验证行为



![image-20240117150131369](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202401171501439.png)

![image-20240117161745261](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202401171617353.png)

单一数据源省略第四步`AuthenticationStrategy`

#### Authenticator 验证器

Shiro `SecurityManager` 实现默认使用 `ModularRealmAuthenticator` 实例。 `ModularRealmAuthenticator` 同样支持具有单个数据源和多个数据源的应用程序。

在单数据源应用程序中， `ModularRealmAuthenticator` 将直接调用单个 `Realm` 。如果配置了两个或多个数据源，它将使用 `AuthenticationStrategy` 实例来协调身份验证

`ModularRealmAuthenticator` 可以访问 `SecurityManager` 上配置的 `Realm` 实例。当执行身份验证尝试时，它将迭代该集合，并且对于支持提交的 `AuthenticationToken` 的每个 `Realm` ，调用 Realm 的 `getAuthenticationInfo` 方法



