import axios from 'axios'
import {ElMessage} from 'element-plus'

/**
 * 封装 axios请求
 */
const service = axios.create({
    baseURL: '',
    withCredentials: true,
    timeout: 5000,
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
        return response.data
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
