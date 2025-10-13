<template>
  <div class="text-animation-container">
    <div 
      ref="textElement" 
      class="animated-text"
      :class="{ 'active': isActive }"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const props = defineProps({
  splitType: {
    type: String,
    default: 'chars', // 'chars', 'words', 'lines'
    validator: (value: string) => ['chars', 'words', 'lines'].includes(value)
  },
  staggerValue: {
    type: Number,
    default: 0.03
  },
  duration: {
    type: Number,
    default: 0.5
  }
});

const textElement = ref<HTMLElement | null>(null);
const isActive = ref(false);
const originalText = ref('');
const elements = ref<HTMLElement[]>([]);

// 处理鼠标进入事件
const handleMouseEnter = () => {
  isActive.value = true;
  animateElements(true);
};

// 处理鼠标离开事件
const handleMouseLeave = () => {
  isActive.value = false;
  animateElements(false);
};

// 动画元素
const animateElements = (entering: boolean) => {
  elements.value.forEach((el, index) => {
    const delay = index * props.staggerValue;
    el.style.transitionDelay = `${delay}s`;
    
    if (entering) {
      el.classList.add('animate-in');
      el.classList.remove('animate-out');
    } else {
      el.classList.add('animate-out');
      el.classList.remove('animate-in');
    }
  });
};

// 分割文本
const splitText = () => {
  if (!textElement.value) return;
  
  originalText.value = textElement.value.textContent || '';
  textElement.value.innerHTML = '';
  
  let splitContent: string[] = [];
  
  if (props.splitType === 'chars') {
    splitContent = originalText.value.split('');
  } else if (props.splitType === 'words') {
    splitContent = originalText.value.split(' ');
  } else if (props.splitType === 'lines') {
    splitContent = originalText.value.split('\n');
  }
  
  splitContent.forEach((item) => {
    const element = document.createElement('span');
    element.classList.add('split-element');
    element.textContent = props.splitType === 'words' ? `${item} ` : item;
    textElement.value?.appendChild(element);
    elements.value.push(element);
  });
};

onMounted(() => {
  splitText();
});
</script>

<style scoped>
.text-animation-container {
  display: inline-block;
}

.animated-text {
  display: inline-block;
  overflow: hidden;
}

.split-element {
  display: inline-block;
  transform: translateY(0);
  opacity: 1;
  transition: transform 0.5s ease, 
              opacity 0.5s ease;
}

.split-element.animate-in {
  transform: translateY(0);
  opacity: 1;
}

.split-element.animate-out {
  transform: translateY(10px);
  opacity: 0.5;
}
</style>