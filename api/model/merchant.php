<?php

/**
 * User: 冯晓飞
 * Date: 2016/1/21
 * Time: 09:50
 */
class merchantModel extends Model
{
    /**
     * 构造函数
     */
    function __construct()
    {
        parent::__construct("shipping", "mongodb://127.0.0.1:27017");
    }

}