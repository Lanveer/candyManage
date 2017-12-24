'use strict';

angular.module('app.newsManage').controller('editFenleiCtr', function ($scope,$http,AlertService,$stateParams,$state) {
var e_id= $stateParams.id;
    $http({
        url:'app/weixin/newscategory/id/'+e_id,
        method:'GET'
    })
        .success(function(res){
            console.log(res);
            var editData= res.content;
            $scope.edit=editData;
        });

    $scope.eidt = {};
    $scope.submit= function(edit){
        if(edit.$invalid)
            return;
        $http.post('app/weixin/newscategory/'+e_id,$scope.edit)
            .success(function(res){
                console.log(res);
                if(res && res.errCode==0){
                    AlertService.success("编辑成功");
                    $state.go('app.weixin.fenlei');
                }else if(res.errCode===200){
                    AlertService.error(res.msg)
                }
                else if(res.errCode===400){
                    AlertService.error(res.msg);
                }

            })
            .error(function(error){
                console.log(error);
                AlertService.error("编辑失败")
            })



    }

});