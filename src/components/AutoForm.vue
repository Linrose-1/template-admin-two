<template>
    <editorable-table :columns="table_columns" :data="table_data" v-if="props.table"></editorable-table>
    <template v-for="(cformInfo,gIndex) in group_form_info">
        <LayoutForm v-if="!props.table && isShowGroup(cformInfo)" :inline="inline" :label-width="labelWidth" :model="formData" :rules="rules"
            :label-placement="labelPlacement" :cols="props.col" :groupName="cformInfo.name">
                <template v-for="(item, index) in cformInfo.value">
                    <component :is="props.col > 1 ? NFormItemGi:NFormItem" :span="getSpan(inline,item,cformInfo.value.length)" :label="item.type == 'button' ? ' ' : item.label" :path="item.key"
                        v-show="visibleComputed(item, formData)">
                        <slot :name="item.key" :item="item" :form-data="formData">
                        
                            <n-input v-model:value="formData[item.key]" v-if="item.type == 'input'" @keyup.enter="doEnter(item,cur_form_info)"
                                :placeholder="item.placeholder" clearable :disabled="item.disabled"
                                v-permission="item.permission" @update:value="(value) => { selectOnUpdate(value, item) }"/>

                            <n-tag v-if="item.type == 'label'" v-permission="item.permission"> {{ formData[item.key] == "" ? "无"
                                : formData[item.key] }} </n-tag>

                            <n-input v-model:value="formData[item.key]" v-if="item.type == 'textarea'" type="textarea"
                                :placeholder="item.placeholder" clearable :disabled="item.disabled"
                                v-permission="item.permission" style="width:100%" @update:value="(value) => { selectOnUpdate(value, item) }" />

                            <n-switch v-model:value="formData[item.key]" v-if="item.type == 'switch'" :disabled="item.disabled"
                                v-permission="item.permission" @update:value="(value) => { selectOnUpdate(value, item) }"/>

                            <dynamic-input :editorEvents="item.editorEvents" :header-form-info="item.headerFormInfo"
                                :editroInfo="item.editroInfo" :headerFormInline="item.headerFormInline"
                                :headerForm="item.headerForm" :addButtonName="item.addButtonName"
                                :add-button-event="item.addButtonEvent" :inline="item.inline" :table="item.table"
                                :width="item.width" :form-info="item.formInfo" :form-data="formData[item.key]"
                                :onAddEvent="item.onAddEvent" :onDelEvent="item.onDelEvent" :onUpEvent="item.onUpEvent"
                                v-if="item.type == 'dynamicInput'" :disabled="item.disabled" :editro-able="item.editroAble"
                                v-permission="item.permission" :col="item.col"/> 

                            <n-input-number v-model:value="formData[item.key]" v-if="item.type == 'inputnumber'"
                                :placeholder="item.placeholder" :max="item.max ? item.max : 9999999999"
                                v-permission="item.permission" :min="item.min ? item.min : 0" clearable
                                :disabled="item.disabled" style="width:100%" />

                            <n-auto-complete v-model:value="formData[item.key]" :options="item.options"
                                v-permission="item.permission" :placeholder="item.placeholder"
                                :render-label="(option) => { return renderLabel(item, option) }"
                                v-if="item.type == 'autoComplete'" :disabled="item.disabled" />

                            <n-select v-model:value="formData[item.key]" v-if="item.type == 'select'" :tag="item.tag" clearable
                                :style="{ width: item.width ? item.width : '320px' }" :placeholder="item.placeholder"
                                v-permission="item.permission" :render-label="(option) => { return renderLabel(item, option) }"
                                :options="item._options" @update:show="initAndRefreshOptions(item)" style="min-width: 120px;"
                                filterable :disabled="item.disabled"
                                @update:value="(value, selectOptionInfo) => { selectOnUpdate(selectOptionInfo, item) }" />

                            <n-select v-model:value="formData[item.key]" v-if="item.type == 'multiselect'"
                                :style="{ width: item.width ? item.width : '320px' }" v-permission="item.permission"
                                :render-label="(option) => { return renderLabel(item, option) }" :placeholder="item.placeholder"
                                clearable :options="item._options" @update:show="initAndRefreshOptions(item)"
                                style="min-width: 120px;" filterable multiple :disabled="item.disabled" />

                            <n-cascader v-if="item.type == 'onecascader'" v-model:value="formData[item.key]" clearable
                                v-permission="item.permission" expand-trigger="hover" :options="item._options" :cascade="true"
                                :check-strategy="item['checkStrategy'] ? item['checkStrategy'] : 'child'" :show-path="true"
                                :filterable="true" :clear-filter-after-select="true" :virtual-scroll="false"
                                @update:value="(value, selectOptionInfo) => { selectOnUpdate(selectOptionInfo, item) }"
                                :render-label="(option) => { return renderLabel(item, option) }"
                                @update:show="initAndRefreshOptions(item)">
                            </n-cascader>

                            <RichTextEditor v-model:value="formData[item.key]" v-if="item.type == 'richtext'" :placeholder="item.placeholder"
                                clearable :disabled="computeDisable(item,formData)"  :height="item.height"></RichTextEditor>

                            <UploadButton v-if="item.type == 'upload'" v-model:value="formData[item.key]"
                                :disabled="item.disabled" v-permission="item.permission">
                            </UploadButton>

                            <n-color-picker v-model:value="formData[item.key]" v-if="item.type == 'color'" @keyup.enter="doEnter(item,cur_form_info)"
                                :placeholder="item.placeholder" clearable :disabled="item.disabled"
                                v-permission="item.permission" @update:value="(value) => { selectOnUpdate(value, item) }"/>

                            <n-cascader v-if="item.type == 'cascader'" v-model:value="formData[item.key]" multiple clearable
                                expand-trigger="hover" :options="item._options" :cascade="true" check-strategy="child"
                                :show-path="true" :filterable="true" :clear-filter-after-select="true"
                                v-permission="item.permission"
                                @update:value="(value, selectOptionInfo) => { selectOnUpdate(selectOptionInfo, item) }"
                                @update:show="initAndRefreshOptions(item)" />

                            <n-date-picker v-model:value="formData[item.key]" v-if="item.type == 'date'" type="datetime"
                                clearable v-permission="item.permission" :disabled="item.disabled" @update:value="(value) => { selectOnUpdate(value, item) }"/>
                            <n-date-picker v-model:value="formData[item.key]" :disabled="item.disabled"
                                :shortcuts="rangeShortcuts" v-permission="item.permission" v-if="item.type == 'daterange'"
                                type="daterange" clearable @update:value="(value) => { selectOnUpdate(value, item) }"/>

                            <n-checkbox-group v-model:value="formData[item.key]" v-if="item.type == 'checkbox'"
                                v-permission="item.permission" :disabled="item.disabled"
                                @update:value="(value, selectOptionInfo) => { selectOnUpdate(selectOptionInfo, item) }">
                                <n-space item-style="display: flex;">
                                    <n-checkbox size="large" v-for="(cb, cbi) in item.options" :value="cb.value"
                                        v-permission="cb.permission" :label="cb.label" />
                                </n-space>
                            </n-checkbox-group>


                            <n-button v-if="item.type == 'button'" :disabled="item.disabled" attr-type="button"
                                @click="item.click(item, formData)" :type="item.style ? item.style : 'primary'"
                                v-permission="item.permission">
                                {{ item.label }}
                            </n-button>

                            <n-space v-if="item.type == 'buttonGroup'" v-permission="item.permission">
                                <template v-for="(b, index2) in item.buttons">
                                    <n-button v-if="b.type == 'button'" attr-type="button" @click="b.click(item, formData)"
                                        :type="b.style ? b.style : 'primary'" :disabled="b.disabled"
                                        v-permission="b.permission">
                                        {{ b.label }}
                                    </n-button>
                                </template>
                            </n-space>

                            

                        </slot>
                    </component>
                </template>

        </LayoutForm>
    </template>

