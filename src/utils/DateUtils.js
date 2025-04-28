
/**判断传入的两天距离多少天，格式 yyyy-MM-dd */
export function getDaysBetween(start, end) {
    var startTime = new Date(start.replace(/-/g, "/"));
    var endTime = new Date(end.replace(/-/g, "/"));
    var days = endTime.getTime() - startTime.getTime();
    var day = parseInt(days / (1000 * 60 * 60 * 24) + "");
    return day;
}
/** 获取今天日期，自定义返回格式 */
export function getToday(format) {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (format == "yyyy-MM-dd") {
        return date.getFullYear() + seperator1 + (month >= 10 ? month : "0" + month) + seperator1 + (strDate >= 10 ? strDate : "0" + strDate);
    } else if (format == "yyyy-MM-dd HH:mm:ss") {
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        return date.getFullYear() + seperator1 + (month >= 10 ? month : "0" + month) + seperator1 + (strDate >= 10 ? strDate : "0" + strDate) +
            " " + (hour >= 10 ? hour : "0" + hour) + seperator2 + (minute >= 10 ? minute : "0" + minute) + seperator2 + (second >= 10 ? second : "0" + second);
    }
}

/**
     * 把Date对象转换成yyyy-MM-dd格式的字符串
     * Convert a Date object to a string in the format of yyyy-MM-dd.
     * @param {string} formatter
     * @param {Date} date
     * @returns {string}
     * @example
     * formatDate('yyyy-MM-dd', new Date()); // 返回'2020-01-01'
     * formatDate('yyyy-MM-dd', new Date(2020, 0, 1)); // 返回'2020-01-01'
     * 
     */
export function formatDate (format, date) {
    var year = date.getFullYear()+"";
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var milliseconds = date.getMilliseconds();

    // 将年份、月份、日期、小时、分钟、秒钟、毫秒替换到对应的位置
    // Replace the year, month, date, hour, minute, second, and millisecond to the corresponding position.
    var result = format.replace('yyyy', year);
    result = result.replace('MM', ('0' + month).slice(-2));
    result = result.replace('dd', ('0' + day).slice(-2));
    result = result.replace('HH', ('0' + hours).slice(-2));
    result = result.replace('mm', ('0' + minutes).slice(-2));
    result = result.replace('ss', ('0' + seconds).slice(-2));
    result = result.replace('SSS', ('00' + milliseconds).slice(-3));

    return result;
}

/** 
     * 时间戳转 yyyy-MM-dd yyyy-MM-dd HH:mm:ss格式的字符串
     * Convert a timestamp to a string in the format of yyyy-MM-dd yyyy-MM-dd HH:mm:ss.
     * @param {number} timestamp
     * @param {string} format
     * @returns {string}
     * @example
     * timestampToTime(1577836800000, 'yyyy-MM-dd'); // 返回'2020-01-01'
     * timestampToTime(1577836800000, 'yyyy-MM-dd HH:mm:ss'); // 返回'2020-01-01 00:00:00'
     * timestampToTime(1577836800000, 'yyyy年MM月dd日'); // 返回'2020年01月01日'
     * timestampToTime(1577836800000, 'yyyy年MM月dd日 HH时mm分ss秒'); // 返回'2020年01月01日 00时00分00秒'
     */ 
export function timestampToTime (timestamp, format) {
    if (timestamp == null || timestamp == '') {
        return '';
    }
    var date = new Date(Number(timestamp));
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var milliseconds = date.getMilliseconds();

    // 将年份、月份、日期、小时、分钟、秒钟、毫秒替换到对应的位置
    // Replace the year, month, date, hour, minute, second, and millisecond to the corresponding position.
    var result = format.replace('yyyy', year+"");
    result = result.replace('MM', ('0' + month).slice(-2));
    result = result.replace('dd', ('0' + day).slice(-2));
    result = result.replace('HH', ('0' + hours).slice(-2));
    result = result.replace('mm', ('0' + minutes).slice(-2));
    result = result.replace('ss', ('0' + seconds).slice(-2));
    result = result.replace('SSS', ('00' + milliseconds).slice(-3));

    return result;
}