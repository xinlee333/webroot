var express = require('express');
var http = require('http');
var url = require('url');
var queryString = require('querystring');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var mysql = require('mysql').createPool(
	{
		host: '10.9.28.231',
		port: 3306,
		user: 'root',
		password: '',
		database: 'xx',
		charset: 'UTF8_GENERAL_CI',
		debug: false
	});

var app = express();
app.use(bodyParser.urlencoded());

app.post(
	'/transfer.php',
	function(req, res)
	{
		if(!req.body.sign)
		{
			res.end();
			return;
		}

		// 生成md5不用sign
		var sign = req.body.sign;
		delete req.body.sign;

		// 构建参数数组
		var params = [];
		var index = 0;
		for(var k in req.body)
		{
			params[index++] = [k, req.body[k]];
		}

		// 升序排序
		params.sort();

		// 参数值连在一起
		var md5 = "";
		for(var k in params)
		{
			md5 += params[k][1];
		}

		// 计算md5
		var hash = crypto.createHash('md5');
		hash.update(md5, 'utf8');
		md5 = hash.digest('hex').toLowerCase();
		delete hash;

		md5 += '3193F6C4ED45BD16EE60460F62C9000D';
		var hash = crypto.createHash('md5');
		hash.update(md5, 'utf8')
		md5 = hash.digest('hex').toLowerCase();
		delete hash

		// 验证合法性
		if(md5 != sign)
		{
			res.end();
			return;
		}

		// 写入数据库
		mysql.query(
			'insert into transfer set userid = ?, coin = ?, serverid = ?, orderno = ?', 
			[req.body.game_user_id, req.body.amount * 10, req.body.server_id, req.body.order_id],
			function(err, rows)
			{
				if(err)
				{
					res.end();
					return;
				}

				res.send('ok');
			})
	})

app.get(
	'/verify.php',
	function(req, res)
	{
		var ret = {};

		if(!req.query.channel || !req.query.username || !req.query.password)
		{
			ret.id = 0;
			res.send(JSON.stringify(ret));
			return;
		}

		mysql.query(
			'select id from account where channel = ? and username = ? and password = ? limit 1',
			[req.query.channel, req.query.username, req.query.password],
			function(err, rows)
			{
				if(err)
				{
					console.log(err);
					
					ret.id = 0;
					res.send(JSON.stringify(ret));
					return;
				}

				if(rows.length == 0)
				{
					ret.id = 0;
					res.send(JSON.stringify(ret));
					return;
				}

				res.send(JSON.stringify(rows[0]));
			});
	})

app.post(
	'/login.php',
	function(req, res)
	{
		// 必要参数检测
		if(!req.body.channel || !req.body.uapi_key || !req.body.uapi_secret)
		{
			res.send('parameter not complete');
			return;
		}

		var params = queryString.stringify(req.body);

		// 模拟请求http
		var post_options = {
			host: 'oauth.anysdk.com',
			port: '80',
			path: '/api/User/LoginOauth/',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': params.length
			}
		};

		var post_req = http.request(
			post_options,
			function(httpRes)
			{
				httpRes.setEncoding('utf8');
				httpRes.on(
					'data',
					function(data)
					{
						// 看看是不是验证成功了
						var ret = JSON.parse(data);
						if(ret.status == 'ok')
						{
							// 登录成功,随机产生密码,写入数据库,重复的不覆盖
							var password = crypto.randomBytes(16).toString('hex');
							mysql.query(
								'insert into account set channel = ?, username = ?, password = ? on duplicate key update password = ?', 
								[ret.common.channel, ret.common.uid, password, password],
								function(err, rows)
								{
									if(err)
									{
										console.log(err);
										res.end();
										return;
									}

									// 把密码发给客户端
									ret.ext = {password: password};
		
									data = JSON.stringify(ret);
									res.send(data);
								})
						}
						else
						{
							// 登录失败,直接返回给客户端
							res.send(data);
						}
					})
			});

		post_req.on(
			'error',
			function(err)
			{
				console.log(err);
				res.end();
			});

		post_req.write(params);
		post_req.end();
	}
)

app.listen(80);

// 定时将划拨操作发给游戏服务器
/*setTimeout(processTransfer, 5000);

var processTransfer = function()
{
	// 读取所有未处理的划拨
	mysql.query(
		'select * from transfer where processed = 0',
		function(err, rows)
		{
			if(err)
			{
				console.log(err);

				setTimeout(processTransfer, 5000);
				return;
			}

			async.map(
				rows,
				function(row, callback)
				{

				},
				function(err, results)
				{

				});
		})
}*/