/**
 * Created by fengxiaofei on 2015/12/9.
 */



define(['angular-city'], function () {
    angular.module('areaTestModule', [])
        .controller("areaTestCtrl", ['$scope', function ($scope) {

            $scope.item = {
                city: ['福建', '泉州', '安溪']
                // city: '350524'
            };
            $scope.cityData = {selectedData: "深圳市"};
            $scope.countryData = {selectedData: {'Name': "加拿大", 'Code': '', 'EnName': ''}};

            $scope.getResult = function () {
                var result = $scope.countryData.selectedData + ";" + $scope.cityData.selectedData;

                var date = new Date();
                var current = date.format("yyyy-MM-dd hh:mm:ss");
                alert(result + ';' + current);
            }
        }])
})