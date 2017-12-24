"use strict";

 angular.module('app.home').directive('testList', function () {

    return {
        restrict: 'EA',
        replace: true,
        templateUrl: 'app/home/directives/test-list.tpl.html',
        // template: '<h1>rejrioerje</h1>',
        link: function (scope, element, attributes) {
            scope.title = '你好啊,时间';
            scope.names = ['sheir', 'day'];
        }
    }
});