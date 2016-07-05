'use strict';

angular.module('app.tpl_category_list', [])
    .controller('TplCategoryListController', ['$scope', 'ActivityManager', 'COMMON_KEYS', 'TplCategoryListService', function ($scope, ActivityManager, COMMON_KEYS, TplCategoryListService) {
        var activity = ActivityManager.getActiveActivity();
        var firstLevel,
            secondLevel,
            LEVEL = 0,
            jsonUrl;
        activity.initialize($scope);

        $scope.selectedIndex = 0;
        $scope.categories = [];

        TplCategoryListService.getJsonUrl();

        if (TplCategoryListService.getFirstLevel().length == 0) {
            TplCategoryListService.getJsonUrl().success(function (data) {
                TplCategoryListService.initialize().success(function (data) {
                    firstLevel = TplCategoryListService.getFirstLevel();
                    bindFirstLevel();
                })
            })
        } else {
            firstLevel = TplCategoryListService.getFirstLevel();
            bindFirstLevel();
        }

        function bindFirstLevel() {
            LEVEL = 1;
            $scope.selectedIndex = 0;
            $scope.categories = [];
            for (var i = 0; i < firstLevel.length; i++) {
                $scope.categories.push({
                    name: firstLevel[i].Name,
                    previewText: firstLevel[i].introduce,
                    previewImage: firstLevel[i].picUrl
                });
            }
        }

        function bindSecondLevel() {
            LEVEL = 2;
            $scope.selectedIndex = 0;
            $scope.categories = [];
            for (var i = 0; i < secondLevel.length; i++) {
                $scope.categories.push({
                    name: secondLevel[i].Name,
                    previewText: secondLevel[i].introduce
                });
            }
        }

        function getSecondLevelData(jsonUrl) {
            secondLevel = null;
            TplCategoryListService.secondLevel(jsonUrl).success(function (data) {
                secondLevel = TplCategoryListService.getSecondLevel();
                bindSecondLevel();
            });
        }

        activity.loadI18NResource(function (res) {
            $scope.title = '城市介绍';
        });

        $scope.listTopStyle = 0;

        activity.onKeyDown(function (keyCode) {
            switch (keyCode) {
                case COMMON_KEYS.KEY_UP:
                    if ($scope.selectedIndex > 0) {
                        $scope.selectedIndex--;
                    }
                    break;
                case COMMON_KEYS.KEY_DOWN:
                    if ($scope.selectedIndex < $scope.categories.length - 1) {
                        $scope.selectedIndex++;
                    }
                    break;
                case COMMON_KEYS.KEY_BACK:
                    if (LEVEL == 1) {
                        activity.finish();
                    } else if (LEVEL == 2) {
                        bindFirstLevel();
                    }

                    break;
                case COMMON_KEYS.KEY_ENTER:
                    if (LEVEL == 1) {
                        jsonUrl = firstLevel[$scope.selectedIndex].json_Url;
                        getSecondLevelData(jsonUrl);
                    } else if (LEVEL == 2) {
                        ActivityManager.startActivity('tpl_pic_text_simple');
                    }
                    break;
            }
            if ($scope.selectedIndex > 9) {
                $scope.listTopStyle = (9 - $scope.selectedIndex) * 39;
            } else if ($scope.listTopStyle !== 0) {
                $scope.listTopStyle = 0;
            }
        });

    }])
    .service('TplCategoryListService', ['$q', '$http', 'ResourceManager', function ($q, $http, ResourceManager) {
        var conUrl = ResourceManager.getConfigurations().serverUrl(),
            jsonUrl,
            configUrl,
            firstLevel = [],
            secondLevel = [];

        this.getJsonUrl = function () {
            return $http.get(conUrl + '/Main/json/MainMenu_4.json').success(function (menuJSON) {
                menuJSON.Content.forEach(function (el, idx, arr) {
                    if (el.Name == '一二级菜单') {
                        el.Second.Content.forEach(function (el, idx, arr) {
                            if (el.Name == '城市介绍') {
                                jsonUrl = conUrl + el.Json_URL;
                                return;
                            }
                        })
                        return;
                    }
                })
            })
        }

        this.initialize = function () {
            var deferred = $q.defer();

            // cached configurations
            if (jsonUrl === configUrl) {
                deferred.resolve();
                return deferred.promise;
            }
            return $http.get(jsonUrl).success(function (configJSON) {
                var zhStrs = [], enStrs = [];
                configUrl = jsonUrl;
                configJSON.Content.forEach(function (el, idx, arr) {
                    var nameKey = 'movie_name_' + el.seq;
                    firstLevel.push({
                        Name: el.Name,
                        introduce: el.SubContent[0].Introduce,
                        picUrl: conUrl + el.SubContent[0].Picurl,
                        json_Url: conUrl + el.Json_URL
                    });
                    zhStrs[nameKey] = el.Name;
                    enStrs[nameKey] = el.NameEng;
                });
                ResourceManager.addI18NResource({'zh-CN': zhStrs, 'en-US': enStrs});
            });
        };

        this.secondLevel = function (jsonUrl) {
            secondLevel = [];
            return $http.get(jsonUrl).success(function (configJSON) {
                var zhStrs = [], enStrs = [];
                configUrl = jsonUrl;
                configJSON.Content.forEach(function (el, idx, arr) {
                    var nameKey = 'movie_name_' + el.seq;
                    secondLevel.push({
                        Name: el.Name,
                        SubContent: el.SubContent
                    });
                    zhStrs[nameKey] = el.Name;
                    enStrs[nameKey] = el.NameEng;
                });
                ResourceManager.addI18NResource({'zh-CN': zhStrs, 'en-US': enStrs});
            });
        };

        this.getFirstLevel = function () {
            return firstLevel;
        };

        this.getSecondLevel = function () {
            return secondLevel;
        };

    }]);
