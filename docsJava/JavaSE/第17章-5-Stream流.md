---
sidebar_position: 21
---

# 第17章-5-Stream流

### 概述

- 流，是以一种类似SQL语法从数据库中查询数据的方式，提供对集合类对象进行计算和操作的方式
- 使用链式语法，高效率、更简洁
- 借助Lambda语法、常用函数式接口、方法引用等语法，操作更简便
- **针对Collection系列集合类对象**
- 还有Collectors类，提供了很多方法，用来将流转换成各种所需的数据
- **相比传统的数据处理方式，代码极其简洁、效率也更好**

### Stream和Collection区别

- Collection：静态的内存数据结构，聚焦的是系列数据存储；面向内存，将数据存储于内容
- Stream：提供一系列方法，完成针对Collection集合相关的计算和操作，强调的是计算；面向CPU，通过CPU进行计算

### Stream操作步骤 

1. **创建Stream**，方式多样，但多通过Collection的stream()方法创建
2. **中间操作**，对创建的Stream，可进行多次的计算与操作，如过滤、映射、排序等
3. **终止操作**，Stream计算完成后，可将结果存储到集合，也可以做输出等处理

### Stream操作

#### 概述

- 主要分中间操作和终止操作

- 操作中广泛应用了Consumer、Function、Predicate、Comparator等常用函数式接口

- 常用的操作如下

  | 操作类型 | 操作名称   | 操作方法    | 形参类型        | 对应抽象方法              | 返回值类型    |
  | -------- | ---------- | ----------- | --------------- | ------------------------- | ------------- |
  | 中间操作 | 过滤       | `filter`    | `Predicate<T>`  | `boolean test(T t);`      | `Stream<T>`   |
  | 中间操作 | 映射       | `map`       | `Function<T,R>` | `R apply(T t);`           | `Stream<T>`   |
  | 中间操作 | 去重       | `distinct`  |                 |                           | `Stream<T>`   |
  | 中间操作 | 排序       | `sorted`    | `Comparator<T>` | `int compare(T o1,T o2);` | `Stream<T>`   |
  | 中间操作 | 跳过       | `skip`      | `long`          |                           | `Stream<T>`   |
  | 中间操作 | 截断       | `limit`     | `long`          |                           | `Stream<T>`   |
  | 终止操作 | 匹配任一个 | `anyMatch`  | `Predicate<T>`  | `boolean test(T t);`      | `boolean`     |
  | 终止操作 | 都匹配     | `allMatch`  | `Predicate<T>`  | `boolean test(T t);`      | `boolean`     |
  | 终止操作 | 都不匹配   | `noneMatch` | `Predicate<T>`  | `boolean test(T t);`      | `boolean`     |
  | 终止操作 | 遍历       | `forEach`   | `Consumer<T>`   | `void accept(T t);`       | `void`        |
  | 终止操作 | 取第一个   | `findFirst` |                 |                           | `Optional<T>` |
  | 终止操作 | 取任一个   | `findAny`   |                 |                           | `Optional<T>` |
  | 终止操作 | 数量       | `count`     |                 |                           | `long`        |
  | 终止操作 | 收集       | `collect`   | 重载方法不确定  | 重载方法不确定            | 不确定        |
  | ...      | ...        | ...         | ...             | ...                       | ...           |

  其中

  ​		中间操作还可分为无状态和有状态操作，无状态表未该中间操作不受之前操作元素影响，如filter、map等，有状态表示该中间操作受链式操作的上一个操作，如distinct、sorted等

  ​		终止操作还分为短路和非短路操作，短路操作表示遇到部分符合条件的结果就返回结果，如anyMatch、findFirst等，非短路操作表示处理所有元素才返回结果，如forEach、collect等

#### 创建Stream

- 可通过多种方式创建Stream，主要有

  - 通过Arrays.stream方法，从数组创建
  - 通过Stream.of方法，从可变长参数创建
  - 通过Collection.stream方法，从集合类对象创建；常用

