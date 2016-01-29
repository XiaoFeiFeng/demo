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

    function __construct($db = null, $host = null)
    {
        if (empty($host)) $host = "mongodb://127.0.0.1:27017";
        if (empty($db)) $db = "admin";
        $this->db = new mongoHelper($db, $host);
    }

    /**
     * 公共查找列表方法
     * @param $collection  string 表名
     * @param $where       array  搜索条件
     * @param $condition   array  附加条件  limit，start，sort
     * @return array
     */
    function lists($collection, $where, $condition)
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

    //添加
    function add($table, $host = null, $db = null)
    {
        if (empty($table)) return;

        $db = new mongoHelper($db, $host);
        $params = getPostData();
        echoData(array("success" => $db->add($table, $params)));
    }


    //批量删除
    function removes($table, $host = null, $db = null)
    {
        if (empty($table)) return;
        $db = new mongoHelper($db, $host);

        $ids = array();
        foreach (getPostData() as $v) {
            $ids[] = new MongoId($v);
        }
        $where = array("_id" => array('$in' => $ids));
        echoData(array("success" => $db->remove($table, $where)));
    }

    //编辑
    function edit($table, $host = null, $db = null)
    {
        if (empty($table)) return;
        $db = new mongoHelper($db, $host);

        $where = array("_id" => new MongoId($_GET["id"]));
        $data = getPostData();
        echoData(array("success" => $db->edit($table, $where, $data)));
    }


    //查找最后一条数据
    function findOne($table, $where, $host = null, $db = null)
    {
        try {
            $result['data'] = $this->db->findOne($table, $where);
            $result['success'] = true;
        } catch (Exception $e) {
            $result['success'] = false;
            $result['error'] = $e->getMessage();
        }
        return $result;
    }

    //条件查找
    function find($table, $where = null, $sort = null, $host = null, $db = null)
    {
        if (empty($table) || empty($where)) return;
        $db = new mongoHelper($db, $host);

        $index = empty($_GET["pi"]) ? null : $_GET["pi"];
        $size = empty($_GET["ps"]) ? null : $_GET["ps"];
        echoData(array(
            "success" => true,
            "data" => $db->find($table, $where, $sort, $index, $size),
            "count" => $db->count($table, $where)
        ));
    }

}

?>