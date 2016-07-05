'use strict';

angular.module('app.bill', [])
    .controller('BillController', ['$scope', 'ActivityManager', 'COMMON_KEYS', '$http', function ($scope, ActivityManager, COMMON_KEYS, $http) {
        var activity = ActivityManager.getActiveActivity();
        activity.initialize($scope);

        var title,
            date,
            amount,
            totalAmount = 0;
        var billItems = [];
        var currentPage = 0,
            maxItemsPerPage = 8;

        $http.get('http://172.17.173.100/nativevod/now/billing.json').success(function (data) {
            var billData = data.Content;

            for(var a = 0; a < billData.length; a++){
                var typeName = billData[a].Name;
                var detailData = billData[a].Second.Content;

                for (var b = 0; b < detailData.length; b++ ){
                    title = typeName + "：" + detailData[b].Name;
                    date = formatDatetime(billData[a].Time);
                    amount = Number(detailData[b].Price);
                    totalAmount += amount;
                    billItems.push({title: title, date: date, amount: amount});
                }
            }
            activity.loadI18NResource(function (res) {
                $scope.title = '账单';
                updatePage();
            });

            function formatDatetime (date) {
                var year = date.substring(0, 4);
                var mouth = date.substring(4, 6);
                var day = date.substring(6, 8);
                var hour = date.substring(8, 10);
                var minute = date.substring(10, 12);
                var second = date.substring(12, 14);
                var dataTime = new Date(year,(mouth-parseInt(1)),day,hour,minute,second);
                return dataTime;
            }
        });

        activity.onKeyDown(function (keyCode) {
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
            $scope.amountText = '￥' + totalAmount.toFixed(2);
        }

    }]);
