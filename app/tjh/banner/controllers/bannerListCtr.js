'use strict';

angular.module('app.banner')
    .controller('bannerListCtr', function ($scope,$http,$state,$stateParams,AlertService,oss,Upload,$log) {
        //列表获取
        var data={
            category:3
        };
        var listPromise=$http({
            methods:"GET",
            url:'tjh/news',
            params:data
        })
        listPromise.then(function (res) {
            if(res.data.code!=0){
                AlertService.success(res.data.msg);
            }else{
                console.log(res)
                $scope.maxSize = 2;
                $scope.bigTotalItems = Number(res.data.data.totalElements||0);
                $scope.currentPage = 1;
                $scope.total=res.data.data.totalElements;
                $scope.bannerList=res.data.data.content;
                AlertService.success('获取banner列表成功！');
            }
        });

    //   删除
        $scope.bannerDelete= function (item,idx) {
            AlertService.alert('是否删除类别是'+' “'  + item.name+ '”' +'的数据','警告',function () {
                $http.delete("tjh/news/"+item.id+"")
                    .then(function (res) {
                        if(res.data.code==0){
                            AlertService.success('删除成功！');
                            $scope.bannerList.splice(idx,1);
                        }
                    })
            })
        }

        //    分页
        $scope.pageChanged = function() {
            $log.log('Page changed to: ' + $scope.currentPage);
            $http.get('tjh/news',{params:{page:$scope.currentPage, category:3}})
                .then(function(res){
                    if(res.data.code==0){
                        AlertService.success('获取banner列表成功！');
                        $scope.bannerList=res.data.data.content;
                    }
                });
        };

    });
