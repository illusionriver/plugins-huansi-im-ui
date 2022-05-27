// 引入@babel/polyfill处理兼容
import "@babel/polyfill";

//项目管理
import HIM from "./src/HIM/index";

const components = [HIM];

const install = function (Vue) {
    if (install.installed) return;
    install.installed = true;
    components.map(component => {
        Vue.component(component.name, component);
    });
};

if (typeof window !== "undefined" && window.Vue) {
    install(window.Vue);
}

export {HIM};
export default {
    install
};
