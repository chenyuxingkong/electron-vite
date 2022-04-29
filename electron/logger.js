const logger = require('electron-log')
const {app} = require('electron')

logger.transports.file.level = 'debug'
logger.transports.file.maxSize = 1002430 // 10M
logger.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}'
let date = new Date()
date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
logger.transports.file.resolvePath = () => app.getPath('userData') + '\\cy-zs-log\\app\\' + date + '.log'

exports.info = function (...params) {
    logger.info(...params)
}
exports.warn = function (...params) {
    logger.warn(...params)
}
exports.error = function (...params) {
    logger.error(...params)
}
exports.debug = function (...params) {
    logger.debug(...params)
}
exports.verbose = function (...params) {
    logger.verbose(...params)
}
exports.silly = function (...params) {
    logger.silly(...params)
}


