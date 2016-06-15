'use strict';

angular.module('app.toolbar', [])
    .directive('toolbar', [function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                items: '@items'
            },
            templateUrl: 'partials/toolbar.html',
            link: function (scope, element, attrs) {
                var toolbarItems = [
                    {code: 'ok', icon: false, title: '按OK选择分类'},
                    {code: 'up-down', icon: 'assets/images/ic_up_down.png', title: '按上下移动选项'},
                    {code: 'left-right', icon: 'assets/images/ic_left_right.png', title: '按左右切换图片'},
                    {code: 'back', icon: 'assets/images/ic_back.png', title: '点击 返回'}
                ];
                var items = attrs.items.split('|');
                var leftItems = items[0].split(',');
                var rightItems = items[1].split(',');
                scope.leftItems = toolbarItems.filter(function (el, idx, arr) {
                    return leftItems.indexOf(el.code) !== -1;
                });
                scope.rightItems = toolbarItems.filter(function (el, idx, arr) {
                    return rightItems.indexOf(el.code) !== -1;
                });
                scope.menu = {icon: 'assets/images/ic_menu.png', title: '点击 打开菜单'};
                scope.showToolbar = true;
                scope.$on('menu.toggle', function (ev, visible) {
                    scope.showToolbar = !visible;
                });
            }
        };
    }]);
