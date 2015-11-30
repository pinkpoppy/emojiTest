/**
 * Created by sszhu on 15/11/25.
 */
var isQQTab = true;
var isEmojiTab = false;
var isChange = false;
var emojiChange = false;
var emojiArr = [];

var currentchoosenExpression= "";
$(document).ready(function(){
  //hide emoji-page-dot-wrap
  $('.emoji-page-dot-wrap').hide();
  readEmojiUnicodeFromJson();
  //默认显示 qq 表情版块第一页
  produceQQ(0,isChange);

  $('.qq-page-dot').click(function(e) {
    var pageNum = $(this).attr('data-id');

    isChange = true;
    produceQQ(pageNum,isChange);
  });


  //表情卡切换动作
  $('.show-control').click(function() {
    $('.emoji-cell-wrap').remove();
    var tabId = $(this).attr('id');
    if (isQQTab && tabId=="show-qq") return;
    if (isEmojiTab && tabId=="show-emoji") return;

    if (tabId=="show-qq") {
      $('.emoji-cell-wrap').remove();
      $('#show-emoji').removeClass('tab-choosen');
      $('#show-qq').addClass('tab-choosen');

      $('.emoji-page-dot-wrap').hide();
      $('.qq-page-dot-wrap').show();
      isQQTab = true;
      isEmojiTab = false;
      produceQQ(0,false);
    } else if (tabId=="show-emoji") {
      $('.cell-wrap').remove();
      isEmojiTab = true;
      isQQTab = false;

      $('#show-qq').removeClass('tab-choosen');
      $('#show-emoji').addClass('tab-choosen');

      $('.qq-page-dot-wrap').hide();
      $('.emoji-page-dot-wrap').show();
      produceEmoji(0,false);
    }

  });

  //emoji dot changed
  $('.emoji-page-dot').click(function (e) {
    var pageNum = $(this).attr('data-id');

    emojiChange = pageNum==0? false:true;
		if (isEmojiTab) {
			emojiChange = true;
		}
    produceEmoji(pageNum,emojiChange);
  });
	
});

function produceEmoji(pageNum,isChange) {

  var start = pageNum * 55;

  var end = Math.min((parseInt(pageNum)+1)* 55 ,emojiArr.length);

  if (isChange) { //说明是在特定选项卡中切换,基本cell 结构已经创建
    var currentShowedEmojiArr = document.getElementsByClassName('expression-cell');

    Array.prototype.forEach.call(currentShowedEmojiArr,function(element,index){
      element.innerHTML = '';
    });
    var myIndex = start;
    while(isChange && myIndex < end) {
      Array.prototype.forEach.call(currentShowedEmojiArr,function(element,index){
        if (index==myIndex % 55) {
          element.innerHTML = emojiArr[myIndex];
          return false;
        }
      });
      myIndex ++;
    }

  } else {
    var cell_wrap = $("<div class='emoji-cell-wrap'></div>");
    var cnt = 0;
    for(var i = start; i < end; i++) {
      var span = $("<span class='expression-cell'>"+emojiArr[i]+"</span>");
      var x = (i % 11) * 36 ;
      var y = parseInt(i / 11) * 36;

      span.css("left",x);
      span.css("top",y);
      ++cnt;
      cell_wrap.append(span);
			//获取表情编码
			$(span).click(function(e){
				currentchoosenExpression = $(this).text();
				//console.log(currentchoosenExpression);
			});

    }
    console.log(cnt);
    $(".expression-body").append(cell_wrap);
  }
}

function produceQQ(pageNum,isChange) {
    var cell_wrap = $("<div class='cell-wrap'></div>");
    var start = pageNum * 55;
    var end = pageNum == 0 ? 55 : 100;

    var imgArr = document.getElementsByClassName('expression-img');
    Array.prototype.forEach.call(imgArr,function(element) {
      element.setAttribute('src',"");
    });
    var i = start;
    while(isChange && i < end) {
      var newSrc = "resources/qq/Expression_"+(i+1)+".png";

      Array.prototype.forEach.call(imgArr,function(element,index){
        if (index== i%55 ) {
          element.setAttribute("src",newSrc);
          return false;
        }
      });
      i++;
      console.log(newSrc);
    }

    if (isChange) return;
    for (var i = start; i < end; i++) {
      var span = $("<span class='expression-cell'></span>");
      var img = $("<img class='expression-img' src='resources/qq/Expression_"+(i+1)+".png'>")
      span.append(img);
      //在这里设置span的position
      var x = (i % 11) * 36 ;
      var y = parseInt(i / 11) * 36;
      console.log(x,y);

      span.css("left",x);
      span.css("top",y);
			
			$(span).click(function () {
				var imgSrc = $(this).children().attr('src');
				console.log(imgSrc);
				currentchoosenExpression = changeToExpressionSerialNumber(imgSrc);
				//console.log(currentchoosenExpression);
			});
      cell_wrap.append(span);

    }
    $(".expression-body").append(cell_wrap);
}

function readEmojiUnicodeFromJson(){
  var url = "resources/emoji.json";
  function callBack(jsonData) {
    emojiArr = jsonData.emojiArr;
    console.log("一共有: " + emojiArr.length + "个表情");
    for (var i = 0; i < emojiArr.length; i++) {
      var val = emojiArr[i].replace('U+','&#x');
      emojiArr[i] = val;
      console.log(emojiArr[i]);
    }
  };
  $.getJSON(url,callBack);
}

function changeToExpressionSerialNumber(imgSrc) {
	var indexOf_ = imgSrc.indexOf('_');
	if (indexOf_!= -1) {
		imgSrc = imgSrc.slice(indexOf_+1,imgSrc.length-4);
		var newLen = imgSrc.length;
		if (newLen==1) {
			imgSrc = "" + "00" + imgSrc;
		} else if (newLen==2) {
			imgSrc = "" + "0" + imgSrc;
		}
	}
	return imgSrc;
}


