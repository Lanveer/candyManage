'use strict';

angular.module('SmartAdmin.UI').factory('AlertService', function () {
    var alertCount = 0;
    var alert = {
        msg: function (data) {
            if (data.errCode === 0)
                this.message(data.message);
            else this.error(data.msg)
        },
        success: function (message, title) {
            $.smallBox({
                 title: title || "操作成功!",
                 content: message,
                 color: "#568a89",
                 iconSmall: "fa fa-thumbs-up bounce animated",
                 timeout: 3000
            });
        },
        error: function (message, title) {
            $.smallBox({
                title: title || "操作失败!",
                content: message,
                color: "#C46A69",
                icon: "fa fa-warning animated",
            });
        },
        message: function (message, title) {
            $.smallBox({
                title: title || "提示!",
                content: message,
                color: "#cdcece",
                icon: "fa fa-commenting animated",
                timeout: 3000
            });
        },
        alert: function (msg, title, ok, cancel) {
            $.SmartMessageBox({
                title: title || "提示",
                content: msg,
                buttons: '[确认][取消]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "确认") {
                    ok && ok();
                }
                if (ButtonPressed === "取消") {
                    cancel && cancel();
                }

            });
        }

    }
    return alert;
})