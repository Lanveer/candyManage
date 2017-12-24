"use strict";


angular.module('app.weixinProgramm', [
    'app.newsManage',
    'app.zhanweiManage',
    'app.weixinDateManage',
    'app.userManage'
])
    .config(function ($stateProvider) {

        $stateProvider
            .state('app.weixin', {
                url: '/weixin',
                abstract: true,
                data: {
                    title: '微信'
                }
            })
    });
