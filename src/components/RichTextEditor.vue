<template>
    <div style="border: 1px solid #ccc">
        <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" />
        <Editor id="editor" style="overflow-y: hidden;" v-model="valueHtml" :defaultConfig="editorConfig"
            @onChange="onChange" @onCreated="handleCreated" :style="{ 'height': height ,'min-width':'350px'}" />
    </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { onBeforeUnmount, ref, shallowRef, onMounted, watch } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import axios from 'axios';

const emit = defineEmits(['update:value'])
const fileDialog = ref(null)
// const cdnUrl = useRuntimeConfig().public.CDN_URL;

const props = defineProps({
    value: {
        type: String,
        default: 'default'
    },
    disabled: {
        type: Boolean,
        default: false
    },
    height: {
        type: String,
        default: '500px'
    }
})

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// 内容 HTML
const valueHtml = ref('<p></p>')
let isInit = false

onMounted(() => {
    setTimeout(() => {
        valueHtml.value = props.value
        isInit = true
    }, 100)
})

watch(() => props.value, (newVal) => {
    valueHtml.value = newVal
})

function onChange(editor) {
    if(!isInit){
        return
    }
    emit('update:value', valueHtml.value)
    // let imgs = document.querySelectorAll('#editor img')

    // imgs.forEach((item) => {
    //     if (item.getAttribute("fixed") || item.getAttribute("src").indexOf("http") > -1) {
    //         return
    //     }
    //     item.setAttribute('src', cdnUrl + item.getAttribute('src'))
    //     item.setAttribute('fixed', true)
    // })

}


const toolbarConfig = { excludeKeys: 'fullScreen', }
const editorConfig = { placeholder: '请输入内容...', MENU_CONF: {} }

editorConfig.MENU_CONF['insertImage'] = {
    // onInsertedImage: (img) => {
    //     console.log('img',img)
    //     img["src"] = "rich_editor_image"
    // },
    // checkImage: (url) => {
    //     console.log('url',url)
    //     return true
    // },
    parseImageSrc: (url, image) => {
        console.log('url', url, image)
        return axios.defaults.baseURL + url
    }
}

editorConfig.MENU_CONF['editImage'] = {
    onUpdatedImage: (img) => {
        console.log('img', img)
    },
    checkImage: (url) => {
        console.log('url', url)
        return true
    },
    parseImageSrc: (url) => {
        console.log('url', url)
        return axios.defaults.baseURL + url
    }
}

async function imageUrlToBase64(url) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image to Base64:', error);
  }
}

// editorConfig.MENU_CONF['uploadImage'] = {
//     server: axios.defaults.baseURL + '/upload/rich_editor_upload',
//     fieldName: 'file',
//     base64LimitSize: 10 * 1024,// 10kb
//     withCredentials: true,
//     headers: {
//         token: "",
//         password:"Sq#465ls)#34ngsdDFesisens^_(or951as*3>de5Sf6%#111"
//     },
// }

// toolbarConfig.excludeKeys = [
//     'uploadVideo',
// ]

// editorConfig.MENU_CONF['uploadVideo'] = {
//     server: axios.defaults.baseURL + '/upload/rich_editor_upload',
//     fieldName: 'file',
//     withCredentials: true,
//     headers: {
//         token: "",
//         password:"Sq#465ls)#34ngsdDFesisens^_(or951as*3>de5Sf6%#111"
//     },
// }

editorConfig.MENU_CONF['lineHeight'] = {
    lineHeightList: ['0.15','0.2','0.25','0.3','0.5','0.75','1', '1.5', '2', '2.5']
}

// editorConfig.MENU_CONF['uploadImage'] = {
//     // 自定义上传
//     async customUpload(file, insertFn) { 
//         console.log('file', file)
//         // file 即选中的文件
//         // 自己实现上传，并得到图片 url alt href
//         // 最后插入图片
//         // insertFn(url, alt, href)
//     },
//     async customBrowseAndUpload(insertFn) { 
//         // console.log('insertFn', insertFn,fileDialog)
//         fileDialog.value.open(async (fileInfo)=>{
//             // console.log('fileInfo',fileInfo)
//             let imageUrl = cdnUrl + fileInfo.path
//             if(fileInfo.fileSize < 100 * 1024){
//                 let base64 = await imageUrlToBase64(imageUrl) // 图片转换base64
//                 insertFn(base64, fileInfo.name, fileInfo.url)
//             }else{
//                 insertFn(imageUrl, fileInfo.name, fileInfo.url)
//             }
//         })
//     // customBrowseAndUpload(insertFn) {              // JS 语法
//         // 自己选择文件
//         // 自己上传文件，并得到图片 url alt href
//         // 最后插入图片
//         // insertFn(url, alt, href)
//     }
// }

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})

const handleCreated = (editor) => {
    editorRef.value = editor

    // editorRef.value.getMenuConfig('uploadImage')
    // console.log(editorRef.value.getMenuConfig('uploadImage'))
}

</script>

<style lang="scss" scoped></style>