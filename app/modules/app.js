'use strict';

angular.module('app', [
    'app.activity',
    'app.resource',
    'app.toolbar',
    'app.menu',
    'app.welcome',
    'app.index',
    'app.alarm',
    'app.dnd',
    'app.bill',
    'app.live',
    'app.play_video_unicast',
    'app.order',
    'app.movie',
    'app.music',
    'app.video',
    'app.weather',
    'app.weather_detail',
    'app.tpl_category_list',
    'app.tpl_pic_text_category',
    'app.tpl_pic_text_simple',
    'app.tpl_text',
    'app.tpl_text_detail'
])
    .run(['$rootScope', '$http', 'ActivityManager', 'ResourceManager', function ($rootScope, $http, ActivityManager, ResourceManager) {

        // 获取主配置文件
        var cfg = ResourceManager.getConfigurations();
        $http.get(cfg.mainConfigUrl()).success(function (mainJSON) {

            // 获取目录配置文件
            var menuConfigUrl = cfg.serverUrl() + mainJSON.MainView_Json_URL;
            $http.get(menuConfigUrl).success(function (menuJSON) {
                ResourceManager.initialize(typeof mainJSON === 'string' ? JSON.parse(mainJSON) : mainJSON,
                    typeof menuJSON === 'string' ? JSON.parse(menuJSON) : menuJSON);
                ActivityManager.startActivity('welcome');
            });
        });

    }])
    .controller('RootController', ['$scope', 'ActivityManager', 'COMMON_KEYS', function ($scope, ActivityManager, COMMON_KEYS) {
        
        /* browser environment */
        var keyMapping = {
            37: COMMON_KEYS.KEY_LEFT,
            38: COMMON_KEYS.KEY_UP,
            39: COMMON_KEYS.KEY_RIGHT,
            40: COMMON_KEYS.KEY_DOWN,
            13: COMMON_KEYS.KEY_ENTER,
            81: COMMON_KEYS.KEY_BACK,
            84: COMMON_KEYS.KEY_TV,
            77: COMMON_KEYS.KEY_MENU
        };

        /* production environment */
        if (Common.API) {
            var tvKey = new Common.API.TVKeyValue();
            keyMapping[tvKey.KEY_LEFT] = COMMON_KEYS.KEY_LEFT;
            keyMapping[tvKey.KEY_RIGHT] = COMMON_KEYS.KEY_RIGHT;
            keyMapping[tvKey.KEY_UP] = COMMON_KEYS.KEY_UP;
            keyMapping[tvKey.KEY_DOWN] = COMMON_KEYS.KEY_DOWN;
            keyMapping[tvKey.KEY_ENTER] = COMMON_KEYS.KEY_ENTER;
            keyMapping[tvKey.KEY_1] = COMMON_KEYS.KEY_MENU;
            keyMapping[tvKey.KEY_BACK] = COMMON_KEYS.KEY_BACK;
        }
        
        $scope.showMenu = false;

        $scope.onkeyup = function (ev) {
            var key = keyMapping[ev.keyCode];
            if (key === COMMON_KEYS.KEY_MENU) {
                if (ActivityManager.getActiveActivity().shouldDisplayMenu()) {
                    $scope.showMenu = !$scope.showMenu;
                    $scope.$broadcast('menu.toggle', $scope.showMenu);
                }
            } else if (!$scope.showMenu) {
                ActivityManager.getActiveActivity().keyUp(key);
            } else {
                $scope.$broadcast('menu.keyup', key);
            }
        };

        $scope.onkeydown = function (ev) {
            if (!$scope.showMenu) {
                ActivityManager.getActiveActivity().keyDown(keyMapping[ev.keyCode]);
            }
        };
        $scope.activityStack = ActivityManager.getActivityStack();

        $scope.$on('activity.created', function (ev) {
            $scope.showMenu = false;
            $scope.$broadcast('menu.toggle', $scope.showMenu);
        });

    }])
    .constant('COMMON_KEYS', {
        KEY_LEFT: 0,
        KEY_RIGHT: 1,
        KEY_UP: 2,
        KEY_DOWN: 3,
        KEY_ENTER: 4,
        KEY_BACK: 5,
        KEY_TV: 6,
        KEY_MENU: 7
    });
