import config from "@/config"
import http from "@/utils/request"

export default {
    //IM
    IM: {
        chatInitRegister: {
            url: `${config.IM_API_URL}/api/service/chat/init/register`,
            name: "注册用户信息",
            get: async function (params) {
                return await http.get(this.url, params);
            }
        },
        chatInitGetContactList: {
            url: `${config.IM_API_URL}/api/service/chat/init/getContactList`,
            name: "初始化用户信息",
            get: async function (params) {
                return await http.get(this.url, params);
            }
        },
        chatInitGetLatestMsg: {
            url: `${config.IM_API_URL}/api/service/chat/init/getLatestMsg`,
            name: "获取消息",
            get: async function (params) {
                return await http.get(this.url, params);
            }
        },
        messageReadAll: {
            url: `${config.IM_API_URL}/api/service/chat/message/readAll`,
            name: "消息已读",
            get: async function (params) {
                return await http.get(this.url, params);
            }
        },
        messageSendMsg: {
            name: "发送消息",
            post: async function (userId, toContactId, params) {
                let url = `${config.IM_API_URL}/api/service/chat/message/${userId}/to/${toContactId}/sendMsg`
                return await http.post(url, params);
            }
        },
    }
}
