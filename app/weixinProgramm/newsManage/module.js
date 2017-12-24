"use strict";


angular.module('app.newsManage', ['ui.router','ngFileUpload','summernote'])
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
            .state('app.weixin.addArticle', {
                url: '/addArticle',
                data: {
                    title: '添加文章'
                },
                views: {
                    "content@app": {
                        templateUrl: 'app/weixinProgramm/newsManage/views/add-article.html',

                        controller: 'addArticleCtr'
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
            .state('app.weixin.updateArticle', {
                url: '/update?id',
                data: {
                    title: '修改文章'
                },
                views: {
                    "content@app": {
                        templateUrl: 'app/weixinProgramm/newsManage/views/add-article.html',

                        controller: 'editorArticleCtr'
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
            .state('app.weixin.addFenlei', {
                url: '/addFenlei',
                data: {
                    title: '添加分类'
                },
                views: {
                    "content@app": {
                        templateUrl: 'app/weixinProgramm/newsManage/views/add-fenlei.html',
                        controller: 'addFenleiCtr'
                    }
                }
            })
            .state('app.weixin.editFenlei', {
                url: '/editFenlei?id',
                data: {
                    title: '修改分类'
                },
                views: {
                    "content@app": {
                        templateUrl: 'app/weixinProgramm/newsManage/views/add-fenlei.html',
                        controller: 'editFenleiCtr'
                    }
                }
            })
            .state('app.weixin.addLunbo', {
                url: '/addLunbo',
                data: {
                    title: '添加轮播'
                },
                views: {
                    "content@app": {
                        templateUrl: 'app/weixinProgramm/newsManage/views/add-lunbo.html',
                        controller: 'addLunboCtr'
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

            .state('app.weixin.editLunbo', {
                url: '/editLunbo?id',
                data: {
                    title: '修改轮播图'
                },
                views: {
                    "content@app": {
                        templateUrl: 'app/weixinProgramm/newsManage/views/add-lunbo.html',
                        controller: 'editLunboCtr'
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
            .state('app.weixin.article', {
                url: '/article',
                data: {
                    title: '文章管理'
                },
                views: {
                    "content@app": {
                        templateUrl: 'app/weixinProgramm/newsManage/views/article.html',
                        controller: 'articleCtr'
                    }
                }
            })
            .state('app.weixin.fenlei', {
                url: '/fenlei',
                data: {
                    title: '分类管理'
                },
                views: {
                    "content@app": {
                        templateUrl: 'app/weixinProgramm/newsManage/views/fenlei.html',
                        controller: 'fenleiCtr'
                    }
                }
            })
            .state('app.weixin.lunbo', {
                url: '/lunbo',
                data: {
                    title: '轮播图'
                },
                views: {
                    "content@app": {
                        templateUrl: 'app/weixinProgramm/newsManage/views/lunbo.html',
                        controller: 'lunboCtr'
                    }
                }
            })


});
