# Database Design Specification

作者：孙克染

更新时间：2019-4-3

## 数据库表概况

本数据库中总计含有15个表，分别是：

| 表名称              | 说明                  | 维护小组 |
|:----------------:|:-------------------:|:----:|
| stock            | 股票表                 | E    |
| stock_history    | 股票历史表               | E    |
| idreference      | 证券账户证券账户id与用户id的对照表 | A    |
| personalaccount  | 自然人证券账户表            | A    |
| corporateaccount | 法人证券账户表             | A    |
| stockhold        | 证券人持股表              | A C  |
| capitalaccount   | 资金账户表               | B    |
| jobberworker     | 证券经纪商处工作人员账户表       | B    |
| capitalaccountio | 资金账户收支记录表           | B    |
| bids             | 股票买入指令表             | D    |
| asks             | 股票卖出指令表             | D    |
| matchs           | 交易撮合表               | D    |
| dealsbid         | 买入成交表               | D    |
| dealsask         | 卖出成交表               | D    |

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

（未完待续）
