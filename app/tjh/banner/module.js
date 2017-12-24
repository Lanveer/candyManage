"use strict";


angular.module('app.banner', ['ui.router'])
.config(function ($stateProvider) {
        function oss($http) {
            return $http({method: 'GET', url: "api/upload/signature.json", cache: true})
                .then(function (data) {
                    var oss = data.data;
                    oss.random_string =function(len) {
                        len = len || 32;
                        var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
                        var maxPos = chars.length;
                        var pwd = '';
                        for (var i = 0; i < len; i++) {
                            pwd += chars.charAt(Math.floor(Math.random() * maxPos));
                        }
                        return pwd;
                    };

                    oss.get_suffix=function(filename) {
                        var pos = filename.lastIndexOf('.')
                        var suffix = ''
                        if (pos != -1) {
                            suffix = filename.substring(pos)
                        }
                        return suffix;
                    };

                    return oss;
                });
        }
    $stateProvider
        .state('app.tjh.bannerList', {
            url: '/bannerList',
            data: {
                title: '首页推荐大图列表'
            },
            views: {
                "content@app": {
                    templateUrl: '/app/tjh/banner/views/bannerList.html',
                    controller: 'bannerListCtr'
                }
            },
            resolve:{
                oss:oss,
                script:function(lazyScript){
                    return lazyScript.register([
                        'build/vendor.ui.js'
                    ])
                }
            }
        })
        .state('app.tjh.bannerAdd', {
            url: '/bannerAdd?id',
            data: {
                title: '首页推荐大图新增'
            },
            views: {
                "content@app": {
                    templateUrl: '/app/tjh/banner/views/bannerAdd.html',
                    controller: 'bannerAddCtr'
                }
            },
            resolve:{
                oss:oss,
                script:function(lazyScript){
                    return lazyScript.register([
                        'build/vendor.ui.js'
                    ])
                }
            }
        })

});
