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
            confirm: {
                network_state: 'The current network status is not wifi, go on？'
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
