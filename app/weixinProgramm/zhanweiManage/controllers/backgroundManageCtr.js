'use strict';

angular.module('app.zhanweiManage').controller('backgroundManageCtr', function ($scope,$http,AlertService,$log) {
    function loadData() {
      $http.get("app/weixin/backgroundimg",{params:{page:1}})
          .success(function(res){
              if(res && res.errCode==0){
                  $scope.maxSize = 5;
                  $scope.bigTotalItems = res.content.totalPages;
                  $scope.currentPage = 1;
                  AlertService.success("加载成功！");
                  var back= res.content.content;
                  $scope.backImg = back;
              }else if(res.errCode===200){
                  AlertService.success(res.msg)
              }else if(res.errCode===400){
                  AlertService.error(res.msg);
              }

          }).error(function(res){
              AlertService.error('加载失败！')
          })

    }


    //    分页

    $scope.pageChanged = function() {
        $log.log('Page changed to: ' + $scope.currentPage);
        $http.get('app/weixin/backgroundimg',{params:{page:$scope.currentPage}})
            .success(function(res){
                console.log(res);
                $scope.zhanweiData= res.content.content;
            });
    };

    $scope.deleteBackground = function (back) {
        AlertService.alert("是否删除！","警告", function () {
        $http.delete("app/weixin/backgroundimg/"+back.id)
            .success(function (res) {
                if(res.errCode ===0)
                loadData();
                else{
                    AlertService.success(res.msg)
                }
            })
        })
    };

    loadData();



    $scope.chaxun = function(){
        var key= $scope.search.keywords;
        console.log(key)
        $http.get('app/weixin/backgroundimg/keyword/'+key)
            .success(function(res){
                console.log(res)
                if(res.errCode===0){
                    $scope.backImg = res.content.content;
                }else if(res.errCode===200){
                    AlertService.error(res.msg)
                }else if(res.errCode===400){
                    AlertService.error(res.msg)
                }
            })
    }
});