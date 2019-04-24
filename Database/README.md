# Database Design Specification

作者：孙克染

更新时间：2019-4-25

## 部署说明（草案）

最后更新：孙克染 陈玮烨

直接在MySQL数据库管理系统中运行`dbDesign.sql`和`dbTest-D.sql`即可。

为方便大家调用数据库，并配合MySQLconnection.js的使用，在数据库定义DDL文本中，规定了数据库的位置，即database为"StockTradingSys".(此项更改需要经过大家同意)
```sql
-- 统一建立数据库
drop database if exists StockTradingSys;
create database StockTradingSys;
-- 使用StockTradingSys命名空间
use StockTradingSys;
```

## 数据库表概况

本数据库中总计含有13个表，分别是：

|      表名称      |                说明                | 维护小组 |
| :--------------: | :--------------------------------: | :------: |
|      stock       |               股票表               |    E     |
|  stock_history   |             股票历史表             |    E     |
|   idreference    | 证券账户证券账户id与用户id的对照表 |    A     |
| personalaccount  |          自然人证券账户表          |    A     |
| corporateaccount |           法人证券账户表           |    A     |
|    stockhold     |            证券人持股表            |   A C    |
|  capitalaccount  |             资金账户表             |    B     |
|   jobberworker   |     证券经纪商处工作人员账户表     |    B     |
| capitalaccountio |         资金账户收支记录表         |    B     |
|       bids       |           股票买入指令表           |    D     |
|       asks       |           股票卖出指令表           |    D     |
|      matchs      |             交易撮合表             |    D     |
| tempinstructions |           临时指令排队表           |    D     |

另有两个基于matchs的视图，用于展示买卖交易的交易结果情况。

| 视图名称 |     说明     | 维护小组 |
| :------: | :----------: | :------: |
| dealsBid | 买入成交记录 |    D     |
| dealsAsk | 卖出成交记录 |    D     |

## 数据库分表说明

### 股票表

stock表每天更新，所存储的信息均为今天的信息。

```sql
drop table if exists stock;
create table stock(
	code varchar(20) primary key,   -- 股票ID
	name_stock varchar(100),   -- 股票名称
	current_price numeric(25, 2),   -- 实时价格
	last_endprice numeric(25, 2),   -- 昨日收盘价
	today_startprice numeric(25, 2),   -- 今日开盘价
	amount bigint,   -- 总发行量
	permission boolean default true,   -- 本股票是否允许交易
	notification varchar(500) default null,   -- 通知
	percentagePriceChange numeric(8, 3) default 0.1,   -- 最大涨跌幅
	st boolean default false   -- 是否为ST股票
);
```

+ code字段唯一确定某一支股票

+ current_price字段需要根据最近的交易信息实时更新

+ 股票是否为ST股票需要根据st字段进行判断

+ 每次交易撮合、发出交易指令之前都需要确定permission字段是否为真

### 股票历史表

stock_history表每天更新，所存储的信息均为历史股票信息。

```sql
drop table if exists stock_history;
create table stock_history(
    code varchar(20) references stock(code),   -- 股票ID
    highest numeric(25, 2),   -- 当日最高价格
    lowest numeric(25, 2),   -- 当日最低价格
    startprice numeric(25, 2),   -- 当日开盘价格
    endPrice numeric(25, 2),   -- 当日收盘价格
    notification varchar(500) default null,   -- 当日通知
    time date,   -- 日期
    primary key(code, time)
);
```

### 证券账户证券账户id与用户id的对照表

idreference表本质上是一个映射表，可以根据personid确定accountid，需要在证券账户表更新之前先更新此表。

```sql
drop table if exists idreference;
create table idreference(
    accountid bigint primary key,   -- 法人/个人股票账户号码
    personid bigint not null   -- 用户ID
);
```

+ 需要注意根据personid确定accountid可能不唯一，需要找到其中最大的accountid，或者直接对于每个accountid直接在证券账户里面确定是否正常

+ 需要根据personid或者accountid是否大于等于1000000000来确定账主体是自然人还是法人

### 自然人证券账户表

personalaccount表，存储自然人证券账户信息，需要在更新之前先更新idreference表，accountid和personid需要小于1000000000，顺次增加。

