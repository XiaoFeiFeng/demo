'use strict'
define([], function () {
    angular.module('permissionUserModule', [])
        .controller("permissionUserCtrl", ['$scope', '$ui', '$validate', '$data', '$request',
            function ($scope, $ui, $validate, $data, $request) {

                $scope.currentPage = 1;
                $scope.pageSize = 10;

                $scope.pageChange = function () {
                    $scope.initGridData();
                }

                $scope.add = function () {
                    $ui.openWindow('views/permission/edituser.html', 'permissionEditUserCtrl', null, function () {
                        $scope.initGridData();
                    });
                }
                $scope.edit = function (data) {
                    $ui.openWindow('views/permission/edituser.html', 'permissionEditUserCtrl', data, function (result) {
                        if (result) $scope.initGridData();
                    });
                }
                $scope.setUserRole = function (data) {
                    $ui.openWindow('views/permission/setuserrole.html', 'permissionSetUserRoleCtrl', data, function (result) {
                        if (result) $scope.initGridData();
                    });
                }

                $scope.batchDel = function () {
                    var ids = [];
                    angular.forEach($scope.gridOptions.colsChk.data, function (item) {
                        ids.push(item._id.$id);
                    })

                    if (ids.length > 0) {
                        $ui.confirm("确认删除？", "确认", function () {
                            $request.post('api/?model=user&action=remove_users', ids, function (response) {
                                if (response.success) {
                                    $scope.initGridData();
                                } else if (angular.isUndefined(response.success)) {
                                    $ui.error(response);
                                } else {
                                    $ui.error(response.error);
                                }
                            });
                        });
                    }
                }

                $scope.del = function (id) {
                    $request.get('api/?model=user&action=remove_user&id=' + id, function (response) {
                        if (response.success) {
                            $scope.initGridData();
                        } else if (angular.isUndefined(response.success)) {
                            $ui.error(response);
                        } else {
                            $ui.error(response.error);
                        }
                    });
                }

                $scope.formatterArray = function (value) {
                    if ($validate.isArray(value) && value.length > 0)
                        return value.join(",");
                    else return "";
                }


                $scope.gridOptions = {
                    data: [],
                    cols: [
                        {FieldName: 'name', DisplayName: '姓名',},
                        {FieldName: 'password', DisplayName: '密码',},
                        {FieldName: 'email', DisplayName: '邮箱',},
                        {FieldName: 'telephone', DisplayName: '电话',},
                        {FieldName: 'roles', DisplayName: '角色', Formatter: $scope.formatterArray},
                    ],
                    colsOpr: {
                        headName: '操作',
                        headClass: '',
                        init: {
                            showView: false,
                            viewFn: function (data) {
                                alert('view');
                            },
                            showEdit: true,
                            editFn: function (data) {
                                $scope.edit(data);
                            },
                            showDelete: true,
                            delFn: function (data) {
                                $ui.confirm("确认删除？", "确认", function () {
                                    $scope.del(data._id.$id);
                                });
                            }
                        },
                        colInfo: [
                            {
                                title: '设置角色',
                                iconClass: 'fa fa-user',
                                clickFn: function (data) {
                                    $scope.setUserRole(data);
                                },
                            },
                        ],
                    },
                    colsChk: {//if not need checkbox,undefined this
                        //rowCheckname: 'checked',//if undefined,use default name
                        checkAllChange: function () {
                        },
                        rowCheckChange: function (data) {
                        },
                        keyName: '_id',//if not get selected data.undefined
                        data: [],//if not get selected data.undefined
                    },
                    rowOpr: {
                        rowSelected: function (data) {
                            //alert("row selected");
                        },
                    },
                    colsHidden: [],
                }

                $scope.getSelectData = function () {
                    alert(angular.toJson($scope.gridOptions.colsChk.data));
                }

                $scope.setSelectData = function () {
                    var index = 1;
                    angular.forEach($scope.gridOptions.data, function (record) {
                        if (index % 2 == 0) {
                            $scope.gridOptions.colsChk.data.push(record);
                        }
                        index++;
                    });
                }

                $scope.clearSelectData = function () {
                    $scope.gridOptions.colsChk.data = [];
                }

                $scope.initGridData = function () {
                    $request.get('api/?model=user&action=get_users&pi=' + $scope.currentPage + '&ps=' + $scope.pageSize, function (response) {
                        if (response.success) {
                            $scope.gridOptions.data = response.data;
                            $scope.totalItems = response.count;
                        } else if (angular.isUndefined(response.success)) {
                            $ui.error(response);
                        } else {
                            $ui.error(response.error);
                        }
                    });

                }

                $scope.initGridData();
            }
        ])
})