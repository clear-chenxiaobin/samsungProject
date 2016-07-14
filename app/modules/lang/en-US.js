'use strict';

angular.module('app.en-US', [])
    .service('en-US-String', [function () {
        return{
            lang:'en-US',
            index:{
                guestName:'guest name',
                welcomeText:'',
                subWelcomeText:'here is subWelcomeText',
                roomNumber:'room-number:8088'
            },
            weather: {
                title: 'weather',
                city_list: 'list of cities',
                day1: 'today',
                day2: 'tomorrow',
                day3: 'the day after tomorrow'
            },
            bill: {
                title: 'Bill',
                billList: 'Consumer items',
                time: 'Time',
                price: 'Price',
                currentPage: 'Current page',
                total: 'Total'
            },
            tpl_categroy_list: {
                title: 'City Guide'
            }
        }

    }])
