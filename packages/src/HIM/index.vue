<template>
    <div id="WebChat">
        <lemon-imui ref="IMUI" :width="IMWidth" :height="IMHeight"
                    :user="user"
                    @pull-messages="handlePullMessages"
                    @send="handleSend"
        ></lemon-imui>
    </div>
</template>

<script>/**
 * @title: WebChat
 * @projectName huansiim-ui
 * @description: TODO
 * @author 金鑫
 * @date 2022/4/1411:41
 */

import mqtt from 'mqtt'
import DEFAULT_CONFIG from "../../config";
import api from "../../api";

export default {
    name: 'HIM',
    props: {
        IMWidth: {
            type: Number,
            default: 700
        }, IMHeight: {
            type: Number,
            default: 500
        }
    },
    data() {
        return {
            socketUser: {
                username: "",
                password: "",
                clientId: ""
            },
            //当前登陆用户信息
            user: {
                id: "0",
                displayName: '',
                avatar: '',
            },
            //消息列表
            messages: {
                "发件人ID": [
                    //消息结构体
                ]
            },
            contacts: [],
            /**
             * 联系人按照id生成的map表, 方便快速取值.
             */
            contactMap: {},
            /**
             * 如果窗口被点击过了则不再往里面存储数据了,否则就存储一条记录带包当前窗口之前已经点击过了.
             */
            viewContancts: {}
        }
    },
    computed: {},
    created() {
    },
    mounted() {
        //TODO 初始化表情包。
        // IMUI.initEmoji();
        // 1. 请求注册接口,传入token和运行端信息获取当前用户的clientid\username\password信息以及需要订阅的topic信息.
        this.register().then(() => {
            //3. 连接websocket服务,传入用户名\密码\clientid\topic订阅消息.
            console.log("开始连接websocket {}", this.user);
            this.websocket();
        });
        //2. 拉取用户的通讯录清单,并填充未读消息以及最近一条消息信息.
        this.initContacts()

    },
    methods: {
        websocket() {
            const {IMUI} = this.$refs;
            let options = {
                clean: false, // true: 清除会话, false: 保留会话
                connectTimeout: 4000, // 超时时间
                // 认证信息
                clientId: this.socketUser.clientId,
                username: this.socketUser.username,
                password: this.socketUser.password,
            }
            let client = mqtt.connect(DEFAULT_CONFIG.IM_BROKER_URL, options);
            client.on('connect', (error) => {
                console.log('连接成功:', error)
                //连接成功后，如果之前绑定过可以先采用解绑操作，在进行绑定，绑定成功先调用http接口拉取最近消息，防止消息遗漏。
                // 3.1 订阅消息至少包含, 当前用户队列\广播队列\系统通知队列三个消息队列.
                client.unsubscribe(this.socketUser.topics, () => {
                    client.subscribe(this.socketUser.topics, (data) => {
                        console.log('成功订阅到消息:', data)
                    });
                })
            })

            client.on('reconnect', (error) => {
                console.log('正在重连:', error)
            })

            client.on('error', (error) => {
                console.log('连接失败:', error)
            })


            client.on('close', (error) => {
                console.log('客户端断开连接:', error)
            })

            client.on('offline', (error) => {
                console.log('客户端离线:', error)
            })

            client.on('disconnect', (error) => {
                console.log('服务端断开连接:', error)
            })

            client.on('message', (topic, message) => {
                message = JSON.parse(message)
                console.log('收到消息：', topic, message)
                this.handleMessage(message);
                /**
                 * TODO 3.2 接收到消息后,直接调用IMUI.appendMessage(data)将消息添加入聊天窗口中.
                 * 再此需要判断viewContancts中是否有值,有值则直接添加,没值则存入messages中.
                 * 同时判断发送人对象中第一条消息的earliestTime字段是否小于message的时间,如果小于则更新earliestTime字段.
                 */
                //message中会包含id信息，每条消息都会包含唯一的id用来进行排重。
                IMUI.appendMessage(message, true);
            })
        },
        /**
         * 注册用户信息
         * @returns {Promise<void>}
         */
        async register() {

            let params = {"client": "web"}
            let user = await api.IM.chatInitRegister.get(params)

            this.$set(this.socketUser, "clientId", user.clientId);
            this.$set(this.socketUser, "password", user.password);
            this.$set(this.socketUser, "username", user.username);
            this.$set(this.socketUser, "topics", user.topics);
            this.$set(this.user, "id", user.user.id);
            this.$set(this.user, "displayName", user.user.displayName);
            this.$set(this.user, "avatar", user.user.avatar);
        },

        /**
         * 初始化用户信息
         */
        async initContacts() {
            const {IMUI} = this.$refs;
            let contacts = await api.IM.chatInitGetContactList.get()

            //从后端请求联系人数据，包装成下面的样子
            this.contacts.push(...contacts);
            //将用户列表数据转换为map,帮助快速检索使用.
            for (let i = 0; i < contacts.length; i++) {
                let contact = contacts[i];
                // contact.displayName = contact.displayName +" "+contact.id;
                contact.unread = Number(contact.unread);
                contact.lastSendTime = Number(contact.lastSendTime);
                this.$set(this.contactMap, contact.id, contact);
            }
            IMUI.initContacts(this.contacts);
        },
        /**
         * 接收消息
         * @param contact
         * @param next
         */
        async handlePullMessages(contact, next) {
            //设置消息都变为已读状态.
            this.$set(contact, "unread", 0);
            //读取本地缓存的数据信息.
            let messages = [];
            if (!this.viewContancts[contact.id]) {
                //说明是用户第一次点击, 将用户操作过的状态进行记录.
                this.$set(this.viewContancts, contact.id, contact);
                //这是说明用户之前没有点击过,所以需要将累计的之前的数据都填入到当前窗口中.
                if (this.messages[contact.id]) {
                    messages = this.messages[contact.id].splice(0);
                }
            } else {
                //用户之前已经点击过了,所以不需要做任何操作.
            }
            //调用远程接口, 拉取历史消息,直到历史消息拉取没有以后,将next中的第二个参数设置为false.
            //首先判断当前消息中的最早时间.

            // 调用远端接口, 使用earliestTime作为条件向前查询数据,获取前面的20条数据.
            let params = {
                timestamp: contact.earliestTime,
                count: 20,
                toUserId: contact.id
            }
            let msgs = await api.IM.chatInitGetLatestMsg.get(params)

            for (let i = 0; i < msgs.length; i++) {
                let msg = msgs[i];
                this.handleMessage(msg);
                // msg.fromUser = this.contactMap[msg["fromContactId"]];
                // msg.sendTime = Number(msg.sendTime);
            }
            if (msgs != null) {
                messages.push(...msgs);
            }

            //调用后端接口,标记消息为已读.
            let paramsRead = {
                timestamp: new Date().getTime(),
                count: 20,
                toUserId: contact.id
            }
            await api.IM.messageReadAll.get(paramsRead)

            // 如果返回数据少于20行,则将next中的第二个参数设置为false.
            //将第二个参数设为true，表示已到末尾，聊天窗口顶部会显示“暂无更多消息”，不然会一直转圈。
            next(messages, msgs != null && msgs.length < 20);
        },
        handleMessage(message) {
            message.sendTime = Number(message.sendTime);
            message.status = "succeed";
            message.fromUser = this.contactMap[message.fromContactId]
            if (this.user.id == message.toContactId) {
                message.toContactId = message.fromContactId;
            }
            let contact = this.contactMap[message.toContactId];
            //记录最早一条消息事件.
            if (contact.earliestTime) {
                if (contact.earliestTime > message.sendTime) {
                    this.$set(contact, "earliestTime", message.sendTime);
                }
            } else {
                this.$set(contact, "earliestTime", message.sendTime);
            }
        },
        /**
         * 发送消息
         * @param message
         * @param next
         * @param file
         */
        async handleSend(message, next, file) {
            //... 调用你的消息发送业务接口
            console.log(message)
            console.log(file)
            this.$delete(message, "id");
            if (file) {
                //TODO 在这里完成文件上传动作.
                message.fileName = "";
            }

            let status = await api.IM.messageSendMsg.post(this.user.id, message.toContactId, message)

            //执行到next消息会停止转圈，如果接口调用失败，可以修改消息的状态 next({status:'failed'});
            if (status) {
                next();
            } else {
                next({status: 'failed'});
            }

        },
    }
}
</script>

<style lang="scss" scoped>

</style>
