var pomelo = window.pomelo;
var phoneNumber;
var password;
//var ip = "127.0.0.1";
var ip = window.location.hostname;
var port = "8001";
var base = 1000;
var increase = 25;
//add message on board



function postfunc(route, args, callback) {
	var url = "http://" + ip + ":" + port + "/" + route;

	$.post(url, args, function(data, status) {
		callback(data);
	}, "json");
}

//注册
function register() {
	phoneNumber = $("#regPhoneNumber").attr("value");
	password = $("#regPassword").attr("value");

	if (!phoneNumber || !password) {
		console.log("有值为空err");
	}
	var route = "user/register";
	var args = {
		phoneNumber: phoneNumber,
		password: password
	};

	postfunc(route, args, function(data) {
		if (data.error) {
			$('#tip').text('error:' + data.error);
			return;
		}
		console.log(data);
		$('#tip').text('注册成功');
	});

}

//登录
function login() {
	phoneNumber = $("#loginPhoneNumber").attr("value");
	password = $("#loginPassword").attr("value");

	if (!phoneNumber || !password) {
		console.log("有值为空err");
	}
	var route = "user/login";
	var args = {
		phoneNumber: phoneNumber,
		password: password
	};

	postfunc(route, args, function(data) {
		if (data.error) {
			$('#tip').text('error:' + data.error);
			return;
		}
		console.log(data);
		$('#tip').text('登录成功');
	});

}

//获取我的信息
function getMyInfo() {
	var route = "user/getMyInfo";
	postfunc(route, null, function(data) {
		if (data.error) {
			$('#tip8').text('error:' + data.error);
			return;
		}
		console.log(data);
		$('#tip8').text('获取我的信息成功');

		var element = $(document.createElement("tr"));
		var content = '<td>_________________________________________' +
		'</br>用户名:' + data.user.name + '&nbsp&nbsp|用户id:' + data.user.id +
		'</br>头像url:'+data.user.headimgUrl+'&nbsp&nbsp|性别:'+data.user.sex +
		'</br>学校:'+data.user.school +'&nbsp&nbsp|认证图片url:'+data.user.papersUrl +
		'</br>注册时间:'+data.user.regiterTime+
		'</br>电话号码:'+data.user.phoneNumber +
		'</br>是否通过授权:'+data.user.isVerify+'&nbsp&nbsp|授权通过时间:'+data.user.verifyTime +
		'</td>';
		element.html(content);
		$('#myInfo').append(element);

	});
}
//更新用户资料
function updateUserInfo() {
	var name = $("#name").attr("value");
	var headimgUrl = $("#headimgurl").attr("value");
	var school = $("#schoolname").attr("value");
	var papersUrl = $("#papersUrl").attr("value");
	var sex = $("#sex").val();


	if (!name || !headimgUrl || !school || !papersUrl || !sex) {
		console.log("有值为空err");
	}
	var route = "user/addNewInfo";
	var args = {
		name: name,
		headimgUrl: headimgUrl,
		school: school,
		papersUrl: papersUrl,
		sex: sex
	};

	postfunc(route, args, function(data) {
		if (data.error) {
			$('#tip1').text('error:' + data.error);
			return;
		}
		console.log(data);
		$('#tip1').text('更新成功');
	});

}
//添加商品
function addCommodity() {
	var commodityName = $("#commodityName").attr("value");
	var classifyType = $("#classifyType").val();
	var status = $("#status").val();
	var label = $("#label").attr("value");
	var commodityDescription = $("#commodityDescription").val();
	var paymentType = $("#paymentType").val();
	var payValue = $("#payValue").attr("value");
	var paymentDes = $("#paymentDes").attr("value");
	var picturesUrl = $("#commodityPicUrl").attr("value");
	var soundUrl = $("#soundUrl").attr("value");
	var effectTimeType = $("#effectTimeType").val();
	var locationX = $("#locationX").attr("value");
	var locationY = $("#locationY").attr("value");


	if (!commodityName || !classifyType || !label || !commodityDescription || !paymentType || !payValue || !soundUrl ||
		!paymentDes || !picturesUrl || !effectTimeType || !locationX || !locationY) {
		console.log("有值为空err");
	}
	var route = "commodity/addCommodity";
	var args = {
		name: commodityName,
		status: status, //商品发布类型:出售、求购
		classifyType: classifyType, //商品类型
		label: label, //商品标签
		commodityDescription: commodityDescription,
		effectTimeType: effectTimeType, //有效时间类型
		paymentType: paymentType, //支付类型
		paymentDes: paymentDes, //支付描述
		payValue: payValue, //支付金额
		picturesUrl: picturesUrl,
		soundUrl: soundUrl,
		locationX: locationX, //用户的地点x
		locationY: locationY //用户的地点y
	};

	postfunc(route, args, function(data) {
		if (data.error) {
			$('#tip2').text('error:' + data.error);
			return;
		}
		console.log(data);
		$('#tip2').text('商品添加成功');
	});
}

