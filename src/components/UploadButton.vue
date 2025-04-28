<template>
  <n-upload show-download-button list-type="image" :custom-request="customRequest" v-model:file-list="_fileList"
    @download="handleDownload" show-preview-button @remove="fileRemove" :show-remove-button="curType == 'upload'">
    <n-button v-if="curType == 'upload'">上传文件</n-button>
  </n-upload>
</template>


<script setup>
import { ref, onMounted, nextTick, watch } from 'vue';
import axios from 'axios';
import { NButton, useMessage,NUpload } from 'naive-ui';

const props = defineProps({
  value: {
    type: Array,
    required: true
  },
  type: {
    type: String,
    default: 'upload'
  }
})

/**
 *  { "id": "6a8dbb09", "name": "utils.cpp", "percentage": 100, 
 * "status": "finished", "url": "//127.0.0.1:7002/upload/downloadFile/1681180230645059584", 
 * "file": "[object File]", "thumbnailUrl": null, "type": "text/plain", "fullPath": "/utils.cpp", 
 * "batchId": "e5df24b0" }
 */
const message = useMessage();
const emit = defineEmits(['update:value', 'change'])
const _fileList = ref([])
const curType = ref(props.type)


onMounted(async () => {
  if (props.type == null || props.type == "") { curType.value = "upload" }
  if (props.value) {
    _fileList.value = []
    let result = await axios.post('/upload/loadUploadInfos', props.value)
    for (let fileInfo of result.data.uploadFiles) {
      _fileList.value.push({
        ...fileInfo,
        id: fileInfo.id,
        batchId: fileInfo.id,
        name: fileInfo.name,
        // url:"https://www.mocky.io/v2/5e4bafc63100007100d8b70f",
        url: `${axios.defaults.baseURL}/upload/viewFile/${fileInfo.id}`,
        downloadUrl: `${axios.defaults.baseURL}/upload/downloadFile/${fileInfo.id}`,
        fullPath: `${axios.defaults.baseURL}/upload/downloadFile/${fileInfo.id}`,
        status: "finished",
        percentage: 100,
      })
    }
  }
})

/**
 * 通过watch函数监听props的value变化，当value变化时，更新_fileList的值
 */
watch(() => props.value, async (newVal) => {
  //如果newVal不为空，则根据newVal的值，更新_fileList的值
  if (newVal) {
    //先将_fileList的值清空
    _fileList.value = []
    //根据newVal的值，从后端获取文件信息
    let result = await axios.post('/upload/loadUploadInfos', newVal)
    //将获取到的文件信息，添加到_fileList中
    for (let fileInfo of result.data.uploadFiles) {
      _fileList.value.push({
        ...fileInfo,
        id: fileInfo.id,
        batchId: fileInfo.id,
        name: fileInfo.name,
        // url:"https://www.mocky.io/v2/5e4bafc63100007100d8b70f",
        url: `${axios.defaults.baseURL}/upload/viewFile/${fileInfo.id}`,
        downloadUrl: `${axios.defaults.baseURL}/upload/downloadFile/${fileInfo.id}`,
        fullPath: `${axios.defaults.baseURL}/upload/downloadFile/${fileInfo.id}`,
        status: "finished",
        percentage: 100,
      })
    }
  }
  //如果newVal为空，则将_fileList的值清空
  else {
    _fileList.value = []
  }
})

/**
 * 自定义上传函数
 */
const customRequest = ({ file, onFinish, onError, onProgress, headers }) => {
  const formData = new FormData()
  //将文件添加到formData中
  formData.append('file', file.file, file.name)  
  //调用后端接口，上传文件 
  axios.post(server_url, formData, {              
    headers: headers,
    onUploadProgress: (event) => {
      const percent = Math.ceil((event.loaded / event.total) * 100);
      onProgress({ percent });
    }
  }).then(response => {
    //上传完成后，将文件的batchId设置为响应信息中的文件id
    handleFinish(file, response.data);    
    //更新父组件的值     
    fileListChangeUpload();               
    onFinish()   
  }).catch(err => {
    onError()
  })
}

/**
 * 删除文件
 */
  const fileRemove = ({file})=>{
   //深拷贝_fileList的值 
   let newfileList = JSON.parse(JSON.stringify(_fileList.value));   
   //将file从newfileList中删除
   newfileList = newfileList.filter(item => item.id !== file.id);   
   //更新父组件的值
   fileListChangeRemove(newfileList);                               
   return true
}


//文件上传的服务器地址
const server_url = window.location.protocol + axios.defaults.baseURL + '/upload/ftpUploadFiles/';

/**
 * 下载文件
 */
const handleDownload = (file) => {
  message.success(`下载成功：${file.name}`)
  window.open(file.fullPath)
  return false
}

/**
 * 上传完成后，将文件的batchId设置为响应信息中的文件id
 */
const handleFinish = (file, responseInfo) => {
  file.batchId = responseInfo.file.id
  file.name = responseInfo.file.name
  file.url = `${axios.defaults.baseURL}/upload/downloadFile/${responseInfo.file.id}`
  return file;
};

/**
 * 文件列表增加文件时，更新父组件的值
 */
const fileListChangeRemove = (fileList) => {
  nextTick(() => {
    let changeVal = fileList.map(item => item.batchId)
    emit('update:value', changeVal)
    emit('change', changeVal)
    props.value = changeVal
  })
}

/**
 * 文件列表删除文件时，更新父组件的值
 */
const fileListChangeUpload = () => {
  nextTick(() => {
    //将文件的batchId添加到changeVal中
    let changeVal = _fileList.value.map(item => item.batchId)  
    emit('update:value', changeVal)                          
    emit('change', changeVal)                                   
    props.value = changeVal
  })
}

</script>

<style lang="scss" scoped></style>