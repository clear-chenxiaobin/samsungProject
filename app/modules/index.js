'use strict';

angular.module('app.index', [])
    .controller('IndexController', ['$scope','ResourceManager', 'ActivityManager', 'COMMON_KEYS', function ($scope,ResourceManager, ActivityManager, COMMON_KEYS) {
        var activity = ActivityManager.getActiveActivity();
        activity.initialize($scope);
        activity.isIndex(true);

        activity.loadI18NResource(function (res) {
            var i18nText = ResourceManager.getLocale();
            $scope.guestName = i18nText.index.guestName + res.getString("guest_name");
            $scope.subWelcomeText = res.getString("welcome_text").replace(/，|。|,|\./g, "\n");
            $scope.roomNumber = i18nText.index.roomNumber + window.localStorage.room;
        });

        activity.onKeyDown(function (keyCode) {
            switch (keyCode) {
                case COMMON_KEYS.KEY_BACK:
                    $scope.$emit('menu.indexShow', false);
                    activity.finish();
                    break;
            }
        });
        
    }]);
