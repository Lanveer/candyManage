'use strict';

angular.module('app.news')
.controller('newsAddCtr', function ($stateParams,$scope,$http,$state,AlertService,oss,Upload) {
    var edit_id=$stateParams.id;
    //分类选择
    $scope.categoryList=[
        {
            cid:1,
            name:'展会资讯'
        },
        {
            cid:2,
            name:'展会指南'
        }
    ];
    //类别选择
    $scope.TypeList=[
        {
            tid:1,
            name:'文字'
        },
        {
            tid:2,
            name:'单图'
        },{
            tid:3,
            name:'多图'
        },{
            tid:4,
            name:'大图'
        },{
            tid:5,
            name:'视频'
        },{
            tid:6,
            name:'轮播图'
        },
    ]

    if(edit_id){
        //获取修改数据
        var editPromise=$http({
            methods:"PUT",
            url:'tjh/news/'+edit_id+''
        });
        editPromise.then(function (msg) {
            console.log(msg)
            $scope.AddDate=msg.data.data;
            $scope.tid=msg.data.data.type;
            $scope.cid=msg.data.data.category;
            if(msg.data.data.type!=''){
                $scope.noInput='true';
            }
            //控制修改显示隐藏
            switch ($scope.tid){
                case 1:
                    $scope.AddDate.tid=$scope.tid
                    $scope.AddDate.cid= $scope.cid
                    $scope.singleImg= false;
                    $scope.multImg=false;
                    $scope.tab='文本';
                    break;
                case 2:
                    $scope.AddDate.tid=$scope.tid
                    $scope.AddDate.cid= $scope.cid
                    $scope.singleImg=true;
                    $scope.multImg=false;
                    $scope.AddDate.editImg=msg.data.data.covers[0];
                    $scope.tab='单图';
                    break;
                case 3:
                    $scope.AddDate.tid=$scope.tid
                    $scope.AddDate.cid= $scope.cid
                    $scope.singleImg= false;
                    $scope.multImg=true;
                    $scope.tab='多图';
                    break;
                case 4:
                    $scope.AddDate.tid=$scope.tid
                    $scope.AddDate.cid= $scope.cid
                    $scope.singleImg= true;
                    $scope.multImg=false;
                    $scope.tab='大图';
                    break;
                case 5:
                    $scope.AddDate.tid=$scope.tid
                    $scope.AddDate.cid= $scope.cid
                    $scope.singleImg= false;
                    $scope.multImg=false;
                    $scope.video=true;
                    $scope.tab='视频';
                    break;
                case 6:
                    $scope.AddDate.tid=$scope.tid
                    $scope.AddDate.cid= $scope.cid
                    $scope.singleImg= true;
                    $scope.multImg=false;
                    $scope.tab='轮播图';
                    break;
            }
            //点击类型选择
            $scope.categoryChoose= function (cid) {
                $scope.category_id=cid;
            }

            //提交修改数据
            $scope.submitData = function (){
                var fo={
                    headers: { 'Accept': 'application/x-www-form-urlencode' },
                }
                var ty=$scope.tid;
                if(ty==1){
                    //文字模式
                    $scope.AddDate.tid=$scope.tid
                    $scope.AddDate.cid= $scope.cid
                    $scope.singleImg= false;
                    $scope.multImg=false;
                    $scope.tab='文本';
                    var data={
                        name:$scope.AddDate.name,
                        category: $scope.category_id == undefined ?  $scope.AddDate.cid : $scope.category_id,
                        type:$scope.tid,
                        tab:$scope.tab,
                        editor:$scope.AddDate.editor,
                        content:$scope.AddDate.content,
                        is_top:$scope.AddDate.is_top
                    }
                    console.log(data)
                        $http.put('tjh/news/'+edit_id+'',data,fo)
                            .then(function (res) {
                                if(res.data.code==0){
                                    AlertService.success('添加成功');
                                    $state.go('app.tjh.news')
                                }
                            })

                }else if(ty==2){
                    //单图模式
                    $scope.AddDate.tid=$scope.tid
                    $scope.AddDate.cid= $scope.cid
                    $scope.tab='单图';
                    var m_imgs;
                    if($scope.addLunbo == undefined){
                        m_imgs=$scope.AddDate.covers[0];
                    }else{
                        m_imgs=$scope.addLunbo;
                    }
                    var data={
                        name:$scope.AddDate.name,
                        category: $scope.category_id == undefined ?  $scope.AddDate.cid : $scope.category_id,
                        type:$scope.tid,
                        tab:$scope.tab,
                        editor:$scope.AddDate.editor,
                        content:$scope.AddDate.content,
                        is_top:$scope.AddDate.is_top,
                        covers:[m_imgs]
                    }
                    $http.put('tjh/news/'+edit_id+'',data,fo)
                        .then(function (res) {
                            if(res.data.code==0){
                                AlertService.success('单图模式添加成功');
                                $state.go('app.tjh.news')
                            }
                        })

                }else if(ty==3){
                    //多图模式
                    $scope.AddDate.tid=$scope.tid
                    $scope.AddDate.cid= $scope.cid
                    $scope.singleImg= false;
                    $scope.multImg=true;
                    $scope.tab='多图';
                    var m_imgs1; var m_imgs2; var m_imgs3;
                    console.log($scope.addLunbo1)
                    console.log($scope.addLunbo2)
                    console.log($scope.addLunbo3)
                    // if($scope.addLunbo1 == undefined && $scope.addLunbo2 == undefined && $scope.addLunbo3 == undefined){
                    //     m_imgs1=$scope.AddDate.covers[0];
                    //     m_imgs2=$scope.AddDate.covers[1];
                    //     m_imgs3=$scope.AddDate.covers[2];
                    //     console.log('没有上传')
                    // }else{
                    //     m_imgs1=$scope.addLunbo1;
                    //     m_imgs2=$scope.addLunbo2;
                    //     m_imgs3=$scope.addLunbo3;
                    //     console.log('有上传')
                    // }

                    //修改开始
                    if($scope.addLunbo1 == undefined){
                        m_imgs1=$scope.AddDate.covers[0];
                    }else{
                        m_imgs1=$scope.addLunbo1;
                    }
                    if($scope.addLunbo2 == undefined){
                        m_imgs2=$scope.AddDate.covers[1];
                    }else{
                        m_imgs2=$scope.addLunbo2;
                    }
                    if($scope.addLunbo3 == undefined){
                        m_imgs3=$scope.AddDate.covers[2];
                    }else{
                        m_imgs3=$scope.addLunbo3;
                    }
                    //修改结束


                    var imgsbox=[];
                    var imgs1=m_imgs1;
                    var imgs2=m_imgs2;
                    var imgs3=m_imgs3;
                    imgsbox.push(imgs1)
                    imgsbox.push(imgs2)
                    imgsbox.push(imgs3);
                    if(imgsbox.length<3){
                        AlertService.error('请上传三张图！');
                        return;
                    }
                    //
                    var data={
                        name:$scope.AddDate.name,
                        category: $scope.category_id == undefined ?  $scope.AddDate.cid : $scope.category_id,
                        type:$scope.tid,
                        tab:$scope.tab,
                        editor:$scope.AddDate.editor,
                        content:$scope.AddDate.content,
                        is_top:$scope.AddDate.is_top,
                        covers:imgsbox
                    }
                    console.log(data)
                    $http.put('tjh/news/'+edit_id+'',data,fo)
                        .then(function (res) {
                            if(res.data.code==0){
                                AlertService.success('多图模式添加成功');
                                $state.go('app.tjh.news')
                            }
                        })
                }else if(ty==4){
                    //大图模式
                    $scope.AddDate.tid=$scope.tid
                    $scope.AddDate.cid= $scope.cid
                    $scope.tab='大图';
                    var m_imgs;
                    if($scope.addLunbo == undefined){
                        m_imgs=$scope.AddDate.covers[0];
                    }else{
                        m_imgs=$scope.addLunbo;
                    }
                    var data={
                        name:$scope.AddDate.name,
                        category: $scope.category_id == undefined ?  $scope.AddDate.cid : $scope.category_id,
                        type:$scope.tid,
                        tab:$scope.tab,
                        editor:$scope.AddDate.editor,
                        content:$scope.AddDate.content,
                        is_top:$scope.AddDate.is_top,
                        covers:[m_imgs]
                    }
                    $http.put('tjh/news/'+edit_id+'',data,fo)
                        .then(function (res) {
                            if(res.data.code==0){
                                AlertService.success('大图模式添加成功');
                                $state.go('app.tjh.news')
                            }
                        })
                }else if(ty==5){
                    //视频模式
                    $scope.AddDate.tid=$scope.tid
                    $scope.AddDate.cid= $scope.cid
                    $scope.tab='视频';

                    var m_imgs;
                    console.log('$scope.addLunbo5:'+$scope.addLunbo5)
                    console.log('$scope.addLunbo4:'+$scope.addLunbo4)
                    console.log('$scope.AddDate.covers[0]:'+$scope.AddDate.covers[0])
                    if($scope.addLunbo4 == undefined && $scope.addLunbo5 == undefined){
                        //封面
                        m_imgs=$scope.AddDate.covers[0];
                        //视频
                        m_imgs2=$scope.AddDate.covers[1];
                    }else{
                        //封面
                        m_imgs=$scope.addLunbo5;
                        //视频
                        m_imgs2=$scope.addLunbo4;
                    }

                    console.log('m_imgs:'+m_imgs)
                    var arrys=[];
                    var imgs1=m_imgs;
                    var imgs2=m_imgs2;
                    arrys.push(imgs1);
                    arrys.push(imgs2);
                    var data={
                        name:$scope.AddDate.name,
                        category: $scope.category_id == undefined ?  $scope.AddDate.cid : $scope.category_id,
                        type:$scope.tid,
                        tab:$scope.tab,
                        editor:$scope.AddDate.editor,
                        content:$scope.AddDate.content,
                        is_top:$scope.AddDate.is_top,
                        covers:arrys
                    }
                     console.log(data)
                    $http.put('tjh/news/'+edit_id+'',data,fo)
                        .then(function (res) {
                            if(res.data.code==0){
                                AlertService.success('视频模式添加成功');
                                $state.go('app.tjh.news')
                            }
                        })

                }else if(ty==6){
                    //轮播图模式
                    $scope.AddDate.tid=$scope.tid
                    $scope.AddDate.cid= $scope.cid
                    $scope.tab='轮播图';
                    var m_imgs;
                    if($scope.addLunbo == undefined){
                        m_imgs=$scope.AddDate.covers[0];
                    }else{
                        m_imgs=$scope.addLunbo;
                    }
                    var data={
                        name:$scope.AddDate.name,
                        category: $scope.category_id == undefined ?  $scope.AddDate.cid : $scope.category_id,
                        type:$scope.tid,
                        tab:$scope.tab,
                        editor:$scope.AddDate.editor,
                        content:$scope.AddDate.content,
                        is_top:$scope.AddDate.is_top,
                        covers:[m_imgs]
                    }
                    $http.put('tjh/news/'+edit_id+'',data,fo)
                        .then(function (res) {
                            if(res.data.code==0){
                                AlertService.success('轮播图模式添加成功');
                                $state.go('app.tjh.news')
                            }
                        })
                }
            }
        });



        // $scope.submitData = function () {
        //     var tt=$scope.modifyImg
        //     var hh=$scope.cover
        //     console.log('tt is:'+tt)
        //     console.log('hh is:'+hh);
        //     if(tt==null && hh==undefined){
        //         AlertService.error('请上传');
        //         return;
        //     }
        //     if(hh==undefined){
        //         tt:hh
        //     }else{
        //         tt:tt
        //     }
        //
        //
        //     var data={
        //         name:$scope.bannerData.name,
        //         editor:$scope.bannerData.editor,
        //         content:$scope.bannerData.content,
        //         covers:[tt],
        //         type:6,
        //         category:3
        //     }
        //     $http.put('tjh/news/'+edit_id+'',data,fo)
        //         .then(function (res) {
        //             console.log(res);
        //             if(res.data.code==0){
        //                 AlertService.success('添加成功');
        //                 $state.go('app.tjh.bannerList')
        //             }
        //         })
        // }

    }else{
        var fo={
            headers: { 'Accept': 'application/x-www-form-urlencode' },
        }
        //测试富文本图片上传开始
        // $scope.imageUpload = function(files) {
            // console.log('image upload:', files);
            // console.log('image upload\'s editable:', $scope.editable);
            // $scope.editor.summernote('insertImage',files[0]);
            // imgUpload(files[0]);
        // }
        //测试富文本图片上传结束


        //分类选择函数
        $scope.categoryChoose= function (cid) {
            $scope.category_id=cid;
        }

        //类别选择函数
        $scope.singleImg=true;
        $scope.video=false;
        $scope.typeChoose= function (tid) {
            $scope.type_id=tid;
            var tid=tid;
            switch (tid){
                case 1:
                    $scope.singleImg= false;
                    $scope.multImg=false;
                    $scope.tab='文本';
                    $scope.video=false;
                    break;
                case 2:
                    $scope.singleImg= true;
                    $scope.multImg=false;
                    $scope.video=false;
                    $scope.tab='单图';
                    break;
                case 3:
                    $scope.singleImg= false;
                    $scope.multImg=true;
                    $scope.tab='多图';
                    $scope.video=false;
                    break;
                case 4:
                    $scope.singleImg= true;
                    $scope.multImg=false;
                    $scope.video=false;
                    $scope.tab='大图';
                    break;
                case 5:
                    $scope.singleImg= false;
                    $scope.multImg=false;
                    $scope.video=true;
                    $scope.tab='视频';
                    break;
                case 6:
                    $scope.singleImg=true;
                    $scope.multImg=false;
                    $scope.video=false;
                    $scope.tab='轮播图';
                    break;
            }

        }
        $scope.submitData = function () {
            //文字模式
            if($scope.type_id==1){
                var data={
                    name:$scope.AddDate.name,
                    category:$scope.category_id,
                    type:$scope.type_id,
                    tab:$scope.tab,
                    editor:$scope.AddDate.editor,
                    content:$scope.AddDate.content,
                    is_top:$scope.AddDate.is_top
                }
                console.log(data)
                $http.post('tjh/news',data,fo)
                    .then(function (res) {
                        if(res.data.code==0){
                            AlertService.success('文本模式添加成功');
                            $state.go('app.tjh.news')
                        }
                    })
            }else if($scope.type_id==2){
                //单图提交
                var data={
                    name:$scope.AddDate.name,
                    category:$scope.category_id,
                    type:$scope.type_id,
                    tab:$scope.tab,
                    editor:$scope.AddDate.editor,
                    content:$scope.AddDate.content,
                    is_top:$scope.AddDate.is_top,
                    covers:[$scope.addLunbo]
                }
                $http.post('tjh/news',data,fo)
                    .then(function (res) {
                        if(res.data.code==0){
                            AlertService.success('单图模式添加成功');
                            $state.go('app.tjh.news')
                        }
                    })
            }else if($scope.type_id==3){
                //多图模式
                var imgsbox=[];
                var imgs1=$scope.addLunbo1;
                var imgs2=$scope.addLunbo2;
                var imgs3=$scope.addLunbo3;
                imgsbox.push(imgs1)
                imgsbox.push(imgs2)
                imgsbox.push(imgs3);
                console.log(imgsbox.length);
                if(imgsbox.length<3){
                    AlertService.error('请上传三张图！');
                    return;
                }
                var data={
                    name:$scope.AddDate.name,
                    category:$scope.category_id,
                    type:$scope.type_id,
                    tab:$scope.tab,
                    editor:$scope.AddDate.editor,
                    content:$scope.AddDate.content,
                    is_top:$scope.AddDate.is_top,
                    covers:imgsbox
                }
                $http.post('tjh/news',data,fo)
                    .then(function (res) {
                        if(res.data.code==0){
                            AlertService.success('多图模式添加成功');
                            $state.go('app.tjh.news')
                        }
                    })
            }else if($scope.type_id==4){
                //大图模式
                var data={
                    name:$scope.AddDate.name,
                    category:$scope.category_id,
                    type:$scope.type_id,
                    tab:$scope.tab,
                    editor:$scope.AddDate.editor,
                    content:$scope.AddDate.content,
                    is_top:$scope.AddDate.is_top,
                    covers:[$scope.addLunbo]
                }
                $http.post('tjh/news',data,fo)
                    .then(function (res) {
                        if(res.data.code==0){
                            AlertService.success('大图模式添加成功');
                            $state.go('app.tjh.news')
                        }
                    })

            }else if($scope.type_id==5){
                //上传视频
                var arrys=[];
                var fm=$scope.addLunbo5;
                var sp=$scope.addLunbo4;
                arrys.push(fm);
                arrys.push(sp);
                var data={
                    name:$scope.AddDate.name,
                    category:$scope.category_id,
                    type:$scope.type_id,
                    tab:$scope.tab,
                    editor:$scope.AddDate.editor,
                    content:$scope.AddDate.content,
                    is_top:$scope.AddDate.is_top,
                    covers:arrys
                }
                $http.post('tjh/news',data,fo)
                    .then(function (res) {
                        if(res.data.code==0){
                            AlertService.success('视频上传成功');
                            $state.go('app.tjh.news')
                        }
                    })
            }
            else if($scope.type_id==6){
                //上传轮播
                var data={
                    name:$scope.AddDate.name,
                    category:$scope.category_id,
                    type:$scope.type_id,
                    tab:$scope.tab,
                    editor:$scope.AddDate.editor,
                    content:$scope.AddDate.content,
                    is_top:$scope.AddDate.is_top,
                    covers:[$scope.addLunbo]
                }
                $http.post('tjh/news',data,fo)
                    .then(function (res) {
                        if(res.data.code==0){
                            AlertService.success('轮播模式添加成功');
                            $state.go('app.tjh.news')
                        }
                    })
            }
        }
    }

    //图片上传
    $scope.chooseFile = function (file,ty) {
        if (file) {
            var key = oss.key + oss.random_string(10) + oss.get_suffix(file.name);
                $scope.cover = file;
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
                console.log(response)
                if(response.status == 200){
                    if(ty==0){
                        $scope.addLunbo= 'http://pic.jiushang.cn/' + key;
                        var url= $scope.addLunbo = 'http://pic.jiushang.cn/' + key;
                        $scope.cover=url;
                    }else if(ty==1){
                        $scope.addLunbo1= 'http://pic.jiushang.cn/' + key;
                    }else if(ty==2){
                        $scope.addLunbo2= 'http://pic.jiushang.cn/' + key;
                    }else if(ty==3){
                        $scope.addLunbo3= 'http://pic.jiushang.cn/' + key;
                    }else if(ty==4){
                        $scope.addLunbo4= 'http://pic.jiushang.cn/' + key;
                    }else if(ty==5){
                        $scope.addLunbo5= 'http://pic.jiushang.cn/' + key;
                    }

                }
            }, function (err) {
                $scope.isImgUploading=false;
            }, function (evt) {

            });
        }
    }


    $scope.options={
        height: 400,
        focus: true,
        toolbar: [
            ['edit',['undo','redo']],
            ['headline', ['style']],
            ['style', ['bold', 'italic', 'underline', 'superscript', 'subscript', 'strikethrough', 'clear']],
            ['fontface', ['fontname']],
            ['textsize', ['fontsize']],
            ['fontclr', ['color']],
            ['alignment', ['ul', 'ol', 'paragraph', 'lineheight']],
            ['height', ['height']],
            ['table', ['table']],
            ['insert', ['link','picture','hr']],
            ['view', ['fullscreen', 'codeview']],
        ],
        fontNames: ['Arial', 'Arial Black', 'Comic Sans MS', 'Courier New','宋体','微软雅黑','楷体','隶书']
    }

    //富文本上传图片

    $scope.imageUpload = function(files) {
        uploadEditorImage(files);
    };
    function uploadEditorImage(files) {
        var key = oss.key + oss.random_string(10) + oss.get_suffix(files[0].name);
        if (files != null) {
            Upload.upload({
                url: 'http://jswpic.oss-cn-hangzhou.aliyuncs.com',
                data: {
                    key: key,
                    OSSAccessKeyId: oss.OSSAccessKeyId,
                    acl: 'public-read',
                    policy: oss.policy,
                    signature: oss.signature,
                    "Content-Type": files.type != '' ? files.type : 'application/octet-stream',
                    filename: files[0].name,
                    success_action_status: 200,
                    file:files[0]
                }
            }).success(function(data, status, headers, config) {
                $scope.richImgs = 'http://pic.jiushang.cn/' + key;
                console.log('jjj:'+$scope.richImgs)
                // var editor = $.summernote.eventHandler.getModule(),
                // editor.insertImage($scope.editable, file_location, uploaded_file_name);
                var file_location =$scope.richImgs;
                $scope.editor.summernote('editor.insertImage', file_location);
            });

        }

    };


});
