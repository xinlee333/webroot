var mysql = require('mysql').createPool(
	{
		connectionLimit: 1,
		host: '10.9.28.231',
		port: 3306,
		user: 'root',
		password: '',
		database: 'xx',
		charset: 'UTF8_GENERAL_CI',
		debug: false
	});

// transfer
var tableName = 'transfer';
mysql.query('DROP TABLE IF EXISTS ??', [tableName]);
mysql.query(
	'CREATE TABLE ?? (\
		`id` int(10) unsigned NOT NULL AUTO_INCREMENT,\
		`userid` int(10) unsigned NOT NULL,\
		`coin` int(10) unsigned NOT NULL,\
		`serverid` int(10) unsigned NOT NULL,\
		`orderno` char(20) NOT NULL,\
		`time` timestamp DEFAULT CURRENT_TIMESTAMP,\
		`processed` tinyint(3) unsigned DEFAULT 0,\
		PRIMARY KEY (`id`),\
		UNIQUE KEY `orderno` (`orderno`),\
		KEY `processed` (`processed`)\
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

// account
var tableName = 'account';
mysql.query('DROP TABLE IF EXISTS ??', [tableName]);
mysql.query(
	'CREATE TABLE ?? (\
		`id` int(10) unsigned NOT NULL AUTO_INCREMENT,\
		`channel` char(16) NOT NULL,\
		`username` char(16) NOT NULL,\
		`password` char(42) NOT NULL,\
		PRIMARY KEY (`id`),\
		UNIQUE KEY `channel` (`channel`, `username`),\
		KEY `password` (`password`)\
	) ENGINE=MyISAM AUTO_INCREMENT=100000 DEFAULT CHARSET=utf8', 
	[tableName],
	function(err, result)
	{
		if(err)
		{
			throw err;
		}
		console.log(tableName + ' finished...')
	});

// 临时放点测试用户
for(var n = 0; n < 1000; ++n)
{
	mysql.query(
		'INSERT INTO ?? SET ?', 
		[tableName, {id: n + 1, channel: 'kooyx', username: n + 1, password: 1}],
		function(err, result)
		{
			if(err)
			{
				throw err;
			}
		});
}

// uc
/*var tableName = '000255_account'
mysql.query('DROP TABLE IF EXISTS ??', [tableName]);
mysql.query(
	'CREATE TABLE ?? (\
		`id` int(10) unsigned NOT NULL,\
		`password` char(42) NOT NULL,\
		PRIMARY KEY (`id`),\
		KEY `password` (`password`)\
	) ENGINE=MyISAM DEFAULT CHARSET=utf8',
	[tableName],
	function(err, result)
	{
		if(err)
		{
			throw err;
		}
		console.log(tableName + ' finished...')
	});
*/