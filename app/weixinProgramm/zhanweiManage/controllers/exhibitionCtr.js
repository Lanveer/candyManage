'use strict';

angular.module('app.zhanweiManage').controller('exhibitionCtr', function ($scope,$http,AlertService) {


    $http.get('app/weixin/exhibitionhotel/2')
        .success(function(res){
            if(res.errCode===0){
                $scope.maxSize = 5;
                $scope.bigTotalItems = Number(res.content.totalElements||0);
                $scope.currentPage = 1;
                AlertService.success('加载成功！');
                var exhibition=res.content.content;
                $scope.exhibitionData= exhibition;
            }else if(res.errCode===200){
                AlertService.success(res.msg);
            }else if(res.errCode===400){
                AlertService.error(res.msg);
            }

        });

    //    分页

    $scope.pageChanged = function() {
        $log.log('Page changed to: ' + $scope.currentPage);
        $http.get('app/weixin/exhibitionhotel/2',{params:{page:$scope.currentPage}})
            .success(function(res){
                console.log(res);
                $scope.exhibitionData= res.content.content;
            });
    };


//删除数据

    $scope.deleteExhibition = function(item,index){
        AlertService.alert('确定删除名字是！'+item.name+'吗？','警告',function(){
            $http.delete('app/weixin/exhibitionhotel/'+item.id)
                .success(function(res){
                    if(res.errCode==0){
                        $scope.exhibitionData.splice(index,1);
                        AlertService.success('删除成功！')
                    }else if(res.errCode===400){
                        AlertService.error(res.msg)
                    }
                })
        } );
    }


//    查询数据
    $scope.chaxun = function(){
        var key= $scope.search.keywords;
        $http.get('app/weixin/exhibitionhotel/2/keyword/'+key)
            .success(function(res){
                if(res.errCode===0){
                    $scope.exhibitionData= res.content.content;
                }else if(res.errCode==200){
                    AlertService.error(res.msg)
                }else if(res.errCode==400){
                    AlertService.error(res.msg)
                }
            })
    }
});