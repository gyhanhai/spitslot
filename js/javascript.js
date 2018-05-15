/*-----------------------------------------------------------------------------
Javascript Functions
-------------------------------------------------------------------------------

Date : 03 / 05 / 2018
Author : loveasia
-----------------------------------------------------------------------------*/
	var dappAddress = "n1n28qe7jh1Xz3H2b1SqCH29qGWre5hQ9qa";
$(document).ready(function() {

	$('.theme-login').click(function() {
		$('.theme-popover-mask').fadeIn(100);
		$('.theme-popover').slideDown(200);
	})
	$('.theme-poptit .close').click(function() {
		$('.theme-popover-mask').fadeOut(100);
		$('.theme-popover').slideUp(200);
	})


	//pageinit--nebulas.min.js
	var HttpRequest = require("nebulas").HttpRequest;
	var Neb = require("nebulas").Neb;
	var Account = require("nebulas").Account;
	var Transaction = require("nebulas").Transaction;
	var Unit = require("nebulas").Unit;
	var myneb = new Neb();
	myneb.setRequest(new HttpRequest("https://testnet.nebulas.io"));
	var account, tx, txhash;

	//==========
	var pcallFunction = "read";
	var pcallArgs = '["9999","0"]';
	myneb.api.call({
		from: dappAddress,
		to: dappAddress,
		value: 0,
		contract: {
			function: pcallFunction,
			args: pcallArgs
		},
		gasPrice: 1000000,
		gasLimit: 2000000,
	}).then(function(tx) {
		pcbSearch(tx)
	});

	function pcbSearch(presp) {
		var presult = presp.result;
		if(presult != "null") {
			var results = presult.split("_");

			var contentHtml = "";

			for(var pi = 0; pi < results.length; pi++) {
				var result = results[pi];
				if(pi == 0) {
					result = result + '"';
				} else if(pi == results.length - 1) {
					result = '"' + result;
				} else {
					result = '"' + result + '"';
				}
				var pjsonobj = jQuery.parseJSON(result);
				var data = eval("(" + pjsonobj + ")");

				var time = timeStamp2String(data.timestamp);
				contentHtml += '<div class="title">' +
					'<div class="clearfix" align="left" style="margin-left: 15px;">' +
					'<font color="darkgreen" size="4">' + data.title + '</font>' +
					'<font size="2" style="margin-left: 30px;">' + time + '</font>' +
					'</div>' +
					'<div class="content" style="margin-left: 20px;" align="left">' +
					'<span><font size="2">' + data.content + '</font>' +
					'</span>' +
					'</div>' +
					'<div class="content" style="margin-right: 20px;" align="right">' +
					'<span><font size="2" color="tomato">---- ' + data.author + '</font>' +
					'</span>' +
					'</div>' +
					'</div>';

			}

			$("#content-mos").html(contentHtml);
		}

	}


	jQuery(window).resize(function() {
		var vpWidth = jQuery('article .lb-audio').width();
		if(vpWidth < 570) {
			jQuery('article .jp-controls-holder').css('width', vpWidth + 'px');
			var newWidth = vpWidth - 260;
			jQuery('article .jp-progress').css('width', newWidth + 'px');
		} else {
			jQuery('article .jp-controls-holder').css('width', 570 + 'px');
			jQuery('article .jp-progress').css('width', 310 + 'px');
		}
	});

	// Fix background pattern
	var screenheight = $(window).height();
	$('#container').css('min-height', screenheight);
});

function saveSpitslot() {
	var NebPay = require("nebpay"); //https://github.com/nebulasio/nebPay
	var nebPay = new NebPay();

	if(typeof(webExtensionWallet) === "undefined") {
		$('#cardspanpp1').text('无法使用');
		$('#cardspanpp2').text('首次使用，请先安装钱包插件>>');
		$('#cardspanpp2').attr('target', '_blank');
		$('#cardspanpp2').attr('href', 'https://github.com/ChengOrangeJu/WebExtensionWallet');
	} else {
		var title = $('#spitslotTitle').val();
		var content = $('#spitslotContent').val();
		if(title == "") {
			alert('请填写标题。');
			return;
		}
		if(content == "") {
			alert('请填写内容。');
			return;
		}

		var to = dappAddress;
		var value = "0";
		var callFunction = "save";
		var callArgs = '["' + title + '","' + content + '"]';

		nebPay.call(to, value, callFunction, callArgs, {
			listener: cbPush //指定回调函数
		});

		function cbPush(resp) {
			var jsonobjresp = JSON.stringify(resp);
			if(jsonobjresp.indexOf("txhash") != -1) {
				 location.reload() 
			}
		}

	}

}


function timeStamp2String(time) {
	var datetime = new Date();
	datetime.setTime(time);
	var year = datetime.getFullYear();
	var month = datetime.getMonth() + 1;
	var date = datetime.getDate();
	var hour = datetime.getHours();
	var minute = datetime.getMinutes();
	var second = datetime.getSeconds();
	var mseconds = datetime.getMilliseconds();
	return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
};