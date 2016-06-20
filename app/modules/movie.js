'use strict';

angular.module('app.movie', [])
    .controller('MovieController', ['$scope', 'ActivityManager', 'COMMON_KEYS', function ($scope, ActivityManager, COMMON_KEYS) {
        var activity = ActivityManager.getActiveActivity();
        activity.initialize($scope);

        activity.loadI18NResource(function (res) {
            $scope.title = '电影';
        });

        activity.onKeyUp(function (keyCode) {
            switch (keyCode) {
                case COMMON_KEYS.KEY_BACK:
                    activity.finish();
                    break;
            }
        });

    }]);
