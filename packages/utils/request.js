import axios from 'axios';
import sysConfig from "@/config";

axios.defaults.baseURL = ''

axios.defaults.timeout = sysConfig.TIMEOUT

// HTTP request 拦截器
axios.interceptors.request.use(
    (config) => {
        let token = sessionStorage.getItem("IM_TOKEN");
        if (token) {
            config.headers[sysConfig.TOKEN_NAME] = token
        }
        if (config.method === 'get') {
            config.params = config.params || {};
            config.params['_'] = new Date().getTime();
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// HTTP response 拦截器
axios.interceptors.response.use(
    (response) => {
        // debugger;
        if (response.data.status === 401) {
            alert("Status:401，无权限访问当前资源！")
        } else {
            return response.data;
        }
    },
    (error) => {
        if (error.response) {
            if (error.response.status === 404) {
                alert("Status:404，正在请求不存在的服务器记录！")
            } else if (error.response.status === 500) {
                alert(error.response.data.message)
                //error.response.data.message || "Status:500，服务器发生错误！"
            } else if (error.response.status === 401) {
                alert("Status:401，无权限访问当前资源！")
            } else {
                alert(`Status:${error.response.status}，未知错误！`)
            }
        } else {
            alert("请求服务器无响应！")
        }
        return Promise.reject(error.response.data);
    }
);

let http = {

    /** get 请求
     * @param  {接口地址} url
     * @param  {{请求参数}} params
     * @param  {{参数}} config
     */
    get: function (url, params = {}, config = {}) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'get',
                url: url,
                params: params,
                ...config
            }).then((response) => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
        })
    },

    /** post 请求
     * @param  {接口地址} url
     * @param  {{请求参数}} data
     * @param  {{参数}} config
     */
    post: function (url, data = {}, config = {}) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url: url,
                data: data,
                ...config
            }).then((response) => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
        })
    },

    /** put 请求
     * @param  {接口地址} url
     * @param  {{请求参数}} data
     * @param  {{参数}} config
     */
    put: function (url, data = {}, config = {}) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'put',
                url: url,
                data: data,
                ...config
            }).then((response) => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
        })
    },

    /** patch 请求
     * @param  {接口地址} url
     * @param  {{请求参数}} data
     * @param  {{参数}} config
     */
    patch: function (url, data = {}, config = {}) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'patch',
                url: url,
                data: data,
                ...config
            }).then((response) => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
        })
    },

    /** delete 请求
     * @param  {接口地址} url
     * @param  {{请求参数}} data
     * @param  {{参数}} config
     */
    delete: function (url, data = {}, config = {}) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'delete',
                url: url,
                data: data,
                ...config
            }).then((response) => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
        })
    },

    /** jsonp 请求
     * @param  {接口地址} url
     * @param  {JSONP回调函数名称} name
     */
    jsonp: function (url, name = 'jsonp') {
        return new Promise((resolve) => {
            let script = document.createElement('script')
            let _id = `jsonp${Math.ceil(Math.random() * 1000000)}`
            script.id = _id
            script.type = 'text/javascript'
            script.src = url
            window[name] = (response) => {
                resolve(response)
                document.getElementsByTagName('head')[0].removeChild(script)
                try {
                    delete window[name];
                } catch (e) {
                    window[name] = undefined;
                }
            }
            document.getElementsByTagName('head')[0].appendChild(script)
        })
    }
}

export default http;
