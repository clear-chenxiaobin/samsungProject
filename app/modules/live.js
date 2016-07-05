'use strict';

angular.module('app.live', [])
    .controller('LiveController', ['$scope', '$element', 'ActivityManager', 'LiveService', 'COMMON_KEYS', function ($scope, $element, ActivityManager, LiveService, COMMON_KEYS) {
        var activity = ActivityManager.getActiveActivity();
        var chaData,
            numOfChannels,
            stream;
        var channelsPerColumn = 8, column;
        var channels = [];

        document.getElementsByTagName("body")[0].setAttribute("style", "background-image:none");
        activity.initialize($scope);
        activity.shouldDisplayMenu(false);
        activity.hide();

        $element[0].parentNode.classList.add('live-content-container');
        if (LiveService.getChannels().length == 0) {
            LiveService.getPlayUrl().success(function (data) {
                LiveService.initialize().success(function (data) {
                    //console.log(LiveService.getChannels());
                    bind();
                })
            })
        } else {
            bind();
        }

        activity.onKeyDown(function (keyCode) {
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
                        LiveService.stopPlay();
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
                //stream = chaData[tempIndex].stream;
                stream = "udp://@229.1.1.1:8001";
                LiveService.changeVideo(stream);
            }
        });

        function bind() {
            chaData = LiveService.getChannels();
            //stream = chaData[0].stream;
            stream = "udp://@224.1.1.1:8001";
            LiveService.onLoad(stream);

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
    }])
    .service('LiveService', ['$q', '$http', 'ResourceManager', function ($q, $http, ResourceManager) {
        var widgetAPI = new Common.API.Widget();
        var pluginObj = new Common.API.Plugin();
        var tvKey = new Common.API.TVKeyValue();

        var configUrl,
            conUrl = ResourceManager.getConfigurations().serverUrl(),
            jsonUrl,
            channels = [];
        var pluginSef;
        var pluginObjectTVMW;
        var PL_MEDIA_SOURCE = 45;

        this.getPlayUrl = function () {
            return $http.get(conUrl + '/Main/json/MainMenu_4.json').success(function (menuJSON) {
                menuJSON.Content.forEach(function (el, idx, arr) {
                    if (el.Name == '直播') {
                        jsonUrl = conUrl + el.Json_URL;
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
                    var nameKey = 'channel_name_' + el.ChannelNum;
                    channels.push({
                        ChannelName: el.ChannelName,
                        nameKey: nameKey,
                        stream: el.ChannelSrc[0].Src,
                        icon: conUrl + el.ChannelPic
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

        this.stopPlay = function () {
            try {
                pluginSef.Execute("Stop");
            } catch (e) {
            }
        }

        this.changeVideo = function (videoURL) {
            pluginSef.Execute("Stop");
            if (parseInt(pluginObjectTVMW.GetSource(), 10) != PL_MEDIA_SOURCE) {
                pluginObjectTVMW.SetSource(PL_MEDIA_SOURCE);
            }
            pluginSef.Execute("InitPlayer", videoURL);
            pluginSef.Execute("Start", videoURL);
            pluginSef.Execute("StartPlayback", 0);
        }
        
        this.onLoad = function (videoURL) {
            widgetAPI.sendReadyEvent();

            pluginObj.unregistKey(tvKey.KEY_VOL_UP);
            pluginObj.unregistKey(tvKey.KEY_VOL_DOWN);
            pluginObj.unregistKey(tvKey.KEY_MUTE);

            pluginSef = document.getElementById("pluginSef");
            pluginObjectTVMW = document.getElementById("pluginObjectTVMW");

            pluginSef.Open('Player', '1.000', 'Player');

            if (parseInt(pluginObjectTVMW.GetSource(), 10) != PL_MEDIA_SOURCE) {
                pluginObjectTVMW.SetSource(PL_MEDIA_SOURCE);
            }
            pluginSef.Execute("InitPlayer", videoURL);
            pluginSef.Execute("Start", videoURL);
            pluginSef.Execute("StartPlayback", 0);

        }

    }]);
