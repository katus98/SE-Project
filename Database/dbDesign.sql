-- 统一建立数据库
drop database if exists StockTradingSys;
create database StockTradingSys;
-- 使用StockTradingSys命名空间
use StockTradingSys;

-- Group-E
-- 股票表
drop table if exists stock;
create table stock(
	code varchar(40) primary key,   -- 股票ID
	name_stock varchar(100),   -- 股票名称
	current_price numeric(25, 2),   -- 实时价格
	last_endprice numeric(25, 2),   -- 昨日收盘价
	today_startprice numeric(25, 2),   -- 今日开盘价
	high_price numeric(25, 2),  -- 当前最高价
	low_price numeric(25, 2),  -- 当前最低价
	volumn numeric(25, 2),  -- 价值体量
	turnover bigint default 5000,   -- 转手
	amount bigint default 10000000,   -- 总发行量
	permission boolean default true,   -- 本股票是否允许交易
	notification varchar(500) default null,   -- 通知
	percentagepricechange numeric(10, 2) default 0.1,   -- 最大涨跌幅
	st boolean default false   -- 是否为ST股票
);

-- 股票历史记录
drop table if exists stock_history;
create table stock_history(
	code varchar(20) references stock(code),   -- 股票ID
	highest numeric(25, 2),   -- 当日最高价格
	lowest numeric(25, 2),   -- 当日最低价格
	startprice numeric(25, 2),   -- 当日开盘价格
	endprice numeric(25, 2),   -- 当日收盘价格
	notification varchar(500) default null,   -- 当日通知
	time date,   -- 日期
	primary key(code, time)
);

-- 股票管理员表
DROP TABLE IF EXISTS security_practitioner;
CREATE TABLE security_practitioner(
	id VARCHAR(20) PRIMARY KEY,
	password VARCHAR(30),
	authority MEDIUMTEXT,
	face MEDIUMBLOB,
	phone VARCHAR(11)
);

-- Group-A
-- 证券账户id与用户id的对照表
drop table if exists idreference;
create table idreference(
	accountid bigint primary key,   -- 法人/个人股票账户号码
	personid bigint not null   -- 用户ID
);

-- 自然人证券账户表
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

-- 法人证券账户表
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

-- 证券人持股表
drop table if exists stockhold;
create table stockhold(
	personid bigint not null references idreference(personid),   -- 用户ID（10位，首位为0标记为个人账户，首位为1标记为法人账户）
	stockid varchar(20) not null references stock(code),   -- 股票ID
	stocknum bigint,   -- 该股票所持有的总数量
	frozenstocknum bigint default 0,   -- 冻结的股票数量
	stockcost numeric(25, 2),   -- 该股票持有总成本
	updatetime timestamp default current_timestamp,   -- 更新时间
	primary key(personid, stockid)   -- 用户ID与股票ID共同构成主键
);

-- Group-B
-- 资金账户表
drop table if exists capitalaccount;
create table capitalaccount(
	capitalaccountid bigint primary key,   -- 资金账户ID（主键）
	tradepassword varchar(100) not null,   -- 交易密码（用于交易客户端）
	cashpassword varchar(100) not null,   -- 存取款密码（用于存取款）
	identificationid varchar(18) not null,   -- 开户身份证号码
	relatedsecuritiesaccountid bigint references idreference(accountid),   -- 相关联的证券账户ID（外键）
	capitalaccountstate enum('normal', 'frozen', 'logout') default 'normal',   -- 资金账户状态（正常，冻结，注销）
	availablemoney numeric(25, 2) default 0.000,   -- 可用资金
	frozenmoney numeric(25, 2) default 0.000,   -- 冻结资金
	interestremained numeric(25, 2) default 0.000   -- 利息余额
);

-- 证券经纪商处工作人员账户表
drop table if exists jobberworker;
create table jobberworker(
	jobberworkerid bigint primary key,   -- 证券经纪商处工作人员账户ID（主键）
	jobberworkerpassword varchar(50) not null   -- 工作人员账户密码
);

