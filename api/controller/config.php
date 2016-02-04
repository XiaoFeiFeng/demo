<?php

/**
 * User: fengxiaofei
 * Date: 2016/1/25
 * Time: 13:54
 */
class config extends Controller
{
    private $config;

    function __construct()
    {
        parent::__construct();
        $this->config = new configModel();
    }
    //region config
    //查看配置
    function get_config()
    {
        $key = $_REQUEST['key'];
        $where = array('key' => $key);
        $result = $this->config->findOne("sys_config", $where);
        echo $this->json->encode($result);
    }

//endregion
}