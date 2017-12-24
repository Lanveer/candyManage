'use strict';

angular.module('app.productQualify')
    .controller('productQualifyCtr', function ($scope,$http,$state,AlertService,$log,$stateParams) {
        //假数据
        $scope.testData=[
            {
                idx:1,
                name:'五粮液',
                img:'http://www.jiushang.cn/data/attachment/common/8f/090644qbj0ppgpzpsjgip8.png',
                type:'浓香型',
                degree:'52度',
                address:'四川 北京',
                weight:'300ml',
                factory:'四川宜宾',
                des:'这是简单的描述',
                status:1
            }
        ]

        //获取产品审核列表
        var data={};
        var listDataPromise=$http({
            methods:"GET",
            url:'tjh/news',
            params:data
        })
        listDataPromise.then(function (res) {
           //处理成功的数据
        })

        //通过产品审核
        $scope.pass= function (item) {
            AlertService.alert('是否通过香型是'+' “'  + item.type+ '”' +'的审核','警告',function () {
                $http.delete("tjh/news/"+item.id+"")
                    .then(function (res) {

                    })
            })
        }


        //拒绝审核
        $scope.refuse= function (item) {
            AlertService.alert('是否拒绝香型是'+' “'  + item.type+ '”' +'的审核','警告',function () {
                $http.delete("tjh/news/"+item.id+"")
                    .then(function (res) {

                    })
            })
        }



        //删除
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