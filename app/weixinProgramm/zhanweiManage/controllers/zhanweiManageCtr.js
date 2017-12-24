'use strict';

angular.module('app.zhanweiManage').controller('zhanweiManageCtr', function ($scope,$http,AlertService,$log) {



    $http.get('app/weixin/booth',{params:{page:1}})
        .success(function(res){
            console.log(res);
            if(res.errCode===0){
                $scope.maxSize = 5;
                $scope.bigTotalItems = Number(res.content.totalElements||0);
                $scope.currentPage = 1;
                var zhanwei= res.content.content;
                $scope.zhanweiData=zhanwei;
            }else if(res.errCode===200){
                AlertService.success(res.msg)
            }else if(res.errCode===400){
                AlertService.error(res.msg);
            }

        });

    //    分页

    $scope.pageChanged = function() {
        $log.log('Page changed to: ' + $scope.currentPage);
        $http.get('app/weixin/booth',{params:{page:$scope.currentPage}})
            .success(function(res){
                console.log(res);
                $scope.zhanweiData= res.content.content;
            });
    };


//   删除列表

    $scope.deleteZhanwei = function(zhanwei,index){
        AlertService.alert('是否删除企业名字是' +' “'  + zhanwei.company+ '”' +'的数据','警告', function(){
            $http.delete('app/weixin/booth/'+zhanwei.id)
                .success(function(res){
                    console.log(res);
                    if(res.errCode==0){
                        AlertService.success('删除成功');
                        $scope.zhanweiData.splice(index,1)
                    }else if(res.errCode===400){
                        AlertService.error(res.msg)
                    }
                })
        })
    }



//    数据搜索
    $scope.chaxun = function(){
        var key= $scope.search.keywords;
        console.log(key);
        $http.get('app/weixin/booth/keyword/'+key)
            .success(function(res){
            if(res.errCode===0){
                $scope.zhanweiData=res.content.content;
            }else if(res.errCode===200){
                AlertService.error(res.msg)
            }else if(res.errCode===400){
                AlertService.error(res.msg)
            }
        })
    }

});