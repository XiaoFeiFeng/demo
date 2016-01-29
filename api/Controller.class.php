<?php
// +--------------------------------------------------------------+
// | 这个文件是 EPR 项目的一部分                                   |
// +--------------------------------------------------------------+
// | Copyright (c) 2012 - 2015  
// |                                                              |
// | 要查看完整的版权信息和许可信息，请查看源代码中附带的 COPYRIGHT 文件  |
// +--------------------------------------------------------------+


/**
 * 控制器基类
 *
 * @copyright Copyright (c) 2010 - 2015
 * @package Common
 * @version v0.1
 */

/**
 * 控制器基类
 * @package Common
 */
abstract class Controller extends App
{

    /**
     * 构造函数
     */
    function __construct()
    {
        $this->json = App::getRegistry('json');
    }

    /**
     * 默认求知动作页面
     */
    function _noAction()
    {
        throw new Exception('你访问了未定义的页面');
    }


    /**
     * 权限检测
     * @param $authz 权限代码
     */
    function actionPrivilege($authz)
    {
        if (!check_authz($authz)) Page::todo('index.php?model=alert', '您没有此操作的权限，请联系系统管理员');
    }

    /**
     * 权限检测
     * @param $authz 权限检查
     */
    function actionCheck($authz)
    {
        if (!check_authz($authz)) {
            echo "{success:false,msg:'您没有此操作的权限，请联系系统管理员!'}";
            exit;
        } else {
            return true;
        }
    }

//endregion
}

?>
