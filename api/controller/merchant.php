<?php

/**
 * User: 冯晓飞
 * Date: 2016/1/15
 * Time: 13:54
 */
class merchant extends Controller
{
    private $merchant;

    function __construct()
    {
        parent::__construct();
        $this->merchant = new merchantModel();
    }
    //region merchant
    //申请
    function apply()
    {
        $data = postData();
        $result = $this->merchant->save('merchants', $data);
        echo $this->json->encode($result);
    }

    //获取待审核的公司申请
    function get_audit_company()
    {

        $state = isset($_GET["state"]) ? intval($_GET["state"]) : 0;
        $where = array('state' => $state, 'type' => 'company');
        $condition = getPageLimit();
        $condition['sort'] = array('applyTime' => 1);
        $result = $this->merchant->find('merchants', $where, $condition);
        echo $this->json->encode($result);
    }

    //获取待审核的个人申请
    function get_audit_personal()
    {
        $state = isset($_GET["state"]) ? intval($_GET["state"]) : 0;
        $where = array('state' => $state, 'type' => 'personal');
        $condition = getPageLimit();
        $condition['sort'] = array('applyTime' => 1);
        $result = $this->merchant->find('merchants', $where, $condition);
        echo $this->json->encode($result);
    }

    function edit()
    {
        $data = postData();
        $result = $this->merchant->save('merchants', $data);
        echo $this->json->encode($result);
    }

    //查询所有菜单
    function upload()
    {
        $path = str_replace('admin/api/', '', CFG_PATH_ROOT) . 'images/merchants/' . date('ymd', time()) . "/";
        $httpPath = 'images/merchants/' . date('ymd', time()) . "/";
        $thumbnail_path = $path . "thumbnail/";

        require(CFG_PATH_ROOT . 'lib/util/UploadFile.class.php');
        require(CFG_PATH_ROOT . 'lib/util/Image.class.php');

        $upload = new UploadFile();
        $image = new Image();

        try {
            $filePaths = array();
            if (!is_array($_FILES['upload']['error'])) {
                $filePaths[] = $path . $upload->upload($_FILES['upload'], $path, 1);
            } else {
                foreach ($_FILES['upload']['error'] as $k => $v) {
                    $file["error"] = $_FILES['upload']['error'][$k];
                    $file["name"] = $_FILES['upload']['name'][$k];
                    $file["size"] = $_FILES['upload']['size'][$k];
                    $file["tmp_name"] = $_FILES['upload']['tmp_name'][$k];
                    $file["type"] = $_FILES['upload']['type'][$k];

                    $file_path = $upload->upload($file, $path, 1);

                    //$result = $image->scale($path . $file_path, $thumbnail_path . $file_path, 960, 960);

                    $filePaths[] = $httpPath . $file_path;
                }
            }

            echo $this->json->encode(array("success" => true, "paths" => $filePaths));
            exit;
        } catch (Exception $e) {
            echo $this->json->encode(array('success' => false, 'error' => $e->getMessage()));
            exit;
        }
    }
//endregion
}