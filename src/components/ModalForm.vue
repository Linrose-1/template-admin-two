<template>
    <n-modal v-model:show="showModal" preset="card" :title="options.title" :style="{width:options.width}">
        <n-space vertical>
            <n-ellipsis expand-trigger="click" line-clamp="2" :tooltip="true">
                {{ options.desc }}
            </n-ellipsis>
            <auto-form ref="afForm" :form-info='_formInfo' :inline="_inline" :labelPlacement="labelPlacement"
                v-model:form-data="_formData" label-placement="left"></auto-form>
        </n-space>
    </n-modal>
</template>

<script setup>

/**
const modalForm = inject('modalForm')
modalForm.value.showForm({
    title: "新增版本",
    formInfo: [
        { type: "input", label: "芯片版本名称", key: "name" },
        { type: "input", label: "芯片版本昵称", key: "nickName" },
        { type: "input", label: "芯片设计年月", key: "description" },
        { type: "input", label: "芯片版本描述", key: "remark" },
        { type: "button", label: "提交", click: (item, formData) => { submitSaveVersion() } }
    ],
    formData: addChipTypeVersionForm.value,
})

 */

import { reactive, ref, onMounted, onUnmounted, getCurrentInstance, h,  nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { NButton, NSpace,NModal,NEllipsis } from 'naive-ui';
import AutoForm from '@/components/AutoForm.vue';

const _formData = ref({})
const _formInfo = ref([])
const _inline = ref(false)
const options = reactive({ onclose: null, title: '无标题', desc: '',width:'80vh' })
const showModal = ref(false)
const afForm = ref(null)

onMounted(() => {
    console.log(afForm)
})

const close = () => {
    showModal.value = false
    if (options.onclose) {
        options.onclose()
    }
}

defineExpose({
    close: close,
    setValue: (key, value) => {
        nextTick(() => {
            afForm.value.setValue(key, value)
        })
    },
    getValue: (key) => {
        return afForm.value.getValue(key)
    },
    hideItem: (key) => {
        nextTick(() => {
            afForm.value.hideItem(key)
        })
    },
    showItem: (key) => {
        nextTick(() => {
            afForm.value.showItem(key)
        })
    },
    showForm({ title, desc, formData, formInfo, inline = false, onclose = null, width="80vh"}) {
        formInfo.forEach(element => {
            element.hide = false
        });
        _formData.value = formData
        _formInfo.value = formInfo
        // console.log(_formData.value, _formInfo.value, inline)
        _inline.value = inline
        showModal.value = true
        options.onclose = onclose
        options.desc = desc
        options.width = width
        if (title) {
            options.title = title
        }
    }
})

</script>

<style lang="scss" scoped>
.hover {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
}

.panel {
    margin: 0 auto;
    width: 60vw;
    min-height: 50vh;
    background-color: #FFF;
    border-radius: 10px;
}

.close {
    float: right;
    margin-right: 10px;
    margin-top: 10px;
    cursor: pointer;
    width: 20px;
    height: 20px;
    padding: 8px;
    text-align: center;
}

.close:hover {
    background-color: #ccc;
    border-radius: 50%;
}
</style>