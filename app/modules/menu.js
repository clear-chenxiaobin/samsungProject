'use strict';

angular.module('app.menu', [])
    .controller('MenuController', ['$scope', '$interval', 'ActivityManager', 'COMMON_KEYS', function ($scope, $interval, ActivityManager, COMMON_KEYS) {
        $scope.menuItems = [
            {name: '账单', icon: 'assets/images/ic_menu_bill.png', activityId: 'bill'},
            {name: '订餐', icon: 'assets/images/ic_menu_default.png', activityId: 'order'},
            {name: '酒店介绍', icon: 'assets/images/ic_menu_default.png', activityId: 'tpl_pic_text_simple'},
            {name: '城市介绍', icon: 'assets/images/ic_menu_default.png', activityId: 'tpl_category_list'},
            {name: '新闻', icon: 'assets/images/ic_menu_default.png', activityId: 'tpl_text'},
            {name: '电视', icon: 'assets/images/ic_menu_default.png', activityId: 'video'},
            {name: '天气', icon: 'assets/images/ic_menu_default.png', activityId: 'weather'},
            {name: '闹钟', icon: 'assets/images/ic_menu_default.png', activityId: 'alarm'},
            {name: '消息', icon: 'assets/images/ic_menu_default.png', activityId: 'live'},
            {name: '免打扰', icon: 'assets/images/ic_menu_default.png', activityId: 'dnd'}
        ];
        $scope.selectedMenuItemIndex = 0;
        $scope.guestName = '李嘉诚先生';
        $scope.roomNumber = '8088';
        
        $scope.menuStyleLeft = (168 - $scope.selectedMenuItemIndex * 120) + 'px';
        $scope.menuStyleWidth = $scope.menuItems.length * 120 + 1000 + 'px';
        
        $scope.$on('menu.keyup', function (ev, key) {
            switch (key) {
                case COMMON_KEYS.KEY_LEFT:
                    if ($scope.selectedMenuItemIndex > 0) {
                        $scope.selectedMenuItemIndex--;
                        $scope.menuStyleLeft = (168 - $scope.selectedMenuItemIndex * 120) + 'px';
                    }
                    break;
                case COMMON_KEYS.KEY_RIGHT:
                    if ($scope.selectedMenuItemIndex < $scope.menuItems.length - 1) {
                        $scope.selectedMenuItemIndex++;
                        $scope.menuStyleLeft = (168 - $scope.selectedMenuItemIndex * 120) + 'px';
                    }
                    break;
                case COMMON_KEYS.KEY_ENTER:
                    ActivityManager.go($scope.menuItems[$scope.selectedMenuItemIndex].activityId, 2);
                    $scope.$emit('activity.created');
                    break;
            }
        });

        function updateClock() {
            var date = new Date();
            $scope.dateString = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('.');
            $scope.timeString = [date.getHours(), date.getMinutes(), date.getSeconds()].join('.');
        }

        updateClock();
        $interval(updateClock, 1000);

    }]);
