<template>
    <!-- 
//use in other component -> 如何在其他组件中使用
import DynamicInput from '@/components/DynamicInput/DynamicInput.vue';
<dynamic-input :form-info="formInfo" :form-data="formData"></dynamic-input>

const formInfo = ref([
    { type: 'input', key: 'name', label: '名称', placeholder: '请输入名称', required: true },
    { type: 'input', key: 'code', label: '编码', placeholder: '请输入编码', required: true },
])

const formData = ref([
    { name: 'name', code: 'name' },
    { name: 'code', code: 'code' },
])

     -->
    <n-space vertical style="width:100%">
        <n-space>
            <n-button type="primary" @click="addRow" v-if="props.editroInfo.includes('ADD')">{{ addButtonName }}</n-button>
            <auto-form v-if="props.headerFormInfo.length > 0" :inline="props.headerFormInline"
                :form-info='props.headerFormInfo' v-model:form-data="props.headerForm" label-placement="none">
            </auto-form>
            <n-switch v-model:value="isFolder" style="margin-top:5px">
                <template #checked>
                    折叠({{ props.formData.length }})
                </template>
                <template #unchecked>
                    展开({{ props.formData.length }})
                </template>
            </n-switch>
        </n-space>
        <div v-if="!isFolder">
            <editorable-table :scroll-x="props.width" v-if="props.table" :columns="table_columns"
                :data="formData"></editorable-table>
            <template v-else>
                <n-card style="margin-top: 8px;">
                    <n-tabs type="card" placement="top" :closable="false"  :default-value="0" @close="delRow" v-model:value="currentTabName">
                        <n-tab-pane v-for="(row, lineIndex) in props.formData" :name="lineIndex" :tab="getTabName(row,lineIndex)" :key="lineIndex">
                            <auto-form :inline="props.inline" :form-info='props.formInfo' :col="props.col"
                                v-model:form-data="props.formData[lineIndex]" :labelWidth="props.labelWidth"
                                :label-placement="props.inline ? 'top' : labelPlacement" :parent="props.parent"></auto-form>
                            <n-space :vertical="!props.inline" v-if="props.editroAble">
                                <n-button-group>
                                    <n-button v-if="testEditorInfo('COPY')" round @click="copyRow(lineIndex)">
                                        复制
                                    </n-button>
                                    <DeleteButton v-if="testEditorInfo('DEL')" title="删除" ghost
                                        :comfirm="() => { delRow(lineIndex) }" type="default" size="medium">
                                    </DeleteButton>
                                    <n-button v-if="testEditorInfo('UP')" round @click="upRow(lineIndex)">
                                        前移
                                    </n-button>
                                    <n-button v-if="testEditorInfo('DOWN')" round @click="downRow(lineIndex)">
                                        后移
                                    </n-button>
                                    <n-button v-if="testEditorInfo('ADD')" round @click="addRow(lineIndex)">
                                        新增
                                    </n-button>
                                </n-button-group>
                            </n-space>
                        </n-tab-pane>
                    </n-tabs>
                </n-card>
            </template>
        </div>
    </n-space>
</template>

