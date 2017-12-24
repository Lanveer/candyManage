'use strict';

angular.module('app.newsManage').controller('addFenleiCtr', function ($scope,$http,AlertService,$state) {


    $scope.eidt = {};
    $scope.submit= function(edit){
        if(edit.$invalid)
        return;
         console.log($scope.edit)
        // $http.post('app/weixin/newscategory',$scope.edit)
        var fo={
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
        $http.post('http://tjh.xtype.cn/app/weixin/newscategory',$scope.edit,fo)
            .success(function(res){
                if(res && res.errCode==0){
                    AlertService.success("新增分类成功！");
                    $state.go('app.weixin.fenlei');
                }
            })
            .error(function(error){
                AlertService.error("提交失败")
            });




    }

});