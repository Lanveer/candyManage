<?php

namespace app\v2\controller;

use think\Request;
use app\v2\model\UserV2;

/**
 * 用户
 */
class User extends Base
{
    protected $regApi = 'http://api.jiushang.cn/api/register';

    /**
     * 显示资源列表
     *
     * @return \think\Response
     */
    public function index(Request $request)
    {
        $page = $request->param('page/d', 1);
        $limit = $request->param('limit/d', 10);

        // 限制limit最大为100
        $limit = $limit < 100 ? $limit : 100;
        $list = UserV2::scope('filter', $request)
                ->limit($limit)
                ->order('id desc')
                ->page($page);

        $list = $list->select();
        if (empty($list)) {
            return $this->ajaxResponse([], '列表数据为空', 300);
        }

        // 统计总条数
        $total = UserV2::scope('filter', $request)->count();
        $totalPages = ceil($total / $limit);

        return $this->ajaxResponse([
            'content' => $list,
            'totalElements' => $total,
            'totalPages' => $totalPages,
            'currentPage' => $page,
        ]);
    }

    /**
     * 保存新建的资源 - 注册
     *
     * @param  \think\Request  $request
     * @return \think\Response
     */
    public function save(Request $request)
    {
        $data = array_filter($request->param());
        if (empty($data)) {
            return $this->ajaxResponse($request->param(), '参数不完整', 400);
        }

        $nick_name = $request->param('nick_name/s');
        $tel = $request->param('tel/s');
        $email = $request->param('email/s');
        $password = $request->param('password/s');
        $openid = $request->param('openid/s');
        $header = $request->param('header/s');

        if (!empty($openid)) {
            // 查询是否存在此openid
            $e = UserV2::where(['openid' => $openid])->find();
            if (!empty($e)) {
                return $this->ajaxResponse($e, '已存在此微信用户', 400);
            }
        }

        // 调用远程服务器接口
        $code = $request->param('code/s');
        if (empty($code)) {
            return $this->ajaxResponse($request->param(), '验证码不能为空', 400);
        }

        $reqestData = ['username' => $tel, 'phone' => $tel, 'password' => $password, 'email' => $email, 'code' => $code];

        $resp = $this->regToJiuS($reqestData);
        if (empty($resp)) {
            return $this->ajaxResponse([], '远程服务器出错', 500);
        }
        if ($resp->errCode != 0) {
            return $this->ajaxResponse([], $resp->msg, $resp->errCode);
        }
        // 调用结束

        $data['js_uid'] = $resp->content->uid;
        // $data['js_uid'] = rand(1, 100000);

        $result = UserV2::create($data);
        if (empty($result)) {
            return $this->ajaxResponse([], '创建失败', 500);
        }

        return $this->ajaxResponse($result);
    }

    /**
     * 显示指定的资源
     *
     * @param  int  $id
     * @return \think\Response
     */
    public function read($id)
    {
        if (is_numeric($id) && strlen($id) < 32) {
            $data = UserV2::where(['id' => $id]);
        } else {
            $data = UserV2::where(['openid' => $id]);
        }

        $data = $data->with(['booth' => ['exhibition']])->find();
        if (empty($data)) {
            return $this->ajaxResponse([], '不存在此资源', 300);
        }

        return $this->ajaxResponse($data);
    }

    /**
     * 保存更新的资源
     *
     * @param  \think\Request  $request
     * @param  int  $id
     * @return \think\Response
     */
    public function update(Request $request, $id)
    {
        $data = $request->param();
        if (empty($data)) {
            return $this->ajaxResponse([], '缺少参数', 400);
        }

        if (is_numeric($id) && strlen($id) < 32) {
            $al = ['id' => $id];
        } else {
            $al = ['openid' => $id];
        }

        $result = UserV2::update($data, $al);
        if (empty($result)) {
            return $this->ajaxResponse([], '修改失败', 500);
        }

        return $this->ajaxResponse($result);
    }

    /**
     * 删除指定资源
     *
     * @param  int  $id
     * @return \think\Response
     */
    public function delete($id)
    {
        // TODO::为啥要删除
    }

    /**
     * 导出全部资源
     *
     * @return \think\Response
     */
    public function export(Request $request)
    {
        $keys = [
            'id' => '编号',
            'js_uid' => '酒商网ID',
            'nick_name' => '昵称',
            'header' => '头像',
            'name' => '真实姓名',
            'tel' => '电话号码',
            'openid' => 'OPENID',
            'create_time' => '创建时间',
        ];

        // 查询出用户数据
        $file = Excel::getExcelByData(UserV2::all(), $keys, '用户数据导出_' . date('Y_m_d', time()));

        if (empty($file)) {
            return $this->ajaxResponse([], '导出失败', 500);
        }

        return $this->ajaxResponse(['path' => $file, 'host' => $request->domain()]);
    }

    /**
     * 在远程服务器注册
     */
    private function regToJiuS($data)
    {
        if (empty($data)) {
            return null;
        }

        $jsonData = json_encode($data);

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->regApi);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

        $resp = curl_exec($ch);
        curl_close($ch);

        return json_decode($resp);
    }
}
