'use strict';

angular.module('app.menu', [])
    .directive('menu', ['$interval', 'ResourceManager', 'COMMON_KEYS', 'ActivityManager', function ($interval, ResourceManager, COMMON_KEYS, ActivityManager) {
        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            scope: {
                items: '@items'
            },
            templateUrl: 'partials/menu.html',
            link: function (scope, element, attrs) {
                var jsonData = ResourceManager.getI18NResource();
                var treeView = ResourceManager.getConfigurations().viewTree();
                scope.menuItems = [];
                for (var i = 0; i < treeView.length; i++) {
                    var nameKey = treeView[i].nameKey
                    scope.menuItems.push({
                        name: eval('jsonData.' + nameKey),
                        icon: treeView[i].icon,
                        activityId: getActivityId(eval('jsonData.' + nameKey))
                    });
                }
                scope.selectedMenuItemIndex = 0;
                scope.guestName = jsonData.guest_name;
                scope.roomNumber = '8088';

                scope.menuStyleLeft = (231 - scope.selectedMenuItemIndex * 100) + 'px';
                scope.menuStyleWidth = scope.menuItems.length * 100 + 1000 + 'px';
                scope.showMenu = false;
                scope.$on('menu.menu', function (ev, visible) {
                    scope.showMenu = !visible;
                    scope.selectedMenuItemIndex = 0;
                    scope.menuStyleLeft = (231 - scope.selectedMenuItemIndex * 100) + 'px';
                });

                scope.$on('menu.keydown', function (ev, key) {
                    switch (key) {
                        case COMMON_KEYS.KEY_LEFT:
                            if (scope.selectedMenuItemIndex > 0 && scope.showMenu == true) {
                                scope.selectedMenuItemIndex--;
                                scope.menuStyleLeft = (231 - scope.selectedMenuItemIndex * 100) + 'px';
                            }
                            break;
                        case COMMON_KEYS.KEY_RIGHT:
                            if (scope.selectedMenuItemIndex < scope.menuItems.length - 1 && scope.showMenu == true) {
                                scope.selectedMenuItemIndex++;
                                scope.menuStyleLeft = (231 - scope.selectedMenuItemIndex * 100) + 'px';
                            }
                            break;
                        case COMMON_KEYS.KEY_BACK:
                            if (scope.showMenu == false) {
                                scope.selectedMenuItemIndex = 0;
                            }
                            break;
                        case COMMON_KEYS.KEY_ENTER:
                            ActivityManager.go(scope.menuItems[scope.selectedMenuItemIndex].activityId, 2);
                            scope.$emit('activity.created');
                            break;
                    }
                });

                function getActivityId(name) {
                    switch (name) {
                        case '直播':
                            return 'live';
                            break;
                        case 'Live':
                            return 'live';
                            break;
                        case '账单':
                            return 'bill';
                            break;
                        case 'Bill':
                            return 'bill';
                            break;
                        case '城市天气':
                            return 'weather';
                            break;
                        case 'Weather':
                            return 'weather';
                            break;
                        case '留言':
                            return 'message';
                            break;
                        case 'message':
                            return 'message';
                            break;
                        case '勿扰':
                            return 'dnd';
                            break;
                        case 'UnExcuse':
                            return 'dnd';
                            break;
                        case '城市介绍':
                            return 'tpl_category_list';
                            break;
                        case 'City Guide':
                            return 'tpl_category_list';
                            break;
                        case '点餐':
                            return 'order';
                            break;
                        case 'Ordering':
                            return 'order';
                            break;
                    }
                }

                function updateClock() {
                    var date = new Date();
                    var houues = format(date.getHours());
                    var minutes = format(date.getMinutes());
                    var seconds = format(date.getSeconds());
                    scope.dateString = [date.getFullYear(), format(date.getMonth() + 1), format(date.getDate())].join('.');
                    scope.timeString = [houues, minutes, seconds].join(':');
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
            }
        }
    }]);
