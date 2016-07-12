'use strict';

angular.module('app.tpl_weather_list', [])
    .controller('TplWeatherListController', ['$scope', 'ActivityManager', 'COMMON_KEYS','ResourceManager','$http', function ($scope, ActivityManager, COMMON_KEYS, ResourceManager, $http) {
        var activity = ActivityManager.getActiveActivity();

        var LEVEL = 0;

        var conUrl = ResourceManager.getConfigurations().serverUrl();
        $scope.conUrl = conUrl;

        activity.initialize($scope);

        $scope.selectedIndex = 0;
        $scope.firstList = [];
        $scope.firstListContent = [];
        $scope.title = "城市列表";
        $scope.listTopStyle = 0;
        $scope.listTopStyle2 = 0;

        $http.get(conUrl+'/Weather/local_weather_all.json').success(function (data) {
                data.Content.forEach(function(el){
                    var menuItem = el.Name;
                    $scope.firstList.push(menuItem);
                    $scope.firstListContent.push(el);
                })
            bindFirstLevel(0);
        })

        function bindFirstLevel(num) {
            LEVEL = 1;
            $scope.selectedIndex = num;
            $scope.cities = [];
            var subTitle =  $scope.firstListContent[num].Name;
            $scope.title = subTitle+ '城市';
            $scope.firstListContent[num].Second.Content.forEach(function(el,index,arr){
                var cityName = el.CityName;
                $scope.cities.push(cityName);
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
                    if (LEVEL == 1) {
                        activity.finish();
                    } else if (LEVEL == 2) {
                        bindFirstLevel(0);
                    }
                    break;
                case COMMON_KEYS.KEY_ENTER:
                    if (LEVEL == 2) {
                        //alert($scope.selectedIndex+"......" + $scope.selectedCityIndex)
                        ResourceManager.setWeatherCity($scope.selectedIndex,$scope.selectedCityIndex);
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
            if ($scope.selectedCityIndex > 9) {
                $scope.listTopStyle2 = (9 - $scope.selectedCityIndex) * 39;
                console.log($scope.listTopStyle2);
            } else if ($scope.listTopStyle2 !== 0) {
                $scope.listTopStyle2 = 0;
            }
            if ($scope.selectedIndex > 9) {
                $scope.listTopStyle = (9 - $scope.selectedIndex) * 39;
            } else if ($scope.listTopStyle !== 0) {
                $scope.listTopStyle = 0;
            }
        });

    }])