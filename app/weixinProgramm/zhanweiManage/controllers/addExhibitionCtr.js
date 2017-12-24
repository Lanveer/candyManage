'use strict';

angular.module('app.zhanweiManage').controller('addExhibitionCtr', function ($scope,$state,oss,Upload,AlertService,$http) {
    $scope.exhibition={};



    $scope.chooseFile = function (file,type) {
        if (file) {
            var key = oss.key + oss.random_string(10) + oss.get_suffix(file.name);
                $scope.logo = file;

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
                    $scope.exhibition.logo = 'http://pic.jiushang.cn/' + key;

            }, function (response) {
                alert("error")
            }, function (evt) {
            });
        }
    }

//    f分组获取

    $http.get('app/weixin/exhibitionhotel/2?group=true')
        .success(function(res){
            console.log(res);
            var cat= res.content;
            $scope.category= cat;

            if($state.params.id){
                $http.get("app/weixin/exhibitionhotel/2/id/"+$state.params.id)
                    .success(function (res) {
                        if(res.errCode === 0)
                            $scope.exhibition = res.content;
                    })
            }
        });


    $scope.submitForm = function(){

        delete $scope.exhibition.id;
        $scope.exhibition.type=2;
        var url = "app/weixin/exhibitionhotel";
        if($state.params.id)
        url+="/"+$state.params.id;
        $http.post(url,$scope.exhibition)
            .success(function(res){
                if(res.errCode==0){
                    AlertService.success("提交成功！");
                    $state.go('app.weixin.exhibition');
                }else if(res.errCode===200){
                    AlertService.success(res.msg);
                }else if(res.errCode===400){
                    AlertService.error(res.msg)
                }
            })
            .error(function(err){
                AlertService.error("提交失败！");
            })
    };
});