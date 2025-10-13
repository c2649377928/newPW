<template>
  <div class="resume-viewer">
    <div class="resume-controls">
      <h2>我的简历</h2>
      <div class="control-buttons">
        <button @click="downloadResume" class="control-btn download-btn" title="下载简历">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </button>
      </div>
    </div>
    
    <div class="pdf-container">
      <div class="pdf-viewer">
        
        <div class="pdf-content">
          <!-- 使用@vue-office/pdf组件 -->
          <VueOfficePdf 
            :src="resumeUrl" 
            :page="currentPage"
            :scale="scale"
            @pages-count="pageCount = $event"
            @rendered="onRendered"
            @error="onError"
            class="pdf-document"
          />
          
          <!-- 加载和错误状态覆盖在PDF上 -->
          <div v-if="loading" class="overlay loading">正在加载简历...</div>
          <div v-else-if="pdfError" class="overlay error">{{ pdfError }}</div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import VueOfficePdf from '@vue-office/pdf'

// PDF状态
const currentPage = ref(1)
const pageCount = ref(0)
const scale = ref(1.0)
const loading = ref(true)
const pdfError = ref('')

// PDF文件路径
const resumeUrl = '/resume.pdf' // 假设PDF文件放在public目录下

// 下载简历
const downloadResume = () => {
  const link = document.createElement('a')
  link.href = resumeUrl
  link.download = '陈相羽-简历.pdf'
  link.click()
}

// 渲染完成回调
const onRendered = () => {
  console.log('PDF渲染完成')
  loading.value = false
}

// 错误处理回调
const onError = (error) => {
  console.error('PDF渲染失败:', error)
  pdfError.value = 'PDF加载失败，请检查文件路径或格式'
  loading.value = false
}
</script>

<style scoped>
.resume-viewer {
  max-width: 1000px;
  margin: 0 auto 5rem auto; /* 修改margin值，只用margin-bottom控制下边距 */
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.resume-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.resume-controls h2 {
  margin: 0;
}

.control-buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: transparent;
  border: 1px solid currentColor;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.zoom-level {
  min-width: 50px;
  text-align: center;
  font-weight: 500;
}

.download-btn {
  width: auto;
  padding: 0 1rem;
  gap: 0.5rem;
}

.pdf-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem 0;
}

.pdf-viewer {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 1rem;
  gap: 1rem;
}

.pdf-content {
  width: 100%;
  height: 80vh; /* 设置固定高度 */
  display: flex;
  justify-content: center;
  overflow: auto; /* 启用滚动 */
  padding: 1rem;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  position: relative;
}

.pdf-document {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  width: 100%; /* 使PDF宽度与容器一致 */
  overflow: visible !important; /* 使用!important覆盖组件内部的overflow-y: auto样式 */
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 4px;
}

.nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: transparent;
  border: 1px solid currentColor;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.9rem;
  opacity: 0.8;
}

.loading, .error {
  text-align: center;
  padding: 1rem;
  border-radius: 4px;
  color: white;
}

.error {
  color: #ff4444;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .resume-viewer {
    padding: 0.5rem;
    margin: 0 10px 5rem 10px; /* 修改margin值，只用margin-bottom控制下边距 */
  }
  
  .resume-controls {
    flex-direction: row; /* 改为水平排列 */
    align-items: center; /* 垂直居中 */
    justify-content: space-between; /* 两端对齐 */
  }
  
  .control-buttons {
    justify-content: center;
  }
  
  .pdf-viewer {
    /* flex-direction: column; */
    gap: 1rem;
  }
  
  .pdf-navigation:first-child,
  .pdf-navigation:last-child {
    order: -1;
  }
  
  .pdf-content {
    height: 60vh; /* 移动端设置较小的高度 */
  }
  
  .pdf-document {
    /* 移除了max-height设置 */
  }
}
</style>