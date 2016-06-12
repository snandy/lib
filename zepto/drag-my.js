
 /*
  * 移动端 悬浮icon 拖动吸边插件
  *
  * *参数* 
  *1.elem     {string}   拖动目标选择器
  *2.isSide   {boolean}  是否吸边 默认true
  *3.boundary {object}   拖动目标距离上下左右的临界距离 px
  *4.callback {function} 回调函数 绑定完拖动事件后，用户自定义一些操作
  * 
  * by wangnan
  */

(function() {

    var targetElement = null;
    var elWidth = 0;//拖动元素的宽
    var elHeight = 0;//拖动元素的高
    var screenWidth = 0;//屏幕的宽度
    var screenHeight = 0;//屏幕的高度
    var boundary = {//拖动元素离边界的距离
        top:0,
        left:0,
        right:0,
        bottom:0
    };
    var startTime = null;
    var endTime = null;
    var startTop = 0;
    var startLeft = 0;

    var isSide = true;
    var domElem = document.documentElement;

     //获取推动元素的基本信息
     function getElementInfo(el){
        elWidth = el.offsetWidth;
        elHeight = el.offsetHeight;
        screenWidth = domElem.clientWidth;
        screenHeight = domElem.clientHeight;
        var distance = screenWidth - elWidth - el.offsetLeft;
        if(boundary.left == 0){
            boundary.left = distance;
        }
        if(boundary.right == 0){
            boundary.right = distance;
        }
        targetElement = el;
     
     }

     //拖动开始touchstart
     function start(e){
        e.preventDefault();//阻止其他事件
        startTime = new Date();
        startTop = this.offsetTop;//元素初始距顶部距离
        startLeft = this.offsetLeft;//元素初始距左侧距离

        targetElement.addEventListener('touchmove',move, false);

        targetElement.addEventListener('touchend',end, false);
     }
     //拖动进行中touchmove
     function move(e){
        e.preventDefault();//阻止其他事件
        // 如果这个元素的位置内只有一个手指的话
        if (e.targetTouches.length == 1) {
            var touch = e.targetTouches[0];  // 把元素放在手指所在的位置
            var currX = touch.clientX;
            var currY = touch.clientY;
            var rightLocation = screenWidth - elWidth - boundary.right;
            //判断right
            if(currX > rightLocation){
                currX = rightLocation;
            }else if(currX < boundary.left){
                    currX = boundary.left + elWidth/2;
            }
            //判断top
            if(currY < elHeight/2 + boundary.top){
                    currY  = elHeight/2 + boundary.top;
            }else if(currY > screenHeight - elHeight - boundary.bottom){
                    currY = screenHeight - elHeight/2 - boundary.bottom;
            }

            targetElement.style.left = currX - elWidth/2 + 'px';
            targetElement.style.top = currY - elHeight/2 + 'px';
        }
     }

     //拖动结束touchend
     function end(e){
        e.preventDefault();//阻止其他事件
        // 如果这个元素的位置内只有一个手指的话
        endTime = new Date();

        var touch = e.changedTouches[0];
        var currX = touch.clientX;
        var currY = touch.clientY;
        var distanceTime = endTime - startTime;
        var distanceX = currX - startLeft;
        var distanceY = currY - startTop;
        
        if(distanceTime > 10  &&  distanceTime < 200 ){
            //console.log(Math.abs(distanceX)+ ' '+Math.abs(distanceY))
            //if(Math.abs(distanceX) <= 5 ||  Math.abs(distanceY) <=5)
            //{
                var href = this.getAttribute("href");
                if(href){
                    window.location.href = href;
                }
                return false;
            //}
            
        }

        var rightLocation = screenWidth - elWidth - boundary.right;

        if(isSide){

            if(currX > rightLocation){
                currX = rightLocation;
            }else if(currX < boundary.left){
                currX = boundary.left;
            }else {
                currX = (currX < (screenWidth/2 + elWidth/2))?boundary.left:rightLocation;
            }

            if(currY < elHeight/2 + boundary.top){
                    currY  = elHeight/2 + boundary.top;
            }else if(currY > screenHeight - elHeight - boundary.bottom){
                    currY = screenHeight - elHeight/2 - boundary.bottom;
            }
            //targetElement.style.left = currX + 'px';
            //targetElement.style.top = currY -elHeight/2 + 'px';
        }else{

            if(currX > rightLocation){
                currX = rightLocation;
            }else if(currX < boundary.left){
                    currX = boundary.left;
            }
            //判断top
            if(currY < elHeight/2 + boundary.top){
                    currY  = elHeight/2+ boundary.top;
            }else if(currY > screenHeight - elHeight - boundary.bottom){
                    currY = screenHeight - elHeight/2 - boundary.bottom;
            }

            
            //targetElement.style.top = currY-elHeight/2 + 'px';
        }
        targetElement.style.left = currX + 'px';
        targetElement.style.top = currY-elHeight/2 + 'px';
        
        
     }
      

      //getElementInfo(div);

      //推动吸边js吸边入口
        var dragDrop = function(params) {
            var el = null;//元素
            if (typeof params == 'object') {
                //元素获取
                el = document.querySelector(params.elem);
            }else{
                return false;
            }
            isSide = params.isSide;

            boundary = {
                top:params.boundary.top,
                bottom:params.boundary.bottom,
                left:params.boundary.left,
                right:params.boundary.right
            }
            getElementInfo(el);
            //href = el.getAttribute("href");
            el.addEventListener('touchstart',start,false);

            //绑定完回调函数
            params.callback && params.callback();

        }


      window.dragDrop = dragDrop;

  })();

  document.addEventListener("DOMContentLoaded", function() {
    
      var params = {
        elem:'.exclusive-service',
        isSide:true,
        boundary:{
            top:10,
            right:0,
            bottom:0,
            left:0
        },
        callback:function(){
            //console.log(1);
        }

      }

     dragDrop(params);
  });
