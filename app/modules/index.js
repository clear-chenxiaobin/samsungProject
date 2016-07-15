'use strict';

angular.module('app.index', [])
    .controller('IndexController', ['$scope','ResourceManager', 'ActivityManager', 'COMMON_KEYS', function ($scope,ResourceManager, ActivityManager, COMMON_KEYS) {
        var activity = ActivityManager.getActiveActivity();
        activity.initialize($scope);
        activity.triggeBottom(true);

        activity.loadI18NResource(function (res) {
            var i18nText = ResourceManager.getLocale();
            $scope.guestName = i18nText.index.guestName + res.getString("guest_name");
            //$scope.welcomeText = '欢迎您来到东方滨江大酒店';
            //$scope.subWelcomeText = [
            //    '您好！衷心欢迎阁下光临东方滨江大酒店',
            //    '我们愿始终如一的为阁下提供优质的产品和服务',
            //    '使每一位宾客宾至如归，令阁下倍感尊崇之礼遇']
            //    .join('\n');
            $scope.subWelcomeText = res.getString("welcome_text").replace(/，|。|,|\./g, "\n");
            $scope.roomNumber = i18nText.index.roomNumber;
        });

        activity.onKeyDown(function (keyCode) {
            switch (keyCode) {
                case COMMON_KEYS.KEY_BACK:
                    activity.finish();
                    break;
            }
        });
        
    }]);
