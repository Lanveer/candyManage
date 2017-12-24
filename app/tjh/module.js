"use strict";
angular.module('app.tjh', [
    'app.news',
    'app.qualify',
    'app.message',
    'app.banner',
    'app.date',
    'app.info',
    'app.hotel',
    'app.exhibition',
    'app.zhanwei',
    'app.feedback',
    'app.user',
    'app.productQualify',
    'app.zhanweiQualify'
])
.config(function ($stateProvider) {
    $stateProvider
        .state('app.tjh', {
            url: '/tjh',
            abstract: true,
            data: {
                title: '糖酒会'
            }
        })
});
