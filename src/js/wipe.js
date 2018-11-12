var cas = document.getElementById('cas');
var context = cas.getContext("2d");
var raduis = 20;	//涂抹的半径
var _w = cas.width,_h = cas.height;
var x,y,x2,y2;
var t;
var ismousedown = false;//表示鼠标状态,是否按下,默认为未按下
//生成画布上的遮罩，默认颜色#666
function drawMask(context){
	// 保存当前绘图状态
	context.save();
	context.fillStyle = "rgba(122,122,122,.9)";
	//画一个矩形区域，前两个参数为坐标，后两个参数为宽高
	context.fillRect(0,0,_w,_h);
	// 恢复原有绘图状态
	context.restore();
	context.globalCompositeOperation ="destination-out";
}

// 在画布上画半径为30的圆
function drawPoint(context,x,y){
	context.save();
	context.beginPath();
	context.arc(x,y,raduis,0,2*Math.PI);
	context.fillStyle = "#eee";
	context.fill();
	context.restore();
}
// 划线
function drawLine(context,x,y,x2,y2){
	context.save();
	context.beginPath();
	context.lineWidth=raduis*2;
	context.moveTo(x,y);
	context.lineTo(x2,y2);
	context.stroke();
	context.restore();
}
// 在canvas画布上监听自定义事件,调用drawPoint函数
cas.addEventListener("mousedown",function(evt){
	var event = evt || window.event;
	// 获取鼠标视口坐标,传递参数到drawPoint
	 x = event.clientX;
	 y = event.clientY;
	drawPoint(context,x,y);
	ismousedown = true;
	console.log(ismousedown);
},false);
cas.addEventListener("mousemove",fn1,false);
function fn1(evt){
	if (ismousedown) {
		console.log(ismousedown);
		var event = evt || window.event;
		// 获取鼠标视口坐标,传递参数到drawPoint
		 x2 = event.clientX;
		 y2 = event.clientY;
		drawLine(context,x,y,x2,y2);
		x=x2;
		y=y2;
	}else{
		return false;
	}
}
cas.addEventListener("mouseup",function(){
	ismousedown = false;
	t=0;
	if (getTransparencyPercent(context)>50) {
		alert("超过了50%面积");
		clearRect(context);
	}
},false);

function clearRect(context){
	context.clearRect(0,0,_w,_h);
}

function getTransparencyPercent(context){
	var imgdata = context.getImageData(0,0,_w,_h);
	console.log(imgdata);
	for (var i = 0; i < imgdata.data.length; i+=4) {
		var a = imgdata.data[i+3];
		if (a === 0) {
			t++;
		}
	}
	var percent = (t/(_w*_h))*100;
	console.log("透明点个数: "+ t);
	console.log("占总面积: " + Math.ceil(percent)+"%");
	//return percent.toFixed(2);//截取小数点两位
	return Math.round(percent);
}
window.onload = function(){
	drawMask(context);
	drawPoint(context);
};