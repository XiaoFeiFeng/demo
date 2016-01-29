<?php


class mongoHelper
{

    //打开数据库连接
    private $mongo = "";
    private $database = "";

    function __construct($db = null, $host = null)
    {
        if (empty($host)) $host = "mongodb://127.0.0.1:27017";
        if (empty($db)) $db = "admin";

        $mongo = new Mongo($host);
        $database = $mongo->selectDB($db);
        $this->mongo = $mongo;
        $this->database = $database;
    }

    //admin数据库通用添加
    function add($table, $data)
    {
        if (empty($table)) return false;
        $collection = $this->database->selectCollection($table);
        $flag = $collection->insert($data);
        $this->mongo->close();
        return $flag;
    }

    //admin数据库通用编辑
    function edit($table, $where, $data)
    {
        if (empty($table) || empty($where) || empty($data)) return false;
        $collection = $this->database->selectCollection($table);
        unset($data['_id']);

        $flag = $collection->update($where, array('$set' => $data));
        $this->mongo->close();
        return $flag;
    }

    //admin数据库通用删除
    function remove($table, $where)
    {
        if (empty($table) || empty($where)) return false;
        $collection = $this->database->selectCollection($table);
        $flag = $collection->remove($where);
        $this->mongo->close();
        return $flag;
    }

    function findOne($table)
    {
        $collection = $this->database->selectCollection($table);
        $cursor = $collection->findOne();
        $record = array();
        foreach ($cursor as $id => $value) {
            $record[] = $value;
        }
        return $record;
    }

    function find($table, $where = null, $sort = null, $index = null, $size = null)
    {
        if (empty($table) || empty($where)) return false;

        $collection = $this->database->selectCollection($table);
        //分页处理前必须排序
        if (!empty($where) && !empty($sort) && !empty($index) && !empty($size)) {
            $cursor = $collection->find($where)->sort($sort)->limit($size)->skip($size * ($index - 1));
        } else if (!empty($sort) && !empty($index) && !empty($size)) {
            $cursor = $collection->find()->sort($sort)->limit($size)->skip($size * ($index - 1));
        } else if (!empty($where) && !empty($index) && !empty($size)) {
            $cursor = $collection->find($where)->limit($size)->skip($size * ($index - 1));
        } else if (!empty($index) && !empty($size)) {
            $cursor = $collection->find()->limit($size)->skip($size * ($index - 1));
        } else if (!empty($where) && !empty($sort)) {
            $cursor = $collection->find($where)->sort($sort);
        } else if (!empty($where)) {
            $cursor = $collection->find($where);
        } else if (!empty($sort)) {
            $cursor = $collection->find()->sort($sort);
        } else {
            $cursor = $collection->find();
        }


        $record = array();
        while ($cursor->hasNext()) {
            $record[] = $cursor->getNext();
        }

        return $record;
    }

    function count($table, $where = null)
    {
        $collection = $this->database->selectCollection($table);

        if (!empty($where)) {
            $cursor = $collection->find($where);
        } else {
            $cursor = $collection->find();
        }
        return $cursor->count();
    }


}

?>