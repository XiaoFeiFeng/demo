<?php

/**
 * User: fengxiaofei
 * Date: 2016/1/29
 * Time: 13:54
 */
class order extends Controller
{
    private $order;

    function __construct()
    {
        parent::__construct();
        $this->order = new orderModel();
    }

    //创建订单
    function create()
    {
        $data = postData();
        $result = $this->order->save('roles', $data);
        echo $this->order->encode($result);
    }

    //更改订单
    function edit()
    {
        $data = postData();
        $result = $this->role->save('roles', $data);
        echo $this->json->encode($result);
    }
//endregion
}