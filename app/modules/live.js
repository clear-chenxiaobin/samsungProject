'use strict';

angular.module('app.live', [])
    .controller('LiveController', ['$scope', '$element', 'ActivityManager', 'LiveService', 'COMMON_KEYS', 'ResourceManager', function ($scope, $element, ActivityManager, LiveService, COMMON_KEYS, ResourceManager) {
        var activity = ActivityManager.getActiveActivity();
        var chaData,
            numOfChannels,
            configUrl = ResourceManager.getConfigurations().serverUrl(),
            jsonUrl,
            stream;
        var channelsPerColumn = 8, column;
        var channels = [];

        document.getElementsByTagName("body")[0].setAttribute("style", "background-image:none");
        activity.initialize($scope);
        activity.shouldDisplayMenu(false);
        activity.hide();

        $element[0].parentNode.classList.add('live-content-container');
        if (LiveService.getChannels().length == 0) {
            LiveService.getPlayUrl(configUrl).success(function (data) {
                data.Content.forEach(function (el, idx, arr) {
                    if (el.Name == '直播') {
                        jsonUrl = ResourceManager.getConfigurations().serverUrl() + el.Json_URL;
                        return;
                    }
                })
                LiveService.initialize(jsonUrl).success(function (data) {
                    //console.log(LiveService.getChannels());
                    bind();
                })
            })
        } else {
            bind();
        }

        activity.onKeyUp(function (keyCode) {
            var tempIndex = $scope.selectedIndex;
            var oldIndex = tempIndex + 1;

            if (activity.isHide()) {
                switch (keyCode) {
                    case COMMON_KEYS.KEY_UP:
                        tempIndex += 1;
                        cutVideo();
                        break;
                    case COMMON_KEYS.KEY_DOWN:
                        tempIndex -= 1;
                        cutVideo();
                        break;
                    case COMMON_KEYS.KEY_ENTER:
                        activity.show();
                        break;
                    case COMMON_KEYS.KEY_BACK:
                        stopPlay();
                        document.getElementsByTagName("body")[0].setAttribute("style", "background-image:(url:../assets/images/bg_window.jpg)");
                        activity.finish();
                        break;
                }
                $scope.selectedIndex = tempIndex;
                return;
            }

            switch (keyCode) {
                case COMMON_KEYS.KEY_LEFT:
                    tempIndex -= 8;
                    cutVideo();
                    break;
                case COMMON_KEYS.KEY_RIGHT:
                    tempIndex += 8;
                    cutVideo();
                    break;
                case COMMON_KEYS.KEY_UP:
                    tempIndex -= 1;
                    cutVideo();
                    break;
                case COMMON_KEYS.KEY_DOWN:
                    tempIndex += 1;
                    cutVideo();
                    break;
                case COMMON_KEYS.KEY_ENTER:
                    //activity.hide();
                    break;
                case COMMON_KEYS.KEY_BACK:
                    activity.hide();
                    break;
            }
            if (tempIndex >= numOfChannels) {
                if (oldIndex != chaData.length) {
                    tempIndex = numOfChannels - 1;
                } else {
                    tempIndex = 0;
                }
            }
            if (tempIndex < 0) {
                if (oldIndex == 1) {
                    tempIndex = chaData.length - 1;
                } else {
                    tempIndex = 0;
                }
            }
            var currentPage = Math.floor(tempIndex / (3 * channelsPerColumn));
            if (currentPage != $scope.currentPage) {
                $scope.currentPage = currentPage;
                $scope.channels = channels.slice(currentPage * 3, currentPage * 3 + 3);
            }
            $scope.selectedIndex = tempIndex;

            function cutVideo() {
                stream = chaData[tempIndex].stream;
                changeVideo(stream);
            }
        });

        function bind() {
            chaData = LiveService.getChannels();
            stream = chaData[0].stream;
            onLoad(stream);

            for (var i = 0; i < chaData.length; i++) {
                if (i % channelsPerColumn === 0) {
                    if (column) {
                        channels.push(column);
                    }
                    column = [];
                }
                column.push({
                    index: i,
                    icon: chaData[i].icon,
                    name: chaData[i].ChannelName,
                    stream: chaData[i].stream
                });
            }
            if (column) {
                channels.push(column);
            }
            $scope.currentPage = 0;
            $scope.selectedIndex = 0;
            $scope.title = '电视频道';
            $scope.totalPage = Math.ceil(chaData.length / (3 * channelsPerColumn));
            $scope.channels = channels.slice(0, 3);
            numOfChannels = chaData.length;
        }

        var widgetAPI = new Common.API.Widget();
        var pluginObj = new Common.API.Plugin();
        var tvKey = new Common.API.TVKeyValue();
        var pluginSef;
        var pluginObjectTVMW;
        var PL_MEDIA_SOURCE = 43;

        function stopPlay() {
            try {
                pluginSef.Execute("Stop");
            } catch (e) {
            }
        }

        function changeVideo(videoURL) {
            stopPlay();
            //if (parseInt(pluginObjectTVMW.GetSource(), 10) != PL_MEDIA_SOURCE) {
            //    pluginObjectTVMW.SetSource(PL_MEDIA_SOURCE);
            //}
            pluginSef.Execute("InitPlayer", videoURL);
            pluginSef.Execute("Start", videoURL);
            pluginSef.Execute("StartPlayback", 0);
        }

        function onLoad(videoURL) {
            widgetAPI.sendReadyEvent();

            pluginObj.unregistKey(tvKey.KEY_VOL_UP);
            pluginObj.unregistKey(tvKey.KEY_VOL_DOWN);
            pluginObj.unregistKey(tvKey.KEY_MUTE);

            pluginSef = document.getElementById("pluginSef");
            pluginObjectTVMW = document.getElementById("pluginObjectTVMW");

            pluginSef.Open('Player', '1.000', 'Player');

            //if (parseInt(pluginObjectTVMW.GetSource(), 10) != PL_MEDIA_SOURCE) {
            //    pluginObjectTVMW.SetSource(PL_MEDIA_SOURCE);
            //}
            pluginSef.Execute("InitPlayer", videoURL);
            pluginSef.Execute("Start", videoURL);
            pluginSef.Execute("StartPlayback", 0);

        }

    }])
    .service('LiveService', ['$q', '$http', 'ResourceManager', function ($q, $http, ResourceManager) {
        var configUrl,
            channels = [];

        this.getPlayUrl = function (_configUrl) {
            return $http.get(_configUrl + '/Main/json/MainMenu_4.json').success(function (menuJSON) {
            })
        }

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
                        ChannelName: el.ChannelName,
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
