<?php
// +--------------------------------------------------------------+
// | 这个文件是 EPR 项目的一部分                                   |
// +--------------------------------------------------------------+
// | Copyright (c) 2012 - 2015  
// |                                                              |
// | 要查看完整的版权信息和许可信息，请查看源代码中附带的 COPYRIGHT 文件  |
// +--------------------------------------------------------------+


/**
 * 逻辑层基类
 *
 * @copyright Copyright (c) 2010 - 2015
 * @package Model
 * @version v0.1
 */
abstract class Model
{

    public $db;
    public $redis;

    function __construct($db = null, $host = null)
    {
        if (empty($host)) $host = "mongodb://202.104.151.209:27017";
        if (empty($db)) $db = "admin";
        $this->db = new mongoHelper($db, $host);

        $this->redis = new redisHelper();
    }

    /**
     * 公共查找列表方法
     * @param $collection  string 表名
     * @param $where       array  搜索条件
     * @param $condition   array  附加条件  limit，start，sort
     * @return array
     */
    function find($collection, $where, $condition)
    {
        try {
            $result['data'] = $this->db->find($collection, $where, $condition);
            $result['count'] = $this->db->count($collection, $where);
            $result['success'] = true;
        } catch (Exception $e) {
            $result['success'] = false;
            $result['error'] = $e->getMessage();
        }
        return $result;
    }

    function save($collection, $data)
    {
        try {
            if (isset($_GET["id"])) {
                $where = array("_id" => new MongoId($_GET["id"]));
                $this->db->edit($collection, $where, $data);
            } else {
                $this->db->add($collection, $data);
            }
            $result['success'] = true;
        } catch (Exception $e) {
            $result['success'] = false;
            $result['error'] = $e->getMessage();
        }
        return $result;
    }

    function remove($collection, $where)
    {
        try {
            $this->db->remove($collection, $where);
            $result['success'] = true;
        } catch (Exception $e) {
            $result['success'] = false;
            $result['error'] = $e->getMessage();
        }
        return $result;
    }

    function removeById($collection)
    {
        try {
            $where = array("_id" => new MongoId($_GET["id"]));
            $this->db->remove($collection, $where);
            $result['success'] = true;
        } catch (Exception $e) {
            $result['success'] = false;
            $result['error'] = $e->getMessage();
        }
        return $result;
    }

    //查找最后一条数据
    function findOne($table)
    {
        try {
            $result['data'] = $this->db->findOne($table);
            $result['success'] = true;
        } catch (Exception $e) {
            $result['success'] = false;
            $result['error'] = $e->getMessage();
        }
        return $result;
    }

    //region Redis

    function redis_set($key, $value, $timeout)
    {
        $this->redis->set($key, $value, $timeout);
    }

    function redis_get($key)
    {
        return $this->redis->get($key);
    }
    //endregion

}

?>