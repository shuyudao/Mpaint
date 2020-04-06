<?php
require_once __DIR__ . '/vendor/autoload.php';
use Workerman\Worker;
use PHPSocketIO\SocketIO;

$io = new SocketIO(233);
// 连接
$io->on('connection', function($socket)use($io){
    Data::$socket_arr[] = $socket->id;
    echo "新加入，当前人数：".count(Data::$socket_arr)."\n";

    $io->emit('online num', count(Data::$socket_arr));

    //发送实时画笔
    $socket->on('message', function($msg)use($io){
        $io->emit('message', $msg);
        clearstatcache(); //清除filesize的缓存 防止读取内容不完整
    });

    //新用户请求当前实时图片
    $socket->on('getNow', function($id)use($io){

        //加载持久化的内容
        if(file_exists(dirname(__FILE__)."/img")){
            $imgData = fopen(dirname(__FILE__)."/img", "r");
            $data = fread($imgData,filesize(dirname(__FILE__)."/img"));
            fclose($imgData);
            //发给新用户们
            $io->to($id)->emit('showNow', $data);

        }else{//没有内容
            $io->to($id)->emit('showNow', NULL);
        }

    });

    $socket->on('i want save', function($id)use($io){

        if(!Data::$save_status){ //防止同时多次无意义上传
            Data::$save_status = true;
            $io->to($id)->emit('you can save', "");
        }

    });

    //实时保存
    $socket->on('save', function($img)use($io){

        //持久化到本地
        $imgData = fopen(dirname(__FILE__)."/img", "w+");
        fwrite($imgData, $img);
        fclose($imgData);

        Data::$save_status = false;

    });

    //离线
    $socket->on('disconnect', function()use($io,$socket){
        $key = array_search($socket->id, Data::$socket_arr);
        if ($key !== false){
            array_splice(Data::$socket_arr, $key, 1);
        }
        $io->emit('online num', count(Data::$socket_arr));

        Data::$save_status = false;
    });

});




Worker::runAll();

//数据
Class Data{

    //用户组 在线
    static $socket_arr = [];

    //保存状态 false：当前无 true：有其他的人在保存
    static $save_status = false;
}