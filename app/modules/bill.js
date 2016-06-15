'use strict';

angular.module('app.bill', [])
    .controller('BillController', ['$scope', 'ActivityManager', 'COMMON_KEYS', function ($scope, ActivityManager, COMMON_KEYS) {
        var activity = ActivityManager.getActiveActivity();
        activity.initialize($scope);

        var billItems = [
            {title: '餐饮-08', date: new Date(), amount: 7487},
            {title: '餐饮-08', date: new Date(), amount: 7487},
            {title: '餐饮-08', date: new Date(), amount: 7487},
            {title: '餐饮-08', date: new Date(), amount: 7487},
            {title: '餐饮-08', date: new Date(), amount: 7487},
            {title: '餐饮-08', date: new Date(), amount: 7487},
            {title: '餐饮-08', date: new Date(), amount: 7487},
            {title: '餐饮-08', date: new Date(), amount: 7487},
            {title: '餐饮-08', date: new Date(), amount: 7487},
            {title: '餐饮-08', date: new Date(), amount: 7487},
            {title: '餐饮-08', date: new Date(), amount: 7487},
            {title: '餐饮-08', date: new Date(), amount: 7487},
            {title: '餐饮-08', date: new Date(), amount: 7487},
            {title: '餐饮-08', date: new Date(), amount: 7487},
            {title: '餐饮-08', date: new Date(), amount: 7487}
        ];

        var currentPage = 0, maxItemsPerPage = 8;

        activity.loadI18NResource(function (res) {
            $scope.title = '账单';
            updatePage();
        });

        activity.onKeyUp(function (keyCode) {
            switch (keyCode) {
                case COMMON_KEYS.KEY_LEFT:
                    currentPage--;
                    if (-1 === currentPage) {
                        currentPage = Math.ceil(billItems.length / maxItemsPerPage) - 1;
                    }
                    updatePage();
                    break;
                case COMMON_KEYS.KEY_RIGHT:
                    currentPage++;
                    if (Math.ceil(billItems.length / maxItemsPerPage) === currentPage) {
                        currentPage = 0;
                    }
                    updatePage();
                    break;
                case COMMON_KEYS.KEY_BACK:
                    activity.finish();
                    break;
            }
        });

        function updatePage() {
            $scope.billItems = billItems.slice(currentPage * maxItemsPerPage,
            (currentPage + 1) * maxItemsPerPage >= billItems.length ? billItems.length: (currentPage + 1) * maxItemsPerPage)
            $scope.pagerText = (currentPage + 1) + '/' + Math.ceil(billItems.length / maxItemsPerPage);
            $scope.amountText = '￥14964.00';
        }

    }]);
