'use strict';

angular.module('app.order', [])
    .controller('OrderController', ['$scope', 'ActivityManager', 'COMMON_KEYS','ResourceManager','$http', function ($scope, ActivityManager, COMMON_KEYS,ResourceManager, $http) {
        var activity = ActivityManager.getActiveActivity();
        activity.initialize($scope);

        var mealID;

        var i18nText = ResourceManager.getLocale();
        var lang = i18nText.lang;
        $scope.order = i18nText.order;
        $scope.title = $scope.order.title;

        $scope.meals = [];
        $scope.listTopStyle = 0;
        $scope.selectedIndex = 0;

        $http.get("assets/images/order/order_menu.json").success(function (data) {
            data.content.forEach(function(val,idx,arr){

                var meal = {};
                if(lang == "en-US") {
                     meal = {
                        name: val.name_en,
                        intro:val.intro_en,
                        img:val.img,
                        id:val.id
                    }
                }else{
                     meal = {
                        name: val.name,
                        intro:val.intro,
                        img:val.img,
                        id:val.id
                     }
                }
                $scope.meals.push(meal);
            })
            bindFirstLevel(0);
        })

        function bindFirstLevel(num) {
            $scope.selectedIndex = num;
            $scope.content = {
                img:$scope.meals[num].img,
                intro:$scope.meals[num].intro
            }
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
                        if ($scope.selectedIndex < $scope.meals.length - 1) {
                            $scope.selectedIndex++;
                            bindFirstLevel($scope.selectedIndex);
                        }
                    break;
                case COMMON_KEYS.KEY_ENTER:
                    ResourceManager.setMeal($scope.meals[$scope.selectedIndex].id);
                    activity.finish();
                    ActivityManager.startActivity('tpl_order_list');
                    break;
            }
        });

    }]);