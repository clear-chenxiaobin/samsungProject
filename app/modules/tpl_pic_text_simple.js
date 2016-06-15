'use strict';

angular.module('app.tpl_pic_text_simple', [])
    .controller('TplPicTextSimpleController', ['$scope', 'ActivityManager', 'COMMON_KEYS', function ($scope, ActivityManager, COMMON_KEYS) {
        var activity = ActivityManager.getActiveActivity();
        activity.initialize($scope);

        activity.loadI18NResource(function (res) {
            $scope.title = '城市介绍/酒店/上海四季酒店';
        });

        var content = [
            {src: 'assets/images/bg_window.jpg', text: '一家5星级的国际顶尖品牌豪华酒店，位于市中心的威海路 师门一路口，邻近南京路商业街'},
            {src: 'assets/images/bg_window.jpg', text: '一家5星级的国际顶尖品牌豪华酒店，位于市中心的威海路 师门一路口，邻近南京路商业街'},
            {src: 'assets/images/bg_window.jpg', text: '一家5星级的国际顶尖品牌豪华酒店，位于市中心的威海路 师门一路口，邻近南京路商业街'},
            {src: 'assets/images/bg_window.jpg', text: '一家5星级的国际顶尖品牌豪华酒店，位于市中心的威海路 师门一路口，邻近南京路商业街'}
        ];

        $scope.previous = null;
        $scope.current = content[0];
        $scope.next = content[1];

        var selectedIndex = 0;

        activity.onKeyUp(function (keyCode) {
            var tempIndex = selectedIndex;
            switch (keyCode) {
                case COMMON_KEYS.KEY_LEFT:
                    if (tempIndex > 0) {
                        tempIndex--;
                    }
                    break;
                case COMMON_KEYS.KEY_RIGHT:
                    if (tempIndex < content.length-1) {
                        tempIndex++;
                    }
                    break;
                case COMMON_KEYS.KEY_BACK:
                    activity.finish();
                    break;
            }
            if (tempIndex !== selectedIndex) {
                selectedIndex = tempIndex;
                $scope.previous = content[selectedIndex - 1];
                $scope.current = content[selectedIndex];
                $scope.next = content[selectedIndex + 1];
            }
        });

    }]);
