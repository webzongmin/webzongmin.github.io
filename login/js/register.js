//  屏幕适配
window.onload=window.onresize=function(){
  var winheight=$(window).height();
  if(winheight<760){
    winheight=760;
  }
  var headerheight=$("header").height();
  var secHeight=winheight-(headerheight*2);
  $("section").css("height",secHeight);
}


var guidCode,
	flag;
init();
function init(){
  bindEvent();
}

function bindEvent(){

  $("#pswregister").blur(function(){
		pwdLen();
	});
  $("#getcode").click(function(){
  	if(pwdLen() == 1){
  		$(".code").show();
    		checkImg();
  	}else{
  		return;
  	}

  });
  $(".close").click(function(){
    $(".code").hide();
  });
  $("#phone").blur(function(){
    checkPhone();
  });
  $("section .code button").click(function(){
  checkCode();
});
$("#formLogin .submitRegis button").click(function(){
	register()
});
}

//  获取验证码

function checkImg(){

  $.ajax({
    url:'http://114.55.128.51:7051/user/register/getVerifyCode',
    success:function(data){
      if(data.status == 200){
        console.log(data);
        var imgsrc='http://121.199.11.87:8118/VerificationCode/CreateVerificationCode/?guid=';
        $('.yanzheng').attr('src',imgsrc+data.guidCode);
        guidCode=data.guidCode;
      }else{
        alert(data.msg);
      }
    }
  })
}
$('.yanzheng').click(function(){
  checkImg();
})

/*验证手机号是否可用*/
function checkPhone(){
    var phone = $('#phone').val();
    if(!(/^1[3|4|5|7|8]\d{9}$/.test(phone))){
      $("#tip").html("手机号码有误，请重填");
      $("#tip").css("color","red");
        return false;
    }
    $.ajax({
    type:"post",
    url:'http://114.55.128.51:7051/user/register/checkUserName',
    data:{
      "userName":phone
    },
    success:function(result){
      if(result.status==200){
        $("#tip").html(result.data);
        $('#tip').css("color","green")
      }else if(result.status==201){
        $("#tip").html(result.data);
        $("#tip").css("color","red");
      }else{
        $("#tip").html("手机号不可用");
          $("#tip").css("color","red");
      }
    }
  });
}

/*验证激活码是否正确并发送短信验证码*/
function checkCode(){
  var verifyCode=$('#verification').val();
  var phone = $('#phone').val();
    $.ajax({
    type:"post",
    url:'http://114.55.128.51:7051/user/register/checkVerifyCode',
    data:{
      "VerifyCode":verifyCode,
      "guidCode":guidCode,
      "userName":phone
    },
    success:function(result){
      if(result.status==200){
        $("section .code").css("display","none");
        $("#phonecode").html("正在发送");
        $.ajax({
          type:"post",
          url:'http://114.55.128.51:7051/user/register/getVerifySMS',
          data:{
            "guidCode":guidCode
          },
          success:function(result){

            if(result.status=="200"){
            	console.log(guidCode)
              $("#phonecode").html("短信发送成功");
            }
          }
        })
      }else if(result.isSuccess==false){
        checkImg();
        $("#phonecode").html(result.msg);
        return;
      }else{
        $("#phonecode").html("验证码错误");
        checkImg();
        return;
      }
    }
  });
}

/*注册用户*/
function register(){
  var phone = $('#phone').val();
  var pwd=$('#pswregister').val();
  var note=$('#txtpwd').val();
  $.ajax({
    type:"post",
    url:'http://114.55.128.51:7051/user/register/userRegister',
    async:false,
    data:{
      "guidCode":guidCode,
      "userName":phone,
      "passWord":pwd,
      "SMSCode":note
    },
    success:function(data){
      if(data.status==200){
        window.location.href="login.html";
      }
    }
  });
}

//判断密码强度

function pwdLen(){
	var val=$("#pswregister").val();
	  if (val.length<6 || val.length>16){
	  	$("#pwdTip").text("请输入6-16位的字母、数字、下划线");
	      $("#pwdTip").css("color","red");
	      return 0;
	  }else{
	      $("#pwdTip").text("密码可以使用");
	      $("#pwdTip").css("color","green");
	      return 1;
	  }
}


//判断输入密码的类型
function CharMode(iN){
  if (iN>=48 && iN <=57) //数字
  return 1;
  if (iN>=65 && iN <=90) //大写
  return 2;
  if (iN>=97 && iN <=122) //小写
  return 4;
  else
  return 8;
}
//bitTotal函数
//计算密码模式
function bitTotal(num){
  modes=0;
  for (i=0;i<4;i++){
    if (num & 1){
      modes++;
    }
    num>>>=1;
  }
  return modes;
}
//返回强度级别
function checkStrong(sPW){
  if (sPW.length<=4)  {
    return 0; //密码太短
  }
  Modes=0;
  for (i=0;i<sPW.length;i++){
  //密码模式
  Modes|=CharMode(sPW.charCodeAt(i));
  }
  return bitTotal(Modes);
}

//显示颜色
function pwStrength(pwd){
  O_color="#eeeeee";
  L_color="#ffd498";
  M_color="#ffbd61";
  H_color="#ffaa33";
  if (pwd==null||pwd==''){
    Lcolor=Mcolor=Hcolor=O_color;
  }else{
    S_level=checkStrong(pwd);
    switch(S_level) {
    case 0:
    Lcolor=Mcolor=Hcolor=O_color;
    case 1:
    Lcolor=L_color;
    Mcolor=Hcolor=O_color;
    break;
    case 2:
    Lcolor=L_color;
    Mcolor=M_color;
    Hcolor=O_color;
    break;
    default:
    Lcolor=Lcolor;
    Mcolor=M_color;
    Hcolor=H_color;
    }
  }
  document.getElementById("strength_L").style.background=Lcolor;
  document.getElementById("strength_M").style.background=Mcolor;
  document.getElementById("strength_H").style.background=Hcolor;
  return;
}