load = false;

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
//画板控制开关
let painting = false;
//第一个点坐标
let startPoint = {
    x: undefined,
    y: undefined
};

var drawData = {};
//初始化画布大小
wh();

//特性检测
if (document.body.ontouchstart !== undefined) {
    //触屏设备
    canvas.ontouchstart = function (e) {
        //[0]表示touch第一个触碰点
        let x = e.touches[0].clientX;
        let y = e.touches[0].clientY;
        painting = true;
        if (EraserEnabled) {
            ctx.clearRect(x - 20, y - 20, 40, 40)
        }
        startPoint = {
            x: x,
            y: y
        };
    };
    canvas.ontouchmove = function (e) {
        let x = e.touches[0].clientX;
        let y = e.touches[0].clientY;
        let newPoint = {
            x: x,
            y: y
        };
        if (painting) {
            if (EraserEnabled) {
                ctx.clearRect(x - 15, y - 15, 30, 30)
            } else {
                drawLine(startPoint.x, startPoint.y, newPoint.x, newPoint.y);
            }
            startPoint = newPoint;
        }
    };
    canvas.ontouchend = function () {
        painting = false;
        saveImg(); //结束绘制 保存
    };
} else { // 非触屏设备
    // 按下鼠标(mouse)
    //鼠标点击事件（onmousedown）
    canvas.onmousedown = function (e) {
        let x = e.offsetX;
        let y = e.offsetY;
        painting = true;
        if (EraserEnabled) {
            ctx.clearRect(x - 15, y - 15, 30, 30)
        }
        startPoint = {
            x: x,
            y: y
        };
    };

    //    滑动鼠标
    //    鼠标滑动事件（onmousemove）
    canvas.onmousemove = function (e) {
        let x = e.offsetX;
        let y = e.offsetY;
        let newPoint = {
            x: x,
            y: y
        };
        if (painting) {
            if (EraserEnabled) {
                ctx.clearRect(x - 15, y - 15, 30, 30)
            } else {
                drawLine(startPoint.x, startPoint.y, newPoint.x, newPoint.y);
            }
            startPoint = newPoint;
        }
    };
    //    松开鼠标
    //    鼠标松开事件（onmouseup)
    canvas.onmouseup = function () {
        painting = false;
        saveImg(); //结束绘制保存
    };
}


/*****工具函数*****/
//    点与点之间连接  自由
function drawLine(xStart, yStart, xEnd, yEnd) {

    xStart +=scroll_x;
    xEnd +=scroll_x;
    yStart +=scroll_y;
    yEnd +=scroll_y;
    
    //socket消息发布
    drawData = {
        'xStart': xStart,
        'yStart': yStart,
        'xEnd': xEnd,
        'yEnd': yEnd,
        'ctxColor': ctx.strokeStyle
    };
    //开始绘制路径
    ctx.beginPath();
    //线宽
    ctx.lineWidth = 3;
    //起始位置
    ctx.moveTo(xStart, yStart);
    //停止位置
    ctx.lineTo(xEnd, yEnd);
    //描绘线路
    ctx.stroke();
    //结束绘制
    ctx.closePath();

    sendMyDraw(drawData);
}

//网络画笔
function drawLineBySocket(data) {

    var data = JSON.parse(data);

    var backupColor = ctx.strokeStyle; //颜色备份 防止其他人颜色影响

    ctx.strokeStyle = data.ctxColor
    //开始绘制路径
    ctx.beginPath();
    //线宽
    ctx.lineWidth = 3;
    //起始位置
    ctx.moveTo(data.xStart, data.yStart);
    //停止位置
    ctx.lineTo(data.xEnd, data.yEnd);
    //描绘线路
    ctx.stroke();
    //结束绘制
    ctx.closePath();

    ctx.strokeStyle = backupColor; //恢复自己的画笔颜色
}

//    canvas与屏幕宽高一致
function wh() {
    let pageWidth = document.documentElement.clientWidth;
    let pageHeight = document.documentElement.clientHeight;
    canvas.width = 3000;
    canvas.height = 2000;
}

//控制橡皮擦开启
let EraserEnabled = false;


$(".colors li").click(function(){
    $(".colors li").removeClass("color_active");
})

//画笔颜色及鼠标样式
black.onclick = function () {
    $(this).addClass("color_active");
    ctx.strokeStyle = 'black';
};
red.onclick = function () {
    ctx.strokeStyle = 'red';
    $(this).addClass("color_active");

};
orange.onclick = function () {
    ctx.strokeStyle = 'orange';
    $(this).addClass("color_active");

};
green.onclick = function () {
    ctx.strokeStyle = 'green';
    $(this).addClass("color_active");

};
blue.onclick = function () {
    ctx.strokeStyle = 'blueviolet';
    $(this).addClass("color_active");

};