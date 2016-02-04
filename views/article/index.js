/**
 * Created by fengxiaofei on 2016/1/28.
 */
/**
 * Created by Administrator on 2016/1/27.
 */

'use strict'
define([], function () {
    angular.module('articlceIndexModule', [])
        .controller('articlceIndexCtrl', ['$scope', function ($scope) {


            $scope.imageList = [];

            $scope.totalItems = 175;
            $scope.currentPage = 1;

            $scope.pageChange = function () {
                $scope.changedPage = $scope.currentPage;
            }

            $scope.init = function () {
                for (var i = 1; i <= 6; i++) {
                    $scope.imageList.push("images/p" + i + ".jpg");
                }
            }
            $scope.init();

        }]);
})
