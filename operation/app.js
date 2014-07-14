var express = require('express');
var mysql = require('mysql').createPool(
	{
		host: '10.9.28.231',
		port: 3306,
		user: 'root',
		password: '',
		database: 'operation',
		charset: 'UTF8_GENERAL_CI',
		debug: false
	});


var app = express();

app.get(
	'/verifycard.php',
	function(req, res)
	{
		var ret = {};

		if(
			!req.query.gameid ||
			!req.query.serverid ||
			!req.query.userid ||
			!req.query.roleid ||
			!req.query.cardno)
		{
			// 参数不全
			ret.err = 2;
			res.send(JSON.stringify(ret));
			return;
		}

		// 使用规则判断

		// 去数据库验证
		mysql.query(
			'select card.id, attachment.content from card, attachment where card.attachmentid = attachment.id and card.no = ? and card.gameid = ?',
			[req.query.cardno, req.query.gameid],
			function(err, rows)
			{
				if(err)
				{
					ret.err = 1;
					res.send(JSON.stringify(ret));
					return;
				}

				if(rows.length == 0)
				{
					// 卡号不存在
					ret.err = 3;
					res.send(JSON.stringify(ret));
					return;
				}

				// 领卡
				var content = rows[0].content;
				mysql.query(
					'update card set serverid = ?, roleid = ?, time = UNIX_TIMESTAMP() where id = ? and time = 0',
					[req.query.serverid, req.query.roleid, rows[0].id],
					function(err, result)
					{
						if(err)
						{
							if(err.errno == 1062)
							{
								// 已经领取过同样类型的卡了
								ret.err = 4;
								res.send(JSON.stringify(ret));
								return;
							}
							else
							{
								ret.err = 1;
								res.send(JSON.stringify(ret));
								return;
							}
						}

						if(result.affectedRows == 0)
						{
							// 此卡已经被使用过了
							ret.err = 5;
							res.send(JSON.stringify(ret));
							return;
						}

						// 领取成功
						ret.err = 0;
						ret.content = content;
						res.send(JSON.stringify(ret));
					})
			});
	})

app.listen(8080);