'use strict';

angular.module('app.hotel')
    .controller('hotelListCtr', function ($scope,$http,$state,AlertService,$log,Upload,oss,$window) {
    //    获取酒店列表
        var hotelPromise=$http({
            methods:"GET",
            url:'tjh/exhibitionHotel',
            params:{type:1}
        })
        hotelPromise.then(function (res) {
            console.log(res);
            if(res.data.code!=0){
                AlertService.success(res.data.msg);
            }else {
                $scope.currentPage = 1;
                $scope.maxSize = 5;
                $scope.bigTotalItems =Number(res.data.data.totalElements||0);
                $scope.hotelData=res.data.data.content;
                AlertService.success('酒店列表加载成功！');
            }
        })

        // 分页
        $scope.pageChanged = function() {
            $log.log('Page changed to: ' + $scope.currentPage);
            $http.get('tjh/exhibitionHotel',{params:{page:$scope.currentPage,type:1}})
                .then(function(res){
                    if(res.data.code==0){
                        $scope.hotelData=res.data.data.content;
                    }
                });
        };

    //    删除
        $scope.hotelDelete = function (item,idx) {
            AlertService.alert('是否删除酒店名称是'+' “'  + item.name+ '”' +'的数据','警告',function () {
                $http.delete("tjh/exhibitionHotel/"+item.id+"")
                    .then(function (res) {
                        if(res.data.code==0){
                            AlertService.success('删除成功！');
                            $scope.hotelData.splice(idx,1);
                        }
                    })
            })
        }
        
    //    导入数据
        $scope.Excel={};
        $scope.chooseFile = function (file,type) {
            if (!file) {
            } else {
                $scope.isImgUploading = true;
                var key = oss.key + oss.random_string(10) + oss.get_suffix(file.name);
                if (type == -1) {
                    $scope.cover = file;
                } else if (type == 2) {
                    $scope.Excel = file;
                }
                Upload.upload({
                    url: 'tjh/exhibitionHotel/putIn', //S3 upload url including bucket name
                    method: 'POST',
                    data: {
                        key: key, // the key to store the file on S3, could be file name or customized
                        OSSAccessKeyId: oss.OSSAccessKeyId,
                        acl: 'public-read', // sets the access to the uploaded file in the bucket: private, public-read, ...
                        policy: oss.policy, // base64-encoded json policy (see article below)
                        signature: oss.signature, // base64-encoded signature based on policy string (see article below)
                        "Content-Type": file.type != '' ? file.type : 'application/octet-stream', // content type of the file (NotEmpty)
                        filename: file.name, // this is needed for Flash polyfill IE8-9
                        success_action_status: 200,
                        excel: file
                    }
                }).then(function (res) {
                    console.log(res)
                    if(res.data.code!=0){
                    }else{
                        AlertService.success('导入成功！');
                        $window.location.reload();
                    }
                }, function (response) {
                    $scope.isImgUploading = false;
                }, function (evt) {
                });
            }
        };

    });