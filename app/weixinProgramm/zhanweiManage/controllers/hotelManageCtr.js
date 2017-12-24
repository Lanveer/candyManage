'use strict';

angular.module('app.zhanweiManage').controller('hotelManageCtr', function ($scope,$http,AlertService,$log) {

    $http({
        url:'app/weixin/exhibitionhotel/1',
        method:'GET',
        params:{page:1}
    }).success(function(res){
        if(res.errCode===0){
            $scope.currentPage = 1;
            $scope.totalItems =Number(res.content.totalElements||0);
            console.log(res);
            var hotel=res.content.content;
            $scope.hotelData= hotel;
            $scope.yes='是';
            $scope.no='否';
        }else if(res.errCode===200){
            AlertService.success(res.msg)
        }else if(res.errCode===400){
            AlertService.error(res.msg);
        }


    }).error(function(data){
        console.log(data)
    });

    //    分页

    $scope.pageChanged = function() {
        $log.log('Page changed to: ' + $scope.currentPage);
        $http.get('app/weixin/exhibitionhotel/1/',{params:{page:$scope.currentPage}})
            .success(function(res){
                console.log(res);
                $scope.hotelData= res.content.content;
            });
    };

//   删除酒店数据
    $scope.hotelDelete = function(hotel,index){

        AlertService.alert('是否删除酒店名字是' +' “'  + hotel.name+ '”' +'的数据','警告',function(){
            $http.delete('app/weixin/exhibitionhotel/'+hotel.id)
                .success(function(res){
                    if(res.errCode===0){
                        AlertService.success('删除成功！');
                        $scope.hotelData.splice(index,1);
                    }else if(res.errCode===400){
                        AlertService.error(res.msg)
                    }
                })
        })
    }


//    酒店查询
   $scope.chaxun = function(){
       var key= $scope.search.keywords
       $http.get('app/weixin/exhibitionhotel/1/keyword/'+key)
           .success(function(res){
               console.log(res);
               if(res.errCode===0){
                   $scope.hotelData= res.content.content;
               }else if(res.errCode===200){
                   AlertService.error(res.msg)
               }else if(res.errCode===400){
                   AlertService.error(res.msg)
               }
           })
   }





});