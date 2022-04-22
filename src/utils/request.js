import axios from 'axios'
import {ElMessage, ElMessageBox} from 'element-plus'

/**
 * 封装 axios请求
 */
const service = axios.create({
    baseURL: 'http://localhost:9297',
    withCredentials: true,
    timeout: 0,
})

service.interceptors.request.use(
    (config) => {
        return config
    },
    (error) => {
        return Promise.reject(error)
    },
)

service.interceptors.response.use(
    (response) => {
        let code = response.data.code
        if (code >= 200 && code <= 300) {
            if (code === 201) {
                ElMessage({
                    type: 'success',
                    message: response.data.message,
                    duration: 2500,
                    showClose: true
                })
            }
            return response.data.data
        } else if (code >= 1000 && code < 2000) {
            ElMessage({
                type: "error",
                message: response.data.message,
                duration: 2500,
                showClose: true
            })
        } else if (code >= 2000 && code < 3000) {
            ElMessageBox.alert(response.data.message, '提示', {
                type: 'warning',
            }).then(r => {
            }).catch((e) => {
            })
        }
        if (response.data.data) {
            return Promise.reject(response.data)
        }
        return Promise.reject(response.data.message || '服务器内部错误')
    },
    (error) => {
        ElMessage({
            message: error,
            type: 'error',
            duration: 2500,
            showClose: true,
        })
        return Promise.reject(error)
    },
)

export default service
