'use strict';

angular.module('app.tpl_shopping_cart', [])
    .controller('ShoppingCartController', ['$scope', 'ActivityManager', 'COMMON_KEYS','ResourceManager','$http', function ($scope, ActivityManager, COMMON_KEYS,ResourceManager, $http) {
        var activity = ActivityManager.getActiveActivity();
        activity.initialize($scope);

        var i18nText = ResourceManager.getLocale();
        var lang = i18nText.lang;
        $scope.cartText = i18nText.cart;
        $scope.title = $scope.cartText.title;
        $scope.priceText = $scope.cartText.price;
        $scope.coin = $scope.cartText.coin;

        $scope.listTopStyle = 0;
        $scope.selectedIndex = 0;
        $scope.order = [];
        $scope.total = 0;

        var cart = ResourceManager.getCart();
        cart.forEach(function(item,index,array){
            if(item.name!=''){
                $scope.order.push(item);
            }
        })

        function deleteOrder(index){
            var ul = document.getElementById('order-list');
            var li = ul.children;
            var target = li[index];
            ul.removeChild(target);
            $scope.order.splice(index,1);
        }

        function submit(){
            //提交的订单信息
        }

        activity.onKeyDown(function (keyCode) {
            switch (keyCode) {
                case COMMON_KEYS.KEY_BACK:
                    activity.finish();
                    break;
                case COMMON_KEYS.KEY_UP:
                        if ($scope.selectedIndex > 0) {
                            $scope.selectedIndex--;
                        }
                    break;
                case COMMON_KEYS.KEY_DOWN:
                        if ($scope.selectedIndex < $scope.order.length - 1) {
                            $scope.selectedIndex++;
                        }
                    break;
                case COMMON_KEYS.KEY_ENTER:

                    break;
                case COMMON_KEYS.KEY_LEFT:
                    if($scope.order[$scope.selectedIndex].num<2){
                        deleteOrder($scope.selectedIndex);
                        //$scope.order[$scope.selectedIndex].num = 0;
                    }else{
                        $scope.order[$scope.selectedIndex].num--;
                    }
                    break;
                case COMMON_KEYS.KEY_RIGHT:
                    $scope.order[$scope.selectedIndex].num++;
                    break;
            }
        });
    }]);