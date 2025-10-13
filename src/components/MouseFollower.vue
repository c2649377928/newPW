<template>
  <div class="mouse-follower-container">
    <div 
      class="mouse-follower" 
      :style="{ 
        transform: `translate(${clampedPosition.x}px, ${clampedPosition.y}px) scale(${isMouseDown ? 1.5 : 1})`,
        backgroundColor: currentColor,
        opacity: isVisible ? 1 : 0
      }"
    ></div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue';

// 鼠标/触摸位置
const position = reactive({ x: 0, y: 0 });
// 光标是否可见
const isVisible = ref(false);
// 鼠标是否按下
const isMouseDown = ref(false);

// 限制光标位置在视口范围内
const clampedPosition = computed(() => {
  return {
    x: Math.max(0, Math.min(position.x, window.innerWidth)),
    y: Math.max(0, Math.min(position.y, window.innerHeight))
  };
});

// 主题颜色（可以根据实际需求调整）
const themes = {
  light: 'rgba(59, 130, 246, 0.6)', // 蓝色
  dark: 'rgba(236, 72, 153, 0.6)'   // 粉色
};

// 当前主题（默认为light）
const currentTheme = ref('light');

// 根据主题计算当前颜色
const currentColor = computed(() => {
  return themes[currentTheme.value];
});

// 监听主题变化事件
const handleThemeChange = (event) => {
  currentTheme.value = event.detail.theme;
};

// 鼠标移动处理函数
const handleMouseMove = (e) => {
  position.x = e.clientX;
  position.y = e.clientY;
  if (!isVisible.value) {
    isVisible.value = true;
  }
};

// 触摸移动处理函数
const handleTouchMove = (e) => {
  if (e.touches.length > 0) {
    position.x = e.touches[0].clientX;
    position.y = e.touches[0].clientY;
    if (!isVisible.value) {
      isVisible.value = true;
    }
  }
};

// 触摸开始处理函数
const handleTouchStart = (e) => {
  if (e.touches.length > 0) {
    position.x = e.touches[0].clientX;
    position.y = e.touches[0].clientY;
    isMouseDown.value = true;
    isVisible.value = true;
  }
};

// 触摸结束处理函数
const handleTouchEnd = () => {
  isMouseDown.value = false;
  // 在触摸结束后保持光标可见一段时间
  setTimeout(() => {
    isVisible.value = false;
  }, 1000);
};

// 鼠标按下处理函数
const handleMouseDown = () => {
  isMouseDown.value = true;
};

// 鼠标松开处理函数
const handleMouseUp = () => {
  isMouseDown.value = false;
};

// 鼠标进入页面
const handleMouseEnter = () => {
  isVisible.value = true;
};

// 鼠标离开页面
const handleMouseLeave = () => {
  isVisible.value = false;
};

// 挂载和卸载事件监听器
onMounted(() => {
  // 检查当前文档主题
  const currentDocTheme = document.documentElement.getAttribute('data-theme') || 'light';
  currentTheme.value = currentDocTheme;
  
  // 鼠标事件监听器（桌面端）
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mousedown', handleMouseDown);
  window.addEventListener('mouseup', handleMouseUp);
  
  // 触摸事件监听器（移动端）
  window.addEventListener('touchstart', handleTouchStart);
  window.addEventListener('touchmove', handleTouchMove);
  window.addEventListener('touchend', handleTouchEnd);
  
  // 主题变化监听器
  window.addEventListener('theme-changed', handleThemeChange);
  
  // 鼠标进入/离开页面事件
  document.addEventListener('mouseenter', handleMouseEnter);
  document.addEventListener('mouseleave', handleMouseLeave);
});

onUnmounted(() => {
  // 移除所有事件监听器
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mousedown', handleMouseDown);
  window.removeEventListener('mouseup', handleMouseUp);
  window.removeEventListener('touchstart', handleTouchStart);
  window.removeEventListener('touchmove', handleTouchMove);
  window.removeEventListener('touchend', handleTouchEnd);
  window.removeEventListener('theme-changed', handleThemeChange);
  document.removeEventListener('mouseenter', handleMouseEnter);
  document.removeEventListener('mouseleave', handleMouseLeave);
});
</script>

<style scoped>
.mouse-follower-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 9999;
  overflow: hidden;
}

.mouse-follower {
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: transform 0.1s ease-out, background-color 0.3s ease;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
</style>