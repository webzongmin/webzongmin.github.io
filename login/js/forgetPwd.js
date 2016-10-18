window.onload = window.onresize = function () {
    var winheight = $(window).height();
    if (winheight < 760) {
        winheight = 760;
    }
    var headerheight = $("header").height();
    var secHeight = winheight - 2 * headerheight;
    $("section").css("height", secHeight);
}
var guidCode;
init();
function init(){
    getImgCode();
    bindEvent();
}

function bindEvent(){
    $('#getMsgCode').click(function () {
            getData();
     });
    $('#resetPwd').click(function () {
        resetPwd()
    });
    $(".close").click(function () {
        $(".code").hide();
    });
// 失去焦点时判断
    $("#phone").blur(function () {
        checkPhone();
    });

    $(".button").click(function () {
        checkCode()
    });

    $("#registerPwd").blur(function () {
         checkPwd();
    });
}

function getData(){
    $.ajax({
            url:'http://114.55.128.51:7051/user/pwdManager/sendResetSMS',
            type:"post",
            data:{
                guidCode: guidCode
            },
            success:function(data){
                var num=10;
                function time(){
                        if(num==0){
                            $('#getMsgCode').removeAttr("disabled").siblings('span').html("免费获取手机验证码");
                            num=10;
                        }else{
                            num--;
                            $('#getMsgCode').attr("disabled","disabled").siblings('span').html(""+num+"秒后可重新获取");
                            setTimeout(function(){
                                time();
                            },1000)
                        }
                }
                time();
                }
        })
}

//  重置密码
function resetPwd(){
    $.ajax({
            url:'http://114.55.128.51:7051/user/pwdManager/resetPwd',
            type:"post",
            data:{
               guidCode: guidCode,
                userName: $('#phone').val(),
                passWord: $('#registerPwd').val(),
                SMSCode: $('#notepsw').val()
            },
            success:function(data){
                if(data.data=='重置密码成功'){
                    window.location.href="login.html";
                }
            }
        })
};

//  判断手机号
    function checkPhone() {
        var phone = $('#phone').val(),
              reg = /^1[3|4|5|7|8]\d{9}$/;
        if (!(reg.test(phone))) {
            $("#tel").text("手机号码有误，请重填");
            $("#tel").css("color", "red");
            return false;
        }
    }

    //	获取验证码

    function getImgCode() {
        $.ajax({
            url:'http://114.55.128.51:7051/user/register/getVerifyCode',
            success:function(result){
                //console,log(result)
                if (result.status == 200) {
                    var imgsrc = 'http://121.199.11.87:8118/VerificationCode/CreateVerificationCode/?guid=';
                    $('.yanzheng').attr('src', imgsrc + result.guidCode);
                    $(".yanzheng input[type='hidden']").val(result.guidNum);
                    guidCode = result.guidCode;
                } else {
                    alert(result.msg);
                }
            }
        })
    }
    //验证验证码

        function checkCode(){
            var verifyCode = $('#verification').val();
            var phone = $('#phone').val();

            $.ajax({
                url:'http://114.55.128.51:7051/user/register/checkVerifyCode',
                type:"post",
                data:{
                    "VerifyCode": verifyCode,
                    "guidCode": guidCode,
                    "userName": phone
                },
                success:function(data){
                    //console,log(result)
                   if (data.status == 200 && data.isSuccess == true) {
                        $("#formForget").hide();
                        $("#formforpost").show();
                        $('#phonePan').text(phone);
                    } else {
                        alert(data.msg);
                        getImgCode();
                        $("#formForget").show();
                        $("#formforpost").hide();
                    }
                }
            })
        }

//判断密码

    function checkPwd(){
        var str=$("#registerPwd").val();
        if (str.length<6 || str.length>16){
            $('#pwdtishi').text('请输入6-16个英文（区分大小写）、数字或常用符号');
            $("#pwdtishi").css("color","red");
        }else{
           $("#pwdtishi").text("密码可以使用");
            $("#pwdtishi").css("color","green");
        }
    }

$('#registerPwd_2').blur(function(){
	var val1=$('#registerPwd').val();
	var val2=$(this).val();
	if(val1==val2){
	   $(this).siblings('span').text('密码一致')
	}
})


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
		Lcolor=Lcolor;
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
