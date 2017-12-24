"use strict";


angular.module('app.news', ['ui.router'])
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
        .state('app.tjh.news', {
            url: '/news',
            data: {
                title: '资讯列表'
            },
            views: {
                "content@app": {
                    templateUrl: '/app/tjh/news/views/newsList.html',
                    controller: 'newsListCtr'
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

        .state('app.tjh.newsAdd', {
            url: '/newsAdd?id',
            data: {
                title: '添加资讯'
            },
            views: {
                "content@app": {
                    templateUrl: '/app/tjh/news/views/newsAdd.html',
                    controller: 'newsAddCtr'
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
