$(function(){
	$(".tab-list li").on("click",function(){
		$(this).addClass("add").siblings().removeClass("add");
		var ind=$(this).index();
		$(".list").hide();
		$(".list").eq(ind).show();
	})
})
