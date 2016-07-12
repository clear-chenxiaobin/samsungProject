'use strict';

angular.module('app.weather', [])
    .controller('WeatherController', ['$scope', 'ActivityManager', 'COMMON_KEYS', 'ResourceManager', '$http', function ($scope, ActivityManager, COMMON_KEYS, ResourceManager, $http) {
        var activity = ActivityManager.getActiveActivity();
        activity.initialize($scope);

        //var content = {};
        var conUrl = ResourceManager.getConfigurations().serverUrl();
        $scope.conUrl = conUrl;
        //$scope.serverURl = 'http://172.17.173.100/nativevod/now';

        $http.get(conUrl+'/Weather/local_weather_all.json').success(function (data) {
            var cityData = ResourceManager.getWeatherCity();
            console.log(cityData);
            var weatherData = data.Content;
            if(cityData){
                loadWeatherData(cityData.menuNum,cityData.cityNum);
            }else{
                loadWeatherData(0,0);
            }
            activity.loadI18NResource(function (res) {
                $scope.title = '天气';
            });
            function loadWeatherData(num,cityNum){
                ResourceManager.setWeatherCity(num,cityNum);
                var loadCity = weatherData[num].Second.Content[cityNum];
                $scope.content = loadCity;
            }
        });
        activity.onKeyDown(function (keyCode) {
            switch (keyCode) {
                case COMMON_KEYS.KEY_ENTER:
                    activity.finish();
                    ActivityManager.startActivity('tpl_weather_list');
                    break;
                case COMMON_KEYS.KEY_BACK:
                    activity.finish();
                    break;
            }
        });
    }]);