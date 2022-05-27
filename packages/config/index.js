const DEFAULT_CONFIG = {

    //版本号
    APP_VER: "1.0.0",

    //接口地址
    IM_API_URL: sessionStorage.getItem('IM_API_URL'),
    IM_BROKER_URL: sessionStorage.getItem('IM_BROKER_URL'),

    //请求超时
    TIMEOUT: 60000,

    //TokenName
    TOKEN_NAME: "Authorization",

}

module.exports = DEFAULT_CONFIG
