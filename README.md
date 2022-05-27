# IM 服务插件 plugins-huansi-im-ui

<p align="center">
  <a href="https://github.com/vuejs/vue">
    <img src="https://img.shields.io/badge/vue-2.6.10-brightgreen.svg" alt="vue">
  </a>
</p>

## 简介

基于vue 2.6.11。功能，聊天、通讯录。需要配合接口服务运行。<br>

## 插件截图

引入插件后，手动控制 IM界面 显示/隐藏 <br>

<img src="https://raw.githubusercontent.com/illusionriver/pictures/main/im-ui-screen.png" alt="">

## 安装插件

```cmd
# 使用npm 
npm i plugins-huansi-im-ui --save
```

## 引入组件

``` javascript
//需要安装依赖包 package.json
"lemon-imui": "^1.7.4",
"mqtt": "^4.3.7",

// 在main.js引入

import LemonIMUI from 'lemon-imui';
import 'lemon-imui/dist/index.css';

Vue.use(LemonIMUI);

import {HIM} from 'plugins-huansi-im-ui';

Vue.use(HIM);

//需在页面调起IM之前 在sessionStorage写入下面的三个值
sessionStorage.setItem(
    'IM_TOKEN',
    'eyJhbGciOiJSUzI1N...'
)
sessionStorage.setItem('IM_API_URL', 'http://im-service.net')
sessionStorage.setItem('IM_BROKER_URL', 'ws://ws.test.service.net/mqtt')

```

## 使用组件

``` javascript
//可以通过 Button 来隐藏显示 通讯窗口

<template>
    <div>
          <HIM :IMWidth="700" :IMHeight="500"></HIM>
    </div>
</template>

```
