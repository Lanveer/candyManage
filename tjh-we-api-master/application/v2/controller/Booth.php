<?php

namespace app\v2\controller;

use think\Db;
use think\Request;
use app\v2\model\BoothV2;
use app\v2\model\BoothProduct;
use app\v2\model\ExhibitionHotelV2;
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
    public function index(Request $request)
    {
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
     * Excel资源导入
     *
     * @param  \think\Request  $request
     * @return \think\Response
     */
    public function putIn(Request $request)
    {
        $file = $request->file('excel');
        if(empty($file)) {
            return $this->ajaxResponse([], '文件不能为空', 400);
        }

        // 直接丢缓存目录
        $info = $file->rule('md5')->move(RUNTIME_PATH . 'excel');
        if (empty($info)) {
            return $this->ajaxResponse(['error' => $file->getError()], '文件上传失败', 500); 
        }

        $pathName = $info->getPathName();

        // 定义一个title与Excel文件的数据字典对应
        $title = [
            'company',
            'exhibition_hotel',
            'floor',
            'exhibition_code',
            'is_hot',
            'contact',
            'tel',
            'address',
            'start_time',
            'end_time',
            'introduce',
            'img',
            'primary_label',
            'two_label',
            'three_label',
            'products',
        ];

        // 通过Excel文件获取数据
        $data = Excel::getDataByExcelFile($pathName, $title);
        if (empty($data)) {
            return $this->ajaxResponse([], '提取的数据为空', 400);
        }

        // 启动事务来导入，这里一点也不复杂
        Db::startTrans();
        try{
            // 保存上传查询的酒店ID
            $lastName = '';
            $lastEHId = 0;
            // 使用索引是为了节约内存空间，防止导入大数据时崩溃
            for ($i=0; $i < count($data); $i++) {
                // 这里只是处理一下数据，分隔逗号
                $data[$i]['primary_label'] = explode(',', $data[$i]['primary_label']);
                $data[$i]['two_label'] = explode(',', $data[$i]['two_label']);
                $data[$i]['three_label'] = explode(',', $data[$i]['three_label']);
                $data[$i]['products'] = explode(',', $data[$i]['products']);

                // 根据酒店名字获取ID
                // 判断场所名是否是与上一条相同
                if ($data[$i]['exhibition_hotel'] == $lastName) {
                    $data[$i]['exhibition_hotel_id'] = $lastEHId;
                } else {
                    // 不相同
                    $eh = ExhibitionHotelV2::where(['name' => $data[$i]['exhibition_hotel']])->find();
                    if (empty($eh)) {
                        throw new \Exception('未找到相关酒店');
                    }
                    $data[$i]['exhibition_hotel_id'] = $eh->id;
                    $lastEHId = $eh->id;
                    $lastName = $eh->name;
                }

                // 插入展位
                $tmp = BoothV2::create($data[$i]);
                // 再插入产品
                foreach ($data[$i]['products'] as $value) {
                    $tmp->product()->save(['product_id' => $value]);
                }
            }

            // 不要忘了提交
            Db::commit();    
        } catch (\Exception $e) {
            Db::rollback();

            return $this->ajaxResponse(['error' => $e->getMessage(), 'error_data' => $data[$i]], '在导入数据时出现错误', 500);
        }

        return $this->ajaxResponse(['count' => count($data)], '导入成功');
    }

    /**
     * 保存新建的资源
     *
     * @param  \think\Request  $request
     * @return \think\Response
     */
    public function save(Request $request)
    {
        $data = $request->param();
        if (empty($data)) {
            return $this->ajaxResponse([], '缺少参数', 400);
        }

        $result = BoothV2::create($data);
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
    public function read(Request $request, $id)
    {
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

        $result = BoothV2::update($data, ['id' => $id]);
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
        $result = BoothV2::destroy($id);
        if (!$result) {
            return $this->ajaxResponse($result, '删除失败', 500);
        }

        // 删除对应的产品
        BoothProduct::destroy(['booth_id', $id]);

        return $this->ajaxResponse($result);
    }
}