-- 资金账户收支记录表
drop table if exists capitalaccountio;
create table capitalaccountio(
	id serial primary key,
	capitalaccountid bigint references capitalaccount(capitalaccountid),   -- 资金账户ID（主键、外键）
	iotime timestamp default current_timestamp,   -- 交易时间（主键）
	ioamount numeric(25, 2) not null,   -- 交易金额
	moneytype enum('RMB', 'USD', 'CAD', 'AUD', 'EUR', 'GBP', 'HKD', 'JPY') default 'RMB',   -- 交易币种
	iodescription varchar(500) not null   -- 交易明细
);

-- Group-C
-- 股票关注表
drop table if exists intereststock;
create table intereststock(
	capitalaccountid bigint references capitalaccount(capitalaccountid),
	stockid varchar(20) references stock(code),
	interestprice numeric(25, 2) not null,
	intereststate tinyint(1) not null,
	primary key(capitalaccountid, stockid)
);

-- Group-D
drop table if exists matchs;
drop table if exists dealsask;
drop table if exists dealsbid;
drop table if exists asks;
drop table if exists bids;

-- 股票买入指令表
create table bids(
	id serial primary key,   -- 编号：唯一性的编号 作为指向该指令的索引
	time timestamp(6) default current_timestamp(6),   -- 时间
	uid bigint not null references idreference(personid),   -- 用户ID标识
	code varchar(20) not null references stock(code),   -- 代交易的股票代码 例如'BABA','MSFT'
	shares bigint not null,   -- 所有交易的股数
	price numeric(25, 2) not null,   -- 交易的单价（元/股）[0-999999.99]
	shares2trade bigint,   -- 该指令中未被交易的部分的股数
	timearchived timestamp(6) default null,   -- 被存档的时间（加入该关系的时间）
	status enum('complete', 'expired', 'partial', 'withdrawn') default 'partial'   -- 状态 complete, expired, partial
);

-- 股票卖出指令表
create table asks(
	id serial primary key,   -- 编号：唯一性的编号 作为指向该指令的索引
	time timestamp(6) default current_timestamp(6),   -- 时间
	uid bigint not null references idreference(personid),   -- 用户ID标识
	code varchar(20) not null references stock(code),   -- 代交易的股票代码 例如'BABA','MSFT'
	shares bigint not null,   -- 所有交易的股数
	price numeric(25, 2) not null,   -- 交易的单价（元/股）[0-999999.99]
	shares2trade bigint,   -- 该指令中未被交易的部分的股数
	timearchived timestamp(6) default null,   -- 被存档的时间（加入该关系的时间）
	status enum('complete', 'expired', 'partial', 'withdrawn') default 'partial'   -- 状态 complete, expired, partial
);

-- 交易指令缓存表
drop table if exists tempinstructions;
create table tempinstructions(
	id serial primary key,   -- 编号：唯一性的编号
	time timestamp(6) default current_timestamp(6),   -- 缓存时间
	tradetype enum('sell', 'buy'),   -- 交易类型
	uid bigint not null references idreference(personid),   -- 用户ID标识
	code varchar(20) not null references stock(code),   -- 代交易的股票代码 例如'BABA','MSFT'
	shares bigint not null,   -- 所有交易的股数
	price numeric(25, 2) not null   -- 交易的单价（元/股）[0-999999.99]
);

-- 交易撮合表
create table matchs(
	matchid serial primary key,   -- 撮合编号
	askid bigint references asks(id),   -- 卖指令编号
	bidid bigint references bids(id),   -- 买指令编号
	shares bigint,   -- 交易数量
	askprice numeric(25, 2),   -- 卖指令价格
	bidprice numeric(25, 2),   -- 买指令价格
	matchprice numeric(25, 2),   -- 撮合价格
	matchtime timestamp(6) default current_timestamp(6),   -- 撮合时间
	code varchar(20) not null references stock(code) on delete set null on update cascade  -- 待交易的股票代码 例如'BABA','MSFT'
);

-- 卖出成交视图
create view dealsAsk as
select askid, code,
       sum(shares) as sharesDealed,
       sum(shares * matchprice) as totalPrice,
       sum(shares * matchprice)/sum(shares) as avgPrice,
       max(matchtime) as time
from matchs
group by askid, code;

-- 买入成交视图
create view dealsBid as
select bidid, code,
       sum(shares) as sharesDealed,
       sum(shares * matchprice) as totalPrice,
       sum(shares * matchprice)/sum(shares) as avgPrice,
       max(matchtime) as time
from matchs
group by bidid, code;
