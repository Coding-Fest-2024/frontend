import { defineNuxtPlugin } from '#app';
import TDesign from 'tdesign-vue-next'; // Import the library, adjust based on actual export
// 引入组件库的少量全局样式变量
import 'tdesign-vue-next/es/style/index.css';

export default defineNuxtPlugin((nuxtApp) => {
    // Here you can use nuxtApp.vueApp to access the Vue instance
    nuxtApp.vueApp.use(TDesign); // This is if TDesign is a plugin that needs to be used entirely
});
