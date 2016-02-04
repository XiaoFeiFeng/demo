/**
 * Created by fengxiaofei on 2016/1/28.
 */
'use strict'
require.config({

    // alias libraries paths
    paths: {
        'jquery': '//cdn.bootcss.com/jquery/2.2.0/jquery.min',
        'easing': '//cdn.bootcss.com/jquery-easing/1.3/jquery.easing.min',
        'angular': '//cdn.bootcss.com/angular.js/1.4.9/angular.min',
        'uiRouter': '//cdn.bootcss.com/angular-ui-router/0.2.16/angular-ui-router.min',
        'blockUI': '//cdn.bootcss.com/angular-block-ui/0.2.2/angular-block-ui.min',
        'bootstrap': '//cdn.bootcss.com/bootstrap/3.3.6/js/bootstrap.min',
        'angular-sanitize': '//cdn.bootcss.com/angular.js/1.4.9/angular-sanitize',
        'ui-bootstrap-tpls': '//cdn.bootcss.com/angular-ui-bootstrap/1.1.1/ui-bootstrap-tpls.min',
        'moment': '//cdn.bootcss.com/moment.js/2.11.1/moment.min',
        'locale': '//cdn.bootcss.com/moment.js/2.11.1/locale/zh-cn',
        'angularAMD': 'js/angularAMD/angularAMD.min',
        'datetimepicker': 'js/angular-bootstrap-datetimepicker/src/js/datetimepicker',

        'fileinput': '//cdn.bootcss.com/bootstrap-fileinput/4.1.9/js/fileinput.min',
        'fileinput-zh': '//cdn.bootcss.com/bootstrap-fileinput/4.1.9/js/fileinput_locale_zh.min',

        'hls-core': 'js/hls-core',
        'hls-util': 'js/hls-util',
        'hls-ui': 'js/hls-ui',
    },
    map: {
        '*': {
            'css': '//cdn.bootcss.com/require-css/0.1.8/css.min.js'
        }
    },
    // Add angular modules that does not support AMD out of the box, put it in a shim
    shim: {
        "angular": {exports: "angular"},
        'angularAMD': ['angular'],
        'uiRouter': ["angular"],
        'ui-bootstrap-tpls': ['angular'],
        'angular-sanitize': ['angular'],

        'blockUI': ['angular',
            'css!//cdn.bootcss.com/angular-block-ui/0.2.2/angular-block-ui.min.css'],
        'bootstrap': ['jquery',
            'css!//cdn.bootcss.com/bootstrap/3.3.6/css/bootstrap.min.css',
            'css!//cdn.bootcss.com/font-awesome/4.5.0/css/font-awesome.min.css'],
        'datetimepicker': [
            'css!js/angular-bootstrap-datetimepicker/src/css/datetimepicker.css'
        ],
        'fileinput': ['bootstrap',
            'css!//cdn.bootcss.com/bootstrap-fileinput/4.1.9/css/fileinput.min.css'],
        'fileinput-zh': ['fileinput'],
        'hls-ui': ['hls-core',
            'css!js/hls-ui.css'
        ],
        'hls-util': ['hls-ui']
    }
});

define(['angular', 'angularAMD', 'uiRouter', 'blockUI', 'bootstrap', 'ui-bootstrap-tpls', 'angular-sanitize', 'fileinput-zh', 'hls-util',
    'css!style/bs-pt.css', 'css!style/index.css'
], function (angular, angularAMD, blockUI) {
    // routes
    var registerRoutes = function ($stateProvider, $urlRouterProvider) {
        var jsResolve = {
            load: ['$q', '$rootScope', '$stateParams',
                function ($q, $rootScope, $stateParams) {

                    if ($stateParams.length == 0) {
                        return null;
                    }
                    var path = './views/' + $stateParams.module + "/" + $stateParams.action;
                    var deferred = $q.defer();
                    require([path], function () {
                        $rootScope.$apply(function () {
                            deferred.resolve();
                        });
                    });
                    return deferred.promise;
                }]
        };
        // default
        //$urlRouterProvider.otherwise("/tutorials/main");

        // route
        $stateProvider.state('module', {
            url: "/{module}/{action}?{params}",
            templateUrl: function ($scope) {
                return 'views/' + $scope.module + '/' + $scope.action + '.html';
            },
            resolve: jsResolve
        });
    };
    // module
    var app = angular.module("indexModule", ["ui.router", 'blockUI', 'ui.bootstrap', 'ngSanitize', 'hls.util']);

    // config
    app.config(["$stateProvider", "$urlRouterProvider", registerRoutes]);

    app.config(function ($httpProvider) {
        //$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
        //$httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    });

    app.config(function (blockUIConfig) {
        // Change the default overlay message
        blockUIConfig.message = "请稍候...";
        // Change the default delay to 100ms before the blocking is visible
        blockUIConfig.delay = 100;
        // Disable automatically blocking of the user interface
        blockUIConfig.autoBlock = false;
    });

    app.controller('indexCtrl', ['$scope', '$request', '$ui', function ($scope, $request, $ui) {

    }]);

// bootstrap
    return angularAMD.bootstrap(app);

})
;



