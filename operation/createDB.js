var mysql = require('mysql').createPool(
	{
		connectionLimit: 1,
		host: '10.9.28.231',
		port: 3306,
		user: 'root',
		password: '',
		database: 'operation',
		charset: 'UTF8_GENERAL_CI',
		debug: false
	})

// card
var tableName = 'card';
mysql.query('DROP TABLE IF EXISTS ??', [tableName]);
mysql.query(
	'CREATE TABLE ?? (\
		`id` int(10) unsigned NOT NULL AUTO_INCREMENT,\
		`type` char(2) NOT NULL,\
		`no` char(16) NOT NULL,\
		`attachmentid` int(10) unsigned NOT NULL,\
		`gameid` int(10) unsigned DEFAULT NULL,\
		`serverid` int(10) unsigned DEFAULT NULL,\
		`roleid` int(10) unsigned DEFAULT NULL,\
		`time` int(10) unsigned DEFAULT 0,\
		PRIMARY KEY (`id`),\
		UNIQUE KEY `no` (`no`),\
		UNIQUE KEY `type` (`type`, `gameid`, `serverid`, `roleid`),\
		KEY `time` (`time`)\
	) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8', 
	[tableName],
	function(err, result)
	{
		if(err)
		{
			throw err;
		}
		console.log(tableName + ' finished...')
	});

// attachment
var tableName = 'attachment';
mysql.query('DROP TABLE IF EXISTS ??', [tableName]);
mysql.query(
	'CREATE TABLE ?? (\
		`id` int(10) unsigned NOT NULL AUTO_INCREMENT,\
		`content` char(255) NOT NULL,\
		`_desc` char(255) DEFAULT NULL,\
		PRIMARY KEY (`id`)\
	) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8', 
	[tableName],
	function(err, result)
	{
		if(err)
		{
			throw err;
		}
		console.log(tableName + ' finished...')
	});


/*var json = {
    "id":3001,
    "xp":1,
    "money":2,
    "coin":3,
    "jiFen":4,
    "items":[
      {  "typeID":301001,
        "count":1}
    ],
    "params":[
        123
    ]
};

mysql.query(
	'update attachment set content = ?', JSON.stringify(json),
	function(err, result)
	{
		console.log(err);
	});*/
