'use strict';

angular.module('app.newsManage').controller('articleCtr', function ($scope,$http,AlertService,$stateParams,$uibModal,$log) {

    $http({
        type:"GET",
        url:'app/weixin/news',
        params:{page:1}
    }).success(function(res){
        if(res.errCode===0){
            console.log(res);
            $scope.currentPage = 1;
            $scope.totalItems =res.content.totalPages;
            var article= res.content.content;
            $scope.articleData=article;

            $scope.yes='是';
            $scope.no='否';
            AlertService.success("加载成功");



        }else if(res.errCode===200){
            AlertService.success(res.msg)
        }else if(res.errCode===400){
            AlertService.error(res.msg);
        }

    }).error(function(res,error){
        console.log(error);
        AlertService.error("加载失败")

    });


//    分页

    $scope.pageChanged = function() {
        $log.log('Page changed to: ' + $scope.currentPage);
        $http.get('app/weixin/news',{params:{page:$scope.currentPage}})
            .success(function(res){
                console.log(res);
                $scope.articleData= res.content.content;
            });
    };



//    文章的删除
    $scope.articleDelete = function(article,index){

        AlertService.alert('是否删除名字是' +' “'  + article.name+ '”' +'的数据','警告',function(){
            $http.delete("app/weixin/news/"+article.id)
                .success(function (res) {
                    if(res.errCode=== 0){
                        $scope.articleData.splice(index,1);
                        AlertService.success("删除成功！");
                    }else if(res.errCode===400){
                        AlertService.error(res.msg);
                    }
                })
        });

    };


// 文章的查询

    $scope.chaxun = function(){
       var key= $scope.search.keywords;
        if(key=='是'){
            var key='1'
        }else if(key=='否'){
            var key='0'
        }
       $http.get('app/weixin/news/keyword/'+ key)
           .success(function(res){
               if(res.errCode===0){
                   var article= res.content.content;
                   $scope.articleData=article;
                   $scope.yes='是';
                   $scope.no='否';
                   AlertService.success("加载成功")
               }else if(res.errCode===200){
                   AlertService.error(res.msg)
               }
               else if(res.errCode==400){
                   AlertService.error(res.msg);
               }
           })
    };

//弹窗

//     $scope.open = function(size){
//         console.log(size.id);
//         $http.get("app/weixin/news/id/"+ size.id)
//             .success(function(res){
//                 console.log(res);
//                 if(res.errCode===0){
//                 $scope.modalData=res.content;
//                 $scope.modalTitle=res.content.name;
//                 $scope.tt='www'
//                 }else if(res.errCode===400){
//                     AlertService.error(res.msg)
//                 }
//             });
//        var modalInstance= $uibModal.open({
//            animation: $scope.animationsEnabled,
//            templateUrl: 'myModalContent.html',
//            controller: 'ModalInstanceCtrl',
//            size: size,
//            resolve: {
//                items: function () {
//                    return $scope.items;
//                }
//            }
//        });
//         modalInstance.result.then(function (selectedItem) {
//             $scope.selected = selectedItem;
//         }, function () {
//             $log.info('Modal dismissed at: ' + new Date());
//         });
//     };
//     $scope.toggleAnimation = function () {
//         $scope.animationsEnabled = !$scope.animationsEnabled;
//     };
//
//
// });
//
// angular.module('app.newsManage').controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, items) {
//     $scope.ok = function () {
//         $uibModalInstance.close();
//     };
//     $scope.cancel = function () {
//         $uibModalInstance.dismiss('cancel');
//     };

});






