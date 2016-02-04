<?php

/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/1/15
 * Time: 13:54
 */
class logistic extends Controller
{

    private $logistic;

    function __construct()
    {
        parent::__construct();
        $this->logistic = new logisticModel();
    }

    //region logistic
    //物流商列表
    function logisticList()
    {
        $where = array();
        $result = $this->logistic->find('logistics', $where, getPageLimit());
        echo $this->json->encode($result);
    }

    //编辑物流商
    function edit_logistic()
    {
        $data = postData();
        $result = $this->logistic->save('logistics', $data);
        echo $this->json->encode($result);

    }

    //删除物流商
    function del_logistic()
    {
        $result = $this->logistic->removeById('logistics');
        echo $this->json->encode($result);
    }


    //上传物流商logo图片
    function upload_logistic_logo_file()
    {
        $path = str_replace('admin/api/', '', CFG_PATH_ROOT);
        require(CFG_PATH_ROOT . 'lib/util/UploadFile.class.php');
        $upload = new UploadFile();
        try {
            $filename = $upload->upload($_FILES['img'], $path . 'images/icon/logistic_logo/', 0);
            echo $this->json->encode(array("success" => true, "path" => "http://www.93myb.com/images/icon/logistic_logo/" . $filename));
            exit;
        } catch (Exception $e) {
            echo $this->json->encode(array('success' => false, 'error' => $e->getMessage()));
            exit;
        }
    }
    //endregion


    //region channel
    //渠道列表
    function channelList()
    {
        if (isset($_GET["id"]) && $_GET["id"] !== 'undefined') {
            $where['channel_logId'] = new MongoId($_GET['id']);
        }
        $result = $this->logistic->find('logistics_channels', $where, getPageLimit());
        echo $this->json->encode($result);
    }

    //编辑渠道
    function edit_channel()
    {
        $data = postData();
        if (isset($_GET['channel_logId']) && !isset($data['channel_name'])) exit; //两次请求会添加两条的bug
        $data['channel_logId'] = new MongoId($_GET['channel_logId']);
        $result = $this->logistic->save('logistics_channels', $data);
        echo $this->json->encode($result);
    }

    //删除渠道
    function del_channel()
    {
        $result = $this->logistic->removeById('logistics_channels');
        echo $this->json->encode($result);
    }


    //上传渠道模板文件和模板图片文件
    function upload_channel_file()
    {

        $path = str_replace('admin/api/', '', CFG_PATH_ROOT);
        require(CFG_PATH_ROOT . 'lib/util/UploadFile.class.php');
        $upload = new UploadFile();
        //var_dump($_FILES);exit;
        if ($_GET['type'] == 'address_template') {
            //上传地址单模板文件
            try {
                $upload->upload($_FILES['upload'], $path . 'console/1.0/views/print/', 0);
                echo $this->json->encode(array("success" => true, "path" => "/console/1.0/views/print/" . $_FILES['upload']['name']));
                exit;
            } catch (Exception $e) {
                echo $this->json->encode(array('success' => false, 'error' => $e->getMessage()));
                exit;
            }
        } elseif ($_GET['type'] == 'address_template_img') {
            //上传地址单模板文件图片
            try {
                $filename = $upload->upload($_FILES['upload'], $path . '/images/templates/', 1);
                echo $this->json->encode(array("success" => true, "path" => 'http://www.93myb.com/images/templates/' . $filename));
                exit;
            } catch (Exception $e) {
                echo $this->json->encode(array('success' => false, 'error' => $e->getMessage()));
                exit;
            }
        } elseif ($_GET['type'] == 'customs_template') {
            //上传报关单模板文件
            try {
                $upload->upload($_FILES['upload'], $path . 'console/1.0/views/print/', 0);
                echo $this->json->encode(array("success" => true, "path" => '/console/1.0/views/print/' . $_FILES['upload']['name']));
                exit;
            } catch (Exception $e) {
                echo $this->json->encode(array('success' => false, 'error' => $e->getMessage()));
                exit;
            }
        } elseif ($_GET['type'] == 'customs_template_img') {
            //上传报关单模板文件图片
            try {
                $filename = $upload->upload($_FILES['upload'], $path . '/images/templates/', 1);
                echo $this->json->encode(array("success" => true, "path" => 'http://www.93myb.com/images/templates/' . $filename));
                exit;
            } catch (Exception $e) {
                echo $this->json->encode(array('success' => false, 'error' => $e->getMessage()));
                exit;
            }
        }
    }
    //endregion


}