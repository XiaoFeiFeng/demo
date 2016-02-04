'use strict'
define([], function () {
    angular.module('permissionEditUserModule', [])
        .controller("permissionEditUserCtrl", ['$scope', '$ui', '$validate', '$request', '$uibModalInstance', 'modalData',
            function ($scope, $ui, $validate, $request, $uibModalInstance, modalData) {

                $scope.user = {};
                if (!$validate.isEmpty(modalData) && !$validate.isEmpty(modalData._id)) {
                    $scope.user = modalData;
                    $scope.isEdit = true;
                }


                $scope.submitForm = function () {

                    if ($scope.isEdit) {
                        var data = angular.copy($scope.user);
                        delete data._id;
                        delete data.$checked;

                        $request.post('api/?model=user&action=edit_user&id=' + $scope.user._id.$id,
                            data,
                            function (response) {
                                if (response.success) {
                                    $ui.notify('保存成功！', '提示',
                                        function () {
                                            $uibModalInstance.close(true);
                                        })
                                } else if (angular.isUndefined(response.success)) {
                                    $ui.error(response);
                                } else {
                                    $ui.error(response.error);
                                }
                            }, function (err) {
                                $ui.error('修改失败，' + err, '错误');
                            });
                    } else {
                        $scope.user.password = "123456";
                        $request.post('api/?model=user&action=add_user',
                            $scope.user,
                            function (response) {
                                if (response.success) {
                                    $ui.confirm('添加成功，是否继续添加?', '确认',
                                        function () {
                                            $scope.reset()
                                            $scope.isAdded = true;
                                        },
                                        function () {
                                            $uibModalInstance.close(true);
                                        })
                                } else {
                                    $ui.error(response.error);
                                }

                            }, function (err) {
                                $ui.error('添加失败，' + err, '错误');
                            });
                    }
                }

                $scope.cancel = function () {
                    $uibModalInstance.close($scope.isAdded);
                }

                $scope.reset = function () {
                    $scope.user = {};
                }
            }
        ])
})