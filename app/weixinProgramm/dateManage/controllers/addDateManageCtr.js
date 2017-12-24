'use strict';

angular.module('app.weixinDateManage')
    .controller('addDateManageCtr', function ($scope,$http,oss,Upload,$state,AlertService,$filter) {
    $scope.DateManage={};
    $scope.chooseHotel={};
    $scope.types=[];
    $scope.subTypes=[];
    $scope.dateList=[];
    $scope.isImgUploading=false;
    $http.get("app/weixin/agenda?datelist=true")
        .then(function (res) {
            $scope.dateList = res.data.content;
        })
        .then(function () {
            $http.get("app/weixin/booth?exhibitionhotel=true")
                .success(function (res) {
                    if(res.errCode === 0){
                        $scope.types = res.content;
                        if($state.params.id)
                            $http({
                                url:"app/weixin/agenda/id/"+$state.params.id,
                                method:'GET'
                            }).success(function(res,header,config,status){
                                console.log(res);
                                $scope.DateManage  = res.content;
                            }).error(function(error){
                                console.log(error)
                            });
                    }
                })
        });
    $scope.submitForm = function () {
        delete  $scope.DateManage.id;
        var url = "app/weixin/agenda";
        if($state.params.id)
            url+="/"+$state.params.id;
        $http.post(url, $scope.DateManage)
            .success(function (res) {
                if(res.errCode === 0)
                {
                    $state.go("app.weixin.dateManage");
                    AlertService.success("添加成功！")
                }
                else if(res.errCode===200){
                    AlertService.error(res.msg)
                }
                else if(res.errCode===400){
                    AlertService.error(res.msg)
                }

            })
        };

// 图片上传
    $scope.chooseFile = function (file,xiangqing) {
            if (file) {
                $scope.isImgUploading=true;
                var key = oss.key + oss.random_string(10) + oss.get_suffix(file.name);
                if(xiangqing)
                    $scope.infoimg = file;
                else
                    $scope.image = file;

                Upload.upload({
                    url: 'http://jswpic.oss-cn-hangzhou.aliyuncs.com', //S3 upload url including bucket name
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
                        file: file
                    }
                }).then(function (response) {
                    $scope.isImgUploading=false;
                    if(xiangqing)
                        $scope.DateManage.infoimg = 'http://pic.jiushang.cn/' + key;
                    else
                        $scope.DateManage.img = 'http://pic.jiushang.cn/' + key;

                }, function (err) {
                    $scope.isImgUploading=false;
                }, function (evt) {

                });
            }
        }

});