- 应用实例

  - 应用实例1，创建Stream的常用方式

    ```java
    package com.bjpoernode.demo;
    
    import java.util.ArrayList;
    import java.util.Arrays;
    import java.util.List;
    import java.util.stream.Stream;
    
    public class StreamDemo {
        public static void main(String[] args) {
            //1、通过数组创建
            //字符串数组
            String[] strings = {"aa", "bb", "cc", "dd"};
            Stream <String> stringStream = Arrays.stream(strings);
            //Integer类型数组
            Integer[] integers = {1, 3, 5, 7, 9};
            Stream <Integer> integerStream = Arrays.stream(integers);
            //...其他类型数组
    
            //2、使用Stream.of静态方法创建
            //String类型
            stringStream = Stream.of("jack", "rose", "peter");
            //Long类型
            Stream <Long> longStream = Stream.of(17l, 25l, 36l, 38l);
            //...其他类型
    
            //3、【常用】使用Collection系列集合类直接获取
            //String类型
            List <String> stringList = new ArrayList <>();
            stringList.add("张三");
            stringList.add("李四");
            stringStream = stringList.stream();
            //Double类型
            List <Double> doubleList = new ArrayList <>();
            Stream <Double> doubleStream = doubleList.stream();
            //...其他类型
        }
    }
    ```

#### 中间操作

- 中间操作主要是进行数据操作的记录，包括过滤、映射、排序、唯一、分页等
- 中间操作只是对操作进行记录，当进行终端操作时，才会进行实际的计算，即惰性求值
- 常见中间操作见概述中表格

#### 终止操作

- 终止操作会触发中间操作的计算，并得到结果，结束Stream
- 终止操作还可以结合Collectors类提供的静态方法，实现一些结果数据的处理，如汇总、分组等
- 常见终止操作见概述中表格

#### Collectors收集器

- 主要用于终止操作中的collect收集方法
- 常用的收集方式有
  - 归集
    - toCollection，Strean收集到指定的Collection实现类对象
    - toList，Stream收集到List对象
    - toSet，Stream收集到Set对象
    - toArray，Stream收集到数组对象
  - 统计
    - counting，计数
    - averagingxxx，平均值，如averagingInt
    - sumxxx()，求和
    - maxBy、minBy，最大值和最小值
    - summarizingxxx，统计所有
  - 分组
    - groupingBy，分组
  - 接合
    - joining，接合成一个字符串

#### Optional类【扩展】

- 开发过程中，对于值为null的引用，直接使用引用的子属性和子方法，会产生异常

- 为了处理这种问题，Java1.8开始，提供一个可以包含null的对象容器

- Stream中部分的终止方法会返回Optional类对象

- 如果要获取容器中的实际对象，使用orElse、get方法获取即可

- 应用实例

  - 应用实例1，Optional使用对比和常用方法

    ```java
    package com.bjpoernode.demo;
    
    import java.util.Optional;
    
    /**
     * Optional使用实例
     */
    public class OptionalDemo {
        public static void main(String[] args) {
            //User类引用，分别使用值为null和对象尝试
            User user = new User(1, "张三", '男', 13, false);
    //        User user = null;
    
    //        String name =  user.getName();    //不能直接获取，当user为null时，会产生异常
    
            //方式1、普通null处理
            String name1 = null;
            if (user != null) {
                name1 = user.getName();
            }
            System.out.println("使用普通方式获取姓名：" + name1);
    
            //方式2、使用Optional进行null处理
            String name2 = null;
            Optional <User> userOptional = Optional.ofNullable(user);
            name2 = userOptional.map(s -> s.getName()).orElse("没找到相应的数据");
            System.out.println("使用Optional获取姓名：" + name2);
    
            //获取实际对象
            User result = userOptional.orElse(null);
            System.out.println("Optional中的实际对象：" + result);
        }
    }
    ```

#### 应用实例

