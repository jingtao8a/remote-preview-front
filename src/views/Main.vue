<template>
    <div>
        <t-dropdown-menu @menu-opened="handleMenuOpened" @menu-closed="handleMenuClosed">
            <t-dropdown-item :options="modelOption.options" :value="modelOption.value" @change="onChange" />
        </t-dropdown-menu>
        <RouterView v-slot="{Component}">
            <component
            :is="Component">
            </component>
        </RouterView>
    </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
const route = useRoute()
const router = useRouter()

const modelOption = {
  value: 'detail',
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

const onChange = (e) => {
  console.log(e);
  router.replace("/" + e)
}

const handleMenuOpened = () => {
  console.log('==handleMenuOpened===');
};

const handleMenuClosed = (val) => {
  console.log('==handleMenuClosed===', val);
};
</script>

<style scoped>
</style>