'use strict';

angular.module('app.newsManage').controller('lunboCtr', function ($scope,$http,AlertService,$log) {

    $http({
        type:"GET",
        url:'app/weixin/banner',
        params:{page:1}
    }).success(function(res){
        console.log(res);
        if(res.errCode===0){
            $scope.maxSize = 5;
            $scope.bigTotalItems = Number(res.content.totalElements||0);
            $scope.currentPage = 1;
            var lunbo=res.content.content;
            $scope.lunboData=lunbo;
            $scope.totalElements= res.content.totalElements;
        }
          else if(res.errCode==200){
            AlertService.success('暂时没有数据！')
        } else if(res.errCode===400){
            AlertService.error(res.msg);
        }

    }).error(function(error){
        console.log(error)
    });



    //    分页

    $scope.pageChanged = function() {
        $log.log('Page changed to: ' + $scope.currentPage);
        $http.get('app/weixin/banner',{params:{page:$scope.currentPage}})
            .success(function(res){
                console.log(res);
                $scope.lunboData= res.content.content;
            });
    };


//    删除事件
    $scope.lunboDelete = function(lunbo,index){
        AlertService.alert('是否删除类别是' +' “'  + lunbo.category+ '”' +'的数据', '警告',function(){
            $http.delete("app/weixin/banner/" +lunbo.id)
                .success(function(res){
                    console.log(res);
                    if(res && res.errCode==0){
                        AlertService.success('删除成功！');
                        $scope.lunboData.splice(index,1);
                    }else if(res.errCode===400){
                        AlertService.error(res.msg);
                    }
                })
        });
    }

});