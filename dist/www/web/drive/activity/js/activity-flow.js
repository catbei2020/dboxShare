﻿// 页面初始化事件调用函数
function init() {
    dataListPageInit();
    dataListPageView();

    fastui.list.scrollDataLoad('/web/drive/activity/activity-flow-list-json.ashx');
}


// 页面调整事件调用函数
function resize() {
    dataListPageInit();
}


// 数据列表页面初始化
function dataListPageInit() {
    // 列表页面布局调整
    fastui.list.layoutResize();
}


// 数据列表页面视图
function dataListPageView() {
    var items = $id('page-menu').$class('item');
    var type = $query('type');
    var i;

    if (type.length == 0) {
        items[0].className = 'item-current';
        return;
    }

    for (i = 0; i < items.length; i++) {
        if (items[i].$get('onClick').toString().indexOf(type) > -1) {
            items[i].className = 'item-current';
            break;
        }
    }
}


// 数据列表视图
function dataListView(field, reverse, primer) {
    var container = $id('datalist-container');
    var list = fastui.list.dataTable('data-list');
    var row;
    var i;
    var j;

    if (typeof(jsonData) == 'undefined') {
        return;
    }

    j = list.rows.length;

    for (i = j; i < jsonData.items.length; i++) {
        row = list.addRow(i);

        // 用户
        row.addCell(
            {width: '150', align: 'center'}, 
            function() {
                var html = '';

                html += '<div class=\"avatar\"><img src=\"/ui/images/avatar-icon.png\" width=\"32\" /></div>';
                html += '<div class=\"username\"><a href=\"javascript: window.parent.fastui.windowPopup(\'user-card\', \'' + lang.user['card'] + '\', \'/web/user/card.html?username=' + encodeURI(encodeURIComponent(jsonData.items[i].dbs_username)) + '\', 500, 500);\">' + jsonData.items[i].dbs_username + '</a></div>';

                return html;
            });

        // 信息
        row.addCell(
            null, 
            function() {
                var html = '';

                html += '<div class=\"time\">' + logTime(jsonData.items[i].dbs_time) + '</div>';
                html += '<div class=\"box\">';
                html += '<div class=\"filename\">' + logData(jsonData.items[i].dbs_fileid, jsonData.items[i].dbs_filename, jsonData.items[i].dbs_fileextension, jsonData.items[i].dbs_fileversion, jsonData.items[i].dbs_isfolder, jsonData.items[i].dbs_action) + '</div>';
                html += '<div class=\"action\">' + logAction(jsonData.items[i].dbs_action) + '</div>';
                html += '</div>';

                return html;
            });
    }
}


// 获取日志操作信息
function logAction(action) {
    var actions = new Array();
    var operation = '';
    var i;

    actions = action.split('-');

    if (actions[1] != undefined) {
        for (i in lang.action) {
            if (i == actions[1]) {
                operation = lang.action[i];
                break;
            }
        }
    }

    return operation;
}


// 获取日志数据信息
function logData(id, name, extension, version, isFolder, action) {
    if (isFolder == 1) {
        if (/^(folder|file)-delete$/.test(action) == false) {
            return '<a href=\"javascript: fastui.windowPopup(\'folder-detail\', \'' + lang.file.context['detail'] + ' - ' + name + '\', \'/web/drive/file/folder-detail.html?id=' + id + '\', 800, 500);\" title=\"' + name + '\">' + name + '</a>';
        } else {
            return '<label title=\"' + name + '\">' + name + '</label>';
        }
    } else {
        if (/^(folder|file)-delete$/.test(action) == false) {
            return '<a href=\"javascript: fastui.windowPopup(\'file-detail\', \'' + lang.file.context['detail'] + ' - ' + name + '' + extension + '\', \'/web/drive/file/file-detail.html?id=' + id + '\', 800, 500);\" title=\"' + name + '' + extension + '\">' + name + '' + extension + '</a>&nbsp;&nbsp;<span class=\"version\">v' + version + '</span>';
        } else {
            return '<label title=\"' + name + '' + extension + '\">' + name + '' + extension + '</label>&nbsp;&nbsp;<span class=\"version\">v' + version + '</span>';
        }
    }
}


// 获取日志时间信息
function logTime(time) {
    var ms = new Date().getTime() - new Date(time.replace(/\-/g, '/'));
    var second = 1000;
    var minute = second * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var month = day * 30;
    var year = day * 365;

    if (Math.floor(ms / second) == 0) {
        return '0 ' + lang.timespan['second'] + ' ' + time;
    } else if (Math.floor(ms / second) < 60) {
        return Math.floor(ms / second) + ' ' + lang.timespan['second'] + ' ' + time;
    } else if (Math.floor(ms / minute) < 60) {
        return Math.floor(ms / minute) + ' ' + lang.timespan['minute'] + ' ' + time;
    } else if (Math.floor(ms / hour) < 24) {
        return Math.floor(ms / hour) + ' ' + lang.timespan['hour'] + ' ' + time;
    } else if (Math.floor(ms / day) < 30) {
        return Math.floor(ms / day) + ' ' + lang.timespan['day'] + ' ' + time;
    } else if (Math.floor(ms / month) < 12) {
        return Math.floor(ms / month) + ' ' + lang.timespan['month'] + ' ' + time;
    } else if (Math.floor(ms / year) > 0) {
        return Math.floor(ms / year) + ' ' + lang.timespan['year'] + ' ' + time;
    }
}