</template>


<script setup>

import { reactive, ref, onMounted, onBeforeMount, computed, onUnmounted, getCurrentInstance, h ,watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import LayoutForm from './LayoutForm.vue';
import EditorableTable from './EditorableTable.vue';
import UploadButton from './UploadButton.vue';
import RichTextEditor from './RichTextEditor.vue';
import DynamicInput from './DynamicInput.vue';
import { NButton, NSpace, NGrid,NCascader,NColorPicker,
    NSelect,NAutoComplete,NTag,NSwitch,NInputNumber , 
    NInput,NCheckboxGroup,NFormItemGi,NFormItem,
    NCheckbox,NDatePicker } from 'naive-ui';


const visibleComputed = computed(() => {
    return (item, formData) => {
        // 判断item.visible 是否函数
        if (typeof item.visible == 'function') {
            return item.visible(item, formData, exportInfos)
        }
        return item.visible == undefined ? true : item.visible
    }
})

const rangeShortcuts = {
    近1天: () => {
        const cur = new Date().getTime()
        return [cur - 24 * 60 * 60 * 1000, cur]
    },
    近3天: () => {
        const cur = new Date().getTime()
        return [cur - 3 * 24 * 60 * 60 * 1000, cur]
    },
    近7天: () => {
        const cur = new Date().getTime()
        return [cur - 7 * 24 * 60 * 60 * 1000, cur]
    },
    近30天: () => {
        const cur = new Date().getTime()
        return [cur - 30 * 24 * 60 * 60 * 1000, cur]
    },
    近90天: () => {
        const cur = new Date().getTime()
        return [cur - 90 * 24 * 60 * 60 * 1000, cur]
    },
    近180天: () => {
        const cur = new Date().getTime()
        return [cur - 180 * 24 * 60 * 60 * 1000, cur]
    },
    近365天: () => {
        const cur = new Date().getTime()
        return [cur - 365 * 24 * 60 * 60 * 1000, cur]
    },

}

// interface FormItem {
//     key: string,
//     label: string,
//     type: string,
//     placeholder?: string,
//     options?: Array<{ label: string, value: string }>,
//     click?: Function,
//     required?: boolean,
//     max?: number,
//     min?: number,
// }

const props = defineProps({
    name: {
        type: String,
        default: ""
    },
    formInfo: {
        type: Array,
        required: true
    },
    formData: {
        type: Object,
        required: true
    },
    inline: {
        type: Boolean,
        default: false
    },
    labelPlacement: {
        type: String,
        default: 'top'
    },
    labelWidth: {
        type: Number,
        default: 120
    },
    custom: {
        type: Boolean,
        default: false
    },
    table: {
        type: Boolean,
        default: false
    },
    col : {
        type: Number,
        default: -1
    }

})

const rules = ref({})
const table_columns = ref([])
const table_data = ref([])
const cur_form_info = ref([])

const renderLabel = (item, option) => {
    if (item.renderLabel) {
        return item.renderLabel(item, option)
    }
    const slots = {
        trigger: () => h('div', {style: {letterSpacing: '-1px'}},option.label)
    }
    return h('n-popover', { trigger: 'hover', vSlots: slots }, [
            h('div', null, option.label)
        ]);
}

const onUploadFinish = (file, event, formData, item) => {
    let responseData = JSON.parse((event?.target).response)
    formData[item.key] = responseData.file.path
    console.log(responseData)
    console.log(event)
    console.log('item', item)
}

function doEnter(item,formInfos) {
    function findFormInfoByName(name){
        for(let formInfo of formInfos){
            if(formInfo.key == name || formInfo.label == name){
                return formInfo
            }
        }
    }
    if (item.onEnter) {
        if(typeof item.onEnter == 'function'){
            item.onEnter()
        }else{
            let formInfo = findFormInfoByName(item.onEnter)
            if(formInfo){
                formInfo.click(formInfo,props.formData)
            }
        }
    }
    // console.log("doEnter", item,formInfo)
}

function initAndRefreshOptions(item) {
    //console.log(item)
    let formData = props.formData
    if (item.key == "daterange") {
        if (formData[item.key] && formData[item.key].length == 0) {
            formData[item.key] = [new Date().getTime() - 30 * 24 * 60 * 60 * 1000, new Date().getTime()]
        }
        console.log("daterange", formData[item.key])
    }
    if (!item.options) { return }
    //if item.options is a function , call it
    if (typeof item.options == 'function') {
        item._options = item.options()
    } else {
        item._options = item.options
    }
}

const computeDisable = computed(() => {
    return (item,formData) => {
        // 判断item.visible 是否函数
        if (typeof item.disabled == 'function') {
            return item.disabled(item,formData, exportInfos,props.parent)
        }
        return item.disabled == undefined ? false : item.disabled
    }
})

const onCreate = (item, formData) => {
    console.log(item, formData);
    // formData[item.key].push({name:'',value:''})
    // return {
    //     name: '',
    //     value: ''
    // }
}

function getSpan(inline,item,totalLength){
    if(item.span){
        return item.span
    }
    if(inline){
        return 24/totalLength
    }
    return 24
}

const exportInfos = {
    setValue: (key, value) => {

        console.log(key.toString(), props.formData[key])
        if (props.formData) {
            props.formData[key] = value
        }
    },
    getValue: (key) => {
        return props.formData[key]
    },
    hideItem: (key) => {
        if (!Array.isArray(key)) {
            key = [key]
        } else {
            exportInfos.showAll()
        }
        key.forEach(fkey => {
            for (let item of cur_form_info.value) {
                if (item.key == fkey) {
                    item.visible = false
                    break
                }
            }
        })
    },
    showAll: () => {
        cur_form_info.value.forEach(item => {
            item.hide = false
        })
    },
    showItem: (key) => {
        if (!Array.isArray(key)) {
            key = [key]
        }
        key.forEach(fkey => {
            for (let item of cur_form_info.value) {
                if (item.key == fkey) {
                    item.visible = true
                    break
                }
            }
        })
    },
    showItemByLabel: (label) => {
        if (!Array.isArray(label)) {
            label = [label]
        }
        label.forEach(flabel => {
            for (let item of cur_form_info.value) {
                console.log(item)
                if (item.label == flabel) {
                    item.visible = true
                    break
                }
            }
        })
    },
    hideItemByLabel: (label) => {
        if (!Array.isArray(label)) {
            label = [label]
        }
        label.forEach(flabel => {
            for (let item of cur_form_info.value) { 
                if (item.label == flabel) {
                    item.visible = false
                    break
                }
            }
        })
    },
}

const selectOnUpdate = (selectOptionInfo, item) => {
    //console.log("selectOnUpdate----", selectOptionInfo, item)
    if (item.onchange) {
        item.onchange(selectOptionInfo, exportInfos, props.name)
    }
    if (item.onChange) {
        item.onChange(selectOptionInfo, exportInfos, props.name)
    }
    if (item.change) {
        item.change(selectOptionInfo, exportInfos, props.name)
    }
    // console.log(selectOptionInfo,item,formInfo,exportInfos)
}


const group_form_info = ref([])

function isShowGroup(groupInfo){
    for(let item of groupInfo.value){
        if(item.visible){
            return true
        }
    }
    return false
}

function refreshFormInfo(){
    group_form_info.value = []
    cur_form_info.value = props.formInfo
    // console.log(props.formInfo)
    if (props.formInfo instanceof Function) {
        cur_form_info.value = props.formInfo()
        // console.log("cur_form_info.value",cur_form_info.value)
    }

    // 切分组 --start
    let lastGroup = {name:'default',value:[]}
    // console.log(cur_form_info.value)
    for(let _formInfo of cur_form_info.value){
        let curGroupName = "default"
        if(_formInfo.group){
            curGroupName = _formInfo.group
        }
        if(lastGroup.name != curGroupName){
            if(lastGroup.value.length != 0){
                group_form_info.value.push(lastGroup)
            }
            lastGroup = {name:curGroupName,value:[]}
        }
        lastGroup.value.push(_formInfo)
    }

    if(lastGroup.value.length != 0){
        group_form_info.value.push(lastGroup)
    }

    // 切分组 --end
    table_columns.value = []
    if (props.table) {
        table_columns.value.splice(0, table_columns.value.length)
        for (let item of cur_form_info.value) {
            initAndRefreshOptions(item)
            table_columns.value.push({
                editor: true,
                title: item.label,
                key: item.key,
                type: item.type,
                disabled: item.disabled,
                options: item.options,
            })
        }
        table_data.value = [props.formData]
    }

    cur_form_info.value.forEach(item => {
        //if type contains 'date'
        initAndRefreshOptions(item)

        // if (item.type.indexOf('date') > -1) {
        //     if ((props.formData[item.key] == null || props.formData[item.key] == "")) {
        //         props.formData[item.key] = new Date().getTime()
        //     } else {
        //         props.formData[item.key] = Number(props.formData[item.key])
        //     }
        // }
        if (item.required) {
            rules.value[item.key] = [{
                required: true,
                message: `${item.label}不能为空`,
                trigger: ['input', 'blur']
            }]
        }
        if (item.visible == undefined) {
            item.visible = true

            if (item.hide != undefined) {
                item.visible = !item.hide
            }
        }

        if (!item.placeholder) {
            item.placeholder = `请输入${item.label}`
        }
        if (!item.options) {
            item.options = [{ label: `请选择${item.label}`, value: "" }]
        }
        if (!item.inline) {
            item.inline = false
        }

    })
}

watch(() => props.formInfo, () => {
    refreshFormInfo()
})

onBeforeMount(async () => {
    refreshFormInfo()
    
})

defineExpose(exportInfos)

</script>

<style lang="scss"></style>