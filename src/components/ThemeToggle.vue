<template>
  <div class="theme-toggle">
    <button @click="toggleTheme" :title="isDarkTheme ? '切换到浅色模式' : '切换到深色模式'">
      <svg v-if="isDarkTheme" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 创建一个响应式变量来跟踪当前主题
const isDarkTheme = ref(false);

// 切换主题的方法
const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value;
  
  // 更新文档的data-theme属性
  document.documentElement.setAttribute('data-theme', isDarkTheme.value ? 'dark' : 'light');
  
  // 触发自定义事件，通知其他组件主题已更改
  window.dispatchEvent(new CustomEvent('theme-changed', { 
    detail: { theme: isDarkTheme.value ? 'dark' : 'light' } 
  }));
  
  // 保存主题偏好到本地存储
  localStorage.setItem('theme', isDarkTheme.value ? 'dark' : 'light');
};

// 在组件挂载时，检查本地存储中的主题偏好
onMounted(() => {
  // 检查本地存储中是否有保存的主题偏好
  const savedTheme = localStorage.getItem('theme');
  
  // 如果有保存的主题偏好，则应用它
  if (savedTheme) {
    isDarkTheme.value = savedTheme === 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else {
    // 如果没有保存的主题偏好，则检查系统偏好
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    isDarkTheme.value = prefersDark;
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  }
});
</script>

<style scoped>
.theme-toggle {
  position: fixed;
  top: 5px;
  right: 5px;
  z-index: 10000;
  /* padding: 10px; */
  cursor: pointer;
  background: none;
  border: none;
  outline: none;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  transform: translateZ(0);
  width: 44px;
  height: 44px;
  box-sizing: border-box;
}

.theme-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 10px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-color, #333);
  transition: background-color 0.3s, transform 0.2s;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

/* 深色模式下的样式 */
:root[data-theme="dark"] .theme-toggle button {
  color: #fff;
}

:root[data-theme="dark"] .theme-toggle button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>