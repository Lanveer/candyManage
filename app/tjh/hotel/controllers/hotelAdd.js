'use strict';

angular.module('app.hotel')

.controller('hotelAddCtr', function ($stateParams,$scope,$http,$state,AlertService,oss,Upload) {
    var edit_id=$stateParams.id;
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
            url:'tjh/exhibitionHotel/'+edit_id+''
        });
        editPromise.then(function (msg) {
            if(msg.data.code!=0){
                AlertService.error(msg.data.msg)
            }else{
                console.log(msg)
                $scope.AddDate=msg.data.data;
                $scope.modifylogo=msg.data.data.logo;
                $scope.modifybanner=msg.data.data.banner;
                var AddDate=msg.data.data;
                var imgs=msg.data.data.logo;
                // 处理标签
                angular.forEach( $scope.firstPrimary,function (label) {
                    var x= AddDate.primary_label;
                    var y=x.join();
                    console.log(y);
                    label.checked = y.indexOf(label.name)>=0;
                });
                angular.forEach( $scope.twoLabel,function (label) {
                    // label.checked = AddDate.two_label.indexOf(label.name)>=0;
                    var x= AddDate.two_label;
                    var y=x.join();
                    label.checked = y.indexOf(label.name)>=0;
                });
                angular.forEach( $scope.threeLabel,function (label) {
                    // label.checked = AddDate.three_label.indexOf(label.name)>=0;
                    var x= AddDate.three_label;
                    var y=x.join();
                    label.checked = y.indexOf(label.name)>=0;
                });
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
            var floors=$scope.AddDate.floors;
            if(floors && angular.isArray(floors)){
                var floorsInput=floors.join();
            }else{
                var floorsInput=floors;
            }
            //处理图片
            var logoImg;
            var bannerImg;
            if($scope.logo == undefined){
                logoImg = $scope.modifylogo
            }else{
                logoImg = $scope.logo
            }

            if($scope.banner == undefined){
                bannerImg= $scope.modifybanner
            }else{
                bannerImg= $scope.banner
            }
            var data={
                type:1,
                recommend:$scope.AddDate.recommend,
                name:$scope.AddDate.name,
                tel:$scope.AddDate.tel,
                introduce:$scope.AddDate.introduce,
                address:$scope.AddDate.address,
                logo:logoImg,
                banner:bannerImg,
                lat:$scope.AddDate.lat,
                lng:$scope.AddDate.lng,
                floors:floorsInput,
                recommend:$scope.AddDate.recommend,
                status:$scope.AddDate.status,
                primary_label:arrayToString($scope.firstPrimary),
                two_label:arrayToString($scope.twoLabel),
                three_label:arrayToString($scope.threeLabel),
            }
            // console.log(data)
            $http.put('tjh/exhibitionHotel/'+edit_id+'',data,fo)
                .then(function (res) {
                    console.log(res);
                    if(res.data.code==0){
                        AlertService.success('添加成功');
                        $state.go('app.tjh.hotelList')
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
                type:1,
                recommend:$scope.AddDate.recommend,
                name:$scope.AddDate.name,
                tel:$scope.AddDate.tel,
                introduce:$scope.AddDate.introduce,
                address:$scope.AddDate.address,
                logo:$scope.logo,
                banner:$scope.banner,
                lat:$scope.AddDate.lat,
                lng:$scope.AddDate.lng,
                floors:$scope.AddDate.floors,
                recommend:$scope.AddDate.recommend,
                status:$scope.AddDate.status,
                primary_label:arrayToString($scope.firstPrimary),
                two_label:arrayToString($scope.twoLabel),
                three_label:arrayToString($scope.threeLabel),
            }
            console.log(data);
            $http.post('tjh/exhibitionHotel',data,fo)
                .then(function (res) {
                    console.log(res);
                    if(res.data.code==0){
                        AlertService.success('添加成功');
                        $state.go('app.tjh.hotelList')
                    }
                })
        }
    }
    // 图片上传
    $scope.addLunbo={};
    $scope.chooseFile = function (file,ty) {
        if (!file) {
        } else {
            var key = oss.key + oss.random_string(10) + oss.get_suffix(file.name);
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
                if(ty ==1 ){
                    $scope.logo = 'http://pic.jiushang.cn/' + key;
                    console.log($scope.logo)
                }else if(ty==2){
                    $scope.banner = 'http://pic.jiushang.cn/' + key;
                    console.log($scope.banner)
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
