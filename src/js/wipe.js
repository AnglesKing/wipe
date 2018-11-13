var cas = document.getElementById('cas');
var context = cas.getContext("2d");
var raduis = 20;	//涂抹的半径
var _w = cas.width,_h = cas.height;
var x,y,x2,y2;
var t;
var ismousedown = false;//表示鼠标状态,是否按下,默认为未按下
// device保存设备类型,如果是移动端则为true,PC端为false
var device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
alert(navigator.userAgent);
console.log(device);
var clickEvtName = device? "touchstart" : "mousedown";
var moveEvtName = device? "touchmove" : "mousemove";
var endEvtName = device? "touchend" : "mouseup";

cas.addEventListener(clickEvtName,function(evt){
	ismousedown = true;
	var event = evt || window.event;
	// 获取鼠标视口坐标,传递参数到drawPoint
	 x = device?event.touches[0].clientX:event.clientX;
	 y = device?event.touches[0].clientY:event.clientY;
	drawT(context,x,y);
},false);


cas.addEventListener(moveEvtName,function(evt){
	if (ismousedown) {
		var event = evt || window.event;
		event.preventDefault();
		// 获取鼠标视口坐标,传递参数到drawPoint
		 x2 = device?event.touches[0].clientX:event.clientX;
		 y2 = device?event.touches[0].clientY:event.clientY;
		drawT(context,x,y,x2,y2);
		x=x2;
		y=y2;
	}else{
		return false;
	}
},false);


cas.addEventListener(endEvtName,function(){
	ismousedown = false;
	t=0;
	if (getTransparencyPercent(context)>50) {
		// alert("超过了50%面积");
		clearRect(context);
	}
},false);

/*
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

cas.addEventListener("mousemove",function(evt){
	if (ismousedown) {
		var event = evt || window.event;
		event.preventDefault();
		// 获取鼠标视口坐标,传递参数到drawPoint
		 x2 = event.clientX;
		 y2 = event.clientY;
		drawLine(context,x,y,x2,y2);
		x=x2;
		y=y2;
	}else{
		return false;
	}
},false);


cas.addEventListener("mouseup",function(){
	ismousedown = false;
	t=0;
	if (getTransparencyPercent(context)>50) {
		// alert("超过了50%面积");
		clearRect(context);
	}
},false);
*/
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
/*
// 在画布上画半径为30的圆
function drawPoint(context,x,y){
	console.log("传递实参个数:"+arguments.length);
	context.save();
	context.beginPath();
	context.arc(x,y,raduis,0,2*Math.PI);
	context.fillStyle = "#eee";
	context.fill();
	context.restore();
}

// 划线
function drawLine(context,x,y,x2,y2){
	console.log("传递实参个数:"+arguments.length);
	context.save();
	context.beginPath();
	context.lineWidth=raduis*2;
	context.moveTo(x,y);
	context.lineTo(x2,y2);
	context.stroke();
	context.restore();
}
*/
function drawT(context,x,y,x2,y2){
	context.save();
	context.beginPath();
	if(arguments.length===3){
		context.arc(x,y,raduis,0,2*Math.PI);
		context.fillStyle = "#eee";
		context.fill();
	}else{
		context.lineWidth=raduis*2;
		context.moveTo(x,y);
		context.lineTo(x2,y2);
		context.stroke();
	}
	context.restore();
}

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
	drawT(context);
};