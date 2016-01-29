<?php

/**
 * User: 冯晓飞
 * Date: 2016/1/15
 * Time: 13:54
 */
class user extends Controller
{

    private $user;

    function __construct()
    {
        parent::__construct();
        $this->user = new userModel();
    }
//region admin user

    //查找所有角色
    function get_users()
    {
        $where = array('used' => true);
        $sort = array('sort' => -1);
        $result = $this->user->lists('users', $where, getPageLimit());
        echo $this->json->encode($result);
    }

    //添加角色
    function add_user()
    {
        $data = postData();
        $result = $this->user->save('users', $data);
        echo $this->json->encode($result);
    }

    //编辑角色
    function edit_user()
    {
        $data = postData();
        $result = $this->user->save('users', $data);
        echo $this->json->encode($result);
    }

    //删除角色
    function remove_user()
    {
        $result = $this->user->removeById('users');
        echo $this->json->encode($result);
    }

    //批量删除角色
    function remove_users()
    {
        $ids = array();
        foreach (postData() as $v) {
            $ids[] = new MongoId($v);
        }
        $where = array("_id" => array('$in' => $ids));
        $result = $this->user->remove('users', $where);
        echo $this->json->encode($result);
    }


//endregion
}