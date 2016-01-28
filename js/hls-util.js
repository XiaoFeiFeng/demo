'use strict'

define([], function () {
    //== Services ================================================================//
    angular.module('hls.util', ['blockUI', 'hls.ui'])
        //本地存储操作服务
        .factory('$store', ['$window', function ($window) {
            return {
                set: function (key, value) {
                    $window.localStorage[key] = escape(value);
                },
                get: function (key, defaultValue) {
                    return unescape($window.localStorage[key] || defaultValue);
                },
                remove: function (key) {
                    delete $window.localStorage[key]
                },
                clean: function () {
                    for (var key in $window.localStorage) {
                        delete $window.localStorage[key];
                    }
                },
                getJson: function (key) {
                    var value = this.get(key, "{}");
                    return angular.fromJson(unescape(value));
                },
                setJson: function (key, value) {
                    var jsonStr = angular.toJson(value);
                    $window.localStorage[key] = escape(jsonStr);
                }
            }
        }])
        //提供数据服务, 如:cookie操作，controller间数据传递、以及controller事件通知
        .factory('$data', ['$timeout', '$window', function ($timeout, $window) {
            var Dictionary = function () {
                var me = this;
                this.CompareMode = 1;
                this.Count = 0;
                this.arrKeys = new Array();
                this.arrValues = new Array();
                this.ThrowException = true;
                this.Item = function (key) {
                    var idx = GetElementIndexInArray(me.arrKeys, key);
                    if (idx != -1) {
                        return me.arrValues[idx];
                    } else {
                        if (me.ThrowException)
                            throw "在获取键对应的值时发生错误，键不存在。";
                    }
                }

                this.Keys = function () {
                    return me.arrKeys;
                }

                this.Values = function () {
                    return me.arrValues;
                }

                this.Add = function (key, value) {
                    if (CheckKey(key)) {
                        me.arrKeys[me.Count] = key;
                        me.arrValues[me.Count] = value;
                        me.Count++;
                    } else {
                        if (me.ThrowException)
                            throw "在将键和值添加到字典时发生错误，可能是键无效或者键已经存在。";
                    }
                }

                this.BatchAdd = function (keys, values) {
                    var bSuccessed = false;
                    if (keys != null && keys != undefined && values != null && values != undefined) {
                        if (keys.length == values.length && keys.length > 0) {
                            var allKeys = me.arrKeys.concat(keys);
                            if (!IsArrayElementRepeat(allKeys)) {
                                me.arrKeys = allKeys;
                                me.arrValues = me.arrValues.concat(values);
                                me.Count = me.arrKeys.length;
                                bSuccessed = true;
                            }
                        }
                    }
                    return bSuccessed;
                }

                this.Clear = function () {
                    if (me.Count != 0) {
                        me.arrKeys.splice(0, me.Count);
                        me.arrValues.splice(0, me.Count);
                        me.Count = 0;
                    }
                }

                this.ContainsKey = function (key) {
                    return GetElementIndexInArray(me.arrKeys, key) != -1;
                }

                this.ContainsValue = function (value) {
                    return GetElementIndexInArray(me.arrValues, value) != -1;
                }

                this.Remove = function (key) {
                    var idx = GetElementIndexInArray(me.arrKeys, key);
                    if (idx != -1) {
                        me.arrKeys.splice(idx, 1);
                        me.arrValues.splice(idx, 1);
                        me.Count--;
                        return true;
                    }
                    else {
                        return false;
                    }
                }

                this.TryGetValue = function (key, defaultValue) {
                    var idx = GetElementIndexInArray(me.arrKeys, key);
                    if (idx != -1) {
                        return me.arrValues[idx];
                    } else {
                        return defaultValue;
                    }
                }

                this.toString = function () {
                    if (me.Count == 0) {
                        return "";
                    } else {
                        return me.arrKeys.toString() + ";" + me.arrValues.toString();
                    }
                }

                function CheckKey(key) {
                    if (key == null || key == undefined || key == "" || key == NaN) {
                        return false;
                    }
                    return !me.ContainsKey(key);
                }

                // 得到指定元素在数组中的索引，如果元素存在于数组中，返回索引；否则返回-1
                function GetElementIndexInArray(arr, e) {
                    var idx = -1;
                    var i;
                    if (!(arr == null || arr == undefined || typeof (arr) != "object")) {
                        for (i = 0; i < arr.length; i++) {
                            var bEqual;
                            if (me.CompareMode == 0) {
                                bEqual = (arr[i] === e);    //二进制比较
                            } else {
                                bEqual = (arr[i] == e);     //文本比较
                            }
                            if (bEqual) {
                                idx = i;
                                break;
                            }
                        }
                    }
                    return idx;
                }

                //判断数组中的元素是否存在重复情况，如果存在返回true, 否则返回false
                function IsArrayElementRepeat(arr) {
                    var bRepeat = false;
                    if (arr != null && arr != undefined && typeof (arr) == "object") {
                        var i;
                        for (i = 0; i < arr.length - 1; i++) {
                            var bEqual;
                            if (me.CompareMode == 0) {
                                bEqual = (arr[i] === arr[i + 1]);   //二进制比较
                            }
                            else {
                                bEqual = (arr[i] == arr[i + 1]);    //文本比较
                            }
                            if (bEqual) {
                                bRepeat = true;
                                break;
                            }
                        }
                    }
                    return bRepeat;
                }
            };

            var isLoad = false;
            var dicCookie = new Dictionary();

            var CustomCookie = function () {
                var name = "data";
                var arr = document.cookie.match(new RegExp("(^|)" + name + "=([^;]*)(;|$)"));
                if (arr != null) return unescape(arr[2]);
                return null;
            };
            var GetCustomCookie = function () {
                if (!isLoad) {
                    var cookie = CustomCookie();
                    if (cookie != null && cookie != "") {
                        var jsonObj = angular.fromJson(cookie);
                        dicCookie = new Dictionary();
                        dicCookie.BatchAdd(jsonObj.arrKeys, jsonObj.arrValues);
                        isLoad = true;
                    }
                }
                return dicCookie;
            };

            var dicData = new Dictionary();

            var dicWatch = new Dictionary();

            function newGuid() {
                var guid = "";
                for (var i = 1; i <= 32; i++) {
                    var n = Math.floor(Math.random() * 16.0).toString(16);
                    guid += n;
                    if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
                        guid += "-";
                }
                return guid;
            }

            return {
                //cookie操作
                setCookie: function (name, value) {
                    var cookies = GetCustomCookie();
                    if (cookies.ContainsKey(name)) {
                        cookies.Remove(name);
                    }
                    cookies.Add(name, value);

                    var jValue = angular.toJson(cookies);
                    var days = 30;
                    var exp = new Date();
                    exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
                    document.cookie = "data=" + escape(jValue) + ";expires=" + exp.toGMTString() + ";path=/";
                }

                ,
                getCookie: function (name) {
                    var cookies = GetCustomCookie();
                    var result = cookies.TryGetValue(name, null);
                    return result;
                }
                ,
                delCookie: function (name) {
                    var cookies = GetCustomCookie();
                    if (cookies.Remove(name)) {
                        var exp = new Date();
                        exp.setTime(exp.getTime() - 1);
                        var cval = cookies.toString();
                        if (cval != null) document.cookie = "data=" + cval + ";expires=" + exp.toGMTString();
                    }
                }
                ,
                clearCookie: function () {
                    var cookies = GetCustomCookie();
                    cookies.Clear();
                }
                ,

                //共享数据操作
                setData: function (key, value) {
                    dicData.Add(key, value);
                }
                ,
                getData: function (key, isCache) {
                    var result = dicData.TryGetValue(key, null);
                    if (result != null) {
                        if (angular.isUndefined(isCache)) {
                            isCache = false;
                        }
                        if (!isCache) {
                            dicData.Remove(key);
                        }
                    }
                    return result;
                }
                ,
                delData: function (key) {
                    dicData.Remove(key);
                }
                ,

                //事件注册、回调操作
                registerEvent: function (scope, key, callback) {
                    if (angular.isFunction(callback)) {
                        var item = dicWatch.TryGetValue(key, null);
                        if (item == null) {
                            item = {};
                            item.data = null;
                            item.guid = null;
                            dicWatch.Add(key, item);
                        }
                        scope[key] = item;
                        scope.$watch(key, function (newValue, oldValue) {
                            if (item.guid != null && angular.isDefined(newValue) && angular.isDefined(oldValue)) {
                                if (newValue.guid != oldValue.guid) {
                                    callback(item.data);
                                }
                            }
                        }, true);
                    }
                }
                ,

                unregisterEvent: function (scope, key) {

                }
                ,

                raiseEvent: function (key, arg) {
                    if (angular.isDefined(arg)) {
                        var item = dicWatch.TryGetValue(key, null);
                        if (item != null) {
                            item.data = arg;
                            item.guid = newGuid();          //生成guid，以触发watch
                        }
                    }
                }
                ,

                //Iframe父子间事件注册、回调操作
                registerIframeEvent: function (key, callback) {
                    window.addEventListener('message', function (e) {
                        if (e.data.eventKey == key) {
                            callback(e.data.data);
                        }
                    }, false);
                }
                ,
                raiseIframeEvent: function (key, data) {
                    var arg = {
                        eventKey: key,
                        data: data
                    };
                    if (top != self) {
                        window.parent.postMessage(arg, "*");
                    }
                    ;
                    if (window.frames != null && window.frames.length > 0) {
                        for (var i = 0; i < window.frames.length; i++) {
                            window.frames[i].postMessage(arg, "*");
                        }
                    }
                    ;
                }
                ,
                randomNum: function (min, max) {
                    var Range = max - min;
                    var Rand = Math.random();
                    return (min + Math.round(Rand * Range));
                }
                ,
                //返回一定长度的随机字符串
                // 默认纯小写字母   参数hasUpper=true 包含大写小写字母 参数 hasNum=true 包含数字
                randomStr: function (length, hasUpper, hasNum) {
                    var str = "abcdefghijklmnopqrstuvwxyz";
                    if (hasUpper) {
                        str += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                    }
                    if (hasNum) {
                        str += "1234567890";
                    }

                    var result = "";
                    for (var i = 0; i < str.length; i++) {
                        var num = this.randomNum(0, str.length);
                        result += str[num];
                    }

                    return result;
                }
            }
        }])
        //ajax请求服务
        .factory('$request', ['$http', 'blockUI', '$config', '$ui', '$q', 'validateService', function ($http, blockUI, $config, $ui, $q, validateService) {
            var urlPrefix = "";

            var successHandler = function (response, successFunction, status, url) {
                if (!response) {
                    $ui.error("返回为空!  url :" + url
                        + "  status :" + status
                        + "  response :" + response);
                }
                else if (angular.isFunction(successFunction)) {
                    successFunction(response, status);
                }
            };
            var errorHandler = function (response, status, config, headers, errorFunction) {
                var exceptionMsg = "";
                if (response) {
                    exceptionMsg += response.ExceptionMessage;
                    exceptionMsg += response.ExceptionType;
                    exceptionMsg += response.Message;
                    exceptionMsg += response.StackTrace;
                } else {
                    exceptionMsg = "status" + status;
                }
                var ishandle = false;
                if (angular.isFunction(errorFunction)) {
                    ishandle = errorFunction(exceptionMsg);
                }
                if (!ishandle) {
                    // $ui.error(ExceptionMessage);
                }
            };

            var getUrl = function (url) {
                if (url.indexOf('http://') > -1) {
                    return url;
                } else {
                    return $config.getApiUrl() + url;
                }
            };

            return {
                post: function (url, data, successFunction, errorFunction) {
                    url = getUrl(url);
                    blockUI.start();
                    setTimeout(function () {
                        $http.post(url, data).success(function (response, status, config, headers) {
                            blockUI.stop();
                            successHandler(response, successFunction, status, url);
                        }).error(function (response, status, config, headers) {
                            blockUI.stop();
                            errorHandler(response, status, config, headers, errorFunction);
                        });
                    }, 10);
                },
                postWithNoBlock: function (url, data, successFunction, errorFunction) {
                    url = getUrl(url);
                    setTimeout(function () {
                        $http.post(url, data).success(function (response, status, config, headers) {
                            successHandler(response, successFunction, status, url);
                        }).error(function (response, status, config, headers) {
                            errorHandler(response, status, config, headers, errorFunction);
                        });
                    }, 10);
                },
                postFile: function (url, formData, successFunction, errorFunction) {
                    url = getUrl(url);
                    blockUI.start();
                    setTimeout(function () {
                        var promiss = sendData(url, formData);
                        promiss.then(function (response) {
                            blockUI.stop();
                            successFunction(response);
                        }, function (error) {
                            blockUI.stop();
                            errorFunction(error);
                        })
                    }, 10);
                    function sendData(url, formData) {
                        var deferred = $q.defer();
                        $.ajax({
                            url: url,
                            type: 'POST',
                            data: formData,
                            async: true,
                            cache: false,
                            contentType: false,
                            processData: false,
                            success: function (response) {
                                deferred.resolve(response);
                            },
                            error: function (error) {
                                deferred.reject(error);
                            }
                        });
                        return deferred.promise;
                    }
                },
                get: function (url, successFunction, errorFunction) {
                    url = getUrl(url);
                    blockUI.start();
                    setTimeout(function () {
                        $http({
                            method: 'GET',
                            url: url
                        }).success(function (response, status, config, headers) {
                            blockUI.stop();
                            successHandler(response, successFunction, status, url);
                        }).error(function (response, status, config, headers) {
                            blockUI.stop();
                            errorHandler(response, status, config, headers, errorFunction);
                        });
                    }, 10);
                },
                getWithData: function (url, data, successFunction, errorFunction) {
                    url = getUrl(url);
                    blockUI.start();
                    setTimeout(function () {
                        $http({
                            method: 'GET',
                            url: url,
                            params: data
                        }).success(function (response, status, config, headers) {
                            blockUI.stop();
                            successHandler(response, successFunction, status, url);
                        }).error(function (response, status, config, headers) {
                            blockUI.stop();
                            errorHandler(response, status, config, headers, errorFunction);
                        });
                    }, 10);
                },
                getWithNoBlock: function (url, data, successFunction, errorFunction) {
                    url = getUrl(url);
                    setTimeout(function () {
                        $http({
                            method: 'GET',
                            url: url,
                            params: data
                        }).success(function (response, status, config, headers) {
                            successHandler(response, successFunction, status, url);
                        }).error(function (response, status, config, headers) {
                            errorHandler(response, status, config, headers, errorFunction);
                        });
                    }, 10);
                },

            }
        }])
        //提供界面类操作，如弹出窗，错误提示 ，确认框等
        .factory('$ui', ['$q', '$rootScope', '$location', '$dialogs', '$data', '$stateParams', function ($q, $rootScope, $location, $dialogs, $data, $stateParams) {
            function loadJs(url, action, callback) {
                var js = '';
                if (angular.isDefined(action) && action != null) {
                    js = action;
                }
                else {
                    if (url.indexOf('.html') > 0) {
                        js = url.replace('html', 'js');
                    }
                    else {
                        var parsePath = url.split("/");
                        parsePath.remove("");
                        if (parsePath.length > 0) {
                            js = "..";
                            for (var i = 0; i < parsePath.length && i < 3; i++) {
                                if (i == 1) {
                                    js += "/Views";
                                }
                                js += "/" + parsePath[i];
                            }
                        }
                    }
                }

                if (js.length > 0) {
                    var dependencies = [js];
                    var deferred = $q.defer();
                    require(dependencies, function () {
                        $rootScope.$apply(function () {
                            deferred.resolve();

                            callback();
                        });
                    });
                    deferred.promise;
                }
            };

            return {
                locate: function (url) {
                    if (window.location.toString().indexOf(url) < 0) {
                        if (url.indexOf('http') < 0) {
                            var nurl = window.location.protocol + '//' + window.location.host + '/' + url;
                            window.location.href = nurl;
                        }
                        else {
                            window.location.href = url;
                        }
                    }
                },
                locateWithData: function (url, data) {
                    this.setData(data);

                    this.locate(url);
                },
                locatePart: function (url) {
                    $location.path(url);
                },
                locatePartWithData: function (url, data) {
                    this.setData(data);

                    this.locatePart(url);
                },
                locateLogin: function (returnUrl) {
                    var url = "Main/Main/Login";
                    if (angular.isDefined(returnUrl)) {
                        url = url + "?return=" + returnUrl;
                    }

                    this.locate(url);
                },
                locateLogout: function (returnUrl) {
                    this.locateLogin(returnUrl);
                },
                locateBlank: function (url) {
                    var nurl = window.location.protocol + '//' + window.location.host + '/Main/Main/Frame#' + url;
                    window.open(nurl);
                },
                goBack: function () {
                    window.history.back();
                },
                notify: function (msg, title, callback_ok) {
                    $dialogs.notify(title, msg, callback_ok);
                },
                error: function (msg, callback_ok) {
                    $dialogs.error(msg, callback_ok);
                },
                confirm: function (msg, title, callback_ok, callback_cancel) {
                    $dialogs.confirm(title, msg, callback_ok, callback_cancel);
                },
                openWindow: function (url, ctrl, data, callback_ok, callback_cancel, action) {
                    loadJs(url, action, function () {
                        $dialogs.openModal(url, ctrl, data, 'lg', callback_ok, callback_cancel);
                    });
                },
                openWindowSm: function (url, ctrl, data, callback_ok, callback_cancel, action) {
                    loadJs(url, action, function () {
                        $dialogs.openModal(url, ctrl, data, 'sm', callback_ok, callback_cancel);
                    });
                },
                setData: function (data) {
                    $data.delData('trans');
                    $data.setData('trans', data);
                },
                getData: function () {
                    return $data.getData('trans');
                },
                getUrlParam: function () {
                    if (!$stateParams.params) {
                        return $stateParams.params
                    }
                    var paramArr = $stateParams.params.split("&");
                    var params = {};
                    angular.forEach(paramArr, function (p) {
                        var param = p.split('=');
                        params[param[0]] = param[1];
                    })

                    return params;
                },
                getKeyByUrl: function () {
                    var result = null;
                    if (angular.isDefined(window.location.hash)) {
                        var hash = window.location.hash.replace('#', '');
                        var splits = hash.split('/');
                        if (splits.length > 3) {
                            var tmp = splits[splits.length - 1];
                            var dx = tmp.indexOf('?');
                            if (dx > 0) {
                                var args = tmp.substring(dx + 1).split('&');
                                if (args.length > 0) {
                                    angular.forEach(args, function (arg) {
                                        var kv = arg.split('=');
                                        if (kv.length > 1) {
                                            if (result == null) {
                                                result = {};
                                            }
                                            result[kv[0]] = kv[1];
                                        }
                                    });
                                }
                            }
                            else if (splits.length > 4) {
                                result = tmp;
                            }
                        }
                    }
                    return result;
                },
            }
        }])
        //提供数据验证服务
        .factory('$validate', ['validateService', function (validateService) {
            return {
                isEmpty: function (input) {
                    return validateService.isEmpty(input);
                },
                isNum: function (input) {
                    return validateService.isNum(input);
                },
                isFloat: function (input) {
                    return validateService.isFloat(input);
                },
                isArray: function (input) {
                    if (validateService.isEmpty(input)) {
                        return false;
                    }
                    if (typeof (input) == "object" && angular.isDefined(input.length)) {
                        return true;
                    }

                    return false;
                },
                equal: function (source, target) {
                    return validateService.equal(source, target);
                },
                minLength: function (input, minLength) {
                    return validateService.minLength(input, minLength);
                },
                maxLength: function (input, maxLength) {
                    return validateService.maxLength(input, maxLength);
                },
                rangeLength: function (input, minLength, maxLength) {
                    return validateService.rangeLength(input, minLength, maxLength);
                },
                min: function (input, min) {
                    return validateService.min(input, min);
                },
                max: function (input, max) {
                    return validateService.max(input, max);
                },
                range: function (input, min, max) {
                    return validateService.range(input, min, max);
                },
                email: function (input) {
                    return validateService.email(input);
                },
                passLevel: function (input) {
                    return validateService.passLevel(input);
                }
            }
        }])
        //权限模块
        .factory('$permission', ['$http', '$config', function ($http, $config) {

        }])
        //服务配置
        .factory('$config', function () {
            var config = {};
            config.getApiUrl = function () {
                return 'http://www.93myb.com/admin/';
            }

            return config;
        })
});