'use strict';

angular.module('app.resource', [])
    .service('ResourceManager', ['$rootScope', 'SERVER_URL', function ($rootScope, SERVER_URL) {

        var locale         = 'zh-CN',
            i18nResource,
            configurations,
            picTextDetail;

        this.initialize = function (mainJSON, menuJSON) {

            i18nResource = {};
            i18nResource['zh-CN'] = {};
            i18nResource['en-US'] = {};
            i18nResource['zh-CN'].guest_name         = mainJSON.guest_name;
            i18nResource['en-US'].guest_name         = mainJSON.guest_name_eng;
            i18nResource['zh-CN'].hotel_manager_name = mainJSON.hotel_manager_name;
            i18nResource['en-US'].hotel_manager_name = mainJSON.hotel_manager_name_eng;
            i18nResource['zh-CN'].welcome_text       = mainJSON.welcome_text;
            i18nResource['en-US'].welcome_text       = mainJSON.welcome_text_eng;

            configurations = {};
            configurations.backgroundVideoUrl = SERVER_URL + mainJSON.background_video_url;
            //configurations.mainConfigUrl      = SERVER_URL + '/main.json';
            configurations.menuConfigUrl      = SERVER_URL + mainJSON.MainView_Json_URL;
            configurations.logoUrl            = SERVER_URL + mainJSON.logo;
            var languages                     = [];
            mainJSON.Content.forEach(function (el, idx, arr) {
                var codeLocaleMapping = {ENG: 'en-US', CHZ: 'zh-CN'};
                languages.push({
                    code: codeLocaleMapping[el.Code],
                    name: el.Name,
                    icon: SERVER_URL + el.URL
                });
            });
            configurations.languages = languages;

            var viewTree = [], subViewTreeIndex = 0, viewTreeIndex = 0;
            menuJSON.Content.forEach(function (el, idx, arr) {
                var childViews = [];
                if (el.Second) {
                    el.Second.Content.forEach(function (el2, idx2, arr2) {
                        var nameKey = 'sub_menu_item_' + subViewTreeIndex;
                        childViews.push({
                            icon: SERVER_URL + el2.Icon_URL,
                            nameKey: nameKey,
                            type: el2.Type,
                            config: SERVER_URL + el2.Json_URL
                        });
                        i18nResource['zh-CN'][nameKey] = el2.Name;
                        i18nResource['en-US'][nameKey] = el2.NameEng;
                        subViewTreeIndex++;
                    });
                }
                var nameKey = 'menu_item_' + viewTreeIndex;
                viewTree.push({
                    childViews: childViews,
                    nameKey: nameKey,
                    type: el.Type,
                    icon: SERVER_URL + el.Icon_URL,
                    config: SERVER_URL + el.Json_URL
                });
                viewTreeIndex++;
                i18nResource['zh-CN'][nameKey] = el.Name;
                i18nResource['en-US'][nameKey] = el.NameEng;
            });
            configurations.viewTree = viewTree;

        };

        this.setLocale = function (_locale) {
            locale = _locale;
            $rootScope.$broadcast('locale.change', _locale);
        };

        this.getI18NResource = function () {
            // keep i18n resource be a snapshot
            var resource = i18nResource[locale];
            //return {
            //    getString: function (resourceKey) {
            //        return resource[resourceKey];
            //    }
            //};
            return resource;
        };

        this.addI18NResource = function (strs) {
            Object.keys(strs['zh-CN']).forEach(function (key) {
                i18nResource['zh-CN'][key] = strs['zh-CN'][key];
            });
            Object.keys(strs['en-US']).forEach(function (key) {
                i18nResource['en-US'][key] = strs['en-US'][key];
            });
        };

        this.setPicTextDetail = function (title, detail) {
            picTextDetail = {
                title : title,
                detail : detail
            };
        }

        this.getPicTextDetail = function () {
            return picTextDetail;
        }

        this.getConfigurations = function () {
            return {
                backgroundVideoUrl: function () {
                    return configurations.backgroundVideoUrl;
                },
                mainConfigUrl: function () {
                    return SERVER_URL + '/main.json';
                },
                serverUrl: function () {
                    return SERVER_URL;
                },
                logoUrl: function () {
                    return configurations.logoUrl;
                },
                languages: function () {
                    return configurations.languages;
                },
                viewTree: function () {
                    return configurations.viewTree;
                }
            };
        };

    }])
    .constant('SERVER_URL', 'http://172.17.173.100/nativevod/now');
