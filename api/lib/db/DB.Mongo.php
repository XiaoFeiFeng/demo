<?php


class mongoHelper
{

    private $mongo = "";
    private $database = "";

    function __construct($db = null, $host = null)
    {
        $mongo = new Mongo($host);
        $database = $mongo->selectDB($db);
        $this->mongo = $mongo;
        $this->database = $database;
    }

    //admin数据库通用添加
    function add($table, $data)
    {
        if (empty($table) || empty($data)) return false;
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
        $record = $collection->findOne();
        return $record;
    }

    /**
     * 查找记录
     *
     * 参数：
     * $table_name:表名
     * $where:字段查找条件
     * $result_condition:查询结果限制条件-limit/sort等
     * $fields:获取字段
     *
     * 返回值：
     * 成功：记录集
     * 失败：false
     */
    function find($table, $where = array(), $result_condition = array(), $fields = array())
    {
        $collection = $this->database->selectCollection($table);
        $cursor = $collection->find($where);

        if (!empty($result_condition['start'])) {
            $cursor->skip($result_condition['start']);
        }
        if (!empty($result_condition['limit'])) {
            $cursor->limit($result_condition['limit']);
        }
        if (!empty($result_condition['sort'])) {
            $cursor->sort($result_condition['sort']);
        }
        $result = array();
        try {
            while ($cursor->hasNext()) {
                $result[] = $cursor->getNext();
            }
        } catch (MongoConnectionException $e) {
            $this->error = $e->getMessage();
            return false;
        } catch (MongoCursorTimeoutException $e) {
            $this->error = $e->getMessage();
            return false;
        }
        return $result;
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

    function close()
    {
        $this->mongo->close();
    }


}

?>