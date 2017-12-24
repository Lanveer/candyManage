"use strict";


angular.module('app.userManage', ['ui.router'])
.config(function ($stateProvider) {

    $stateProvider
        .state('app.weixin.userInfo', {
            url: '/userInfo',
            data: {
                title: '用户管理'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/weixinProgramm/userManage/views/userInfo.html',
                    controller: 'userInfoCtr'
                }
            }
        })
});
