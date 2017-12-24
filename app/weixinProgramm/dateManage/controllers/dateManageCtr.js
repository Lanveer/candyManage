'use strict';

angular.module('app.weixinDateManage')
    .controller('dateManageCtr', function ($scope,$http,$state,AlertService,$log) {

        //获取数据
        function loadData() {
            $http({
                url:"app/weixin/agenda",
                method:'GET',
                params:{page:1}
            }).success(function(data,header,config,status){
                if(data.errCode===0){
                    $scope.currentPage = 1;
                    $scope.totalItems =Number(data.content.totalElements||0);
                    var res= data.content.content;
                    $scope.yes='是';
                    $scope.no='否';
                    $scope.data=res;
                    $scope.totalNum= data.content.totalElements;
                }else if(data===200){
                    AlertService.success(data.msg);
                }else if(data===400){
                    AlertService.error(data.msg);
                }

            }).error(function(error){
                if(error.errCode===400){
                    AlertService.error(error.msg);
                }
            });
        }

//    删除数据
    $scope.dateDelete= function(date){
        AlertService.alert("是否删除","警告", function () {
            $http({
                url:"app/weixin/agenda/" + date.id,
                method:'delete'
            })
                .success(function () {
                    loadData()
                })
        })
    };



        loadData();


//        搜索数据

 $http.get("app/weixin/agenda?datelist=true")
     .then(function (res) {
         $scope.dateList = res.data.content;
     });
$scope.chaxun = function(){

    var theme = $scope.search.theme;
    var hotel = $scope.search.hotel;
    var dateid=$scope.search.dateid;
 $http.get('app/weixin/agenda/keyword/'+theme +hotel +dateid)
     .success(function(res){
         if(res.errCode===0){
             $scope.data=res.content.content;
         }else if(res.errCode===200){
             AlertService.error(res.msg)
         }else if(res.errCode===400){
             AlertService.error(res.msg)
         }
     })
};
    //    分页

        $scope.pageChanged = function() {
            $log.log('Page changed to: ' + $scope.currentPage);
            $http.get('app/weixin/agenda',{params:{page:$scope.currentPage}})
                .success(function(res){
                    console.log(res);
                    $scope.data= res.content.content;
                });
        };

    });