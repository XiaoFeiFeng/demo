/**
 * Created by Administrator on 2015/12/21.
 */
'use strict'
define([], function () {
    angular.module('testLabelModule', [])
        .controller("testLabelCtrl", ['$scope', function ($scope) {
            $scope.close = function () {
                alert('关闭');
            }
        }])
})