<template>
  <div class="scroll-progress-container">
    <div class="scroll-info">
      <div class="scroll-info-left">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 5px; vertical-align: middle;">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
          <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
        联系邮箱
      </div>
      <div class="scroll-info-right">13611931242@163.com</div>
    </div>
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: `${scrollPercentage}%` }"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const scrollPercentage = ref(0);
let ticking = false;

const updateScrollProgress = () => {
  // 确保在浏览器环境中执行
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  
  const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  
  // 防止除以0的情况
  if (scrollHeight <= 0) {
    scrollPercentage.value = 0;
    return;
  }
  
  scrollPercentage.value = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
};

const onScroll = () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateScrollProgress();
      ticking = false;
    });
    ticking = true;
  }
};

onMounted(() => {
  // 确保在浏览器环境中添加事件监听器
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', onScroll);
    // 初始化进度
    updateScrollProgress();
  }
});

onUnmounted(() => {
  // 确保在浏览器环境中移除事件监听器
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', onScroll);
  }
});
</script>

<style scoped>
.scroll-progress-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100vw;
  max-width: 100vw;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 9998;
  padding: 10px 0;
  box-sizing: border-box;
  transform: translateZ(0);
  overflow: hidden;
}

.scroll-info {
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  color: #fff;
  font-size: 14px;
  margin-bottom: 10px;
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;
}

.scroll-info-left, .scroll-info-center, .scroll-info-right {
  overflow: hidden;
  text-overflow: ellipsis;
}

.progress-bar {
  width: 100%;
  height: var(--progress-bar-height, 4px);
  background-color: rgba(255, 255, 255, 0.2);
  box-sizing: border-box;
}

.progress-fill {
  height: 100%;
  background-color: #fff;
  transition: width 0.1s ease-out;
  box-sizing: border-box;
}

/* 深色模式适配 */
:root[data-theme="dark"] .scroll-progress-container {
  background-color: rgba(0, 0, 0, 0.9);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .scroll-info {
    padding: 0 10px;
    font-size: 12px;
  }
  
  .scroll-info-left, .scroll-info-center, .scroll-info-right {
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>