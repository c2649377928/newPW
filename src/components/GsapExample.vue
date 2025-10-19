<template>
  <div class="gsap-example">
    <h2 ref="titleRef" class="animated-title">GSAP 动画示例</h2>
    
    <div class="animation-controls">
      <button @click="triggerTextAnimation">文字动画</button>
      <button @click="triggerElementAnimation">元素动画</button>
      <button @click="triggerStaggerAnimation">交错动画</button>
      <button @click="triggerTimelineAnimation">时间线动画</button>
      <button @click="triggerMorphAnimation">形态变换</button>
    </div>
    
    <div class="animated-elements">
      <div 
        v-for="i in 5" 
        :key="i"
        :ref="(el) => elementRefs[i-1] = el"
        class="animated-element"
      >
        元素 {{ i }}
      </div>
    </div>
    
    <div ref="staggerTextRef" class="stagger-text">
      这是一段交错动画的文字效果
    </div>
    
    <div class="morph-shapes">
      <div ref="morphBoxRef" class="morph-box"></div>
      <div ref="morphCircleRef" class="morph-circle"></div>
    </div>
    
    <div ref="timelineElementsRef" class="timeline-elements">
      <div class="timeline-element" v-for="i in 5" :key="i" :ref="(el) => timelineElementRefs[i-1] = el">
        步骤 {{ i }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import gsap from 'gsap';

// 定义引用
const titleRef = ref<HTMLElement | null>(null);
const elementRefs = ref<Array<HTMLElement | null>>([]);
const staggerTextRef = ref<HTMLElement | null>(null);
const morphBoxRef = ref<HTMLElement | null>(null);
const morphCircleRef = ref<HTMLElement | null>(null);
const timelineElementRefs = ref<Array<HTMLElement | null>>([]);
const timelineElementsRef = ref<HTMLElement | null>(null);

// 文字动画
const triggerTextAnimation = () => {
  if (titleRef.value) {
    // 将文字分解为单个字符
    const text = titleRef.value.textContent || '';
    titleRef.value.innerHTML = '';
    
    text.split('').forEach((char, i) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char; // 处理空格
      span.style.display = 'inline-block';
      titleRef.value?.appendChild(span);
      
      // 为每个字符应用动画
      gsap.fromTo(
        span,
        { 
          opacity: 0,
          y: 50,
          scale: 0.3
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          delay: i * 0.05,
          ease: "back.out(1.7)"
        }
      );
    });
  }
};

// 元素动画
const triggerElementAnimation = () => {
  elementRefs.value.forEach((el, i) => {
    if (el) {
      gsap.fromTo(
        el,
        {
          opacity: 0,
          y: 100,
          rotation: 180
        },
        {
          opacity: 1,
          y: 0,
          rotation: 0,
          duration: 0.8,
          delay: i * 0.1,
          ease: "elastic.out(1, 0.3)"
        }
      );
    }
  });
};

// 交错动画
const triggerStaggerAnimation = () => {
  if (staggerTextRef.value) {
    // 将文字分解为单个字符
    const text = staggerTextRef.value.textContent || '';
    staggerTextRef.value.innerHTML = '';
    
    text.split('').forEach(char => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.display = 'inline-block';
      staggerTextRef.value?.appendChild(span);
    });
    
    // 使用交错动画
    gsap.fromTo(
      staggerTextRef.value.children,
      {
        opacity: 0,
        y: 30,
        scale: 0.5
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.05,
        ease: "power2.out"
      }
    );
  }
};

// 时间线动画
const triggerTimelineAnimation = () => {
  if (timelineElementsRef.value) {
    // 创建时间线
    const tl = gsap.timeline({
      defaults: { duration: 0.6, ease: "power2.out" }
    });
    
    // 重置元素状态
    timelineElementRefs.value.forEach(el => {
      if (el) {
        gsap.set(el, { opacity: 0, y: 50, scale: 0.8 });
      }
    });
    
    // 按顺序添加动画到时间线
    timelineElementRefs.value.forEach((el, i) => {
      if (el) {
        tl.to(el, { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          delay: i === 0 ? 0 : 0.1
        });
      }
    });
    
    // 添加整体旋转效果
    tl.to(timelineElementRefs.value, {
      rotation: 360,
      duration: 1,
      stagger: 0.1
    });
  }
};

// 形态变换动画
const triggerMorphAnimation = () => {
  if (morphBoxRef.value && morphCircleRef.value) {
    // 创建形态变换动画
    const tl = gsap.timeline({
      repeat: -1,
      repeatDelay: 0.5,
      yoyo: true
    });
    
    tl.to(morphBoxRef.value, {
      duration: 1,
      borderRadius: "50%",
      backgroundColor: "#42b883",
      ease: "elastic.inOut(1, 0.3)"
    }).to(morphCircleRef.value, {
      duration: 1,
      borderRadius: "0%",
      backgroundColor: "#3498db",
      ease: "elastic.inOut(1, 0.3)"
    }, 0); // 与第一个动画同时开始
  }
};

// 组件挂载后执行初始动画
onMounted(() => {
  // 初始标题动画
  if (titleRef.value) {
    gsap.from(titleRef.value, {
      duration: 1,
      opacity: 0,
      y: -50,
      ease: "bounce.out"
    });
  }
  
  // 初始元素动画
  elementRefs.value.forEach((el, i) => {
    if (el) {
      gsap.from(el, {
        duration: 0.8,
        opacity: 0,
        x: (i % 2 === 0 ? -100 : 100),
        delay: i * 0.1,
        ease: "back.out(1.4)"
      });
    }
  });
  
  // 初始形态元素动画
  if (morphBoxRef.value && morphCircleRef.value) {
    gsap.from([morphBoxRef.value, morphCircleRef.value], {
      duration: 1,
      opacity: 0,
      scale: 0,
      stagger: 0.3,
      ease: "elastic.out(1, 0.5)"
    });
  }
});
</script>

<style scoped>
.gsap-example {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  margin-bottom: 2rem;
}

.animated-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: var(--primary-color);
}

.animation-controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.animation-controls button {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: transform 0.2s;
}

.animation-controls button:hover {
  transform: translateY(-2px);
}

.animated-elements {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.animated-element {
  width: 80px;
  height: 80px;
  background: var(--primary-color);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
}

.stagger-text {
  text-align: center;
  font-size: 1.5rem;
  margin: 2rem 0;
  min-height: 2rem;
}

.morph-shapes {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin: 2rem 0;
}

.morph-box, .morph-circle {
  width: 100px;
  height: 100px;
  background: #3498db;
}

.morph-box {
  border-radius: 0;
}

.morph-circle {
  border-radius: 50%;
  background: #42b883;
}

.timeline-elements {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 2rem 0;
  flex-wrap: wrap;
}

.timeline-element {
  width: 80px;
  height: 80px;
  background: #9b59b6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
}
</style>