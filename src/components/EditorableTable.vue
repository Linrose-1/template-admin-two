<!-- 
    用法: editor-> 开启编辑模式, type->编辑器类型, options->编辑器选项
columns = [
    { title: "id", key: "id", },
    {title: "供应商", key: "supplierId", editor:true, type:"select",options:[...optionsStore.supplierData]},
    { title: "订单备注", key: "orderRemark", editor:true ,type:"textarea"},
]
 -->

<template>
    <AutoTable :columns="table_columns" :data="data" :pagination="pagination" :bordered="false" />
</template>

<script setup lang="jsx">
import { reactive, ref, onMounted, watchEffect, computed, h,  onUpdated } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { NButton, NInput, NInputNumber, NPopover, 
    NSelect, NSpace, NTab, NTag,NCascader, NDatePicker ,NSwitch } from 'naive-ui';

import UploadButton from './UploadButton.vue'
import DynamicInput from './DynamicInput.vue'
import AutoTable from './AutoTable.vue';

const props = defineProps({
    columns: {
        type: Array,
        required: true
    },
    data: {
        type: Array,
        required: true
    },
})

const testVal = ref('test')

// const table_columns = ref(props.columns)
const table_columns = computed(() => {
    let ret_val = []
    for (let col of props.columns) {
        console.log("col",col)
        if(col.hide){ // 隐藏列
            continue
        }
        if (col.editor && col.type != "label") {
            let editorWidget = null // 编辑器组件
            col.resizable = true
            col.render = (_row,index) => {
                let row = _row["$source"] || _row
                let key = col.key

                if(key.indexOf(".")>0){
                    let keys = key.split(".")
                    row = row[keys[0]][_row["_idx"]]
                    key = keys[1]
                    if(!row){
                        return ""
                    }
                }

                if (col.type == "select") {
                    // <n-select value={row[key]} disabled={col.disabled} on-update:value={(val) => { onValueUpdated(val, row, col,key) }} options={col.options} filterable={true}></n-select> 
                    editorWidget = h(NSelect, { value: row[key],
                                disabled: col.disabled,
                                'on-update:value': (val) => onValueUpdated(val, row, col, key),
                                options: col.options,
                                filterable: true
                            });
                }else if (col.type == "upload") { 
                    editorWidget = h(UploadButton, {
                            value: row[key],
                            'onUpdate:value': (val) => onValueUpdated(val, row, col, key)
                        });
                } else if (col.type == "multiselect") {
                    editorWidget = h(NSelect, { value: row[key], disabled: col.disabled, "on-update:value": (val) => { onValueUpdated(val, row, col,key) }, options: col.options, multiple: true, filterable: true }, {})
                } else if (col.type == "inputnumber") {
                    editorWidget = h(NInputNumber, { value: row[key], disabled: col.disabled, "on-update:value": (val) => { onValueUpdated(val, row, col,key) }, options: col.options }, {})
                } else if (col.type == "textarea") {
                    editorWidget = h(NInput, { value: row[key], disabled: col.disabled, "on-update:value": (val) => { onValueUpdated(val, row, col,key) }, type: "textarea" }, {})
                }else if(col.type == "switch"){
                    editorWidget = h(NSwitch, { value: row[key], disabled: col.disabled, "on-update:value": (val) => { onValueUpdated(val, row, col,key) } }, {})
                } else if(col.type == "cascader"){
                    editorWidget = h(NCascader, { value: row[key], disabled: col.disabled, "on-update:value": (val) => { onValueUpdated(val, row, col,key) }, options: col.options, 
                    multiple: true, filterable: true ,"expand-trigger":true ,
                    clearable:true ,cascade:true ,
                    "show-path":true,
                    "clear-filter-after-select":true,
                    "on-update:value": (val) => { onValueUpdated(val, row, col,key) },
                    "check-strategy":"child"}, {})
                    
                } else if(col.type == "onecascader"){
                    editorWidget = h(NCascader, { value: row[key], disabled: col.disabled, "on-update:value": (val) => { onValueUpdated(val, row, col,key) }, options: col.options, 
                    multiple: false, filterable: true ,"expand-trigger":true ,
                    clearable:true ,cascade:true ,
                    "show-path":true,
                    "clear-filter-after-select":true,
                    "on-update:value": (val) => { onValueUpdated(val, row, col,key) },
                    "check-strategy":"child"}, {})
                    
                }else if(col.type == "date"){
                    editorWidget = h(NDatePicker, { value: row[key], disabled: col.disabled, "on-update:value": (val) => { onValueUpdated(val, row, col,key) }, type: "datetime" }, {})
                }else if(col.type == "dynamicInput"){
                    editorWidget =  h(DynamicInput, { editorEvents: col.editorEvents, headerFormInfo: col.headerFormInfo,
                        editroInfo: col.editroInfo, headerFormInline: col.headerFormInline,
                        headerForm: col.headerForm, addButtonName: col.addButtonName,
                        addButtonEvent: col.addButtonEvent, inline: col.inline, table: col.table,
                        width: col.width, formInfo: col.formInfo, formData: row[key],
                        onAddEvent: col.onAddEvent, onDelEvent: col.onDelEvent, onUpEvent: col.onUpEvent,
                        disabled: col.disabled, editroAble: col.editroAble }, {})
                }else if(col.type == "render"){
                    editorWidget = col.myRender(row,index, col,key,exportInfos)
                } else {
                    editorWidget = h(NInput, { value: row[key], disabled: col.disabled, "on-update:value": (val) => { onValueUpdated(val, row, col,key) }, }, {})
                }

                return h(NPopover, { trigger: "hover", placement: "top" }, { // 提示原来的值
                    trigger: () => {
                        return editorWidget
                    },
                    default: () => {
                        if (col.type == "select" || col.type == "multiselect") {
                            col.options.forEach((option) => {
                                if (option.value == row[key] && !row[key + "_source"]) {
                                    row[key + "_source"] = option.label
                                }
                            })
                        } else {
                            if (!row[key + "_source"]) {
                                row[key + "_source"] = row[key]
                            }
                        }
                        row[key + "_source"] = row[key + "_source"] || "无"
                        return h("div", {}, "原值:" + row[key + "_source"])
                    }
                })

            }
        }
        ret_val.push(col)
    }
    return ret_val
})


