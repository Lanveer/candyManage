'use strict';


angular.module('app.userManage').controller('userInfoCtr', function ($scope,$http,AlertService,$log) {


//var getDataUrl=url+'/user/read';
//var deleteUrl=url+'user/delete';
    $http.get('app/weixin/user',{params:{page:1}})
        .success(function(res){
            console.log(res)
            if(res.errCode===0){
                $scope.maxSize = 5;
                $scope.bigTotalItems = Number(res.content.totalElements||0);
                $scope.currentPage = 1;
                var list= res.content.content;
                console.log(res);
                $scope.del=res;
                $scope.data=list;
                $scope.totalNum= res.content.totalElements;
            }
             else if(res.errCode===200){
                AlertService.success(res.msg)
            } else if(res.errCode===400){
                AlertService.error(res.msg);
            }
        })
        .error(function(err){

        });
    //    分页

    $scope.pageChanged = function() {
        $log.log('Page changed to: ' + $scope.currentPage);
        $http.get('app/weixin/user',{params:{page:$scope.currentPage}})
            .success(function(res){
                console.log(res);
                $scope.data= res.content.content;
            });
    };


//    删除数据

    $scope.userDelete= function(item,index){
        $http.delete('app/weixin/user/'+item.id)
            .success(function(res){
                if(res.errCode===0){
                    AlertService.success('删除成功!');
                    $scope.del.splice(index,1)
                }
                else{
                    AlertService.success(res.msg)
                }
            })
            .error(function(err){

            })
    };



});



