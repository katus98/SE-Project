use StockTradingSys;

-- 清除全部表中的内容
delete from tempinstructions;
delete from intereststock;
delete from matchs;
delete from asks;
delete from bids;
delete from capitalaccountio;
delete from jobberworker;
delete from capitalaccount;
delete from stockhold;
delete from corporateaccount;
delete from personalaccount;
delete from idreference;
delete from stock_history;
delete from stock;

-- Group-E
insert into 
	stock(code, name_stock, current_price, last_endprice, amount, permission, notification, percentagePriceChange, st) 
	values
	("000001", "平安银行", 12.79, 12.79, 1000000000, true, null, 0.1, false), 
	("000002", "万科A", 29.53, 29.15, 1000000000, true, null, 0.1, false), 
	("000003", "国农科技", 19.6, 19.64, 1000000000, true, null, 0.05, true), 
	("000004", "世纪星源", 3.73, 3.72, 1000000000, true, null, 0.1, false), 
	("000005", "深振业A", 6.5, 6.5, 1000000000, true, null, 0.1, false), 
	("000006", "全新好", 8.26, 8.41, 1000000000, true, null, 0.05, true), 
	("000007", "神州高铁", 4.67, 4.59, 1000000000, true, null, 0.1, false), 
	("000008", "中国宝安", 6.88, 6.57, 1000000000, true, null, 0.1, false), 
	("000009", "美丽生态", 3.97, 3.87, 1000000000, true, null, 0.1, false), 
	("000010", "深物业A", 11.15, 11.09, 1000000000, true, null, 0.1, false),
	("000011", "南玻A", 5.59, 5.63, 1000000000, true, null, 10000, false),
	("000012", "沙河股份", 11.56, 11.51, 1000000000, true, null, 10000, false),
	("000013", "深康佳A", 5.74, 5.9, 1000000000, true, null, 10000, false),
	("000014", "深中华A", 5.54, 5.4, 1000000000, true, null, 10000, false),
	("000015", "神州长城", 2.95, 2.94, 1000000000, true, null, 10000, false),
	("000016", "深粮控股", 8.7, 8.75, 1000000000, true, null, 10000, false),
	("000017", "深华发A", 12.48, 12.49, 1000000000, true, null, 10000, false),
	("000018", "深科技", 8.32, 8.42, 1000000000, true, null, 10000, false),
	("000019", "深赤湾A", 16.64, 16.69, 1000000000, true, null, 10000, false),
	("000020", "深天地A", 15.98, 16.04, 1000000000, true, null, 10000, false),
	("000021", "特力A", 33.17, 33.09, 1000000000, true, null, 10000, false),
	("000022", "飞亚达A", 9.15, 9.23, 1000000000, true, null, 10000, false),
	("000023", "深圳能源", 6.58, 6.49, 1000000000, true, null, 0.1, false),
	("000024", "国药一致", 49.1, 49.09, 1000000000, true, null, 0.05, true),
	("000025", "富奥股份", 5.09, 5.26, 1000000000, true, null, 0.1, false),
	("000026", "中粮地产", 6.12, 6.19, 1000000000, true, null, 0.1, false),
	("000027", "深桑达A", 9.7, 9.59, 1000000000, true, null, 0.1, false),
	("000028", "神州数码", 14.99, 14.79, 1000000000, true, null, 0.1, false),
	("000029", "中国天楹", 5.47, 5.61, 1000000000, true, null, 0.1, false),
	("000030", "中集集团", 13.8, 13.69, 1000000000, true, null, 0.05, true);

update stock set today_startprice = last_endprice, current_price = last_endprice;
update stock set volumn = current_price * amount;

-- Group-A
insert into 
	idreference(accountid, personid) 
	values
	(0, 0), 
	(1, 1), 
	(2, 2), 
	(3, 3), 
	(4, 4), 
	(5, 5), 
	(6, 2), 
	(1000000001, 1000000001), 
	(1000000002, 1000000002), 
	(1000000003, 1000000003), 
	(1000000004, 1000000004), 
	(1000000005, 1000000005);

insert into 
	personalaccount(accountid, registertime, name, gender, identityid, homeaddress, work, educationback, workaddress, phonenumber, agentid, state, personid) 
	values
	(0, "2019-1-1 00:00:00", "孙克染", "male", "210211200001016666", "浙江省杭州市浙江大学青溪1舍", "学生", "本科", "无", "18000004860", null, "normal", 0),
	(1, "2019-2-25 15:23:33", "张三", "male", "33000119770422003X", "浙江省杭州市港湾家园1幢202", "待业", "高中", "无", "17697390598", null, "normal", 1),
	(2, "2019-2-26 09:15:20", "李四", "female", "330001198711040223", "浙江省杭州市信义坊3幢402", "家庭主妇", "本科", "无", "13809382267", null, "frozen", 2),
	(3, "2019-2-27 17:06:55", "王五", "female", "33000119770422003X", "浙江省宁波市鄞州区永达西路", "工厂工人", "高中", "开发区金地工厂", "18965703689", null, "logout", 3),
	(4, "2019-2-28 16:41:11", "赵六", "male", "11010119910507005X", "北京市朝阳区金叶地王花园11幢601", "销售经理", "研究生", "传奇奢华汽车4S店", "15820770108", "110101198710210000", "normal", 4),
	(5, "2019-3-1 19:04:32", "孙七", "male", "430103198810132772", "湖南省长沙市碧桂园山湖城5幢502", "工人", "初中", "睿临汽车零部件加工厂", "15487338739", null, "normal", 5),
	(6, "2019-3-12 08:10:20", "李四", "female", "330001198711040223", "浙江省杭州市信义坊3幢402", "家庭主妇", "本科", "无", "13809382267", null, "normal", 2);