//获取附近的商品列表
function getCommodities() {
	var commoditiyClassifyType = $("#commoditiyClassifyType").val();
	var commoditiyStatus = $("#commoditiyStatus").val();
	var adressX = $("#adressX").attr("value");
	var adressY = $("#adressY").attr("value");

	if (!commoditiyClassifyType || !commoditiyStatus || !adressX || !adressY) {
		console.log("有值为空err");
	}
	var route = "commodity/getCommodities";
	var args = {
		classifyType: commoditiyClassifyType,
		status: commoditiyStatus,
		locationX: adressX,
		locationY: adressY
	};

	postfunc(route, args, function(data) {
		if (data.error) {
			$('#tip4').text('error:' + data.error);
			return;
		}
		console.log(data);
		$('#tip4').text('获取商品成功');
		for (var i = 0; i < data.commodities.length; i++) {
			var element = $(document.createElement("tr"));
			var content = '<td>_____________________________________________________________' +
			'</br>商品名:' + data.commodities[i].name + '&nbsp&nbsp|发布者id:' + data.commodities[i].userId +
			'</br>标签:'+data.commodities[i].label+'&nbsp&nbsp|商品发布类别:'+data.commodities[i].status +
			'</br>商品类别:'+data.commodities[i].classifyType +'&nbsp&nbsp|商品发布时间:'+data.commodities[i].issueTime +
			'</br>支付类型:'+data.commodities[i].paymentType+'&nbsp&nbsp|支付描述:'+data.commodities[i].paymentDes +
			'</br>支付金额:'+data.commodities[i].payValue+'&nbsp&nbsp|描述:'+data.commodities[i].description +
			'</br>商品图片url:'+data.commodities[i].picturesUrl+'&nbsp&nbsp|声音url:'+data.commodities[i].soundUrl +
			'</br>商品位置x:'+data.commodities[i].locationX+'&nbsp&nbsp|商品位置y:'+data.commodities[i].locationY +
			'</td>';
			element.html(content);
			$('#commodities').append(element);
		}

	});

}


//获取我的商品
function getMyCommodities() {

	var route = "commodity/getMyCommodities";

	postfunc(route, null, function(data) {
		if (data.error) {
			$('#tip3').text('error:' + data.error);
			return;
		}
		$('#tip3').text('获取自己商品列表成功');
		for (var i = 0; i < data.commodities.length; i++) {
			var element = $(document.createElement("tr"));
			var content = '<td>_____________________________________________________________' +
			'</br>商品名:' + data.commodities[i].name + '&nbsp&nbsp|发布者id:' + data.commodities[i].userId +
			'</br>标签:'+data.commodities[i].label+'&nbsp&nbsp|商品发布类别:'+data.commodities[i].status +
			'</br>商品类别:'+data.commodities[i].classifyType +'&nbsp&nbsp|商品发布时间:'+data.commodities[i].issueTime +
			'</br>支付类型:'+data.commodities[i].paymentType+'&nbsp&nbsp|支付描述:'+data.commodities[i].paymentDes +
			'</br>支付金额:'+data.commodities[i].payValue+'&nbsp&nbsp|描述:'+data.commodities[i].description +
			'</br>商品图片url:'+data.commodities[i].picturesUrl+'&nbsp&nbsp|声音url:'+data.commodities[i].soundUrl +
			'</br>商品位置x:'+data.commodities[i].locationX+'&nbsp&nbsp|商品位置y:'+data.commodities[i].locationY +
			'</td>';
			element.html(content);
			$('#myCommodities').append(element);
		}
	});

}

