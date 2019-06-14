
var sqlMap = {
    user: {
        add: 'insert into user(id, name, age) values (0, ?, ?)'
    }
};

module.exports = sqlMap;
