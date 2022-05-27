import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: "/",
            name: "home",
            redirect: "imTest"
        },
        {
            //IM测试
            path: "/imTest",
            name: "imTest",
            component: () => import("../views/imTest.vue")
        }
    ]
});
