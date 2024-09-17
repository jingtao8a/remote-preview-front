<template>
    <div>
        <t-dropdown-menu>
            <t-dropdown-item :options="modelOption.options" :value="modelValue" @change="onChange" />
        </t-dropdown-menu>
        <RouterView v-slot="{Component}">
            <component
            :is="Component">
            </component>
        </RouterView>
    </div>
</template>

<script setup>
import {onMounted, ref, watch} from 'vue'
import {useRoute, useRouter } from 'vue-router';
const route = useRoute()
const router = useRouter()

const modelValue = ref()

const modelOption = {
  options: [
    {
      value: 'detail',
      label: '详细信息',
    },
    {
      value: 'brief',
      label: '大图标',
    },
  ],
}

onMounted(()=>{//确保route的path和mdoelValue能相对应
    modelValue.value = route.path.substring(1)
})

const onChange = (e) => {
  let suffix = ''
  let start = route.fullPath.indexOf('?')
  if (start != -1) {
    suffix = route.fullPath.substring(start)
  }
  router.replace("/" + e + suffix)
}

</script>

<style scoped>
</style>