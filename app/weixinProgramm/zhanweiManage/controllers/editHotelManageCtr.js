'use strict';

angular.module('app.zhanweiManage').controller('editHotelManageCtr', function ($scope,$http,AlertService,$stateParams,$filter,$state,oss,Upload) {
    $scope.isImgUploading=false;
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

//    获取数据列表
    var e_id= $stateParams.id;
    $http.get('app/weixin/exhibitionhotel/1/id/'+e_id)
    .success(function(res){
        // console.log(res.content);
        var hotelData= res.content;
            angular.forEach( $scope.firstPrimary,function (label) {
                console.log( hotelData.primary_label)
                label.checked = hotelData.primary_label.indexOf(label.name)>=0;
                // label.checked = '白酒展区,洋酒酒展区'.indexOf(label.name)>=0;
            });
 angular.forEach( $scope.twoLabel,function (label) {
                label.checked = hotelData.two_label.indexOf(label.name)>=0;

 });
 angular.forEach( $scope.threeLabel,function (label) {
                // label.checked = hotelData.three_label.indexOf(label.name)>=0;
                label.checked = '西凤，茅台'.indexOf(label.name)>=0;
            });

            $scope.hotel=hotelData;

        AlertService.success('加载成功！')
    })
    .error(function(err){
        AlertService.error("获取失败！")
    });




//    获取分组
    $http.get('app/weixin/exhibitionhotel/1?group=true')
        .success(function(res){
            console.log(res);
            var cat= res.content;
            $scope.category= cat
        });



//    提交

    $scope.chooseFile = function (file,type) {
        if (file) {
            $scope.isImgUploading=true;
            var key = oss.key + oss.random_string(10) + oss.get_suffix(file.name);
            if(type==-1){
//                $scope.logo = file;
                $scope.hotel.logo = file;
            }else if(type==2){
                $scope.hotel.logo = file;
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
                if(type==-1){
                    $scope.hotel.logo = 'http://pic.jiushang.cn/' + key;
                }else if(type==2){
                    $scope.hotel.url2 = 'http://pic.jiushang.cn/' + key;
                }

            }, function (response) {
                $scope.isImgUploading=false;
            }, function (evt) {
            });
        }
    }

//    f分组获取



    $scope.submitForm = function(){
        var str1= arraySize($scope.firstPrimary);
        var str2= arraySize($scope.twoLabel);
        var str3= arraySize($scope.threeLabel);

        if((str1+str2+str3)>5){
            AlertService.error("最多只能选择五个");
            return;
        }

        $scope.hotel.primary_label= arrayToString($scope.firstPrimary);
        $scope.hotel.two_label= arrayToString($scope.twoLabel);
        $scope.hotel.three_label= arrayToString($scope.threeLabel);
        $scope.hotel.type=1;
        delete $scope.hotel.id;
        $http.post("app/weixin/exhibitionhotel/"+e_id,$scope.hotel)
            .success(function(res){
                if(res.errCode==0){
                    AlertService.success("提交成功！");
                    $state.go('app.weixin.hotel');
                }else if(res.errCode==200){
                    AlertService.error(res.msg);
                }else if(res.errCode===400){
                    AlertService.error(res.msg);
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

});