//发表评论
function addComment() {
	var replyCommodityId = $("#replyCommodityId").val();
	var replyContent = $("#replyContent").val();


	if (!replyCommodityId || !replyContent) {
		console.log("有值为空err");
	}
	var route = "comment/addComment";
	var args = {
		commodityId: replyCommodityId,
		content: replyContent
	};

	postfunc(route, args, function(data) {
		if (data.error) {
			$('#tip5').text('error:' + data.error);
			return;
		}
		console.log(data);
		$('#tip5').text('发表评论成功');
	});

}

//获取评论列表
function getComments() {
	var commentCommoditiyId = $("#commentCommoditiyId").val();

	if (!commentCommoditiyId) {
		console.log("有值为空err");
	}
	var route = "comment/getComments";
	var args = {
		commodityId: commentCommoditiyId
	};

	postfunc(route, args, function(data) {
		if (data.error) {
			$('#tip6').text('error:' + data.error);
			return;
		}

		$('#tip6').text('获取评论列表成功');
		for (var i = 0; i < data.comments.length; i++) {
			var element = $(document.createElement("tr"));
			var content = '<td>_____________________________________________________________' +
			'</br>评论id:' + data.comments[i].id + '&nbsp&nbsp|商品id:' + data.comments[i].commodityId +
			'</br>评论人id:'+data.comments[i].userId+'&nbsp&nbsp|评论发表时间:'+data.comments[i].commentTime +
			'</br>评论内容:'+data.comments[i].content +
			'</td>';
			element.html(content);
			$('#comments').append(element);
		}
	});

}

//获取我的评论列表
function getMyComments() {

	var route = "comment/getMyComments";

	postfunc(route, null, function(data) {
		if (data.error) {
			$('#tip7').text('error:' + data.error);
			return;
		}
		$('#tip7').text('获取我的评论列表成功');
		for (var i = 0; i < data.comments.length; i++) {
			var element = $(document.createElement("tr"));
			var content = '<td>_____________________________________________________________' +
			'</br>评论id:' + data.comments[i].id + '&nbsp&nbsp|商品id:' + data.comments[i].commodityId +
			'</br>评论人id:'+data.comments[i].userId+'&nbsp&nbsp|评论发表时间:'+data.comments[i].commentTime +
			'</br>评论内容:'+data.comments[i].content+
			'</td>';
			element.html(content);
			$('#myComments').append(element);
		}
	});

}
$(document).ready(function() {
	//注册
	$("#register").click(function() {
		register();
	});
	//登录
	$("#login").click(function() {
		login();
	});
	//获取我的信息
	$("#getMyInfo").click(function() {
		getMyInfo();
	});
	//更新用户资料
	$("#updateUserInfo").click(function() {
		console.log("updateUserInfo");
		updateUserInfo();
	});
	//添加商品
	$("#addcommodity").click(function() {
		console.log("addcommodity");
		addCommodity();
	});
	//获取我的商品
	$("#getMyCommodities").click(function() {
		console.log("getMyCommodities");
		getMyCommodities();
	});
	//获取商品
	$("#getCommodities").click(function() {
		console.log("getCommodities");
		getCommodities();
	});
	//发表评论
	$("#addComment").click(function() {
		console.log("addComment");
		addComment();
	});
	//获取评论列表
	$("#getComments").click(function() {
		console.log("getComments");
		getComments();
	});
	//获取我的评论列表
	$("#getMyComments").click(function() {
		console.log("getMyComments");
		getMyComments();
	});
	$("#getToken").click(function() {
		console.log("getToken");
		var route = "upload/getToken";

		postfunc(route, null, function(data) {
			//$('#tip10').text(data.uptoken);
			$('#token').val(data.uptoken);

		});
	});
});