'use strict';

angular.module('app.zhanweiManage').controller('addZhanweiManageCtr', function ($scope,$http,oss,Upload,$state,AlertService,$filter) {
    $scope.isImgUploading=false;
    $scope.firstPrimary=[{
        name: '经销商',
        checked:false
    }, {
        name: '酒企',
        checked:false
    },
        {
            name: '企业',
            checked:false
        },{
            name: '厂商',
            checked:false
        }
    ];
    $scope.twoLabel=[{
        name:'白酒',
        checked:false
    },{
        name:'啤酒',
        checked:false
    },{
        name:'洋酒　',
        checked:false
    },{
        name:'红酒',
        checked:false
    },{
        name:'黄酒',
        checked:false
    },{
        name:'饮料',
        checked:false
    },{
        name:'食品',
        checked:false
    },{
        name:'其他',
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

    $scope.types = [];
    $scope.subTypes = [];
    $scope.zhanwei = {};
    $scope.image =null;
    $scope.chooseHotel = {};


//    获取下拉框
    $http.get('app/weixin/booth?exhibitionhotel=true')
        .success(function (res) {
            $scope.types = res.content;

            if($state.params.id){
                $http.get("app/weixin/booth/id/"+$state.params.id)
                    .success(function (res) {
                        if(res.errCode === 0){
                            var localzhanwei = res.content;
                            angular.forEach( $scope.firstPrimary,function (label) {
                                label.checked = localzhanwei.primary_label.indexOf(label.name)>=0;
                            });
                            angular.forEach( $scope.twoLabel,function (label) {
                                label.checked =localzhanwei.two_label.indexOf(label.name)>=0;
                            });
                            angular.forEach( $scope.threeLabel,function (label) {
                                label.checked = localzhanwei.three_label.indexOf(label.name)>=0;
                            });
                            localzhanwei.start_time = new Date(localzhanwei.start_time);
                            localzhanwei.end_time = new Date(localzhanwei.end_time);
                            var t =  $filter('filter')($scope.types,{exhibition_hotel_id:localzhanwei.exhibition_hotel_id})
                            $scope.chooseHotel =t.length>0?t[0]:$scope.types[0];
                            $scope.loadBooth($scope.chooseHotel.type);
                            $scope.zhanwei = localzhanwei;
                        }
                    })
            }
        });

    $scope.loadBooth = function (type) {
        $scope.zhanwei.floor = null;
        $http.get('app/weixin/booth?bath='+type,{cache:true})
            .success(function (res) {
                $scope.subTypes = res.content;
            })
    };

    $scope.submitForm = function(){
        var str1= arraySize($scope.firstPrimary);
        var str2= arraySize($scope.twoLabel);
        var str3= arraySize($scope.threeLabel);

        if((str1+str2+str3)>5){
            AlertService.error("最多只能选择五个");
            return;
        }
        $scope.zhanwei.exhibition_hotel_id =  $scope.chooseHotel.exhibition_hotel_id;
        $scope.zhanwei.primary_label= arrayToString($scope.firstPrimary);
        $scope.zhanwei.two_label= arrayToString($scope.twoLabel);
        $scope.zhanwei.three_label= arrayToString($scope.threeLabel);
//        $scope.zhanwei.start_time= moment($scope.zhanwei.start_time).format("YYYY-MM-DD hh:mm:ss");
//        $scope.zhanwei.end_time= moment($scope.zhanwei.end_time).format("YYYY-MM-DD hh:mm:ss");
        delete $scope.zhanwei.id;
        var url='app/weixin/booth/';
        if($state.params.id)
        url+='/'+$state.params.id;
        $http.post(url,$scope.zhanwei)
            .success(function(res){
                if(res.errCode==0){
                    AlertService.success("提交成功！");
                    $state.go('app.weixin.zhanwei');
                }else if(res.errCode===200){
                    AlertService.error(res.msg)
                }else if(res.errCode==400){
                    AlertService.error(res.msg)
                }
            })
            .error(function(err){
                AlertService.error("提交失败！");
            })
    };
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

    $scope.chooseFile = function (file) {
        if (file) {
            $scope.isImgUploading=false;
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
                    $scope.zhanwei.img = 'http://pic.jiushang.cn/' + key;


            }, function (response) {

            }, function (evt) {
            });
        }
    }

});