'use strict';

angular.module('app.user')
.controller('userAddCtr', function ($stateParams,$scope,$http,$state,AlertService,oss,Upload) {
    var edit_id=$stateParams.id;
    if(edit_id){

        //选择日期
        var datePromie=$http({
            methods:"get",
            url:'tjh/dates'
        });
        datePromie.then(function (res) {
            if(res.data.code==0){
                console.log(res)
                $scope.dateList=res.data.data;
            }
        })

        //获取酒店或者展馆
        var datePromie=$http({
            methods:"get",
            url:'tjh/exhibitionHotel',
            params:{
                limit:99,
                field:'name'
            }
        });
        datePromie.then(function (res) {
            if(res.data.code==0){
                $scope.hotelList=res.data.data.content;
            }
        })
        // 获取修改数据
        var editPromise=$http({
            methods:"PUT",
            url:'tjh/agenda/'+edit_id+''
        });
        editPromise.then(function (msg) {
            console.log(msg)
            $scope.AddDate=msg.data.data;
            $scope.modifyImg=msg.data.data.cover;
            var imgs=msg.data.data.cover;
        });
        // 提交修改数据
        var fo={
            headers: { 'Accept': 'application/x-www-form-urlencode' },
        }
        $scope.submitData = function () {
            // var modify=$scope.modifyImg
            // var cover=$scope.cover
            // if(cover==null && modify==undefined){
            //     AlertService.error('请上传一张图片');
            //     return;
            // }
            // var imgs;
            // if(modify==undefined){
            //     imgs=cover
            // }else if(cover==null){
            //     imgs=modify
            // }

            var data={
                page_id:$scope.AddDate.page_id,
                is_hot:$scope.AddDate.is_hot,
                time:$scope.AddDate.time,
                theme:$scope.AddDate.theme,
                guest:$scope.AddDate.guest,
                cover:$scope.modifyImg,
                auditoria:$scope.AddDate.auditoria,
                address:$scope.AddDate.address,
                exhibition_hotel_id:$scope.AddDate.exhibition_hotel_id,
                introduce:$scope.AddDate.introduce
            }
            console.log(data)
            $http.put('tjh/agenda/'+edit_id+'',data,fo)
                .then(function (res) {
                    console.log(res);
                    if(res.data.code==0){
                        AlertService.success('添加成功');
                        $state.go('app.tjh.dateList')
                    }
                })
        }
    }else{
        var fo={
            headers: { 'Accept': 'application/x-www-form-urlencode' },
        }

        //选择日期
        var datePromie=$http({
            methods:"get",
            url:'tjh/dates'
        });
        datePromie.then(function (res) {
            if(res.data.code==0){
                $scope.dateList=res.data.data;
            }
        })

        //获取酒店或者展馆
        var datePromie=$http({
            methods:"get",
            url:'tjh/exhibitionHotel',
            params:{
                limit:99,
                field:'name'
            }
        });
        datePromie.then(function (res) {
            console.log(res);
            if(res.data.code==0){
                $scope.hotelList=res.data.data.content;
            }
        })
        //提交数据
        $scope.submitData = function () {
            var data={
                page_id:$scope.AddDate.page_id,
                is_hot:$scope.AddDate.is_hot,
                time:$scope.AddDate.time,
                theme:$scope.AddDate.theme,
                guest:$scope.AddDate.guest,
                cover:$scope.cover,
                auditoria:$scope.AddDate.auditoria,
                address:$scope.AddDate.address,
                exhibition_hotel_id:$scope.AddDate.exhibition_hotel_id,
                introduce:$scope.AddDate.introduce
            }

            console.log(data);
            $http.post('tjh/agenda',data,fo)
                .then(function (res) {
                    console.log(res);
                    if(res.data.code==0){
                        AlertService.success('添加成功');
                        $state.go('app.tjh.dateList')
                    }
                })
        }
    }
    // 图片上传
    $scope.addLunbo={};
    $scope.chooseFile = function (file,type) {
        if (!file) {
        } else {
            $scope.isImgUploading = true;
            var key = oss.key + oss.random_string(10) + oss.get_suffix(file.name);
            if (type == -1) {
                $scope.cover = file;
            } else if (type == 2) {
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
                $scope.isImgUploading = false;
                if (type == -1) {
                    $scope.addLunbo.banner = 'http://pic.jiushang.cn/' + key;
                    var url= $scope.addLunbo.banner = 'http://pic.jiushang.cn/' + key;
                    $scope.cover=url;
                    console.log(url)
                } else if (type == 2) {
                    $scope.addLunbo.url2 = 'http://pic.jiushang.cn/' + key;
                }

            }, function (response) {
                $scope.isImgUploading = false;
            }, function (evt) {
            });
        }
    };
    //富文本编辑器
    $scope.options={
        height:300,
        minHeight: null,             // set minimum height of editor
        maxHeight: null,             // set maximum height of editor
        focus: false
    }


});
