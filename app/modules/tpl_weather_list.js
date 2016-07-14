'use strict';

angular.module('app.tpl_weather_list', [])
    .controller('TplWeatherListController', ['$scope', 'ActivityManager', 'COMMON_KEYS','ResourceManager','$http', function ($scope, ActivityManager, COMMON_KEYS, ResourceManager, $http) {
        var activity = ActivityManager.getActiveActivity();

        var LEVEL = 0;

        //var conUrl = ResourceManager.getConfigurations().serverUrl();
        //$scope.conUrl = conUrl;

        activity.initialize($scope);

        $scope.selectedIndex = 0;
        //$scope.firstList = ['北京','上海','天津','重庆','安徽','福建','甘肃','广东','广西','贵州','海南','河北','黑龙江','河南','香港','湖北','湖南','内蒙古','江苏','江西','吉林','辽宁','澳门','宁夏','青海','陕西','山东','山西','四川','西藏','新疆','云南','浙江','台湾'];
        $scope.firstList = [];
        $scope.firstListContent = [];
        var i18nText = ResourceManager.getLocale();
        $scope.weather = i18nText.weather;
        $scope.listTopStyle = 0;
        $scope.listTopStyle2 = 0;

        $http.get("assets/images/weather/weather_simple.json").success(function (data) {
                data.content.forEach(function(el){
                    var menuItem = el.name;
                    $scope.firstList.push(menuItem);
                    $scope.firstListContent.push(el.subArea);
                })
            bindFirstLevel(0);
        })

        function bindFirstLevel(num) {
            LEVEL = 1;
            $scope.selectedIndex = num;
            $scope.cities = [];
            $scope.firstListContent[num].forEach(function(el,index,arr){
                $scope.cities.push(el);
            })
        }

        function bindSecondLevel() {
            LEVEL = 2;
            $scope.selectedCityIndex = 0;
        }

        function cancelBindSecondLevel() {
            LEVEL = 1;
            $scope.selectedCityIndex = -1;
        }

        activity.onKeyDown(function (keyCode) {
            switch (keyCode) {
                case COMMON_KEYS.KEY_UP:
                    if (LEVEL == 1) {
                        if ($scope.selectedIndex > 0) {
                            $scope.selectedIndex--;
                            bindFirstLevel($scope.selectedIndex);
                        }
                    } else if (LEVEL == 2) {
                        if ($scope.selectedCityIndex > 0) {
                            $scope.selectedCityIndex--;
                        }
                    }
                    break;
                case COMMON_KEYS.KEY_DOWN:
                    if (LEVEL == 1) {
                        if ($scope.selectedIndex < $scope.firstList.length - 1) {
                            $scope.selectedIndex++;
                            bindFirstLevel($scope.selectedIndex);
                        }
                    } else if (LEVEL == 2) {
                        if ($scope.selectedCityIndex < $scope.cities.length - 1) {
                            $scope.selectedCityIndex++;
                        }
                    }
                    break;
                case COMMON_KEYS.KEY_BACK:
                    activity.finish();
                    ActivityManager.startActivity('weather');
                    break;
                case COMMON_KEYS.KEY_ENTER:
                    if (LEVEL == 1) {
                        bindSecondLevel();
                    }
                    else if (LEVEL == 2) {
                        //alert($scope.selectedIndex+"......" + $scope.selectedCityIndex)
                        var city = $scope.cities[$scope.selectedCityIndex];
                        ResourceManager.setCity(city);
                        activity.finish();
                        ActivityManager.startActivity('weather');
                    }
                    break;
                case COMMON_KEYS.KEY_LEFT:
                    if (LEVEL == 2) {
                        cancelBindSecondLevel();
                        bindFirstLevel($scope.selectedIndex);
                    }
                    break;
                case COMMON_KEYS.KEY_RIGHT:
                    if (LEVEL == 1) {
                        bindSecondLevel();
                    }
                    break;
            }
            if ($scope.selectedCityIndex > 11) {
                $scope.listTopStyle2 = (11 - $scope.selectedCityIndex) * 39;
                console.log($scope.listTopStyle2);
            } else if ($scope.listTopStyle2 !== 0) {
                $scope.listTopStyle2 = 0;
            }
            if ($scope.selectedIndex > 11) {
                $scope.listTopStyle = (11 - $scope.selectedIndex) * 39;
            } else if ($scope.listTopStyle !== 0) {
                $scope.listTopStyle = 0;
            }
        });

    }])