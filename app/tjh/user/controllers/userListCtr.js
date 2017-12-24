'use strict';

angular.module('app.user')
    .controller('userListCtr', function ($scope,$http,$state,AlertService,$log,$stateParams,$window) {
    //    获取列表数据
        var listDataPromise=$http({
            methods:"GET",
            url:'tjh/user'
        })
        listDataPromise.then(function (res) {
            if(res.data.code!=0){
                AlertService.error(res.data.data.msg);
            }else{
                console.log(res)
                $scope.currentPage = 1;
                $scope.maxSize = 5;
                $scope.bigTotalItems =Number(res.data.data.totalElements||0);
                $scope.data=res.data.data.content;
                AlertService.success('用户列表数据加载成功！');
            }
        })
    //    分页
        $scope.pageChanged = function() {
            $log.log('Page changed to: ' + $scope.currentPage);
            $http.get('tjh/user',{params:{page:$scope.currentPage}})
                .then(function(res){
                    if(res.data.code==0){
                        $scope.data=res.data.data.content;
                    }
                });
        };
        
    //    导出数据
        $scope.exportData= function () {
            var userListPromise=$http({
                methods:"GET",
                url:'tjh/user/export'
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


    //    导出推广数据
        $scope.exportDetail= function () {
            var userListPromise=$http({
                methods:"GET",
                url:'tjh/v2/user/countData'
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
        
    //    删除

        $scope.dateDelete = function (item,idx) {
            AlertService.alert('是否删除昵称是'+' “'  + item.nick_name+ '”' +'的数据','警告',function () {
                $http.delete("tjh/user/"+item.id+"")
                    .then(function (res) {
                        console.log(res)
                        if(res.data.code==0){
                            AlertService.success('删除成功！');
                            $scope.data.splice(idx,1);
                        }
                    })
            })
        }
    });