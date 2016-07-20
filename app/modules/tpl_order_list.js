'use strict';

angular.module('app.tpl_order_list', [])
    .controller('OrderListController', ['$scope', 'ActivityManager', 'COMMON_KEYS','ResourceManager','$http', function ($scope, ActivityManager, COMMON_KEYS,ResourceManager, $http) {
        var activity = ActivityManager.getActiveActivity();
        activity.initialize($scope);

        var i18nText = ResourceManager.getLocale();
        var lang = i18nText.lang;
        $scope.order = i18nText.order;
        $scope.title = $scope.order.title;

        var mealID = ResourceManager.getMeal().id;
        //根据上一级中选择的mealID请求对应数据

        var LEVEL = 0;
        $scope.foods = [];
        $scope.listTopStyle = 0;
        $scope.selectedIndex = 0;

        $http.get("assets/images/order/order_demo.json").success(function (data) {
            data.content.forEach(function(val,idx,arr){
                var meal = {};
                if(lang == "en-US") {
                     meal = {
                        name: val.name_en,
                        intro:val.intro_en,
                        img:val.img
                    }
                }else{
                     meal = {
                        name: val.name,
                        intro:val.intro,
                        img:val.img
                    }
                }
                $scope.foods.push(meal);
            })
            bindFirstLevel(0);
        })

        function bindFirstLevel(num) {
            LEVEL = 1;
            $scope.selectedIndex = num;
            $scope.content = {
                img:$scope.foods[num].img,
                intro:$scope.foods[num].intro
            }
        }

        function bindSecondLevel() {
            LEVEL = 2;
            
        }

        activity.onKeyDown(function (keyCode) {
            switch (keyCode) {
                case COMMON_KEYS.KEY_BACK:
                    activity.finish();
                    break;
                case COMMON_KEYS.KEY_UP:
                        if ($scope.selectedIndex > 0) {
                            $scope.selectedIndex--;
                            bindFirstLevel($scope.selectedIndex);
                        }
                    break;
                case COMMON_KEYS.KEY_DOWN:
                        if ($scope.selectedIndex < $scope.foods.length - 1) {
                            $scope.selectedIndex++;
                            bindFirstLevel($scope.selectedIndex);
                        }
                    break;
                case COMMON_KEYS.KEY_ENTER:
                    ResourceManager.setMeal($scope.selectedIndex);
                    activity.finish();
                    ActivityManager.startActivity('tpl_order_list');
                    break;
            }
        });

    }]);