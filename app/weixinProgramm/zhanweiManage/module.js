"use strict";


angular.module('app.zhanweiManage', ['ui.router'])
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
        .state('app.weixin.addExhibition', {
            url: '/addExhibition?id',
            data: {
                title: '添加展馆'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/weixinProgramm/zhanweiManage/views/add-exhibition.html',
                    controller: 'addExhibitionCtr'
                }
            },
            resolve: {
                oss: oss,
                script: function (lazyScript) {
                    return lazyScript.register([
                        'build/vendor.ui.js'
                    ])
                }
            }

            })

        .state('app.weixin.addHotel', {
            url: '/addHotel',
            data: {
                title: '添加酒店'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/weixinProgramm/zhanweiManage/views/add-hotel.html',
                    controller: 'addHotelManageCtr'
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

        .state('app.weixin.editHotel', {
            url: '/editHotel?id',
            data: {
                title: '修改酒店'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/weixinProgramm/zhanweiManage/views/add-hotel.html',
                    controller: 'editHotelManageCtr'
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

        .state('app.weixin.addZhanwei', {
            url: '/addZhanwei?id',
            data: {
                title: '增加展位'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/weixinProgramm/zhanweiManage/views/add-zhanwei.html',
                    controller: 'addZhanweiManageCtr'
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
        .state('app.weixin.exhibition', {
            url: '/exhibition',
            data: {
                title: '展馆管理'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/weixinProgramm/zhanweiManage/views/exhibition.html',
                    controller: 'exhibitionCtr'
                }
            }
        })




        .state('app.weixin.hotel',{
            url: '/hotel',
            data: {
                title: '酒店管理'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/weixinProgramm/zhanweiManage/views/hotel.html',
                    controller: 'hotelManageCtr'
                }
            }
        })
        .state('app.weixin.zhanwei', {
            url: '/zhanwei',
            data: {
                title: '展位管理'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/weixinProgramm/zhanweiManage/views/zhanwei.html',
                    controller: 'zhanweiManageCtr'
                }
            }
        })
        .state('app.weixin.backgroundManage', {
            url: '/backgroundManage',
            data: {
                title: '背景图管理'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/weixinProgramm/zhanweiManage/views/backgroundManage.html',
                    controller: 'backgroundManageCtr'
                }
            }
        })
        .state('app.weixin.editBackgroundManage', {
            url: '/editBckgroundManage?id',
            data: {
                title: '修改背景图管理'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/weixinProgramm/zhanweiManage/views/addBackgroundManage.html',
                    controller: 'editBackgroundManageCtr'
                }
            },
            resolve:{
                oss:oss
            }
        })
});
