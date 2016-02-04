<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/1/14
 * Time: 11:02
 */
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Request-With');
header('Access-Control-Allow-Credentials: true');

include_once('../../ice/common/lib/util/JSON.php');

$mongo = new Mongo("mongodb://127.0.0.1:27017");

$_REQUEST['action']($mongo);


function logisticList($mongo){
    $collection = $mongo->logistic->logistics;
    if(isset($_GET['ps']) && isset($_GET['pi'])){
        $cursor = $collection->find()->limit($_GET['ps'])->skip($_GET['ps'] * ($_GET['pi'] - 1));
    }else{
        $cursor = $collection->find();
    }
    $record['count'] = $collection->count();
    $record['success'] = true;
    foreach ($cursor as $id => $value) {
        $record['data'][] = $value;
    }
    $json = new Services_JSON();
    echo $json->encode($record);

}
function edit_logistic($mongo){
    $collection = $mongo->logistic->logistics;
    if(isset($_GET["id"])){
        $where = array("_id" => new MongoId($_GET["id"]));
        $collection->update($where, json_decode(file_get_contents("php://input"), true));
    }else{
        $collection->insert(json_decode(file_get_contents("php://input"), true));
    }
    $mongo->close();
}
function del_logistic($mongo){
    $collection = $mongo->logistic->logistics;
    $collection->remove(array("_id" => new MongoId($_GET["id"])));
    $mongo->close();
}



function channelList($mongo){
    $collection = $mongo->logistic->logistics_channels;
    $where = array();
    if(isset($_GET["id"]) && $_GET["id"] !== 'undefined'){
        $where['channel_logId'] = new MongoId($_GET['id']) ;
    }

    if(isset($_GET['ps']) && isset($_GET['pi'])){
        $cursor = $collection->find($where)->limit($_GET['ps'])->skip($_GET['ps'] * ($_GET['pi'] - 1));
    }else{
        $cursor = $collection->find($where);
    }
    $record['count'] = $collection->count($where);
    $record['success'] = true;
    $record['data'] = array();
    foreach ($cursor as $id => $value) {
        $record['data'][] = $value;
    }
    $json = new Services_JSON();
    echo $json->encode($record);
}

function edit_channel($mongo){

    $document = json_decode(file_get_contents("php://input"), true);

    $collection = $mongo->logistic->logistics_channels;
    if(isset($_GET["id"])){
        $where = array("_id" => new MongoId($_GET["id"]));
        $collection->update($where, json_decode(file_get_contents("php://input"), true));
    }else{
        $document['channel_logId'] = new MongoId($document['channel_logId']);
        $collection->insert($document);
    }
    $mongo->close();
}
function del_channel($mongo){
    $collection = $mongo->logistic->logistics_channels;
    $collection->remove(array("_id" => new MongoId($_GET["id"])));
    $mongo->close();
}