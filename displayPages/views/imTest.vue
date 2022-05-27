<template>
    <div>
        <div>
            <button style="border-radius: 10px !important;margin-bottom: 10px;" @click="viewHIM">{{ viewBtn }}</button>
        </div>
        <div v-show="viewIM">
            <HIM :IMWidth="700" :IMHeight="500"></HIM>
        </div>
    </div>
</template>

<script>

export default {
    name: 'HIM-test',
    data() {
        return {
            viewIM: false,
            viewBtn: '打开'
        }
    },
    methods: {
        viewHIM() {
            this.viewIM = !this.viewIM
            this.viewBtn = this.viewIM ? '隐藏' : '打开'
        }
    },
}
</script>
