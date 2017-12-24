"use strict";


angular.module('app.weixinDateManage', ['ui.router'])
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
        .state('app.weixin.dateManage', {
            url: '/dateManage',
            data: {
                title: '日程管理'
            },
            views: {
                "content@app": {
                    templateUrl: '/app/weixinProgramm/dateManage/views/dateManage.html',
                    controller: 'dateManageCtr'
                }
            }
        })


        .state('app.weixin.addDateManage', {
            url: '/addDateManage?id',
            data: {
                title: '编辑日程'
            },
            views: {
                "content@app": {
                    templateUrl: '/app/weixinProgramm/dateManage/views/addDateManage.html',
                    controller: 'addDateManageCtr'
                }
            },
            resolve:{
                oss: oss,
                script:function(lazyScript){
                   return lazyScript.register([
                       'build/vendor.ui.js'
                   ])
                }
            }
        })

        .state('app.weixin.addDateManage2', {
            url: '/addDateManage2',
            data: {
                title: '新增日程'
            },
            views: {
                "content@app": {
                    templateUrl: '/app/weixinProgramm/dateManage/views/addDateManage.html',
                    controller: 'addDateManageCtr'
                }
            },
            resolve:{
                oss: oss,
                script:function(lazyScript){
                    return lazyScript.register([
                        'build/vendor.ui.js'
                    ])
                }

            }
        })
});
