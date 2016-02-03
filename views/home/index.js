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
            $scope.imageList = [];

            $scope.totalItems = 175;
            $scope.currentPage = 1;

            $scope.pageChange = function () {
                $scope.changedPage = $scope.currentPage;
            }

            $scope.init = function () {
                for (var i = 1; i <= 16; i++) {
                    var index = i;
                    if (index > 12)index = i - 12;
                    $scope.images.push("images/p" + index + ".jpg");
                }

                for (var i = 1; i <= 6; i++) {
                    $scope.imageList.push("images/p" + i + ".jpg");
                }
            }
            $scope.init();

        }]);
})
