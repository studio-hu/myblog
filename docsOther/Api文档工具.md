# Api文档工具

## Apifox

本文仅介绍idea插件部分使用，更多操作和方法详见[Apifox官网](https://apifox.com/)

### idea插件使用

### 1.从 IDEA plugins 中搜索安装

![image.png](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202311031923166.png)

### 2.获取项目ID

新建一个项目，在项目设置中查看项目ID

![image-20231103192727958](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202311031927014.png)

### 3.获取个人账号令牌

点开个人头像，在账号设置>API访问令牌，新建一个访问令牌（令牌只会显示一次，注意保存）

![image-20231103192902907](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202311031929948.png)



### 4.填写基本配置信息

示例项目模块名为：security

![image-20231103193836697](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202311031938721.png)

![image-20231103193738772](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202311031937838.png)

### 5.同步接口到Apifox

#### 同步模块内所有接口

- 在模块目录上的**右键菜单**中选择 `Upload to Apifox`

![image-20231103194150359](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202311031941407.png)

#### 同步 controller 文件内所有接口

- 在代码编辑区域的**右键菜单**中选择 `Upload to Apifox`

![image-20231103194348892](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202311031943933.png)

## 官方注释Demo

```java

/**
 * 分类名称
 * 分类备注/描述
 *
 * @module 归属项目
 */
@RestController
@RequestMapping(value = "/pathOfCtrl")
public class MockCtrl {

    /**
    * api名称
    * api描述
    * @param param1 参数1的名称或描述
    * @param param2 可以用`@link`来表示当前参数的取值是某个枚举{@link some.enum.or.constant.class}
    * @param param3 当目标枚举字段与当前字段名不一致,额外指定{@link some.enum.or.constant.class#property1}
    * @return 响应描述
    */
    @RequestMapping(value = "/pathOfApi1")
    public Result methodName1(long param1,
                      @RequestParam String param2,
                      @RequestParam(required = false, defaultValue = "defaultValueOfParam3") String param3){
        ...
    }


    /**
    * 默认使用`application/x-www-form-urlencoded`,
    * 对于`@RequestBody`将使用`application/json`
    * 可以用注解`@Deprecated`来表示api废弃
    * 也可以用注释`@deprecated`
    *
    * @deprecated 改用{@link #methodName3(String)}
    */
    @Deprecated
    @RequestMapping(value = "/pathOfApi2")
    public Result methodName2(@RequestBody MockDtoOrVo jsonModel){
        ...
    }

    /**
    * 所有注释或者参数描述中都可以使用`@link`来引用另一个API
    * 例如:
    * 请先访问{@link #methodName4(String)}

    * 也可以使用`@see`来引用另一个API
    *
    * @param param1 参数1的名称或描述 可以从{@link #methodName5(String)}中获得
    * @see #methodName6(String)
    * @deprecated 改用{@link #methodName7(String)}
    */
    @Deprecated
    @RequestMapping(value = "/pathOfApi3")
    public Result methodName3(long param1){
        ...
    }

    ...
}
```



## 简单演示

![image-20231103195627550](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202311031956594.png)

### Apifox客户端显示

![image-20231103195719282](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202311031957308.png)

### 生成的接口文档显示

![image-20231103195759091](https://cdn.jsdelivr.net/gh/studio-hu/drawingBed/img/202311031957221.png)



