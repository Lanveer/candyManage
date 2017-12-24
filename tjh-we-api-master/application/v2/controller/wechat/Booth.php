<?php

namespace app\v2\controller\wechat;

use think\Db;
use app\v2\model\BoothV2;
use app\v2\model\BoothCollection as Collection;

/**
 * 展位信息
 */
class Booth extends Base
{
    /**
     * 显示资源列表
     *
     * @return \think\Response
     */
    public function index()
    {
        $request = $this->request;

        $page = $request->param('page/d', 1);
        $limit = $request->param('limit/d', 10);

        // 限制limit最大为100
        $limit = $limit < 100 ? $limit : 100;
        $list = BoothV2::scope('filter', $request)
                ->with(['exhibition'])
                ->limit($limit)
                ->order('id desc')
                ->page($page);

        $list = $list->select();
        if (empty($list)) {
            return $this->ajaxResponse([], '列表数据为空', 300);
        }

        // 统计总条数
        $total = BoothV2::scope('filter', $request)->count();
        $totalPages = ceil($total / $limit);

        return $this->ajaxResponse([
            'content' => $list,
            'totalElements' => $total,
            'totalPages' => $totalPages,
            'currentPage' => $page,
        ]);
    }

    /**
     * 显示指定的资源
     *
     * @param  int  $id
     * @return \think\Response
     */
    public function read()
    {
        $request = $this->request;
        $id = $request->param('id/d');

        $data = BoothV2::where(['id' => $id])
                ->with(['exhibition', 'product'])
                ->find();
        if (empty($data)) {
            return $this->ajaxResponse([], '不存在此资源', 300);
        }

        $data['collected'] = 0;
        $user_id = $request->param('user_id/d');
        if ($user_id) {
            if (!empty(Collection::where(['user_id' => $user_id, 'booth_id' => $id])->find())) {
                $data['collected'] = 1;
            }
        }

        return $this->ajaxResponse($data);
    }
}
