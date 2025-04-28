<template>
  <component :name="groupName" size="large" :is="groupName == 'default' ? 'div' : NCard" :title="groupName" :class="{'from-card':groupName != 'default'}">
    <n-form
      v-if="props.cols < 1"
      :inline="props.inline"
      :label-width="props.labelWidth"
      :model="props.model"
      :rules="props.rules"
      :label-placement="props.labelPlacement"
    >
      <slot></slot>
    </n-form>
    <n-form
      v-else
      :inline="props.inline"
      :label-width="props.labelWidth"
      :model="props.model"
      :rules="props.rules"
      :label-placement="props.labelPlacement"
    >
      <n-grid :cols="props.cols" :x-gap="props.cols">
        <slot></slot>
      </n-grid>
    </n-form>
  </component>
</template>

<script setup>
import { ref ,watch} from "vue";
import { NCard,NGrid,NForm } from "naive-ui";

const props = defineProps({
  inline: {
    type: Boolean,
    default: false,
  },
  labelWidth: {
    type: Number,
    default: 120,
  },
  labelPlacement: {
    type: String,
    default: "top",
  },
  model: {
    type: Object,
    required: true,
  },
  cols: {
    type: Number,
    default: -1,
  },
  rules: {
    type: Object,
    default: () => ({}),
  },
  groupName: {
    type: String,
    default: "default",
  },
});


</script>

<style lang="scss" scoped>
.from-card{
  margin: 0 0 20px 0;
}
</style>
