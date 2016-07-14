'use strict';

angular.module('app.zh-CN', [])
    .service('zh-CN-String', [function () {
        return{
            index:{
                guestName:'贵宾',
                welcomeText:'',
                subWelcomeText:'华丽的客房',
                roomNumber:'房间号8088'
            },
            confirm:{
                network_state:'The current network status is not wifi, go on？'
            }
        }
    }])
