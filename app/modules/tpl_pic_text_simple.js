'use strict';

angular.module('app.tpl_pic_text_simple', [])
    .controller('TplPicTextSimpleController', ['$scope', 'ActivityManager', 'COMMON_KEYS', function ($scope, ActivityManager, COMMON_KEYS) {
        var activity = ActivityManager.getActiveActivity();
        activity.initialize($scope);

        activity.loadI18NResource(function (res) {
            $scope.title = '酒店介绍/酒店/上海四季酒店';
        });

        var content = [
            {src: 'assets/images/bg_window.jpg', text: '一家5星级的国际顶尖品牌豪华酒店，位于市中心的威海路 师门一路口，邻近南京路商业街'},
            {src: 'assets/images/img-detail-1.png', text: '行政大床房，2米大床给您一个家的感觉，放松心情，享受一份好心情'},
            {src: 'assets/images/img-detail-2.png', text: '标准大床房，2米大床给您舒适的感觉，呼吸新鲜空气，享受每一天'},
            {src: 'assets/images/img-detail-3.jpg', text: '中式餐厅，想吃什么点什么'}
        ];

        $scope.previous = null;
        $scope.current = content[0];
        $scope.next = content[1];

        var selectedIndex = 0;

        activity.onKeyDown(function (keyCode) {
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
