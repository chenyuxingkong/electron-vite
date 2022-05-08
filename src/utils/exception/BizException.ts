import {ElMessage, ElMessageBox} from "element-plus";
import {stringIsBlank} from "../public/blank-utils";

export const ExceptionEnum = {
    SUCCESS: {code: 200, name: '成功', turnOnHtml: false},

    MESSAGE_ERROR: {code: 1001, name: '错误', turnOnHtml: false},
    MESSAGE_HTML_ERROR: {code: 1002, name: '错误', turnOnHtml: true},

    LOGICAL_ERROR: {code: 2001, name: '成功', turnOnHtml: false},
    LOGICAL_HTML_ERROR: {code: 2002, name: '成功', turnOnHtml: true},

} as const;

class ExceptionCode {
    code: number;
    name: string;
    turnOnHtml: boolean;
}

export class BizException extends Error {
    public message: string;

    constructor(code: ExceptionCode)
    constructor(code: ExceptionCode, message?: string) {
        super();
        this.check(code, message)
    }

    check(code: ExceptionCode, message?: string) {
        this.message = stringIsBlank(message) ? code.name : message
        if (code.code > 1000 && code.code < 2000) {
            ElMessage({
                type: 'error',
                message: this.message,
                dangerouslyUseHTMLString: code.turnOnHtml,
                duration: 2500,
                showClose: true
            })
        } else if (code.code > 2000 && code.code < 3000) {
            ElMessageBox.alert(this.message, '提示', {
                type: 'error',
                dangerouslyUseHTMLString: code.turnOnHtml,
            }).then(() => {

            }).catch(() => {

            })
        }
    }

    public toString() {
        return `错误信息：${this.message}`
    }

}
