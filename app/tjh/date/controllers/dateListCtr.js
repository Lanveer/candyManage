'use strict';

angular.module('app.date')
    .controller('dateListCtr', function ($scope,$http,$state,AlertService,$log,$stateParams) {
    //    获取列表数据
        var listDataPromise=$http({
            methods:"GET",
            url:'tjh/agenda'
        })
        listDataPromise.then(function (res) {
            if(res.data.code!=0){
                AlertService.error(res.data.data.msg);
            }else{
                $scope.currentPage = 1;
                $scope.maxSize = 5;
                $scope.bigTotalItems =Number(res.data.data.totalElements||0);
                $scope.data=res.data.data.content;
                AlertService.success('日程列表数据加载成功！');
            }
        })
    //    分页
        $scope.pageChanged = function() {
            $log.log('Page changed to: ' + $scope.currentPage);
            $http.get('tjh/agenda',{params:{page:$scope.currentPage}})
                .then(function(res){
                    if(res.data.code==0){
                        $scope.data=res.data.data.content;
                    }
                });
        };
    //    删除

        $scope.dateDelete = function (item,idx) {
            AlertService.alert('是否删除主题是'+' “'  + item.theme+ '”' +'的数据','警告',function () {
                $http.delete("tjh/agenda/"+item.id+"")
                    .then(function (res) {
                        if(res.data.code==0){
                            AlertService.success('删除成功！');
                            $scope.data.splice(idx,1);
                        }
                    })
            })
        }
    });