- 应用实例1，Stream常用操作

  - User类，用于操作时使用

    ```java
    package com.bjpoernode.demo;
    
    import java.util.Objects;
    
    /**
     * 用户类
     */
    public class User implements Comparable <User> {
        //普通属性
        private Integer id;
        private String name;
        private Character sex;
        private Integer age;
        private Boolean enabled;
    
        public User() {
        }
    
        public User(Integer id, String name, Character sex, Integer age, boolean enabled) {
            this.id = id;
            this.name = name;
            this.sex = sex;
            this.age = age;
            this.enabled = enabled;
        }
    
        public Integer getId() {
            return id;
        }
    
        public void setId(Integer id) {
            this.id = id;
        }
    
        public String getName() {
            return name;
        }
    
        public void setName(String name) {
            this.name = name;
        }
    
        public Character getSex() {
            return sex;
        }
    
        public void setSex(Character sex) {
            this.sex = sex;
        }
    
        public Integer getAge() {
            return age;
        }
    
        public void setAge(Integer age) {
            this.age = age;
        }
    
        public Boolean isEnabled() {
            return enabled;
        }
    
        public void setEnabled(Boolean enabled) {
            this.enabled = enabled;
        }
    
        @Override
        public String toString() {
            return "User{" + "id=" + id + ", name='" + name + '\'' + ", sex=" + sex + ", age=" + age + ", enabled=" + enabled + '}';
        }
    
        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            User user = (User) o;
            return Objects.equals(id, user.id);
        }
    
        @Override
        public int hashCode() {
            return Objects.hash(id);
        }
    
        @Override
        public int compareTo(User o) {
            return this.id - o.id;
        }
    }
    ```

  - Employee类，用于操作时使用

    ```java
    package com.bjpoernode.demo;
    
    /**
     * 工作人员类
     */
    public class Employee {
        private Integer id;
        private String name;
        private String sex;
        private String type;  //类型：儿童、少年、青年、中年、老年
    
        public Employee() {
        }
    
        public Employee(Integer id, String name, String sex, String type) {
            this.id = id;
            this.name = name;
            this.sex = sex;
            this.type = type;
        }
    
        public Integer getId() {
            return id;
        }
    
        public void setId(Integer id) {
            this.id = id;
        }
    
        public String getName() {
            return name;
        }
    
        public void setName(String name) {
            this.name = name;
        }
    
        public String getSex() {
            return sex;
        }
    
        public void setSex(String sex) {
            this.sex = sex;
        }
    
        public String getType() {
            return type;
        }
    
        public void setType(String type) {
            this.type = type;
        }
    
        @Override
        public String toString() {
            return "Employee{" + "id=" + id + ", name='" + name + '\'' + ", sex='" + sex + '\'' + ", type='" + type + '\'' + '}';
        }
    }
    ```

  - Stream常用操作类

    ```java
    package com.bjpoernode.demo;
    
    import java.util.*;
    import java.util.function.Function;
    import java.util.function.Predicate;
    import java.util.stream.Collectors;
    import java.util.stream.Stream;
    
    /**
     * Stream常用操作
     */
    public class StreamOperationDemo {
        public static void main(String[] args) {
            //初始化数据
            List <User> users = new ArrayList <>();
            users.add(new User(1, "Jack", '男', 55, true));
            users.add(new User(2, "Lucy", '男', 44, false));
            users.add(new User(3, "Liuxin", '女', 20, true));
            users.add(new User(4, "Zhansan", '男', 57, false));
            users.add(new User(5, "lisi", '女', 18, false));
            users.add(new User(4, "Zhansan", '女', 24, false));
            users.add(new User(2, "Lucy", '男', 44, false));
    
            System.out.println("-----------------------------【原始数据】-----------------------------");
            //遍历输出
            for (User user : users) {
                System.out.println(user.toString());
            }
    
            System.out.println("=================================【中间操作】=================================");
    
            //filter，过滤；业务逻辑：过滤出名称中包含c的男性
            System.out.println("-----------------------------【filter】-----------------------------");
            //方式1、一个filter中包含多个条件
            System.out.println("【方式1、一个filter中包含多个条件】");
            //查询条件，使用Predicate函数式接口
            Predicate <User> condition = s -> s.getSex() == '男' && s.getName().contains("c");
            //查询，返回Stream
            Stream <User> streamOfFilter = users.stream().filter(condition);
            //遍历输出
            streamOfFilter.forEach(s -> {
                System.out.println(s);
            });
            //方式2、多个filter中包含条件
            System.out.println("【方式2、多个filter中包含条件，并简写、收集】");
            List <User> filterResult = users.stream().filter(s -> s.getSex() == '男').filter(s -> s.getName().contains("c")).collect(Collectors.toList());
            for (User user : filterResult) {
                System.out.println(user.toString());
            }
    
            //map，异构对象输出；将用户转员工
            System.out.println("-----------------------------【map】-----------------------------");
            //定义转换类型
            Function <User, Employee> function = user -> {
                Employee employee = new Employee();
                employee.setId(user.getId());
                employee.setName(user.getName());
                employee.setSex(user.getSex() == '男' ? "male" : "female");
                if (user.getAge() < 8) {
                    employee.setType("儿童");
                } else if (user.getAge() < 18) {
                    employee.setType("少年");
                } else if (user.getAge() < 30) {
                    employee.setType("青年");
                } else if (user.getAge() < 50) {
                    employee.setType("中年");
                } else {
                    employee.setType("老年");
                }
    
                return employee;
            };
            //结果转集合
            List <Employee> employees = users.stream().map(function).collect(Collectors.toList());
            //遍历输出
            for (Employee employee : employees) {
                System.out.println(employee.toString());
            }
    
            //distinct，取唯一；需要覆盖Uer的equals和hashCode方法
            System.out.println("-----------------------------【distinct】-----------------------------");
            List <User> listOfDistinct = users.stream().distinct().collect(Collectors.toList());
            //遍历输出
            for (User user : listOfDistinct) {
                System.out.println(user.toString());
            }
    
            //sorted，排序；业务逻辑，按年龄降序
            System.out.println("-----------------------------【sorted】-----------------------------");
            //定义比较方法
            Comparator <User> comparator = (o1, o2) -> o1.getAge() > o2.getAge() ? -1 : 1;
            //结果转集合
            List <User> listOfSorted = users.stream().sorted(comparator).collect(Collectors.toList());
            //遍历输出
            for (User user : listOfSorted) {
                System.out.println(user.toString());
            }
    
            //skip，跳过
            //limit，截断
            System.out.println("-----------------------------【skip、limit实现分页】-----------------------------");
            //每页元素数量
            int pageSize = 3;
            //根据每页元素数量、记录总数来计算页数
            int pageCount = (int) Math.ceil((double) users.size() / pageSize);
            //分页显示
            for (int i = 0; i < pageCount; i++) {
                System.out.println("【第" + i + "页】");
                //获取当前面数据
                List <User> currentUsers = users.stream().skip(i * pageSize).limit(pageSize).collect(Collectors.toList());
                //遍历输出
                for (User user : currentUsers) {
                    System.out.println(user.toString());
                }
            }
    
            System.out.println("=================================【终止操作】=================================");
    
            //anyMatch，匹配任一个；业务逻辑：年龄大于50岁的
            System.out.println("-----------------------------【anyMatch】-----------------------------");
            //Predicate函数式接口，匹配条件
            Predicate <User> conditionOfAnyMatch = s -> s.getAge() > 50;
            //任意匹配，返回Stream
            boolean resultOfAnyMatch = users.stream().anyMatch(conditionOfAnyMatch);
            //任意匹配结果
            System.out.println("匹配任一个结果：" + resultOfAnyMatch);
    
            //allMatch，全部都匹配；业务逻辑：年龄大于50岁的
            System.out.println("-----------------------------【allMatch】-----------------------------");
            //全部匹配条件
            //全部匹配，返回Stream
            boolean resultOfAllMatch = users.stream().allMatch(s -> s.getAge() > 50);
            //全部匹配结果
            System.out.println("全部都匹配结果：" + resultOfAllMatch);
    
            //noneMatch，全部都不匹配；业务逻辑：年龄大于50岁的
            System.out.println("-----------------------------【noneMatch】-----------------------------");
            //全部匹配条件
            //全部匹配，返回Stream
            boolean resultOfNoneMatch = users.stream().noneMatch(s -> s.getAge() > 50);
            //全部匹配结果
            System.out.println("全部都不匹配结果：" + resultOfNoneMatch);
    
            //forEach，遍历；
            System.out.println("-----------------------------【forEach】-----------------------------");
            //遍历
            users.stream().forEach(s -> {
                System.out.println(s.toString());
            });
    
            //findFirst，获取第一个；业务逻辑：获取第一个女性
            System.out.println("-----------------------------【fintFirst】-----------------------------");
            //返回Optional
            Optional <User> optionalUser = users.stream().filter(s -> s.getSex() == '女').findFirst();
            //输出
            System.out.println("第一个女性：" + optionalUser.orElse(null));
    
            //findAny，获取任一个，一般在并行的时候才能体现出效果，是为了更高性能；业务逻辑：获取任一个女性
            System.out.println("-----------------------------【findAny】-----------------------------");
            //返回Optional
            User findAnyUser = users.stream().filter(s -> s.getSex() == '女').findAny().orElse(null);
            //输出
            System.out.println("任一个女性：" + findAnyUser);
    
            //count,数量；业务逻辑：统计男用户数量
            System.out.println("-----------------------------【count】-----------------------------");
            //汇总条数
            Long count = users.stream().filter(s -> s.getSex() == '男').count();
            //输出
            System.out.println("男用户数量：" + count);
    
            //collect->归集
            System.out.println("-----------------------------【collect】->【归集】->[toCollection]-----------------------------");
            System.out.println("【Collectors.toCollection(ArrayList::new)】");
            //查询结果
            ArrayList <User> collectionForArrayList = users.stream().filter(s -> s.isEnabled() == false).collect(Collectors.toCollection(ArrayList::new));
            //遍历输出
            for (User user : collectionForArrayList) {
                System.out.println(user.toString());
            }
            System.out.println("【Collectors.toCollection(LinkedList::new)】");
            //查询结果
            LinkedList <User> collectionForLinkedList = users.stream().filter(s -> s.isEnabled() == false).collect(Collectors.toCollection(LinkedList::new));
            //遍历输出
            for (User user : collectionForLinkedList) {
                System.out.println(user.toString());
            }
            System.out.println("【Collectors.toCollection(HashSet::new)】会去重");
            //查询结果
            HashSet <User> collectionForHashSet = users.stream().filter(s -> s.isEnabled() == false).collect(Collectors.toCollection(HashSet::new));
            //遍历输出
            for (User user : collectionForHashSet) {
                System.out.println(user.toString());
            }
            System.out.println("【Collectors.toCollection(TreeSet::new)】会排序，但集合元素必须实现Comparable接口");
            //查询结果
            TreeSet <User> collectionForTreeSet = users.stream().filter(s -> s.isEnabled() == false).collect(Collectors.toCollection(TreeSet::new));
            //遍历输出
            for (User user : collectionForTreeSet) {
                System.out.println(user.toString());
            }
    
            //collect->归集->toList
            System.out.println("-----------------------------【collect】->【归集】->[toList]-----------------------------");
            //查询结果
            List <User> usersForList = users.stream().filter(s -> s.isEnabled() == false).collect(Collectors.toList());
            //遍历输出
            for (User user : usersForList) {
                System.out.println(user.toString());
            }
    
            //collect->归集->toSet，会去重，需要覆盖equals方法
            System.out.println("-----------------------------【collect】->【归集】->[toSet]会去重-----------------------------");
            //查询结果
            Set <User> usersForSet = users.stream().filter(s -> s.isEnabled() == false).collect(Collectors.toSet());
            //遍历输出
            for (User user : usersForSet) {
                System.out.println(user.toString());
            }
    
            //collect->归集->toMap；先使用distinct针对key去重
            System.out.println("-----------------------------【collect】->【归集】->[toMap]-----------------------------");
            //查询结果
            Map <Integer, User> usersForMap = users.stream().filter(s -> s.isEnabled() == false).distinct().collect(Collectors.toMap(s -> s.getId(), s -> s));
            //遍历输出
            Set <Map.Entry <Integer, User>> usersForMapResult = usersForMap.entrySet();
            for (Map.Entry <Integer, User> item : usersForMapResult) {
                System.out.println(item.toString());
            }
    
            //collect->归集->toArray
            System.out.println("-----------------------------【collect】->【归集】->[toArray]-----------------------------");
            //查询结果
            User[] usersForArray = users.stream().filter(s -> s.isEnabled() == false).toArray(User[]::new);
            //遍历输出
            for (User user : usersForArray) {
                System.out.println(user.toString());
            }
    
            //collect->统计->counting
            System.out.println("-----------------------------【collect】->【统计】->[counting]-----------------------------");
            Long countingOfUser = users.stream().filter(s -> s.isEnabled() == false).collect(Collectors.counting());
            System.out.println("counting：" + countingOfUser);
    
            //collect->统计->averagingxxx
            System.out.println("-----------------------------【collect】->【统计】->[averagingDouble]-----------------------------");
            Double averagingOfUser = users.stream().filter(s -> s.isEnabled() == false).collect(Collectors.averagingInt(User::getAge));
            System.out.println("averagingInt：" + averagingOfUser);
    
            //collect->统计->summingxxx
            System.out.println("-----------------------------【collect】->【统计】->[summingInt]-----------------------------");
            Integer summingOfUser = users.stream().filter(s -> s.isEnabled() == false).collect(Collectors.summingInt(User::getAge));
            System.out.println("summingInt：" + summingOfUser);
            //collect->统计->maxBy、minBy
            System.out.println("-----------------------------【collect】->【统计】->[maxBy、minBy]-----------------------------");
            User maxOfUser = users.stream().filter(s -> s.isEnabled() == false).collect(Collectors.maxBy((o1, o2) -> o1.getAge() - o2.getAge())).orElse(null);
            System.out.println("maxBy：" + maxOfUser);
            User minOfUser = users.stream().filter(s -> s.isEnabled() == false).collect(Collectors.minBy((o1, o2) -> o1.getAge() - o2.getAge())).orElse(null);
            System.out.println("minBy：" + minOfUser);
    
            //collect->统计->summarizingxxx
            System.out.println("-----------------------------【collect】->【统计】->[summarizingInt]-----------------------------");
            IntSummaryStatistics intSummaryStatistics = users.stream().filter(s -> s.isEnabled() == false).collect(Collectors.summarizingInt(User::getAge));
            System.out.println("summarizingInt：" + intSummaryStatistics);
    
            //collect->分组->groupingBy
            System.out.println("-----------------------------【collect】->【分组】->[groupingBy]-----------------------------");
            Map <Character, List <User>> groupingByOfUser = users.stream().collect(Collectors.groupingBy(User::getSex));
            //遍历输出
            Set <Map.Entry <Character, List <User>>> groupingByOfUserResult = groupingByOfUser.entrySet();
            for (Map.Entry <Character, List <User>> item : groupingByOfUserResult) {
                System.out.println(item.toString());
            }
    
            //collect->接合->joining
            System.out.println("-----------------------------【collect】->【接合】->[joining]-----------------------------");
            String names = users.stream().map(s -> s.getName()).collect(Collectors.joining(","));
            System.out.println("joining：" + names);
        }
    }
    ```

