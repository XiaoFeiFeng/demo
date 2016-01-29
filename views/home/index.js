/**
 * Created by fengxiaofei on 2016/1/28.
 */
/**
 * Created by Administrator on 2016/1/27.
 */

'use strict'
define(['easing', 'css!../../style/style.css'], function () {
    angular.module('homeIndexModule', [])
        .controller('homeIndexCtrl', ['$scope', function ($scope) {

            $scope.images = [];

            $scope.init = function () {
                for (var i = 1; i <= 12; i++) {
                    $scope.images.push("images/p" + i + ".jpg");
                }
            }
            $scope.init();

        }]);
})
