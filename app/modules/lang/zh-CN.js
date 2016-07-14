'use strict';

angular.module('app.zh-CN', [])
    .service('zh-CN-String', [function () {
        return {
            lang:'zh-CN',
            index: {
                guestName: '尊敬的 ',
                roomNumber: '房间号8088'
            },
            weather:{
                title:'天气',
                city_list:'城市列表',
                day1:'今天',
                day2:'明天',
                day3:'后天'
            },
            bill: {
                title: '账单',
                billList: '消费项目',
                time: '时间',
                price: '金额',
                currentPage: '当前页',
                total: '总计'
            },
            tpl_categroy_list: {
                title: '城市介绍'
            }
        }
    }])