<script setup>
import { reactive, ref, onMounted, onUnmounted, getCurrentInstance, h, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { NButton, NSpace, NButtonGroup,
    NTabPane,NSwitch,NTabs,NCard } from 'naive-ui';
import DeleteButton from '@/components/DeleteButton.vue';
import AutoForm from './AutoForm.vue';
import EditorableTable from './EditorableTable.vue';

const props = defineProps({
    addButtonName: {
        type: String,
        default: '添加'
    },
    headerFormInfo: {
        type: Array,
        default: () => []
    },
    headerFormInline: {
        type: Boolean,
        default: true
    },
    headerForm: {
        type: Object,
        default: () => ({})
    },
    addButtonEvent: {
        type: Function,
        default: () => true
    },
    formInfo: {
        type: Array,
        default: () => []
    },
    formData: {
        type: Array,
        default: () => []
    },
    inline: {
        type: Boolean,
        default: true
    },
    labelPlacement: {
        type: String,
        default: 'left'
    },
    table: {
        type: Boolean,
        default: false
    },
    width: {
        type: Number,
        default: 0
    },
    editroAble: {
        type: Boolean,
        default: true
    },
    editroInfo: {
        type: Array,
        default: () => ['ADD', 'DEL', 'UP', 'DOWN',"COPY"]
    },
    editorEvents: {
        type: Array,
        default: () => []
    },
    onAddEvent: {
        type: Function,
        default: (event, item) => true
    },
    onDelEvent: {
        type: Function,
        default: (event, item) => true
    },
    onUpEvent: {
        type: Function,
        default: (event, item) => true
    },
    onDownEvent: {
        type: Function,
        default: (event, item) => true
    },
    col: {
        type: Number,
        default: 24
    }
})

const table_columns = ref([])
const table_data = ref([])
const isFolder = ref(false)
const currentTabName = ref(0)

const onUploadFinish = (file, event, formData, item) => {
    let responseData = JSON.parse((event?.target).response)
    formData[item.key] = responseData.file.path
    console.log(responseData)
    console.log(event)
    console.log('item', item)
}

function getTabName(row,index){
    if(props.formInfo.length == 0){return index+1}
    let mainCol = props.formInfo[0].key
    for(let info of props.formInfo){
        if(info.main){
            mainCol = info.key
        }
    }
    if(mainCol && row[mainCol] ){
        return `${index+1}.`+row[mainCol] 
    }else{
        return index + 1 
    }
}

function testEditorInfo(val) {
    // 判断props.editroInfo 是否是函数
    console.log("props.editroInfo", typeof props.editroInfo)
    if (typeof props.editroInfo === 'function') {
        return props.editroInfo().includes(val)
    }

    return props.editroInfo.includes(val)
}

watch(props.formInfo, () => {
    refreshTableColumns()
})

const refreshTableColumns = () => {
    if (props.table) {
        table_columns.value.splice(0, table_columns.value.length)

        for (let item of props.formInfo) {
            if (item.hide) continue;
            table_columns.value.push({
                ...item,
                editor: true,
                title: item.label,
                key: item.key,
                type: item.type,
                options: item.options,
                fixed: item.fixed,
                disabled: item.disabled,
                onchange: item.onchange,
                width: item.width,
                myRender: item.render,
                formInfo: item.formInfo,
            })
        }
        if (props.editroAble && props.editroInfo.length > 0) {
            // console.log("props.editroInfo", props.editroInfo)
            table_columns.value.push({
                title: '操作',
                width: 150,
                render: (row, index) => {
                    let lineIndex = row.$idx || index
                    let components = []
                    for (let event of props.editorEvents) {
                        components.push(h(NButton, {
                            type: 'primary',
                            size: 'tiny',
                            onClick: () => event.click(row, index, lineIndex)
                        }, {
                            default: () => event.label
                        }))
                    }
                    return h(NSpace, { vertical: false }, [
                        h(NSpace, {}, components),
                        h(NSpace, {}, [h(NButton, {
                            type: 'primary',
                            size: 'tiny',
                            ghost: true,
                            style: props.editroInfo.includes('UP') ? '' : 'display:none',
                            onClick: () => copyRow(lineIndex)
                        }, {
                            default: () => '复制'
                        }),
                        h(NButton, {
                            type: 'primary',
                            size: 'tiny',
                            ghost: true,
                            style: props.editroInfo.includes('UP') ? '' : 'display:none',
                            onClick: () => upRow(lineIndex)
                        }, {
                            default: () => '上移'
                        }),
                        h(NButton, {
                            type: 'primary',
                            size: 'tiny',
                            ghost: true,
                            style: props.editroInfo.includes('DOWN') ? '' : 'display:none',
                            onClick: () => downRow(lineIndex)
                        }, {
                            default: () => '下移'
                        }),
                        ]),
                        h(NSpace, {}, [
                        //     h(NButton, {
                        //     type: 'primary',
                        //     size: 'tiny',
                        //     ghost: true,
                        //     style: props.editroInfo.includes('ADD') ? '' : 'display:none',
                        //     onClick: () => addRow(lineIndex)
                        // }, {
                        //     default: () => '添加'
                        // }),
                        h(DeleteButton, { visible: props.editroInfo.includes('DEL'), comfirm: () => { console.log("DEL"); delRow(lineIndex) }, size: "tiny", ghost: true },),]),

                    ])
                }
            })
        }
        table_data.value = [props.formData]
        console.log("table_columns:", table_columns.value)
    }
}

onMounted(async () => {
    console.log(props.formInfo)
    refreshTableColumns()
    props.formInfo.forEach(item => {
        if (!item.placeholder) {
            item.placeholder = `请输入${item.label}`
        }
        if (!item.options) {
            item.options = [{ label: `请选择${item.label}`, value: "" }]
        }
    })
})

const addRow = (lineIndex = 0) => {
    console.log('addRow', lineIndex)
    if (!props.addButtonEvent()) return
    let newItem = props.formInfo.reduce((acc, cur) => {
        acc[cur.key] = null
        if (cur.type.includes('date')) {
            acc[cur.key] = new Date().getTime()
        } else if (cur.type == "dynamicInput") {
            acc[cur.key] = []
        }else if (cur.type == "fileDialog") {
            acc[cur.key] = []
        } else if (cur.type.includes("num")) {
            acc[cur.key] = 0
        }
        return acc
    }, {})
    if (props.onAddEvent('add', lineIndex)) {
        // props.formData.splice(lineIndex + 1, 0, newItem);
        props.formData.push(newItem)
    }
}

const delRow = (lineIndex) => {
    console.log('delRow', lineIndex) 
    if (props.onDelEvent('del', props.formData[lineIndex])) {
        props.formData.splice(lineIndex, 1)
    }
    currentTabName.value = 0
}

const upRow = (lineIndex) => {
    if (lineIndex === 0) return
    if (props.onUpEvent('up', props.formData[lineIndex])) {
        props.formData.splice(lineIndex - 1, 0, props.formData.splice(lineIndex, 1)[0])
    }
}

const downRow = (lineIndex) => {
    if (lineIndex === props.formData.length - 1) return
    if (props.onDownEvent('down', props.formData[lineIndex])) {
        props.formData.splice(lineIndex + 1, 0, props.formData.splice(lineIndex, 1)[0])
    }
}

const copyRow = (lineIndex) => {
    let newItem = JSON.parse(JSON.stringify(props.formData[lineIndex]))
    newItem.id = null
    props.formData.splice(lineIndex + 1, 0, newItem)
}

</script>

<style lang="scss" scoped></style>