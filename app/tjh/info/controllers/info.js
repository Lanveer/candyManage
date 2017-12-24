'use strict';

angular.module('app.info')
    .controller('infoCtr', function ($scope,$http,$state,AlertService,$log,$window) {

    //    获取列表数据
        var data={};
        var listDataPromise=$http({
            methods:"GET",
            url:'tjh/actionCount',
            params:data
        })
        listDataPromise.then(function (res) {
            //处理成功的数据
            console.log(res);
            if(res.data.code!=0){
                AlertService.error(res.data.msg)
            }else{
                $scope.currentPage = 1;
                $scope.maxSize = 5;
                $scope.bigTotalItems =Number(res.data.data.totalElements||0);
                $scope.listData=res.data.data.content;
            }
        })


        //    分页
        $scope.pageChanged = function() {
            $log.log('Page changed to: ' + $scope.currentPage);
            $http.get('tjh/actionCount',{params:{page:$scope.currentPage}})
                .then(function(res){
                    if(res.data.code==0){
                        $scope.listData=res.data.data.content;
                    }
                });
        };


        //    导出数据
        $scope.export= function () {
            var userListPromise=$http({
                methods:"GET",
                url:'tjh/actionCount/export'
            });
            userListPromise.then(function (res) {
                console.log(res);
                if(res.data.code!=0){
                    AlertService.error('导出数据异常')
                }else{
                    $scope.path=res.data.data.path;
                    $scope.host=res.data.data.host;
                    AlertService.success('数据导出成功')
                    $window.location.href=$scope.host+$scope.path;
                }

            })
        }

    });