const exportInfos = {
    setValue: (idx,key, value) => {
        // console.log(key, value)
        props.data[idx][key] = value
    },
    getValue: (idx,key) => {
        return props.data[idx][key]
    },
    hideItem: (key) => {
        if (!Array.isArray(key)) {
            key = [key]
        } else {
            exportInfos.showAll()
        }
        key.forEach(fkey => {
            for (let item of table_columns) {
                if (item.key == fkey) {
                    item.hide = true
                    break
                }
            }
        })
    },
    showAll: () => {
        for (let item of table_columns) {
            item.hide = false
        }
    },
    showItem: (key) => {
        if (!Array.isArray(key)) {
            key = [key]
        }
        key.forEach(fkey => {
            for (let item of table_columns) {
                if (item.key == fkey) {
                    item.hide = false
                    break
                }
            }
        })
    },
}

// 递归查找选中的数据,返回单个数据
function findSelectData(options,value){
    for(let item of options){
        if(item.value == value){
            return item
        }
        if(item.children){
            let ret = findSelectData(item.children,value)
            if(ret){
                return ret
            }
        }
    }
    return null
}

const onValueUpdated = (val, row, col,key) => {
    row[key] = val;
    if (col.onchange) {
        if (col.options) {
            let exportFuncs = {
                setValue: (key, value) => {
                    row[key] = value
                },
                getValue: (key) => {
                    return row[key]
                },
            }
            let selectOptionInfo = findSelectData(col.options,val)
            console.log(selectOptionInfo)
            col.onchange(selectOptionInfo,exportFuncs,val,row)
        }
    }
}

function onValueUpdatedUnAutoChange(val, row, col,key){
    row[key] = val.id;
    if (col.onchange) {
        if (col.options) {
            let exportFuncs = {
                setValue: (key, value) => {
                    row[key] = value
                },
                getValue: (key) => {
                    return row[key]
                },
            }
            let selectOptionInfo = findSelectData(col.options,val)
            console.log(selectOptionInfo)
            col.onchange(selectOptionInfo,exportFuncs,val.id,val,row)
        }
    }
}

onMounted(() => {
    
})

defineExpose(exportInfos)

</script>

<style lang="scss" scoped></style>