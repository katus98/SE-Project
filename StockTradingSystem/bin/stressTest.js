let siege = require('siege');

siege('node ./bin/www')   // node ./bin/www 为服务启动脚本
    .wait(10000)   // 延迟时间
    .on(3000)   // 被压测的服务端口
    .concurrent(1000)   // 并发数
    .for(1000000).times   // .times或者.seconds
    .post('/home/orderSubmit', {
        userId: '2019007',
        tradeType: 'sell',
        stockId: '000001',
        stockNum: '1',
        pricePer: '12'
    })   // 需要压测的页面
    .attack();   // 执行压测

