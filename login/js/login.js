
var phone,psw;

    $("#phone").blur(function () {
        var reg = /^1[3|4|5|7|8]\d{9}$/;
        phone = $("#phone").val();
//  判断手机号两种情况
        if (phone == "") {
            $(".alert_box").show();
            $(".alert_box h3").html("手机号不能为空");
            $(".alert_box").delay(1000).hide(0);
        }else if (!(reg.test(phone))) {
            $(".alert_box").show();
            $(".alert_box h3").html("手机号码格式错误，请重填");
            $(".alert_box").delay(1000).hide(0);
            return false;
        }
    })
    $(".login-container button").click(function () {
        var phone = $("#phone").val();
        var psw = $("#pwdLogin").val();

        getData(phone,psw);
    })

    function getData(phone,psw){
        //  ajax请求数据
        $.ajax({
            url:'http://114.55.128.51:7051/user/login',   //  登录页接口
            type:'post',
            data:{   //  需要传递的3个参数
               usr: phone,
               pwd: psw,
               source: "xxy_pc"
            },
            
            success:function(data){
                    console.log(data)
                //  请求成功
                if (data.status == 200) {
                    console.log(data)
                    if (data.data.code == 0) {
                          $(".alert_box").show();
                          $(".alert_box h3").html("用户名不存在");
                          $(".alert_box").delay(1000).hide(0);
                    }else if(data.data.code == 2) {
                         $(".alert_box").show();
                          $(".alert_box h3").html("你输入的用户名或密码错误");
                          $(".alert_box").delay(1000).hide(0);
                    }else if(data.data.code == 1){

                        window.location.href = "index.html";
                    }
                }
            }
        })
    }




window.onload=window.onresize=function(){
	var winH=$(window).height();
	if(winH<500){
		winH=500;
	}
	$('footer').css('padding-top',winH-40)
}