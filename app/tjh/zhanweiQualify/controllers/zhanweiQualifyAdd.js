'use strict';

angular.module('app.zhanweiQualify')

.controller('zhanweiQualifyAddCtr', function ($stateParams,$scope,$http,$state,AlertService,oss,Upload) {
    var edit_id=$stateParams.id;
    //获取酒店或者展馆
    var datePromie=$http({
        methods:"get",
        url:'tjh/exhibitionHotel',
        params:{
            is_limit:0,
            field:'name'
        }
    });
        datePromie.then(function (res) {
        if(res.data.code==0){
            $scope.hotelList=res.data.data.content;
        }
    })

    //一二三级标签
    $scope.firstPrimary=[{
        name: '白酒展区',
        checked:false
    }, {
        name: '红酒展区',
        checked:false
    }, {
        name: '洋酒展区',
        checked:false
    }, {
        name: '啤酒展区',
        checked:false
    },{
        name: '饮料展区',
        checked:false
    },{
        name: '食品展区',
        checked:false
    },{
        name: '综合展区',
        checked:false
    }
    ];
    $scope.twoLabel=[{
        name:'东门展区',
        checked:false
    },{
        name:'北门展区　',
        checked:false
    },{
        name:'西门展区',
        checked:false
    },{
        name:'南门展区',
        checked:false
    },{
        name:'市区展区',
        checked:false
    }
    ];
    $scope.threeLabel=[
        {
            name:'五粮液',
            checked:false
        },   {
            name:'茅台',
            checked:false
        },   {
            name:'剑南春',
            checked:false
        },   {
            name:'洋河',
            checked:false
        },   {
            name:'泸州老窖',
            checked:false
        },   {
            name:'郎酒　',
            checked:false
        },   {
            name:'西凤',
            checked:false
        },   {
            name:'汾酒',
            checked:false
        },   {
            name:'古井贡酒',
            checked:false
        },   {
            name:'四特',
            checked:false
        },{
            name:'杏花村　',
            checked:false
        }
    ];
    if(edit_id){
        // 获取修改数据
        var editPromise=$http({
            methods:"PUT",
            url:'tjh/booth/'+edit_id+''
        });
        editPromise.then(function (msg) {
            if(msg.data.code!=0){
                AlertService.error(msg.data.msg)
            }else{
                console.log(msg)
                $scope.AddDate=msg.data.data;
                $scope.modifyImg=msg.data.data.img;
                var AddDate=msg.data.data;
                var imgs=msg.data.data.img;
        //        处理标签
                if( AddDate.primary_label){
                    angular.forEach( $scope.firstPrimary,function (label) {
                        label.checked = AddDate.primary_label.indexOf(label.name)>=0;
                    });
                    angular.forEach( $scope.twoLabel,function (label) {
                        label.checked = AddDate.two_label.indexOf(label.name)>=0;
                    });
                    angular.forEach( $scope.threeLabel,function (label) {
                        label.checked = AddDate.three_label.indexOf(label.name)>=0;
                    });
                }else{
                    console.log('buhao')
                    //说明没有选中标签
                }
        }

        });

        //筛选数据
        function arrayToString(array){
            if(array && angular.isArray(array)){
                var arr=[];
                angular.forEach(array,function(a,b){
                    if(a.checked){
                        arr.push(a.name);
                    }
                });
                return arr.join(',');
            }
        }

        function arraySize(array){
            if(array && angular.isArray(array)){
                var arr=0;
                angular.forEach(array,function(a,b){
                    if(a.checked){
                        arr++;
                    }
                });
                return arr;
            }else{
                return 0;
            }
        }
        // 提交修改数据
        var fo={
            headers: { 'Accept': 'application/x-www-form-urlencode' },
        }

        $scope.submitData = function () {
            var floors=$scope.AddDate.floor;
            if(floors && angular.isArray(floors)){
                var addFloorsInput=floors.join();
            }else{
                var addFloorsInput=floors;
            }
            var floors_alias=$scope.AddDate.exhibition_code;
            if(floors_alias && angular.isArray(floors_alias)){
                var floorsInput=floors_alias.join();
            }else{
                var floorsInput=floors_alias;
            };
            var data={
                is_hot:$scope.AddDate.is_hot,
                company:$scope.AddDate.company,
                introduce:$scope.AddDate.introduce,
                exhibition_hotel_id:$scope.AddDate.exhibition_hotel_id,
                exhibition_code:floorsInput,
                floor:addFloorsInput,
                exhibition_code:$scope.AddDate.exhibition_code,
                contact:$scope.AddDate.contact,
                tel:$scope.AddDate.tel,
                address:$scope.AddDate.address,
                img: $scope.modifyImg,
                start_time:$scope.AddDate.start_time,
                end_time:$scope.AddDate.end_time,
                primary_label:arrayToString($scope.firstPrimary),
                two_label:arrayToString($scope.twoLabel),
                three_label:arrayToString($scope.threeLabel),
                status:$scope.AddDate.status
            }
            console.log(data)
            $http.put('tjh/booth/'+edit_id+'',data,fo)
                .then(function (res) {
                    console.log(res);
                    if(res.data.code==0){
                        AlertService.success('添加成功');
                        $state.go('app.tjh.zhanweiQualify')
                    }
                })
        }
    }else{

        //表单头部修改
        var fo={
            headers: { 'Accept': 'application/x-www-form-urlencode' },
        }
        //筛选数据
        function arrayToString(array){
            if(array && angular.isArray(array)){
                var arr=[];
                angular.forEach(array,function(a,b){
                    if(a.checked){
                        arr.push(a.name);
                    }
                });
                return arr.join(',');
            }
        }

        function arraySize(array){
            if(array && angular.isArray(array)){
                var arr=0;
                angular.forEach(array,function(a,b){
                    if(a.checked){
                        arr++;
                    }
                });
                return arr;
            }else{
                return 0;
            }
        }

        //提交数据
        $scope.submitData = function () {
            var str1= arraySize($scope.firstPrimary);
            var str2= arraySize($scope.twoLabel);
            var str3= arraySize($scope.threeLabel);
            if((str1+str2+str3)>5){
                AlertService.error("最多只能选择五个");
                return;
            }
            var data={
                is_hot:$scope.AddDate.is_hot,
                company:$scope.AddDate.company,
                introduce:$scope.AddDate.introduce,
                exhibition_hotel_id:$scope.AddDate.exhibition_hotel_id,
                floor:$scope.AddDate.floor,
                exhibition_code:$scope.AddDate.exhibition_code,
                contact:$scope.AddDate.contact,
                tel:$scope.AddDate.tel,
                address:$scope.AddDate.address,
                img:$scope.addLunbo.banner,
                start_time:$scope.AddDate.start_time,
                end_time:$scope.AddDate.end_time,
                primary_label:arrayToString($scope.firstPrimary),
                two_label:arrayToString($scope.twoLabel),
                three_label:arrayToString($scope.threeLabel),
            }
            console.log(data);
            $http.post('tjh/booth',data,fo)
                .then(function (res) {
                    console.log(res);
                    if(res.data.code==0){
                        AlertService.success('添加成功');
                        $state.go('app.tjh.zhanweiQualify')
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
                    var test=$scope.cover;
                    console.log(test)
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


});
