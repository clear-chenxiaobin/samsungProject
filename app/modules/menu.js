'use strict';

angular.module('app.menu', [])
    .controller('MenuController', ['$scope', '$interval', 'ActivityManager', 'COMMON_KEYS', function ($scope, $interval, ActivityManager, COMMON_KEYS) {
        $scope.menuItems = [
            {name: '电视', icon: 'assets/images/ic_menu_live.png', activityId: 'live'},
            {name: '电影', icon: 'assets/images/ic_menu_default.png', activityId: 'movie'},
            {name: '账单', icon: 'assets/images/ic_menu_bill.png', activityId: 'bill'},
            {name: '订餐', icon: 'assets/images/ic_menu_order.png', activityId: 'order'},
            {name: '城市介绍', icon: 'assets/images/ic_menu_city.png', activityId: 'tpl_category_list'},
            {name: '新闻', icon: 'assets/images/ic_menu_news.png', activityId: 'tpl_text'},
            {name: '天气', icon: 'assets/images/ic_menu_weather.png', activityId: 'weather'},
            {name: '闹钟', icon: 'assets/images/ic_menu_alarm.png', activityId: 'alarm'},
            {name: '消息', icon: 'assets/images/ic_menu_msg.png', activityId: 'dnd'},
            {name: '免打扰', icon: 'assets/images/ic_menu_dnd.png', activityId: 'dnd'}
        ];
        $scope.selectedMenuItemIndex = 0;
        $scope.guestName = '李嘉诚先生';
        $scope.roomNumber = '8088';

        $scope.menuStyleLeft = (222.5 - $scope.selectedMenuItemIndex * 100) + 'px';
        $scope.menuStyleWidth = $scope.menuItems.length * 100 + 1000 + 'px';

        $scope.$on('menu.keydown', function (ev, key) {
            switch (key) {
                case COMMON_KEYS.KEY_LEFT:
                    if ($scope.selectedMenuItemIndex > 0) {
                        $scope.selectedMenuItemIndex--;
                        $scope.menuStyleLeft = (222.5 - $scope.selectedMenuItemIndex * 100) + 'px';
                    }
                    break;
                case COMMON_KEYS.KEY_RIGHT:
                    if ($scope.selectedMenuItemIndex < $scope.menuItems.length - 1) {
                        $scope.selectedMenuItemIndex++;
                        $scope.menuStyleLeft = (222.5 - $scope.selectedMenuItemIndex * 100) + 'px';
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
            var houues = format(date.getHours());
            var minutes = format(date.getMinutes());
            var seconds = format(date.getSeconds());
            $scope.dateString = [date.getFullYear(), format(date.getMonth() + 1), format(date.getDate())].join('.');
            $scope.timeString = [houues, minutes, seconds].join(':');
            function format(time) {
                if (time < 10) {
                    return "0" + time;
                } else {
                    return time;
                }
            }
        }

        updateClock();
        $interval(updateClock, 1000);

    }]);
