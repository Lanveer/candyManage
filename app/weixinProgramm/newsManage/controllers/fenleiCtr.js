'use strict';

angular.module('app.newsManage').controller('fenleiCtr', function ($scope,$http,AlertService) {
    $http({
        type:"GET",
        url:'http://tjh.xtype.cn/app/weixin/newscategory'
    }).success(function(res){
        if(res.errCode==0){
            var fenlei= res.content.content;
            $scope.fenleiData= fenlei;
//       获取总数据
            $scope.totalNum= res.content.totalElements;
            AlertService.success("加载成功");
        }else if(res.errCode===200){
            AlertService.success(res.msg)
        }else if(res.errCode===400){
            AlertService.error(res.msg);
        }

    }).error(function(error){
        console.log(error);
        AlertService.error("加载失败");
    });

//分类数据删除
    $scope.deleteFenlei = function(fenlei,index){
       AlertService.alert('是否删除类别是' +' “'  + fenlei.category+ '”' +'的数据', '警告',function(){
           $http.delete("app/weixin/newscategory/"+fenlei.id)
               .success(function (res) {
                   if(res.errCode === 0){
                       $scope.fenleiData.splice(index,1);
                       AlertService.success(res.msg)
                   }else if(res.errCode){
                       AlertService.error(res.msg)
                   }
               })
       });

    }


});





