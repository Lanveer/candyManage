'use strict';

angular.module('app.qualify')
    .controller('qualifyCtr', function ($scope,$http,$state,AlertService,$log,$stateParams) {
        //假数据
        $scope.testData=[
            {
                idx:12,
                name:'测试审核',
                img:'http://www.jiushang.cn/data/attachment/common/8f/090644qbj0ppgpzpsjgip8.png',
                tel:'1820046532',
                time:'2016-12-06 10:11:38',
                url:'https://www.baidu.com',
                status:1
            }
        ]

        //获取审核列表
        var data={};
        var listDataPromise=$http({
            methods:"GET",
            url:'tjh/news',
            params:data
        })
        listDataPromise.then(function (res) {
           //处理成功的数据
        })

        //通过审核
        $scope.pass= function (item) {
            AlertService.alert('是否通过名称是'+' “'  + item.name+ '”' +'的审核','警告',function () {
                $http.delete("tjh/news/"+item.id+"")
                    .then(function (res) {

                    })
            })
        }



        //   删除
        $scope.dataDelete= function (item,idx) {
            AlertService.alert('是否删除名称是'+' “'  + item.name+ '”' +'的数据','警告',function () {
                $http.delete("tjh/news/"+item.id+"")
                    .then(function (res) {

                    })
            })
        }
        //    分页
        $scope.pageChanged = function() {
            $log.log('Page changed to: ' + $scope.currentPage);
            $http.get('tjh/news',{params:{page:$scope.currentPage}})
                .then(function(res){
                    // if(res.data.code==0){
                    //     AlertService.success('获取banner列表成功！');
                    //     $scope.bannerList=res.data.data.content;
                    // }
                });
        };


    });