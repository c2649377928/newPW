<template>
  <div class="model-container" ref="modelContainer">
    <div class="model" ref="model">
      <svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <!-- 简洁的科幻风格原子轨道图标 -->
        <circle cx="100" cy="100" r="20" fill="none" stroke="#4a9fff" stroke-width="2" />
        <circle cx="100" cy="100" r="40" fill="none" stroke="#4a9fff" stroke-width="1" stroke-dasharray="3,3" />
        <circle cx="100" cy="100" r="60" fill="none" stroke="#4a9fff" stroke-width="1" stroke-dasharray="4,4" />
        
        <!-- 中心粒子 -->
        <circle cx="100" cy="100" r="8" fill="#4a9fff" />
        
        <!-- 轨道电子 -->
        <circle cx="140" cy="100" r="5" fill="#4a9fff" class="electron" />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const modelContainer = ref(null);
const model = ref(null);
let rotationInterval = null;
let rotationAngle = 0;
// 添加一个变量来检测是否为移动设备
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// 旋转模型
const rotateModel = () => {
  rotationAngle = (rotationAngle + 1);
  if (model.value) {
    // 只进行单向水平旋转
    model.value.style.transform = `rotateY(${rotationAngle}deg)`;
  }
};

// 根据滚动位置调整模型大小和位置
const handleScroll = () => {
  // 如果是移动设备，则不执行滚动动画
  if (isMobile) return;
  
  if (!modelContainer.value) return;
  
  const scrollY = window.scrollY;
  const viewportHeight = window.innerHeight;
  const scrollRatio = Math.min(scrollY / viewportHeight, 0.4);
  
  // 移除缩放效果，只保留位置移动
  // 向右上方移动
  const translateX = scrollRatio * 900;
  const translateY = scrollRatio * 1400;
  
  // 修复：每次重新设置完整的transform属性，包括初始居中定位
  modelContainer.value.style.transform = `translate(-50%, -50%) translate(${translateX}px, ${translateY}px)`;
};

onMounted(() => {
  // 启动旋转动画
  rotationInterval = setInterval(rotateModel, 30);
  
  // 添加滚动事件监听（仅在非移动设备上）
  if (!isMobile) {
    window.addEventListener('scroll', handleScroll);
  }
});

onUnmounted(() => {
  // 清除旋转动画
  clearInterval(rotationInterval);
  
  // 移除滚动事件监听（仅在非移动设备上）
  if (!isMobile) {
    window.removeEventListener('scroll', handleScroll);
  }
});
</script>

<style scoped>
.model-container {
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* 使用视口宽度的百分比而不是固定像素值 */
  width: min(20vw, 200px);
  height: min(20vw, 200px);
  transition: transform 0.3s ease-out;
  z-index: 10;
}


.model {
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
}

/* 深色模式适配 */
:root[data-theme="dark"] circle {
  stroke: #4a9fff;
  fill: #4a9fff;
}

:root[data-theme="light"] circle {
  stroke: #0066cc;
  fill: #0066cc;
}

:root[data-theme="dark"] circle[fill="none"] {
  fill: none;
}

:root[data-theme="light"] circle[fill="none"] {
  fill: none;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .model-container {
    width: min(30vw, 150px);
    height: min(30vw, 150px);
  }
}

@media (max-width: 480px) {
  .model-container {
    width: min(40vw, 120px);
    height: min(40vw, 120px);
  }
}
</style>