```sql
drop table if exists personalaccount;
create table personalaccount(
    accountid bigint primary key references idreference(accountid),   -- 股票账户号码（11位从000...1顺序到009...9赋予新用户）
    registertime timestamp default current_timestamp,   -- 登记时间
    name varchar(50),   -- 姓名
    gender enum('male', 'female'),   -- 性别
    identityid varchar(18),   -- 身份证号码
    homeaddress varchar(100),   -- 家庭地址
    work varchar(20),   -- 职业
    educationback varchar(20),   -- 学历
    workaddress varchar(100),   -- 工作单位
    phonenumber varchar(30),   -- 联系电话
    agentid varchar(18),   -- 代办人身份证号码
    state enum('normal', 'frozen', 'logout') default 'normal',   -- 状态
    personid bigint not null references idreference(personid)   -- 用户ID（10位，首位为0标记为个人账户，从00...1到09...9）
);
```

+ 交易过程中，需要验证证券账户的有效性

### 法人证券账户表

corporateaccount表，存储法人证券账户信息，需要在更新之前先更新idreference表，accountid和personid需要大于等于1000000000，顺次增加。

```sql
drop table if exists corporateaccount;
create table corporateaccount(
    accountid bigint primary key references idreference(accountid),   -- 法人股票账户号码（11位从010...1顺序到019...9赋予新用户）
    registrationid varchar(50),   -- 法人注册登记号码
    licenseid varchar(50),   -- 营业执照号码
    identityid varchar(18),   -- 身份证号码
    name varchar(50),   -- 姓名
    phonenumber varchar(30),   -- 联系电话
    workaddress varchar(100),   -- 联系地址
    authorizername varchar(50),   -- 授权证券交易执行人姓名
    authorizeridentityid varchar(18),   -- 授权人身份证号码
    authorizerphonenumber varchar(30),   -- 授权人联系电话
    authorizeraddress varchar(100),   -- 授权人地址
    state enum('normal', 'frozen', 'logout') default 'normal',   -- 状态
    personid bigint not null references idreference(personid)   -- 用户ID（10位，首位为1标记为法人账户，从10...1到19...9）
);
```

+ 交易过程中，需要验证证券账户的有效性

### 证券人持股表

stockhold表，维度设计为cube形式，维度m（股民） × n（股票），每增加一个证券账户或者每上市一支股票都需要在该表格内多增加一个维度。

```sql
drop table if exists stockhold;
create table stockhold(
    personid bigint not null references idreference(personid),   -- 用户ID（10位，首位为0标记为个人账户，首位为1标记为法人账户）
    stockid varchar(20) not null references stock(code),   -- 股票ID
    stocknum bigint,   -- 该股票所持有的总数量
    stockcost numeric(25, 2),   -- 该股票持有总成本
    updatetime timestamp default current_timestamp,   -- 更新时间
    primary key(personid, stockid)   -- 用户ID与股票ID共同构成主键
);
```

### 资金账户表

capitalaccount表，存储资金账户信息（主要是存款）。

```sql
drop table if exists capitalaccount;
create table capitalaccount(
    capitalaccountid bigint primary key,   -- 资金账户ID（主键）
    tradepassWord varchar(100) not null,   -- 交易密码（用于交易客户端）
    cashpassWord varchar(100) not null,   -- 存取款密码（用于存取款）
    identificationid varchar(18) not null,   -- 开户身份证号码
    relatedsecuritiesaccountid bigint references idreference(accountid),   -- 相关联的证券账户ID（外键）
    capitalaccountstate enum('normal', 'frozen', 'logout') default 'normal',   -- 资金账户状态（正常，冻结，注销）
    availablemoney numeric(25, 2) default 0.000,   -- 可用资金
    frozenmoney numeric(25, 2) default 0.000,   -- 冻结资金
    interestremained numeric(25, 2) default 0.000   -- 利息余额
);
```

+ 登录客户端、发起交易指令、成交过程中都需要对capitalaccount表对应记录的状态进行检验

+ 发起交易指令、成交过程中需要对capitalaccount表中的资金等字段进行更新

+ 发起交易指令、成交之前需要根据capitalaccount表中的accountid字段检验其证券账户的有效性

### 证券经纪商处工作人员账户表

jobberworker表，证券账户维护专用，无跨系统调用。

```sql
drop table if exists jobberworker;
create table jobberworker(
    jobberworkerid bigint primary key,   -- 证券经纪商处工作人员账户ID（主键）
    jobberworkerpassword varchar(50) not null   -- 工作人员账户密码
);
```

### 资金账户收支记录表

capitalaccountio表，存储资金流水，主要用于证券账户业务之利息计算。

