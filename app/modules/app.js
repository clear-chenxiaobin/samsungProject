'use strict';

angular.module('app', [
    'app.activity',
    'app.resource',
    'app.toolbar',
    'app.menu',
    'app.room',
    'app.welcome',
    'app.index',
    'app.alarm',
    'app.dnd',
    'app.bill',
    'app.live',
    'app.order',
    'app.movie',
    'app.music',
    'app.message',
    'app.video',
    'app.weather',
    'app.weather_detail',
    'app.zh-CN',
    'app.en-US',
    'app.tpl_category_list',
    'app.tpl_order_list',
    'app.tpl_shopping_cart',
    'app.tpl_pic_text_category',
    'app.tpl_pic_text_simple',
    'app.tpl_text',
    'app.tpl_text_detail',
    'app.tpl_weather_list',
    'app.test',
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

                    //判断localStorage中房间号是否存在，不存在则跳转至home页面设置房间号
                    if(!window.sessionStorage.room){
                        ActivityManager.startActivity('room');
                    }else {
                        ActivityManager.startActivity('welcome');
                    }
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
            77: COMMON_KEYS.KEY_MENU,
            104: COMMON_KEYS.KEY_VOL_UP,
            98: COMMON_KEYS.KEY_VOL_DOWN,
            101: COMMON_KEYS.KEY_MUTE
        };

        /* production environment */
        if (Common.API) {
            var tvKey = new Common.API.TVKeyValue();
            keyMapping[tvKey.KEY_LEFT] = COMMON_KEYS.KEY_LEFT;
            keyMapping[tvKey.KEY_RIGHT] = COMMON_KEYS.KEY_RIGHT;
            keyMapping[tvKey.KEY_UP] = COMMON_KEYS.KEY_UP;
            keyMapping[tvKey.KEY_DOWN] = COMMON_KEYS.KEY_DOWN;
            keyMapping[tvKey.KEY_ENTER] = COMMON_KEYS.KEY_ENTER;
            keyMapping[tvKey.KEY_MENU] = COMMON_KEYS.KEY_MENU;
            keyMapping[tvKey.KEY_RETURN] = COMMON_KEYS.KEY_BACK;
            keyMapping[tvKey.KEY_VOL_UP] = COMMON_KEYS.KEY_VOL_UP;
            keyMapping[tvKey.KEY_VOL_DOWN] = COMMON_KEYS.KEY_VOL_DOWN;
            keyMapping[tvKey.KEY_MUTE] = COMMON_KEYS.KEY_MUTE;
            keyMapping[tvKey.KEY_1] = COMMON_KEYS.KEY_1;
            keyMapping[tvKey.KEY_2] = COMMON_KEYS.KEY_2;
            keyMapping[tvKey.KEY_3] = COMMON_KEYS.KEY_3;
            keyMapping[tvKey.KEY_4] = COMMON_KEYS.KEY_4;
            keyMapping[tvKey.KEY_5] = COMMON_KEYS.KEY_5;
            keyMapping[tvKey.KEY_6] = COMMON_KEYS.KEY_6;
            keyMapping[tvKey.KEY_7] = COMMON_KEYS.KEY_7;
            keyMapping[tvKey.KEY_8] = COMMON_KEYS.KEY_8;
            keyMapping[tvKey.KEY_9] = COMMON_KEYS.KEY_9;
            keyMapping[tvKey.KEY_0] = COMMON_KEYS.KEY_0;
        }

        var handler = function(event){
            var widgetAPI = new Common.API.Widget();
            widgetAPI.sendReadyEvent();
            widgetAPI.blockNavigation(event);
        };

        $scope.showMenu = false;

        $scope.onkeydown = function (ev) {
            var key = keyMapping[ev.keyCode];
            if (key === COMMON_KEYS.KEY_MENU) {
                if (ActivityManager.getActiveActivity().shouldDisplayMenu() && !ActivityManager.getActiveActivity().isIndex()) {
                    $scope.showMenu = !$scope.showMenu;
                    $scope.$broadcast('menu.toggle', $scope.showMenu);
                }
            } else if (key === COMMON_KEYS.KEY_ENTER && ActivityManager.getActiveActivity().triggerBottom() && $scope.showMenu == false) {
                $scope.showMenu = !$scope.showMenu;
                $scope.$broadcast('menu.toggle', $scope.showMenu);
            } else if (key === COMMON_KEYS.KEY_BACK && ActivityManager.getActiveActivity().isIndex()) {
                ActivityManager.getActiveActivity().keyDown(key);
            } else if (!$scope.showMenu) {
                ActivityManager.getActiveActivity().keyDown(key);
            } else {
                $scope.$broadcast('menu.keydown', key);
            }
            document.removeEventListener("keydown", handler, false);
            document.addEventListener("keydown", handler, false);
        };

        $scope.onkeyup = function (ev) {
            var key = keyMapping[ev.keyCode];
            if (!$scope.showMenu) {
                ActivityManager.getActiveActivity().keyUp(key);
            }
        }

        $scope.activityStack = ActivityManager.getActivityStack();

        $scope.$on('activity.created', function (ev) {
            $scope.showMenu = false;
            $scope.$broadcast('menu.toggle', !$scope.showMenu);
        });

        $scope.$on('menu.created', function (ev) {
            $scope.$broadcast('menu.load', true);
        });

        $scope.$on('menu.indexShow', function (ev, bool) {
            $scope.showMenu = bool;
            $scope.$broadcast('menu.toggle', !$scope.showMenu);
            if (bool == true) {
                ActivityManager.getActiveActivity().isIndex(true);
            }
        });

    }])
    .constant('COMMON_KEYS', {
        KEY_LEFT    : 0,
        KEY_RIGHT   : 1,
        KEY_UP      : 2,
        KEY_DOWN    : 3,
        KEY_ENTER   : 4,
        KEY_BACK    : 5,
        KEY_TV      : 6,
        KEY_MENU    : 7,
        KEY_VOL_UP  : 8,
        KEY_VOL_DOWN: 9,
        KEY_MUTE    :10
    });