【练习】

1. 练习应用实例内容，完成代码编写

#### 串行流与并行流【扩展】

##### 概述

- 上面创建的都是串行流
- 另外，也可以通过parallelStream方法创建并行流，功能与串行流相同
- 相比串行流，并行流使用多线程，性能更好；但也不是任何情况性能都好，只有单个任务足够复杂时才会有性能优势

##### 应用实例

- 应用实例1，对比串行流和并行流

  ```java
  package com.bjpoernode.demo;
  
  import java.util.ArrayList;
  import java.util.Date;
  import java.util.List;
  import java.util.stream.Collectors;
  
  /**
   * 串行流与并行流测试
   */
  public class ParallelStreamTest {
      public static void main(String[] args) {
          //执行次数
          int executeCount = 1000;
  
          //串行流测试
          ParallelStreamTest.testStream(executeCount);
          //并行流测试
          ParallelStreamTest.testParallelStream(executeCount);
      }
  
      /**
       * 串行流测试
       */
      public static void testStream(int executeCount) {
          //开妈时间
          Date start = new Date();
  
          List <Integer> datas = new ArrayList <>();
          //创建临时数据
          for (int i = 0; i < executeCount; i++) {
              datas.add(i);
          }
          //串行流计算
          datas.stream().map(ParallelStreamTest::complexOperation).collect(Collectors.joining(","));
          //结束时间
          Date end = new Date();
  
          //计算时间间隔毫秒数
          long millisecond = end.getTime() - start.getTime();
          //输出毫秒数
          System.out.println(millisecond);
      }
  
      /**
       * 并行流测试
       */
      public static void testParallelStream(int executeCount) {
          //开始时间
          Date start = new Date();
  
          List <Integer> datas = new ArrayList <>();
          //创建临时数据
          for (int i = 0; i < executeCount; i++) {
              datas.add(i);
          }
          //并行流计算
          datas.parallelStream().map(ParallelStreamTest::complexOperation).collect(Collectors.joining(","));
  
          //结束时间
          Date end = new Date();
  
          //计算时间间隔毫秒数
          long millisecond = end.getTime() - start.getTime();
          //输出毫秒数
          System.out.println(millisecond);
      }
  
      /**
       * 模拟复杂计算
       *
       * @param data
       * @return
       */
      public static String complexOperation(Integer data) {
  
          try {
              //休眠1毫秒
              Thread.sleep(1);
          } catch (InterruptedException e) {
              throw new RuntimeException(e);
          }
  
          return "abc";
      }
  }
  ```

【练习】

1. 练习应用实例内容，完成代码编写

### 实战和作业

1. 编写程序，要求如下
   1. 定义一个用户类，包括ID、姓名、省份、密码、性别、年龄、银行存款等属性，属性都有getter、setter方法等方法
   2. 使用用户类定义一个包含10个用户的集合对象
   3. 输出集合中年龄大于30岁的男性数据，按银行存款降序输出，格式为用户的姓名+密码+存款，如：张三丰_123123_155000.85
   4. 输出女性平均银行存款金额
   5. 按省份对用户进行分组并输出