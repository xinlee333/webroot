var crypto = require('crypto')
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

/*每次要修改这里*/
var pre = 'TX';			// 前缀
var type = '02';		// 卡类型
var attachmentID = 2;	// 这次生成的附件ID
var gameID = 1;			// 游戏ID
var total = 20000;		// 这次生成的数量
//gen();
/*每次要修改这里*/

var count = 0;

function gen()
{
	// 随机卡号
	var no = crypto.randomBytes(3);
	no = (pre + type + no.toString('hex')).toUpperCase();

	// 插数据库，用数据库去重
	mysql.query(
		'insert into card set ?',
		[{type: type, no: no, attachmentid: attachmentID, gameid: gameID}],
		function(err, result)
		{
			if(err)
			{
				if(err.errno == 1062)
				{
					// 重复了
					gen();
				}
				else
				{
					throw err;
				}
			}
			else
			{
				count += 1;

				console.log(count + ' ' + no)

				if(count >= total)
				{
					// 够了
					console.log('生成成功...')
					return;
				}

				gen();
			}
		});
}

