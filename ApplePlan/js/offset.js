window.onload=function(){
    var nav=document.getElementById('nav');
    var navFixed=document.getElementById('navFixed');
    window.onscroll=function(){
        var scrollTop=document.documentElement.scrollTop||document.body.scrollTop;
        if(scrollTop>$("section").offsetTop){
            alert(1)
        }else if(scrollTop<nav.offsetTop){
            navFixed.style.display='none';
        }
    }
}