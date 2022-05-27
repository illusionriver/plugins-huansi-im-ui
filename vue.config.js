const path = require('path');//引入path模块
function resolve(dir) {
    return path.join(__dirname, dir)//path.join(__dirname)设置绝对路径
}

module.exports = {

    lintOnSave: false,

    pages: {
        index: {
            // 页面入口
            entry: "displayPages/main.js",
            // 模板来源
            template: "pubilc/index.html",
            // 输出文件名
            filename: "index.html"
        }
    },

    // build编译后不生成资源MAP文件
    productionSourceMap: false,

    //开发服务,build后的生产模式还需nginx代理
    devServer: {
        open: false, //运行后自动打开游览器
        port: 8901, //挂载端口
    },

    chainWebpack: config => {
        // 移除 prefetch 插件
        config.plugins.delete('preload');
        config.plugins.delete('prefetch');
        config.resolve.alias
            .set('@', resolve('./packages'))
        // config.resolve.alias.set('vue-i18n', 'vue-i18n/dist/vue-i18n.cjs.js');
    },

    configureWebpack: config => {
        //性能提示
        config.performance = {
            hints: false
        }
        config.optimization = {
            splitChunks: {
                chunks: "async",
                automaticNameDelimiter: '~',
                name: true,
                cacheGroups: {
                    //第三方库抽离
                    vendor: {
                        name: "modules",
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10
                    }
                }
            }
        }
    }
};
