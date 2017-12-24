'use strict';

angular.module('app.zhanweiManage').controller('editBackgroundManageCtr', function ($scope,$http,$state,oss,Upload,AlertService) {
    $scope.Background = {};
    $scope.isImgUploading=false;
    if($state.params.id){
        $http.get("app/weixin/backgroundimg/id/"+$state.params.id)
            .success(function (res) {
                $scope.Background = res.content;
                $scope.Background.hotel_num = Number(  $scope.Background.hotel_num) ;
            })
    }


    $scope.submitForm = function () {
        var url = "app/weixin/backgroundimg";
        if($state.params.id)
        url+="/"+$state.params.id;
        delete  $scope.Background.id;
        $http.post(url,$scope.Background)
            .success(function (res) {
                if(res.errCode == 0){
                    AlertService.success("提交成功！");
                    $state.go("app.weixin.backgroundManage");
                }else if(res.errCode===200){
                    AlertService.success(res.msg)
                }else if(res.errCode==400){
                    AlertService.error(res.msg)
                }

            })
    };
    $scope.chooseFile = function (file) {
        if (file) {
//            $scope.isImgUploading=true;
            var key = oss.key + oss.random_string(10) + oss.get_suffix(file.name);
            $scope.backImage = file;

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
                $scope.Background.back_image = 'http://pic.jiushang.cn/' + key;

            }, function (response) {
//                $scope.isImgUploading=false;
            }, function (evt) {
            });
        }
    }

});