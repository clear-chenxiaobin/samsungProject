'use strict';

angular.module('app.zh-CN', [])
    .service('zh-CN-String', [function () {
        return {
            index: {
                guestName: '贵宾',
                welcomeText: '',
                subWelcomeText: '华丽的客房',
                roomNumber: '房间号8088'
            },
            weather:{
                title:'天气',
                city_list:'城市列表',
                day1:'今天',
                day2:'明天',
                day3:'后天'
            },
            tpl_categroy_list: {
                title: '城市介绍'
            }
        }
    }])
