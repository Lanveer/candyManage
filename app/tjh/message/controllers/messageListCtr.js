'use strict';

angular.module('app.message')

.controller('messageListCtr', function ($scope,$http,$state,AlertService,$log) {

    //    获取列表数据
    var data={};
    var listDataPromise=$http({
        methods:"GET",
        url:'tjh/message',
        params:data
    })
    listDataPromise.then(function (res) {
        //处理成功的数据
        if(res.data.code!=0){
            AlertService.error(res.data.data.msg);
        }else{
            console.log(res)
            $scope.currentPage = 1;
            $scope.maxSize = 5;
            $scope.bigTotalItems =Number(res.data.data.totalElements||0);
            $scope.data=res.data.data.content;
            AlertService.success('消息中心列表数据加载成功！');
        }
    })


    //    删除

    $scope.delete = function (item,idx) {
        AlertService.alert('是否删除消息内容是'+' “'  + item.content+ '”' +'的数据','警告',function () {
            $http.delete("tjh/message/"+item.id+"")
                .then(function (res) {
                    console.log(res)
                    if(res.data.code==0){
                        AlertService.success('删除成功！');
                        $scope.data.splice(idx,1);
                    }
                })
        })
    }

    //    分页
    $scope.pageChanged = function() {
        $log.log('Page changed to: ' + $scope.currentPage);
        $http.get('tjh/message',{params:{page:$scope.currentPage}})
            .then(function(res){
                if(res.data.code==0){
                    AlertService.success('获取列表成功！');
                    $scope.data=res.data.data.content;
                }
            });
    };


});