```sql
drop table if exists capitalaccountio;
create table capitalaccountio(
    capitalaccountid bigint references capitalaccount(capitalaccountid),   -- 资金账户ID（主键、外键）
    iotime timestamp default current_timestamp,   -- 交易时间（主键）
    ioamount numeric(25, 2) not null,   -- 交易金额
    moneytype enum('RMB', 'USD', 'CAD', 'AUD', 'EUR', 'GBP', 'HKD', 'JPY') default 'RMB',   -- 交易币种
    iodescription varchar(500) not null,   -- 交易明细
    primary key (capitalaccountid, iotime)
);
```

+ 存取款时需要对此表格进行更新

+ 交易成交时需要对此表格进行更新，往往每次包括两个，一个买方，一个卖方

### 股票买入指令表

bids表，存储股票购买指令，每有用户发起购买指令即插入此表。

```sql
drop table if exists bids;
create table bids(
    id serial primary key,   -- 编号：唯一性的编号 作为指向该指令的索引
    time timestamp default current_timestamp,   -- 时间
    uid bigint not null references idreference(personid),   -- 用户ID标识
    code varchar(20) not null references stock(code),   -- 代交易的股票代码 例如'BABA','MSFT'
    shares bigint not null,   -- 所有交易的股数
    price numeric(25, 2) not null,   -- 交易的单价（元/股）[0-999999.99]
    shares2trade bigint,   -- 该指令中未被交易的部分的股数
    timearchived timestamp default null,   -- 被存档的时间（加入该关系的时间）
    status enum('complete', 'expired', 'partial') default 'partial'   -- 状态 complete, expired, partial
);
```

+ 每一个交易日结束时，将现存的全部指令状态修改为“过期”

+ 每有（部分）交易发生都要对相应的指令进行更新

+ 撤销指令需要对指令信息进行更新

### 股票卖出指令表

asks表，存储股票卖出指令，每有用户发起出售指令即插入此表。

```sql
drop table if exists asks;
create table asks(
    id serial primary key,   -- 编号：唯一性的编号 作为指向该指令的索引
    time timestamp default current_timestamp,   -- 时间
    uid bigint not null references idreference(personid),   -- 用户ID标识
    code varchar(20) not null references stock(code),   -- 代交易的股票代码 例如'BABA','MSFT'
    shares bigint not null,   -- 所有交易的股数
    price numeric(25, 2) not null,   -- 交易的单价（元/股）[0-999999.99]
    shares2trade bigint,   -- 该指令中未被交易的部分的股数
    timearchived timestamp default null,   -- 被存档的时间（加入该关系的时间）
    status enum('complete', 'expired', 'partial') default 'partial'   -- 状态 complete, expired, partial
);
```

- 每一个交易日结束时，将现存的全部指令状态修改为“过期”

- 每有（部分）交易发生都要对相应的指令进行更新

- 撤销指令需要对指令信息进行更新

### 交易撮合表

matchs表，存储股票撮合信息，每有符合撮合条件的指令对即存入此表格。

```sql
drop table if exists matchs;
create table matchs(
    matchid serial primary key,   -- 撮合编号
    askid bigint references asks(id),   -- 卖指令编号
    bidid bigint references bids(id),   -- 买指令编号
    shares bigint,   -- 交易数量
    askPrice numeric(25, 2),   -- 卖指令价格
    bidPrice numeric(25, 2),   -- 买指令价格
    matchprice numeric(25, 2),   -- 撮合价格
    matchtime timestamp default current_timestamp,   -- 撮合时间
    code varchar(20) not null references stock(code) on delete set null on update cascade  -- 待交易的股票代码 例如'BABA','MSFT'
);
```

+ 一旦发生了撮合，参与撮合的股份无法撤回

### 卖出成交视图

```mysql
-- 卖出成交视图
create view dealsAsk as
select askid, code,
       sum(shares) as sharesDealed,
       sum(shares * matchprice) as totalPrice,
       sum(shares * matchprice)/sum(shares) as avgPrice,
       max(matchtime) as time
from matchs
group by askid, code;
```

### 买入成交视图

```mysql
-- 买入成交视图
create view dealsBid as
select bidid, code,
       sum(shares) as sharesDealed,
       sum(shares * matchprice) as totalPrice,
       sum(shares * matchprice)/sum(shares) as avgPrice,
       max(matchtime) as time
from matchs
group by bidid, code;
```