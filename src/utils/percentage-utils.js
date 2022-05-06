// 百分数转化为小数
export function toPoint(percent) {
    let str = percent.replace("%", "");
    str = str / 100;
    return str;
}


// 小数转化为百分数
export function toPercent(point) {
    let str = Number(point * 100).toFixed(2);
    str += "%";
    return str;
}


