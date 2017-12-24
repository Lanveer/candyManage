'use strict';

angular.module('app.newsManage').controller('addLunboCtr', function ($scope,$http,$state,Upload,oss,AlertService) {
//下拉列表的获取
    $scope.isImgUploading=false;
    $http.get("app/weixin/newscategory")
        .success(function(res){
            console.log(res);
            if(res.errCode==0){
                AlertService.success('加载成功！')
            }
            var category=res.content.content;
            $scope.categoryList=category;

        }).error(function(error){
            console.log(error)
        });

//添加轮播图片提交表单
    $scope.submitForm = function(){
        $http.post('app/weixin/banner',$scope.addLunbo)
            .success(function(res){
                console.log(res);
                if(res.errCode==0){
                    AlertService.success('提交成功');
                $state.go('app.weixin.lunbo')
                }

            })
            .error(function(error){
                console.log(error);
                AlertService.error('提交失败')
            })
    };




// 图片上传
    $scope.addLunbo={};
    $scope.chooseFile = function (file,type) {
        if (file) {
            $scope.isImgUploading=true;
            var key = oss.key + oss.random_string(10) + oss.get_suffix(file.name);
            if(type==-1){
                $scope.cover = file;
            }else if(type==2){
                $scope.addLunbo.file2 = file;
            }
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
                if(type==-1){
                    $scope.addLunbo.banner = 'http://pic.jiushang.cn/' + key;
                }else if(type==2){
                    $scope.addLunbo.url2 = 'http://pic.jiushang.cn/' + key;
                }

            }, function (response) {
                $scope.isImgUploading=false;
            }, function (evt) {
            });
        }
    }

});