'use strict';

angular.module('app.zh-CN', [])
    .service('zh-CN-String', [function () {
        return {
            lang:'zh-CN',
            welcome: {
                cue: '根据您的语言习惯选择使用的语言系统',
            },
            index: {
                guestName: '尊敬的 ',
                roomNumber: '房间号8088'
            },
            toolbar: {
                ok: '按OK选择分类',
                weather_ok:'按OK选择分类',
                order_ok:'按OK选择分类',
                up_down: '按上下移动选项',
                left_right: '按左右切换图片',
                back: '点击 返回',
                menu: '点击 打开菜单',
                menuText: '菜 单'
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
            },
            movie: {
                title: '电影'
            },
            order: {
                title: '订餐服务'
            },
            cart:{
                title:'购物车',
                coin:'￥',
                price:'/份'
            }
        }
    }])
