'use strict';

angular.module('app.dnd', [])
    .controller('DnDController', ['$scope', 'ActivityManager', 'COMMON_KEYS', function ($scope, ActivityManager, COMMON_KEYS) {
        var activity = ActivityManager.getActiveActivity();
        activity.initialize($scope);

        activity.loadI18NResource(function (res) {
            $scope.title = '免打扰服务';
        });

        activity.onKeyDown(function (keyCode) {
            switch (keyCode) {
                case COMMON_KEYS.KEY_BACK:
                    activity.finish();
                    $scope.$emit('menu.indexShow', true);
                    break;
            }
        });

    }]);