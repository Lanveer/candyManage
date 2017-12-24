'use strict';

angular.module('app.zhanwei')
    .controller('zhanweiListCtr', function ($scope,$http,$state,AlertService,$log,Upload,oss,$window) {
    //    获取展位列表
        $scope.chaxun= function () {
            if($scope.search.keywords==undefined){
                AlertService.error('请输入关键字查询')
            }else{
                var zhanweiPromise=$http({
                    methods:"GET",
                    url:'tjh/booth',
                    params:{
                        hidden:1,
                        recommended:1,
                        skw:$scope.search.keywords
                    }
                })
                zhanweiPromise.then(function (res) {
                    if(res.data.code!=0){
                        AlertService.success(res.data.msg);
                    }else {
                        // console.log(res)
                        $scope.currentPage = 1;
                        $scope.maxSize = 5;
                        $scope.bigTotalItems =Number(res.data.data.totalElements||0);
                        $scope.zhanweiData=res.data.data.content;
                        AlertService.success('展位列表加载成功！');
                    }
                })
            }

        }
        var zhanweiPromise=$http({
            methods:"GET",
            url:'tjh/booth',
            params:{
                hidden:1,
                recommended:1
            }
        })
        zhanweiPromise.then(function (res) {
            if(res.data.code!=0){
                AlertService.success(res.data.msg);
            }else {
                console.log(res)
                $scope.currentPage = 1;
                $scope.maxSize = 5;
                $scope.bigTotalItems =Number(res.data.data.totalElements||0);
                $scope.zhanweiData=res.data.data.content;
                AlertService.success('展位列表加载成功！');
            }
        })
        //搜索展位

        // 分页
        $scope.pageChanged = function() {
            $http.get('tjh/booth',{params:{page:$scope.currentPage,type:1,skw:$scope.search.keywords,recommended:1}})
                .then(function(res){
                    if(res.data.code==0){
                        $scope.zhanweiData=res.data.data.content;
                    }
                });
        };

    //    删除
        $scope.hotelDelete = function (item,idx) {
            AlertService.alert('是否删除企业名称是'+' “'  + item.company+ '”' +'的数据','警告',function () {
                $http.delete("tjh/booth/"+item.id+"")
                    .then(function (res) {
                        if(res.data.code==0){
                            AlertService.success('删除成功！');
                            $scope.zhanweiData.splice(idx,1);
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
                    url: 'tjh/booth/putIn', //S3 upload url including bucket name
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