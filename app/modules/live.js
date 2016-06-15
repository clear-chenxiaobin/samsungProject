'use strict';

angular.module('app.live', [])
    .controller('LiveController', ['$scope', '$element', 'ActivityManager', 'LiveService', 'COMMON_KEYS', function ($scope, $element, ActivityManager, LiveService, COMMON_KEYS) {
        var activity = ActivityManager.getActiveActivity();
        activity.initialize($scope);
        activity.shouldDisplayMenu(false);

        LiveService.initialize('http://192.168.18.123/nativevod/now/Main/json/Live_46.json').success(function () {
            console.log(LiveService.getChannels());
        });

        $element[0].parentNode.classList.add('live-content-container');

        var channels = [];
        var channelsPerColumn = 8, column;
        for (var i = 0; i < 100; i++) {
            if (i % channelsPerColumn === 0) {
                if (column) {
                    channels.push(column);
                }
                column = [];
            }
            column.push({
                index: i,
                name: 'CCTV0'
            });
        }
        if (column) {
            channels.push(column);
        }
        $scope.currentPage = 0;
        $scope.selectedIndex = 0;
        $scope.title = 'TV Channels';
        $scope.totalPage = Math.ceil(100 / (3 * channelsPerColumn));
        $scope.channels = channels.slice(0, 3);
        var numOfChannels = 100;

        activity.hide();

        activity.onKeyUp(function (keyCode) {
            if (activity.isHide()) {
                switch (keyCode) {
                    case COMMON_KEYS.KEY_OK:
                        activity.show();
                        break;
                }
                return;
            }

            var tempIndex = $scope.selectedIndex;
            switch (keyCode) {
                case COMMON_KEYS.KEY_LEFT:
                    tempIndex -= 8;
                    break;
                case COMMON_KEYS.KEY_RIGHT:
                    tempIndex += 8;
                    break;
                case COMMON_KEYS.KEY_UP:
                    tempIndex -= 1;
                    break;
                case COMMON_KEYS.KEY_DOWN:
                    tempIndex += 1;
                    break;
                case COMMON_KEYS.KEY_OK:
                    break;
                case COMMON_KEYS.KEY_BACK:
                    activity.finish();
                    break;
            }
            if (tempIndex >= numOfChannels) {
                tempIndex = numOfChannels - 1;
            }
            if (tempIndex < 0) {
                tempIndex = 0;
            }
            var currentPage = Math.floor(tempIndex / (3 * channelsPerColumn));
            if (currentPage != $scope.currentPage) {
                $scope.currentPage = currentPage;
                $scope.channels = channels.slice(currentPage * 3, currentPage * 3 + 3);
            }
            $scope.selectedIndex = tempIndex;
        });
    }])
    .service('LiveService', ['$q', '$http', 'ResourceManager', function ($q, $http, ResourceManager) {

        var configUrl, channels = [];

        this.initialize = function (_configUrl) {

            var deferred = $q.defer();

            // cached configurations
            if (_configUrl === configUrl) {
                deferred.resolve();
                return deferred.promise;
            }

            return $http.get(_configUrl).success(function (configJSON) {
                var zhStrs = [], enStrs = [];
                configUrl = _configUrl;
                configJSON.Content.forEach(function (el, idx, arr) {
                    var nameKey = 'channel_name_' + el.ChannelNum;
                    channels.push({
                        nameKey: nameKey,
                        stream: el.ChannelSrc[0].Src,
                        icon: ResourceManager.getConfigurations().serverUrl() + el.ChannelPic
                    });
                    zhStrs[nameKey] = el.ChannelName;
                    enStrs[nameKey] = el.ChannelNameEng;
                });
                ResourceManager.addI18NResource({'zh-CN': zhStrs, 'en-US': enStrs});
            });

        };

        this.getChannels = function () {
            return channels;
        };

    }]);
