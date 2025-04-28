<template>
    <n-space :style="{ 'display': props.visible ? 'block' : 'none' }">
        <n-popconfirm  positive-text="确定" negative-text="取消" @positive-click="onPositiveClick">
            <template #trigger>
                <n-button :disabled="props.disabled" :ghost="props.ghost" :round="props.round" :size="props.size" :type="props.type">{{ props.title }}</n-button>
            </template>
            {{ props.content }}
        </n-popconfirm>
    </n-space>
</template>

<script setup>
import { reactive, ref, onMounted, onUnmounted, getCurrentInstance, h, } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { NButton, NSpace,NPopconfirm } from 'naive-ui';
import axios from 'axios';

const emit = defineEmits(["confirm"])

const props = defineProps({
    comfirm: {
        type: Function,
        required: false
    },
    confirm:{
        type: Function,
        required: false
    },
    disabled: {
        type: Boolean,
        required: false,
        default: false
    },
    size: {
        type: String,
        required: false,
        default: "small"
    },
    title: {
        type: String,
        required: false,
        default: "删除"
    },
    content: {
        type: String,
        required: false,
        default: "确认删除吗？"
    },
    ghost: {
        type: Boolean,
        required: false,
        default: true
    },
    type:{
        type: String,
        required: false,
        default: "error"
    },
    round: {
        type: Boolean,
        required: false,
        default: false
    },
    visible: {
        type: Boolean,
        required: false,
        default: true
    },
})

function onPositiveClick(){
    if(props.comfirm){
        props.comfirm()
    }
    if(props.confirm){
        props.confirm()
    }
    emit("confirm")
    
}

</script>

<style lang="scss" scoped></style>