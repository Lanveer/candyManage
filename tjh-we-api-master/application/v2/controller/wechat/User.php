<?php

namespace app\v2\controller\wechat;

require_once VENDOR_PATH . 'autoload.php';

use think\Request;
use app\v2\model\UserV2;
use app\v2\model\BoothV2;

/**
 * 用户相关操作
 */
class User extends Auth
{

    /**
     * 获取用户信息
     */
    public function info()
    {
        $data = UserV2::where(['id' => $this->user_id])
                ->with(['booth' => ['exhibition']])
                ->find();

        $data['token'] = $this->getToken($data['id']);

        return $this->ajaxResponse($data);
    }

    /**
     * 办展用户添加一个展位
     */
    public function addbooth()
    {
        $data = $this->request->param();
        if (empty($data)) {
            return $this->ajaxResponse([], '缺少参数', 400);
        }

        $vk = ['company', 'introduce', 'exhibition_hotel_id', 'floor', 'exhibition_code', 'contact', 'address', 'img'];
        foreach ($vk as $value) {
            if (empty($data[$value])) {
                return $this->ajaxResponse([], '参数不能为空', 400);
            }
        }

        $user = UserV2::get($this->user_id);
        if (empty($user)) {
            return $this->ajaxResponse([], '服务器出错', 500);
        }

        $data['tel'] = $user->tel;
        $data['status'] = 0;

        $result = BoothV2::create($data);
        if (empty($result)) {
            return $this->ajaxResponse([], '创建失败', 500);
        }

        return $this->ajaxResponse($result);
    }

    /**
     * 用户上传图片
     */
    public function upload()
    {
        $file = $this->request->file('file');

        if(empty($file)) {
            return $this->ajaxResponse([], '文件不能为空', 400);
        }

        $info = $file->rule('md5')->move(ROOT_PATH . 'public' . DS . 'tmp' . DS . 'uploads');
        if (empty($info)) {
            return $this->ajaxResponse(['error' => $file->getError()], '文件上传失败', 500); 
        }

        $path = 'tmp/uploads/' . $info->getSaveName();

        // 如果没有配置阿里云那啥
        if (empty(config('v2.accessKeyId'))) {
            $host = $this->request->domain();

            return $this->ajaxResponse(['host' => $host, 'path' => $path, 'url' => $host . '/' . $path]);
        }

        // 配置了
        try {
            $ossClient = new OssClient(config('v2.accessKeyId'), config('v2.accessKeySecret'), config('v2.endpoint'));
        } catch (OssException $e) {
            return $this->ajaxResponse([], $e->getMessage(), 600);
        }

        try{
            $ossClient->uploadFile(config('v2.bucket'), $path, $info->getPathName());
        } catch(OssException $e) {
            return $this->ajaxResponse([], $e->getMessage(), 600);
        }

        return $this->ajaxResponse(['host' => config('v2.host'), 'path' => $info->getSaveName(), 'url' => config('v2.host') . '/' . $path]);
    }
}
