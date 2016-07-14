'use strict';

angular.module('app.welcome', [])
    .controller('WelcomeController', ['$scope', 'ResourceManager', 'ActivityManager', 'COMMON_KEYS', function ($scope, ResourceManager, ActivityManager, COMMON_KEYS) {
        var activity = ActivityManager.getActiveActivity();
        activity.initialize($scope);
        activity.shouldDisplayMenu(false);

        activity.loadI18NResource(function (res) {
            $scope.guestName = res.getString("guest_name");
            //$scope.welcomeText = '欢迎您来到东方滨江大酒店';
            //$scope.subWelcomeText = [
            //    '您好！衷心欢迎阁下光临东方滨江大酒店',
            //    '我们愿始终如一的为阁下提供优质的产品和服务',
            //    '使每一位宾客宾至如归，令阁下倍感尊崇之礼遇']
            //    .join('\n');
            $scope.subWelcomeText = res.getString("welcome_text").replace(/，|。|,|\./g, "\n");
            $scope.roomNumber = '房间号8088';

            var i18nText;
            if(ResourceManager.getLocale()){
                i18nText  = ResourceManager.getLocale();
            }else{
                $scope.language = 'zh-CN';
                ResourceManager.setLocale($scope.language);
                i18nText = ResourceManager.getLocale();
            }
        });
        var languages = ['zh-CN', 'en-US'],
            languageIndex = 0;

        activity.onKeyDown(function (keyCode) {
            switch (keyCode) {
                case COMMON_KEYS.KEY_LEFT:
                case COMMON_KEYS.KEY_RIGHT:
                    languageIndex ^= 1;
                    $scope.language = languages[languageIndex];
                    ResourceManager.setLocale($scope.language);
                    break;
                case COMMON_KEYS.KEY_ENTER:
                    ActivityManager.startActivity('index');
                    break;
            }
        });
    }]);