insert into 
	corporateaccount(accountid, registrationid, licenseid, identityid, name, phonenumber, workaddress, authorizername, authorizeridentityid, authorizerphonenumber, authorizeraddress, state, personid) 
	values
	(1000000001, "1", "11", "330726199904037050", "黄金", "17868767175", "杭州大厦", "黄金金", "330726198906093212", "17468767175", "杭州大厦", "normal", 1000000001),
	(1000000002, "2", "12", "654322199007086832", "白银", "17868767176", "杭州老和山", "白银银", "654322197702086277", "17468767176", "杭州老和山", "normal", 1000000002),
	(1000000003, "3", "13", "330103199802129042", "钱多", "17868767177", "北京王府井全聚德", "钱多多", "330103198212127296", "17468767177", "北京王府井全聚德", "normal", 1000000003),
	(1000000004, "4", "14", "210213188912217311", "金钱", "17868767178", "温州江南皮革厂", "金钱钱", "210213188107212235", "17468767178", "温州江南皮革厂", "normal", 1000000004),
	(1000000005, "5", "15", "522125199811220912", "买银行", "17868767179", "义乌小商品市场", "买行行", "522125197605223467", "17468767179", "义乌小商品市场", "normal", 1000000005);

-- temp stockhold
insert into
	stockhold(personid, stockid, stocknum, stockcost) 
	select distinct personid, code, 0 as stocknum, 0.00 as stockcost from idreference cross join stock;
update stockhold set stocknum = 100000, stockcost = 12.79 where personid > 1000000000 and stockid = "000001";
update stockhold set stocknum = 100000, stockcost = 3.73 where personid > 1000000000 and stockid = "000004";
update stockhold set stocknum = 100000, stockcost = 29.53 where personid > 1000000000 and stockid = "000002";
update stockhold set stocknum = 100000, stockcost = 19.6 where personid > 1000000000 and stockid = "000003";
update stockhold set stocknum = 100000, stockcost = 6.5 where personid > 1000000000 and stockid = "000005";
update stockhold set stocknum = 100000, stockcost = 8.26 where personid > 1000000000 and stockid = "000006";
update stockhold set stocknum = 100000, stockcost = 4.67 where personid > 1000000000 and stockid = "000007";
update stockhold set stocknum = 100000, stockcost = 6.88 where personid > 1000000000 and stockid = "000008";
update stockhold set stocknum = 100000, stockcost = 3.97 where personid > 1000000000 and stockid = "000009";
update stockhold set stocknum = 100000, stockcost = 11.15 where personid > 1000000000 and stockid = "000010";
update stockhold set stocknum = 100000, stockcost = 16.64 where personid > 1000000000 and stockid = "000019";
update stockhold set stocknum = 100000, stockcost = 15.98 where personid > 1000000000 and stockid = "000020";
-- 请根据需要进一步补充

-- Group-B
insert into 
	capitalaccount(capitalaccountid, tradepassword, cashpassword, identificationid, relatedsecuritiesaccountid, capitalaccountstate, availablemoney, frozenmoney, interestremained)
	values
	(2019007, 'skrgod', '980818', '210211200001016666', 0, 'normal', 98000000000.00, 0.00, 0.00),
	(2019101, '115165', '495165', '412726198412232666', 1, 'normal', 4121544214.38, 50000.00, 3.45),
	(2019102, '198273', '976164', '481892196608162588', 2, 'normal', 56127.96, 0.00, 8.96),
	(2019103, '847922', '254929', '456387199006252698', null, 'frozen', 0.00, 9551.16, 2.39),
	(2019104, '516951', '717921', '464892198509152896', 3, 'logout', 0.00, 0.00, 0.00),
	(2019105, '115165', '495385', '412726199705168866', 4, 'normal', 4141701624.38, 50000.00, 3.45),
	(2019106, '2345670', '2345670', '419252196608162588', 1000000005, 'normal', 56127.96, 0.00, 8.96),
	(2019107, '896922', '289229', '491527199006252698', null, 'frozen', 0.00, 9551.16, 2.39),
	(2019108, '516921', '714921', '429891198509152896', null, 'logout', 0.00, 0.00, 0.00),
	(2019109, '2345670', '2345670', '481192198412232666', 1000000004, 'normal', 41489.38, 0.00, 3.45),
	(2019110, '2345670', '2345670', '429212196608162588', 1000000003, 'normal', 56127.96, 0.00, 8.96),
	(2019111, '846952', '254829', '491470199006252698', null, 'frozen', 0.00, 9551.16, 2.39),
	(2019112, '518951', '799921', '464098198509152896', null, 'logout', 0.00, 0.00, 0.00),
	(2019113, '2345670', '2345670', '419126198412232666', 1000000001, 'normal', 41244.38, 0.00, 3.45),
	(2019114, '2345670', '2345670', '481892196908162588', 1000000002, 'normal', 56147.96, 0.00, 8.96),
	(2019115, '848922', '251489', '456387199908526998', null, 'frozen', 0.00, 9551.16, 2.39),
	(2019116, '511851', '715591', '464892198908091796', 5, 'normal', 0.00, 0.00, 0.00);

insert into 
	jobberworker(jobberworkerid, jobberworkerpassword)
	values
	(2019001, 'wangyilin'), 
	(2019002, 'subin'), 
	(2019003, 'liangshuchen'), 
	(2019004, 'limingtao'), 
	(2019005, 'sunkeran');
