'use strict';

angular.module('app.weather', [])
    .controller('WeatherController', ['$scope', 'ActivityManager', 'COMMON_KEYS', 'ResourceManager', '$http', function ($scope, ActivityManager, COMMON_KEYS, ResourceManager, $http) {
        var activity = ActivityManager.getActiveActivity();
        activity.initialize($scope);

        var i18nText = ResourceManager.getLocale();
        $scope.weather = i18nText.weather;
        var lang = i18nText.lang;
        //var conUrl = ResourceManager.getConfigurations().serverUrl();
        //$scope.conUrl = conUrl;
        $scope.serverURl = 'http://192.168.18.201/weather/weather?city=';
        var cityData = ResourceManager.getCity();
        if(cityData){
            loadWeatherData(cityData.cityName);
        }else{
            loadWeatherData('上海');
        }
        function loadWeatherData(cityName){
            $http.get($scope.serverURl+cityName).success(function (data) {
                $scope.content = data;
                if(lang == "en-US"){
                    $scope.content.City = $scope.content.CityEng;
                }
                ResourceManager.setCity(cityName);
            });
        }
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