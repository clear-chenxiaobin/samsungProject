'use strict';

angular.module('app.tpl_category_list', [])
    .controller('TplCategoryListController', ['$scope', 'ActivityManager', 'COMMON_KEYS', function ($scope, ActivityManager, COMMON_KEYS) {
        var activity = ActivityManager.getActiveActivity();
        activity.initialize($scope);

        $scope.selectedIndex = 0;
        $scope.categories = [];
        for (var i  = 0; i < 20; i++) {
            $scope.categories.push({
                name: '景点',
                previewText: '景点',
                previewImage: 'http://192.168.18.123/nativevod/now/Main/resource/caf9b6b99962bf5c2264824231d7a40c_144064080529.png'
            });
        }
        activity.loadI18NResource(function (res) {
            $scope.title = '城市介绍';
        });

        $scope.listTopStyle = 0;

        activity.onKeyUp(function (keyCode) {
            switch (keyCode) {
                case COMMON_KEYS.KEY_UP:
                    if ($scope.selectedIndex > 0) {
                        $scope.selectedIndex--;
                    }
                    break;
                case COMMON_KEYS.KEY_DOWN:
                    if ($scope.selectedIndex < $scope.categories.length - 1) {
                        $scope.selectedIndex++;
                    }
                    break;
                case COMMON_KEYS.KEY_BACK:
                    activity.finish();
                    break;
                case COMMON_KEYS.KEY_OK:
                    ActivityManager.startActivity('tpl_pic_text_simple');
                    break;
            }
            if ($scope.selectedIndex > 10) {
                $scope.listTopStyle = (10 - $scope.selectedIndex) * 64;
            } else if ($scope.listTopStyle !== 0) {
                $scope.listTopStyle = 0;
            }
        });

    }]);
