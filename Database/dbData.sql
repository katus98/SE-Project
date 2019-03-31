-- 清除全部表中的内容
delete from dealsask;
delete from dealsbid;
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
	stock(code, name_stock, current_price, last_endprice, today_startprice, amount, permission, notification, st) 
	values
	("000001", "平安银行", 12.75, 12.79, 12.68, 1000000000, true, null, false), 
	("000002", "万科A", 29.53, 29.15, 29.15, 1000000000, true, null, false), 
	("000003", "国农科技", 19.6, 19.64, 19.99, 1000000000, true, null, false), 
	("000004", "世纪星源", 3.73, 3.72, 3.72, 1000000000, true, null, false), 
	("000005", "深振业A", 6.5, 6.5, 6.44, 1000000000, true, null, false), 
	("000006", "全新好", 8.26, 8.41, 8.12, 1000000000, true, null, false), 
	("000007", "神州高铁", 4.67, 4.59, 4.59, 1000000000, true, null, false), 
	("000008", "中国宝安", 6.88, 6.57, 6.58, 1000000000, true, null, false), 
	("000009", "美丽生态", 3.97, 3.87, 3.87, 1000000000, true, null, false), 
	("000010", "深物业A", 11.15, 11.09, 11.09, 1000000000, true, null, false);

-- Group-A
insert into 
	idreference(accountid, personid) 
	values
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
