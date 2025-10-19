<template>
  <div class="gsap-scroll-demo">
    <h2 class="section-title">GSAP ScrollTrigger 示例</h2>
    
    <div class="scroll-section">
      <div ref="box1Ref" class="scroll-box">滚动触发动画 1</div>
    </div>
    
    <div class="scroll-section">
      <div ref="box2Ref" class="scroll-box">滚动触发动画 2</div>
    </div>
    
    <div class="scroll-section">
      <div ref="box3Ref" class="scroll-box">滚动触发动画 3</div>
    </div>
    
    <div class="pin-section">
      <div ref="pinBoxRef" class="pin-box">
        <h3>固定元素示例</h3>
        <p>这个元素会在滚动时固定在屏幕上</p>
      </div>
    </div>
    
    <div class="parallax-section">
      <div ref="parallaxBoxRef" class="parallax-box">
        <h3>视差效果</h3>
        <p>这个元素会以不同的速度移动</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// 注册ScrollTrigger插件
gsap.registerPlugin(ScrollTrigger);

// 定义引用
const box1Ref = ref<HTMLElement | null>(null);
const box2Ref = ref<HTMLElement | null>(null);
const box3Ref = ref<HTMLElement | null>(null);
const pinBoxRef = ref<HTMLElement | null>(null);
const parallaxBoxRef = ref<HTMLElement | null>(null);

// 初始化滚动触发动画
const initScrollAnimations = () => {
  // 第一个滚动动画
  if (box1Ref.value) {
    gsap.fromTo(
      box1Ref.value,
      {
        opacity: 0,
        x: -100,
        scale: 0.5
      },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 1,
        scrollTrigger: {
          trigger: box1Ref.value,
          start: "top 80%",
          end: "top 50%",
          scrub: 1,
          markers: false
        }
      }
    );
  }
  
  // 第二个滚动动画
  if (box2Ref.value) {
    gsap.fromTo(
      box2Ref.value,
      {
        opacity: 0,
        y: 100,
        rotation: 180
      },
      {
        opacity: 1,
        y: 0,
        rotation: 0,
        duration: 1,
        scrollTrigger: {
          trigger: box2Ref.value,
          start: "top 80%",
          end: "top 50%",
          scrub: 1,
          markers: false
        }
      }
    );
  }
  
  // 第三个滚动动画
  if (box3Ref.value) {
    gsap.fromTo(
      box3Ref.value,
      {
        opacity: 0,
        x: 100,
        borderRadius: "0%"
      },
      {
        opacity: 1,
        x: 0,
        borderRadius: "50%",
        duration: 1,
        scrollTrigger: {
          trigger: box3Ref.value,
          start: "top 80%",
          end: "top 50%",
          scrub: 1,
          markers: false
        }
      }
    );
  }
  
  // 固定元素动画
  if (pinBoxRef.value) {
    ScrollTrigger.create({
      trigger: pinBoxRef.value,
      start: "top center",
      end: "bottom center",
      pin: true,
      pinSpacing: false,
      markers: false
    });
  }
  
  // 视差效果
  if (parallaxBoxRef.value) {
    gsap.to(parallaxBoxRef.value, {
      y: -100,
      ease: "none",
      scrollTrigger: {
        trigger: parallaxBoxRef.value,
        scrub: true,
        markers: false
      }
    });
  }
};

// 组件挂载后初始化动画
onMounted(() => {
  initScrollAnimations();
});

// 组件卸载前清理ScrollTrigger
onUnmounted(() => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
});
</script>

<style scoped>
.gsap-scroll-demo {
  padding: 5rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: var(--primary-color);
}

.scroll-section {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scroll-box {
  width: 200px;
  height: 200px;
  background: linear-gradient(45deg, #42b883, #3498db);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.pin-section {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  margin: 2rem 0;
}

.pin-box {
  width: 300px;
  height: 300px;
  background: linear-gradient(45deg, #9b59b6, #3498db);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  padding: 2rem;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
}

.pin-box h3 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.parallax-section {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a1a, #2c3e50);
  position: relative;
  overflow: hidden;
}

.parallax-box {
  width: 300px;
  height: 300px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  padding: 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.parallax-box h3 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
}
</style>