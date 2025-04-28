<template>
    <n-data-table :bordered="true" :single-line="false" :columns="table_columns" :data="table_data" />
</template>

<script setup>
import { reactive, ref, onMounted, watchEffect, computed, h, } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import {timestampToTime} from "@/utils/DateUtils"
import { NButton, NSpace,NDataTable,NImage } from 'naive-ui';

const cdnUrl = "/"

const props = defineProps({
    columns: {
        type: Array,
        required: true,
    },
    data: {
        type: Array,
        required: true
    },
})

const table_data = ref([])
const table_columns = ref([])
const subKeys = ref([])

watchEffect(() => {
    // let subKey = props.subKey;
    // console.log("props.data:", props.data)
    // console.log("props.columns", props.columns)
    // TODO 权限过滤
    // props.columns = props.columns.filter(item => {
    //     if (item.permission) {
    //         return permissionStore.existPermission(item.permission)
    //     } else {
    //         return true
    //     }
    // })

    let tmp_subKeys = []
    for (let item of props.columns) {
        // console.log("item:", item)
        if (item.key && item.key.indexOf(".") != -1) {
            tmp_subKeys.push(item.key.split(".")[0])
        }
    }
    subKeys.value = [...new Set(tmp_subKeys)]
    console.log("subKeys:", subKeys.value)
    let subKey = subKeys.value.length > 0 ? subKeys.value[0] : null // 默认第一个,目前只支持一个
    table_data.value = []
    table_columns.value = []

    if (subKey) {
        let $idx = 0;
        for (let d of props.data) {
            let idx = 0;
            // console.log("d:", d[subKey])
            if (d[subKey].length > 0) {
                for (let sub of d[subKey]) {
                    let subVal = {}
                    for (let key in sub) {
                        subVal[`${subKey}.${key}`] = sub[key]
                    }
                    let tmp = Object.assign({}, d, subVal);
                    tmp["$source"] = d;
                    tmp["$idx"] = $idx;
                    tmp["key"] = tmp["id"];
                    tmp["_idx"] = idx++;
                    tmp["empty"] = false;

                    // console.log("tmp:", tmp)
                    table_data.value.push(tmp)
                }
            } else {
                let subVal = {}
                // console.log("props.columns:", props.columns)
                for (let col of props.columns) {
                    if(col.key && col.key.indexOf(subKey) == 0){
                        subVal[`${col.key}`] = null
                    }
                }
                // console.log("subVal:", subVal)
                let tmp = Object.assign({},d, subVal);
                tmp["$source"] = d;
                tmp["$idx"] = $idx;
                tmp["key"] = tmp["id"];
                tmp["_idx"] = idx++;
                tmp["empty"] = true;
                console.log("tmp:", tmp)

                table_data.value.push(tmp)
            }

            $idx++;
        }
    } else {
        for (let d of props.data) {
            d["key"] = d["id"];
            d["_idx"] = 0;
            d["empty"] = false;
            table_data.value.push(d)
        }
    }

    for (let item of props.columns) {
        if (item.visible != false) {
            if(!item.render ){
                if(item.format){
                    item.render = (row) => {
                        return timestampToTime(row[item.key],item.format)
                    }
                }else if(item.type == "image"){
                    item.render = (row) => {
                        let imageTags = []
                        for(let imgInfo of row[item.key]){
                            console.log(imgInfo)
                            imageTags.push(h(NImage, {
                                src: cdnUrl + imgInfo.path,
                                lazy:true,
                                "object-fit":"cover",
                                width:"100",
                                height:"100",
                            }))
                        }
                        return h("div", {}, imageTags)
                    }
                }else if(item.type == "array"){
                    if(item.options){
                        
                        item.render = (row) => {
                            if(!row[item.key]){return ""}
                            let options = item.options.value
                            let res = []
                            for(let val of row[item.key]){
                                let findVals = options.filter(item => item.value == val)
                                if(findVals.length > 0){
                                    res.push(findVals[0].label)
                                }
                            }
                            return res.join(",")
                        }

                    }else{
                        item.render = (row) => {
                            return row[item.key].join(",")
                        }
                    }
                    
                }else if(item.options){
                    item.render = (row) => {
                        if(!row[item.key]){return ""}
                        let options = item.options.value
                        let findOptions = options.filter(opt => opt.value == row[item.key])
                        return findOptions.length > 0 ? findOptions[0].label : ""
                    }
                }

            }
            // console.log("item:", item)
            table_columns.value.push({
                title: item.title,
                key: item.key,
                width: item.width,
                align: item.align,
                render: item.render,
                visible: item.visible,
                rowSpan: (rowData, rowIndex) => {
                    if (subKey == null || (item.key && item.key.indexOf(subKey) == 0)) {
                        return 1;
                    } else {
                        return rowData[subKey].length > 0 ? rowData[subKey].length : 1;
                    }
                },
            })
        }
    }
    // console.log("table_data", table_data.value)
    // console.log("table_columns", table_columns.value)

})



</script>

<style lang="scss" scoped></style>