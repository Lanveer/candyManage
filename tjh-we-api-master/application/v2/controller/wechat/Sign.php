<?php

namespace app\v2\controller\wechat;

use think\Request;
use app\v2\model\UserV2;

/**
 * 用户
 */
class Sign extends Base
{
    protected $regApi = 'http://api.jiushang.cn/api/register';

    /**
     * 保存新建的资源 - 注册
     *
     * @param  \think\Request  $request
     * @return \think\Response
     */
    public function up(Request $request)
    {
        $data = array_filter($request->param());
        if (empty($data)) {
            return $this->ajaxResponse($request->param(), '参数不完整', 400);
        }

        $opencode = $request->param('opencode/s');

        // 验证openid
        $wechatret = $this->getOpenID($opencode);
        if (empty($wechatret) || empty($wechatret['openid'])) {
            return $this->ajaxResponse($wechatret, 'OPENID获取失败', 500);
        }
        // 查询是否存在此openid
        $e = UserV2::where(['openid' => $wechatret['openid']])->find();
        if (!empty($e)) {
            return $this->ajaxResponse($e, '已存在此微信用户', 400);
        }
        $data['openid'] = $wechatret['openid'];
        // 验证结束

        $nick_name = $request->param('nick_name/s');
        $tel = $request->param('tel/s');
        $email = $request->param('email/s');
        $password = $request->param('password/s');
        $header = $request->param('header/s');

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

        $result = UserV2::create($data);
        if (empty($result)) {
            return $this->ajaxResponse([], '创建失败', 500);
        }

        return $this->ajaxResponse($result);
    }

    /**
     * 登录
     *
     * @param  int  $id
     * @return \think\Response
     */
    public function in()
    {
        $opencode = $this->request->param('opencode/s');
        if (empty($opencode)) {
            return $this->ajaxResponse([], '参数不完整', 300);
        }

        // 验证openid
        $wechatret = $this->getOpenID($opencode);
        if (empty($wechatret) || empty($wechatret['openid'])) {
            return $this->ajaxResponse($wechatret, 'OPENID获取失败', 500);
        }

        $data = UserV2::where(['openid' => $wechatret['openid']])
                ->with(['booth' => ['exhibition']])
                ->find();

        if (empty($data)) {
            return $this->ajaxResponse([], '不存在此用户', 300);
        }

        $data['token'] = $this->getToken($data['id']);

        return $this->ajaxResponse($data);
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

    /**
     * 获取token
     */
    private function getJSWToken()
    {
        $url    = 'https://auth.jiushang.cn/oauth/token';
        $header = ['Authorization:Basic ' . base64_encode(config('v2.auth.authorization'))];
        $data   = [
            'grant_type' => 'password',
            'username' => config('v2.username'),
            'password' => config('v2.password'),
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        $result = curl_exec($ch);

        if ($result === FALSE) {
            return null;
        }
        curl_close($ch);
        return json_decode($result, true);
    }

    /**
     * 获取OpenID
     */
    public function getOpenID($code)
    {
        if (empty($code)) return null;

        $appid = config('v2.appid');
        $secret = config('v2.secret');

        $url = "https://api.weixin.qq.com/sns/jscode2session?appid=" . $appid . "&secret=" . $secret . "&grant_type=authorization_code&js_code=" . $code;

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $result = curl_exec($ch);
        curl_close($ch);

        if (empty($result)) {
            return null;
        }

        return json_decode($result, true);
    }
}
