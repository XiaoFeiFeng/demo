<?php

/**
 * User: Administrator
 * Date: 2016/1/15
 * Time: 14:26
 */
class channelModel extends Model
{
    /**
     * 构造函数
     */
    function __construct()
    {
        parent::__construct("logistic", "mongodb://127.0.0.1:27017"); //定义数据库
    }

}