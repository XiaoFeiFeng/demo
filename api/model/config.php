<?php

/**
 * User: 冯晓飞
 * Date: 2016/1/25
 * Time: 11:39
 */
class configModel extends Model
{
    /**
     * 构造函数
     */
    function __construct()
    {
        parent::__construct("shipping", "mongodb://127.0.0.1:27017"); //定义数据库
    }

}