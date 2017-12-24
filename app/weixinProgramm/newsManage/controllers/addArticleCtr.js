'use strict';

angular.module('app.newsManage').controller('addArticleCtr', function ($scope,$http,$stateParams,AlertService,oss,Upload,$state) {
    $scope.article = {image1:'',image2:'',image3:'',content1:'',content2:'',content3:''};
    $scope.images=[];
    $scope.isImgUploading=false;

//下拉列表
    $http.get("app/weixin/newscategory")
        .success(function(res){
            console.log(res);
            var category=res.content.content;
            $scope.categoryList=category;
        }).error(function(error){
            console.log(error)
        });
//    表单提交
     $scope.submitForm= function(){
    $http.post('app/weixin/news',$scope.article)
        .success(function(res){
            console.log(res);
            if(res.errCode==0){
                AlertService.success("添加成功");
                $state.go('app.weixin.article');
            }else if(res.errCode===200){
                AlertService.error(res.msg);
            }else if(res.errCode===400){
                AlertService.error(res.msg);
            }
        })
        .error(function(error){
            AlertService.error('添加失败！')
        })
};



    // 图片上传
    $scope.chooseFile = function (file,type) {
        if (file) {
            $scope.isImgUploading=true;
            var key = oss.key + oss.random_string(10) + oss.get_suffix(file.name);
            if(type==-1){
                $scope.cover=file
            }else {
                $scope.images[type] = file;
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
                    $scope.article.cover = 'http://pic.jiushang.cn/' + key;
                }else{
                    $scope.article['image'+(type+1)] = 'http://pic.jiushang.cn/' + key;
                }

            }, function (response) {
                $scope.isImgUploading=false;
            }, function (evt) {
            });
        }
    }


});