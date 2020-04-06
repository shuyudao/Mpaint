//连接Socket
var socket = io('http://127.0.0.1:233');


socket.on('connect', function(){
    console.log('connect success');
    //要求获取当前的实时画面
    socket.emit('getNow',socket.id);
});

//显示当前实时画面 针对于刚打开的用户
socket.on('showNow', function(img){
    if(img!=null&&img!=""){
        var toimg = new Image();
        toimg.src=img;
        
        toimg.onload = function(){ //防止首次绘制不显示
            ctx.drawImage(toimg,0,0,canvas.width,canvas.height);
        }

        load = true;
    }
    $("#load").remove();

});

// 接收到画笔内容
socket.on('message', function(msg){
    //网络绘制
    drawLineBySocket(msg);
});

//在线数量
socket.on('online num', function(num){
    $("#online_num").html("实时绘画人数："+num);
});

//通知可以保存
socket.on('you can save', function(num){
    var img = canvas.toDataURL();
    //保存
    socket.emit('save',img);
});

//发送我所画的内容
function sendMyDraw(data){
    //发送
    socket.emit('message', JSON.stringify(data));
}

//保存修改
function saveImg(){
    //发送希望保存的请求
    socket.emit('i want save',socket.id);
    
}