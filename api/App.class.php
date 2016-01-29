<?php
// +--------------------------------------------------------------+
// | 这个文件是 EPR 项目的一部分                                   |
// +--------------------------------------------------------------+
// | Copyright (c) 2012 - 2015  
// |                                                              |
// | 要查看完整的版权信息和许可信息，请查看源代码中附带的 COPYRIGHT 文件  |
// +--------------------------------------------------------------+


/**
 * 文件说明
 *
 * @copyright Copyright (c) 2012 - 2015
 * @package Common
 * @version v0.1
 */
class App
{

    /**
     * 构造函数
     */
    function __construct()
    {
        // nothing
    }

    /**
     * 运行程序
     *
     */
    function run()
    {
        $cotrollerName = $_GET['model'];
        $file = 'controller/' . $cotrollerName . '.php';
        $modelFile = 'model/' . $cotrollerName . '.php';
        if (is_file($file)) {
            include($file);
            include($modelFile);
            $cotroller = new $cotrollerName();
            $actionName = $_REQUEST['action'];
            if (method_exists($cotroller, $actionName)) {
                $cotroller->{$actionName}();
            } else if (method_exists($cotroller, '_noAction')) {
                $cotroller->_noAction();
            } else {
                throw new Exception('no Action');
            }
        } else {
            throw new Exception('no cotroller');
        }
    }

    /**
     * 注册一个公共变量
     *
     * @param string $key
     * @param mixed $value
     */
    public static function setRegistry($key, $value)
    {
        if (isset($GLOBALS['registry'][$key])) {
            throw new Exception($key . '已被注册');
        }
        $GLOBALS['registry'][$key] = $value;
    }

    /**
     * 返回已注册的公共变量
     *
     * @param string $key
     * @return mixed
     */
    public static function getRegistry($key)
    {
        if (!isset($GLOBALS['registry'][$key])) {
            throw new Exception('没有' . $key . '这个注册变量！');
        }
        return $GLOBALS['registry'][$key];
    }
}

?>