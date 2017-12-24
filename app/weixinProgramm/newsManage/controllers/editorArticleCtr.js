'use strict';

angular.module('app.newsManage')
    .controller('editorArticleCtr', function ($scope,$http,$stateParams,AlertService,oss,Upload,$state) {
    $scope.isImgUploading=false;
    var e_id= $stateParams.id;
    $scope.images=[];

    $http.get("app/weixin/newscategory")
        .success(function(res){
            console.log(res);
             var category=res.content.content;
            $scope.categoryList=category;
            $http.get("app/weixin/news/id/"+ e_id)
                .success(function(res){
                    if(res.errCode===0){
                        var edit=res.content;
                        $scope.article = edit;
                        delete  $scope.article.category;
                        delete  $scope.article.id;
                        $scope.cover=edit.cover;
                    }else if(res.errCode===400){
                        AlertService.error(res.msg)
                    }


                }).error(function(error){
                    console.log(error)
                })

        }).error(function(error){
            console.log(error)
        });


//        修改表单的提交
        $scope.submitForm= function(){
            $http.post('app/weixin/news/'+e_id,$scope.article)
                .success(function(res){
                    if(res.errCode==0){
                        AlertService.success("修改成功");
                        $state.go('app.weixin.article');
                        console.log(res)
                    }else if(res.errCode===200){
                        AlertService.error(res.msg)
                    }else if(res.errCode===400){
                        AlertService.error(res.msg)
                    }

                })
                .error(function(err){
                    AlertService.error("修改失败");
                    console.log(err)
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