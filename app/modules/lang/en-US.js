'use strict';

angular.module('app.en-US', [])
    .service('en-US-String', [function () {
        return{
            index:{
                guestName:'guest name',
                welcomeText:'',
                subWelcomeText:'here is subWelcomeText',
                roomNumber:'room-number:8088'
            },
            confirm:{
                network_state:'The current network status is not wifi, go on？'
            },
            tpl_categroy_list: {
                title: 'City Guide'
            }
        }

    }])
