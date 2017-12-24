'use strict';

angular.module('app.message')

.controller('messageAddCtr', function ($scope,$http,$state,AlertService,$log) {
    //酒店和展馆的总共数据
    var datePromie=$http({
        methods:"get",
        url:'tjh/exhibitionHotel',
        params:{
            is_limit:0,
            type:1,
            field:'name'
        }
    });
    datePromie.then(function (res) {
        if(res.data.code==0){
            $scope.hotelList=res.data.data.content;
        }
    })
//单独的展馆数据

    var datePromie=$http({
        methods:"get",
        url:'tjh/exhibitionHotel',
        params:{
            is_limit:0,
            type:2
        }
    });
    datePromie.then(function (res) {
        console.log(res)
        if(res.data.code!=0){
            AlertService.success(res.data.msg)
        }else{
            $scope.exhibitionlList=res.data.data.content;
        }
    })


//    选择酒店
    $scope.hotelChoose= function (item) {
        $scope.hotel_id=item;
    }



//    选择展馆和展馆号码
    $scope.exhibitionChoose= function (item) {
        $scope.floors=item;
    }



    $scope.submitData= function () {
        //表单头部修改
        var fo={
            headers: { 'Accept': 'application/x-www-form-urlencode' },
        }
        var data={
            eh_id:$scope.AddDate.hotel_id,
            label:$scope.AddDate.label,
            message:$scope.AddDate.message,
            floor:''
        }
        console.log(data)
        $http.post('tjh/message',data,fo)
            .then(function (res) {
                console.log(res);
                if(res.data.code!=0){
                    AlertService.error(res.data.msg)
                }else{
                    AlertService.success('添加成功');
                    $state.go('app.tjh.messageList')
                }
            })

    }


});