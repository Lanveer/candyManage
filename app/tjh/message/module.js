"use strict";


angular.module('app.message', ['ui.router'])
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
        .state('app.tjh.messageList', {
            url: '/messageList',
            data: {
                title: '消息列表'
            },
            views: {
                "content@app": {
                    templateUrl: '/app/tjh/message/views/messageList.html',
                    controller: 'messageListCtr'
                }
            }
        })
        .state('app.tjh.messageAdd', {
            url: '/messageAdd',
            data: {
                title: '消息添加'
            },
            views: {
                "content@app": {
                    templateUrl: '/app/tjh/message/views/messageAdd.html',
                    controller: 'messageAddCtr'
                }
            }
        })

});
