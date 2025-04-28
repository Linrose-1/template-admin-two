<template>
  <div style="width: 100%">
    <n-upload abstract v-model:file-list="props.value" @remove="removeItem">
      <n-button v-if="value.length < props.max" @click="openFileDialog"
        >选择文件</n-button
      >
      <div style="margin-top: 8px">
        <n-upload-file-list />
      </div>
    </n-upload>
  </div>
  <file-dialog ref="fileDialog"></file-dialog>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from "vue";
import axios from "axios";
import { NButton, useMessage, NUpload, NUploadFileList } from "naive-ui";
import FileDialog from "./FileDialog.vue";

const cdnUrl = useRuntimeConfig().public.CDN_URL;
const props = defineProps({
  value: {
    type: Array,
    required: true,
    default: () => [],
  },
  max: {
    type: Number,
    default: 3,
  },
});
const message = useMessage();
const emit = defineEmits(["update:value", "change"]);
const fileDialog = ref(null);

async function removeItem(data){
    let removeIndex = data.index 
    props.value.splice(removeIndex,1)
}

async function openFileDialog() {
  fileDialog.value.open((fileInfo) => {
    /**
         {
        id: 'b',
        name: 'file.doc',
        status: 'finished',
        type: 'text/plain'
      }
         */
    props.value.push({
      id: fileInfo.id,
      name: fileInfo.name,
      status: "finished",
      type: "text/plain",
      path: fileInfo.path,
      url: `${cdnUrl}${fileInfo.path}`,
    });
    // console.log(fileInfo);
  });
}
</script>

<style lang="scss" scoped></style>
