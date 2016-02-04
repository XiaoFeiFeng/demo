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

    //查找所有用户
    function get_users()
    {
        $where = array('used' => true);
        $sort = array('sort' => -1);
        $result = $this->user->find('users', $where, getPageLimit());
        echo $this->json->encode($result);
    }

    //添加用户
    function add_user()
    {
        $data = postData();
        $result = $this->user->save('users', $data);
        echo $this->json->encode($result);
    }

    //编辑用户
    function edit_user()
    {
        $data = postData();
        $result = $this->user->save('users', $data);
        echo $this->json->encode($result);
    }

    //删除用户
    function remove_user()
    {
        $result = $this->user->removeById('users');
        echo $this->json->encode($result);
    }

    //批量删除用户
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


//region web user
    //用户注册
    function register()
    {
        $data = postData();
        $result = $this->user->save('users', $data);
        echo $this->json->encode($result);
    }

    function login()
    {
        $checkimg = $_SESSION["checkimg"];
        $data = postData();

        if (strtolower($data["checkimg"]) != strtolower($_SESSION["checkimg"])) {
            $this->outError("验证码错误.");
            exit;
        }

        $user = $this->user->find("users", array("name" => $data['name'], 'password' => $data['password']));
        if (!$user["success"]) {
            $this->outData($user);
            exit;
        }
        if ($user["count"] == 0) {
            $this->outError("用户名或密码错误.");
            exit;
        }

        $user_id = $user['data'][0]['_id']->{'$id'};

        $where = array('code' => array('$in' => $user['data'][0]['roles']));
        $roles = $this->user->find('roles', $where);
        if (!$roles["success"]) {
            $this->outData($roles);
            exit;
        }
        if ($roles["count"] == 0) {
            $this->outError("用户权限异常");
            exit;
        }

        $permissions = array();
        foreach ($roles["data"] as $value) {
            $permissions = array_merge($value['permissions'], $permissions);
        }
        $permissions = array_unique($permissions);

        $this->user->redis_set(CFG_REDIS_PERMISSIONS_KEY . $user_id, json_encode($permissions));

        $tempUser = $user['data'][0];
        $tempUser["permissions"] = $permissions;
        $this->outSuccessData($tempUser);
    }
//endregion

}