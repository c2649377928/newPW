<template>
  <div class="home">
    <!-- 鼠标跟随效果 -->
    <MouseFollower />
    
    <!-- 顶部信息栏 -->
    <div class="top-info">
      <div class="info-left">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="location-icon">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
        </svg>
        上海
      </div>
      <div class="info-center">{{ currentTime }}</div>
      <div class="info-right">快速入职</div>
    </div>
    
    <!-- 头部区域 -->
    <section class="header-section" ref="headerSection">
      <div class="left-title" ref="leftTitle">
        <h1>Frontend-<br>Development</h1>
      </div>
      
      <RotatingModel />
      
      <div class="right-title" ref="rightTitle">
        <h1>My Name Is<br>陈相羽</h1>
      </div>
    </section>
    
    <!-- 英雄区域 -->
    <section class="hero">
      <div class="hero-content">
        <h1 ref="heroTitle">我是陈相羽</h1>
        <h2 ref="heroSubtitle">目前是一个前端开发工程师</h2>
        <p ref="heroDescription">致力于制作优雅、高质量的代码，培养强大的开发实践，并提供卓越的用户体验。目标是不断进步，在开发中接触和学习后端知识，向全栈开发工程师靠拢。</p>
      </div>
    </section>
    
    <!-- 移动端卡片容器 -->
    <div class="mobile-cards-wrapper">
      <div class="cards-container mobile-cards" ref="mobileCardsRef" @touchstart="stopAutoScroll" @mousedown="stopAutoScroll">
        <div class="card" v-for="(card, index) in cards" :key="index">
          <img :src="card.icon" :alt="card.title" class="card-icon" />
          <h3>{{ card.title }}</h3>
        </div>
      </div>
      
      <div class="scroll-btn-container">
        <button class="scroll-btn left" @click="scrollLeft">
          <span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="scroll-icon" style="color: inherit;">
            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          </span>
        </button>
        
        <button class="scroll-btn right" @click="scrollRight">
          <span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="scroll-icon" style="color: inherit;">
            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          </span>
        </button>
      </div>
    </div>

    <!-- 服务区域 -->
    <div class="services-container">
      <div class="services-wrapper">
        <section class="service" v-for="(service, index) in services" :key="index" :ref="(el) => { if (el) serviceRefs[index] = el }">
          <div class="service-number">{{ service.number }}</div>
          <div class="service-content">
            <h2 :ref="(el) => { if (el) serviceTitleRefs[index] = el }">{{ service.title }}</h2>
            <p :ref="(el) => { if (el) serviceDescRefs[index] = el }">{{ service.description }}</p>
          </div>
        </section>
      </div>
      
      <!-- PC端卡片容器 -->
      <div class="cards-container desktop-cards">
        <div class="card" v-for="(card, index) in cards" :key="index">
          <img :src="card.icon" :alt="card.title" class="card-icon" />
          <h3>{{ card.title }}</h3>
        </div>
      </div>
    </div>
    
    <section id="contact" class="contact">
      <!-- 物理胶囊组件 -->
        <PhysicsCapsule />
    </section>



    <ResumeViewer />
    
    <!-- 底部滚动进度条 -->
    <ScrollProgress />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MouseFollower from '../components/MouseFollower.vue';
import RotatingModel from '../components/RotatingModel.vue';
import PhysicsCapsule from '../components/PhysicsCapsule.vue';
import ScrollProgress from '../components/ScrollProgress.vue';
import ResumeViewer from '../components/ResumeViewer.vue';
import { useScrollAnimation } from '../assets/animations';
import { useGsapTextStagger } from '../assets/gsapAnimations';

// 注册ScrollTrigger插件
gsap.registerPlugin(ScrollTrigger);

// 导入SVG图标
import htmlIcon from '../assets/icons/html5.svg';
import cssIcon from '../assets/icons/css.svg';
import jsIcon from '../assets/icons/javascript.svg';
import tsIcon from '../assets/icons/typescript.svg';
import vueIcon from '../assets/icons/vuedotjs.svg';
import gitIcon from '../assets/icons/git.svg';

// 滚动动画
const { animateOnScroll } = useScrollAnimation();
const { createTextStagger, createScrollStagger } = useGsapTextStagger();

// 引用DOM元素
const leftTitle = ref(null);
const rightTitle = ref(null);
const heroTitle = ref(null);
const heroSubtitle = ref(null);
const heroDescription = ref(null);
const serviceRefs = ref([]);
const serviceTitleRefs = ref([]);
const serviceDescRefs = ref([]);

// 当前时间
const currentTime = ref('');

// 卡片数据
const cards = ref([
  {
    title: "HTML",
    icon: htmlIcon
  },
  {
    title: "CSS",
    icon: cssIcon
  },
  {
    title: "JavaScript",
    icon: jsIcon
  },
  {
    title: "TypeScript",
    icon: tsIcon
  },
  {
    title: "Vue",
    icon: vueIcon
  },
  {
    title: "Git",
    icon: gitIcon
  }
]);

// 服务数据
const services = ref([
  {
    number: "01",
    title: "提升技能",
    description: "挑战自己。找到您以前从未使用过的技术并了解更多信息。尝试一下。用它做点什么。尝试每天学习一些小东西。"
  },
  {
    number: "02",
    title: "保持专注",
    description: "创建一个待办事项列表，进一步分解任务、确定优先级。不要试图同时处理多项任务，这会让你的注意力分散并且降低效率。"
  },
  {
    number: "03",
    title: "归属感",
    description: "团队中的归属感通过培养信任、目标和开放的沟通将混乱转化为协作。有了它，每个人都可以团结一致、投入并能够自由贡献，从而形成一个有凝聚力和高效的团队。"
  },
  {
    number: "04",
    title: "AI 编程\"效率幻觉\"",
    description: "单纯依赖 AI 进行碎片化的代码生成，只会让我们陷入\"效率幻觉\"的陷阱。未来的编程不再仅仅是编写代码，而是通过规范来定义和传达意图。如何有效利用这些工具，挖掘其潜力，将是每位开发者面临的挑战。"
  },
  {
    number: "05",
    title: "以产品为中心",
    description: "作为一名工程师，如果你想在这个领域继续发展，你需要开始将自己视为软件的生产者，而不仅仅是编码员。"
  },
  {
    number: "06",
    title: "Agent",
    description: "未来每个人都会拥有属于自己的AI Agent，就像现在每个人都有一个手机一样。Agent的出现，并不是为了取代人类，而是让我们从重复、琐碎的工作中解放出来，去做更有创造性、更有人情味的事情。"
  }
]);

// 表单数据
const form = ref({
  name: '',
  email: '',
  message: ''
});

// 移动端卡片容器引用
const mobileCardsRef = ref(null);
const isAutoScrolling = ref(false);
const scrollDirection = ref(1); // 添加滚动方向状态，1表示向右，-1表示向左

// 更新时间
const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

// 标题滚动动画函数
const handleTitleAnimation = () => {
  if (!leftTitle.value || !rightTitle.value) return;
  
  const scrollY = window.scrollY;
  const viewportHeight = window.innerHeight;
  // 计算滚动比例，最大值为1
  const scrollRatio = Math.min(scrollY / (viewportHeight * 0.5), 1);
  
  // 检测是否为移动设备
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // 根据滚动比例计算缩放
  const scale = 1 + (0.5 * scrollRatio); // 从1放大到1.5
  
  // 左侧标题向右移动
  const translateXLeft = 160 * scrollRatio; // 向右移动180px
  const translateYLeft = 380 * scrollRatio; // 向下移动360px
  
  // 右侧标题向左移动
  const translateXRight = -160 * scrollRatio; // 向左移动180px
  const translateYRight = 540 * scrollRatio; // 向下移动500px
  
  // 计算透明度（仅在移动端应用）
  const opacity = isMobile ? 1 - (0.8 * scrollRatio) : 1; // 移动端从1到0.5，PC端保持1
  
  // 应用变换到左侧标题
  if (leftTitle.value.querySelector('h1')) {
    const leftTitleH1 = leftTitle.value.querySelector('h1');
    leftTitleH1.style.transform = `scale(${scale}) translate(${translateXLeft}px, ${translateYLeft}px)`;
    if (isMobile) {
      leftTitleH1.style.opacity = opacity;
    }
  }
  
  // 应用变换到右侧标题
  if (rightTitle.value.querySelector('h1')) {
    const rightTitleH1 = rightTitle.value.querySelector('h1');
    rightTitleH1.style.transform = `scale(${scale}) translate(${translateXRight}px, ${translateYRight}px)`;
    
    // 当动画完成时（scrollRatio接近1），取消换行
    if (scrollRatio > 0.9) {
      rightTitleH1.style.whiteSpace = 'nowrap';
    } else {
      rightTitleH1.style.whiteSpace = 'normal';
    }
    
    // 移动端应用透明度变化
    if (isMobile) {
      rightTitleH1.style.opacity = opacity;
    }
  }
};

// 向左滚动
const scrollLeft = () => {
  if (mobileCardsRef.value) {
    isAutoScrolling.value = false;
    mobileCardsRef.value.scrollBy({ 
      left: -mobileCardsRef.value.offsetWidth * 0.8,
      behavior: 'smooth' 
    });
  }
};

// 向右滚动
const scrollRight = () => {
  if (mobileCardsRef.value) {
    isAutoScrolling.value = false;
    mobileCardsRef.value.scrollBy({ 
      left: mobileCardsRef.value.offsetWidth * 0.8,
      behavior: 'smooth' 
    });
  }
};

// 自动滚动
const startAutoScroll = () => {
  if (!mobileCardsRef.value || !isAutoScrolling.value) return;
  
  const scrollAmount = 1 * scrollDirection.value;
  mobileCardsRef.value.scrollLeft += scrollAmount;
  
  // 检查是否已滚动到最右侧或最左侧
  if (mobileCardsRef.value.scrollLeft >= mobileCardsRef.value.scrollWidth - mobileCardsRef.value.offsetWidth - 10) {
    // 到达最右侧，改为向左滚动
    scrollDirection.value = -1;
  } else if (mobileCardsRef.value.scrollLeft <= 0) {
    // 到达最左侧，改为向右滚动
    scrollDirection.value = 1;
  }
  
  // 继续自动滚动
  setTimeout(startAutoScroll, 30);
};

// 开始自动滚动
const initAutoScroll = () => {
  isAutoScrolling.value = true;
  scrollDirection.value = 1; // 重置滚动方向为向右
  startAutoScroll();
};

// 停止自动滚动
const stopAutoScroll = () => {
  isAutoScrolling.value = false;
};

// GSAP文本交错动画
const initTextStaggerAnimations = () => {
  // 英雄区域文本动画
  if (heroTitle.value) {
    gsap.from(heroTitle.value, {
      opacity: 0,
      y: 30,
      duration: 1.2,
      delay: 0.2
    });
  }
  
  if (heroSubtitle.value) {
    gsap.from(heroSubtitle.value, {
      opacity: 0,
      y: 30,
      duration: 1.2,
      delay: 0.6
    });
  }
  
  if (heroDescription.value) {
    gsap.from(heroDescription.value, {
      opacity: 0,
      y: 30,
      duration: 1.2,
      delay: 1.0
    });
  }
  
  // 服务区域标题动画
  setTimeout(() => {
    // 确保元素已经渲染完成
    if (serviceTitleRefs.value && serviceTitleRefs.value.length > 0) {
      // 过滤掉空值
      const validTitleRefs = serviceTitleRefs.value.filter(ref => ref !== null);
      if (validTitleRefs.length > 0) {
        createScrollStagger(validTitleRefs, {
          duration: 1.0,  // 增加动画持续时间，使动画更平缓
          y: 30,
          stagger: 0.2,   // 增加交错延迟，使每个元素的动画间隔更明显
          scrollTrigger: {
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        });
      }
    }
    
    // 服务区域描述动画
    if (serviceDescRefs.value && serviceDescRefs.value.length > 0) {
      // 过滤掉空值
      const validDescRefs = serviceDescRefs.value.filter(ref => ref !== null);
      if (validDescRefs.length > 0) {
        createScrollStagger(validDescRefs, {
          duration: 1.0,  // 增加动画持续时间，使动画更平缓
          y: 30,
          stagger: 0.2,   // 增加交错延迟，使每个元素的动画间隔更明显
          delay: 0.2,     // 增加初始延迟，使描述动画在标题之后更明显地出现
          scrollTrigger: {
            start: "top 90%",
            toggleActions: "play none none reverse"
          }
        });
      }
    }
  }, 1000);
};

// 提交表单
const submitForm = () => {
  console.log('Form submitted:', form.value);
  // 这里可以添加实际的表单提交逻辑
  alert('感谢您的留言！我们会尽快回复您。');
  form.value = {
    name: '',
    email: '',
    message: ''
  };
};

// 在 script setup 的顶层声明 timeInterval
let timeInterval = null;

// 页面加载完成后初始化自动滚动
onMounted(() => {
  window.addEventListener('scroll', animateOnScroll);
  window.addEventListener('scroll', handleTitleAnimation);
  
  // 初始化时也执行一次
  animateOnScroll();
  handleTitleAnimation();
  
  // 设置时间并定时更新
  updateTime();
  const timeInterval = setInterval(updateTime, 60000);
  
  // 初始化自动滚动
  setTimeout(() => {
    initAutoScroll();
  }, 3000); // 3秒后开始自动滚动
  
  // 初始化文本交错动画
  setTimeout(() => {
    initTextStaggerAnimations();
    
    // 刷新ScrollTrigger以确保所有动画正确注册
    ScrollTrigger.refresh();
  }, 1500); // 从1000增加到1500毫秒
  
  // 再次刷新确保所有内容加载完成
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 3500); // 从3000增加到3500毫秒
});

// 确保组件销毁时清理定时器和事件监听器
onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval);
  }
  window.removeEventListener('scroll', animateOnScroll);
  window.removeEventListener('scroll', handleTitleAnimation);
  
  // 清理ScrollTrigger
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }
});
</script>

<style scoped>
.home {
  width: 100vw;
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
}

/* 添加全局样式以防止水平滚动 */
:global(html),
:global(body) {
  overflow-x: hidden;
}

/* 顶部信息栏样式 */
.top-info {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100vw;
  display: flex;
  justify-content: space-between;
  padding: 1rem 4rem 1rem 1rem;
  font-size: 0.8rem;
  z-index: 9998;
  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transform: translateZ(0);
  box-sizing: border-box;
  max-width: 100vw;
  overflow: hidden;
}

.info-left, .info-right {
  opacity: 0.8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.location-icon {
  flex-shrink: 0;
  display: inline-block;
  vertical-align: middle;
  width: 16px;
  height: 16px;
  margin-right: 4px;
  /* 防止图标影响行高 */
  line-height: 1;
  /* 确保图标不会被文本对齐影响 */
  vertical-align: text-bottom;
}

.info-center {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 头部区域样式 */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50vh;
  padding: 0 5rem;
  margin-top: 30px;
  position: relative;
}

.left-title, .right-title {
  flex: 1;
}

/* 为 RotatingModel 组件保留中心空间 */
.header-section > :nth-child(2) {
  flex: 0 0 auto; /* 防止 RotatingModel 被压缩 */
  margin: 0 2rem; /* 为模型组件添加左右边距 */
}

.left-title {
  text-align: left;
}

.right-title {
  text-align: right;
}

.left-title h1, .right-title h1 {
  font-size: 4rem;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -1px;
  /* 添加动画相关样式 */
  transition: all 0.1s ease-out;
  transform: scale(1) translate(0, 0);
  white-space: normal;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-section {
    flex-direction: column;
    padding: 2rem;
    height: auto;
  }
  
  .left-title, .right-title {
    text-align: center;
    margin-bottom: 3rem;
  }
  
  .left-title h1, .right-title h1 {
    font-size: 2.5rem;
  }
  
  /* 移动端确保标题始终不换行 */
  .left-title h1, .right-title h1 {
    white-space: nowrap;
  }
}

.title-bars {
  font-weight: 300;
  letter-spacing: -3px;
  margin-left: 0.5rem;
}

.hero {
  height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  overflow: hidden;
}

/* PC端样式：top设置为50vh */
@media (min-width: 769px) {
  .hero {
    
  height: 100vh;
    top: 50vh;
    /* transform: translate(-50%, -50%); */
  }
}

.hero-content {
  max-width: 800px;
  padding: 2rem;
  z-index: 2;
}

.hero-content h1 {
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 1rem;
  letter-spacing: -2px;
}

.hero-content h2 {
  font-size: 1.5rem;
  font-weight: 400;
  margin-bottom: 1.5rem;
  opacity: 0.9;
}

.hero-content p {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  opacity: 0.8;
}

.cta-button {
  margin-top: 2rem;
}

.cta-button a {
  display: inline-block;
  padding: 1rem 2rem;
  background: transparent;
  border: 1px solid currentColor;
  color: inherit;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  border-radius: 30px;
}

.cta-button a:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

/* 服务区域样式 */
.services-container {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  top: 10vh;
}

.services-wrapper {
  flex: 1;
}

.service {
  display: flex;
  padding: 2rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.service-number {
  font-size: 5rem;
  font-weight: 700;
  opacity: 0.1;
  width: 150px;
  flex-shrink: 0;
}

.service-content {
  flex: 1;
}

.service-content h2 {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.service-content p {
  font-size: 1.1rem;
  line-height: 1.6;
}

/* 卡片容器样式 */
.cards-container {
  display: flex;
  gap: 1rem;
}

/* PC端卡片样式 */
.cards-container.desktop-cards {
  flex-direction: column;
  width: 300px;
  padding: 5rem 2rem;
}

.cards-container.mobile-cards {
  display: none;
}

.card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-top: 5rem;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.2);
}

.card-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 1rem;
  object-fit: contain;
  transition: transform 0.3s ease;
  filter: drop-shadow(0 0 1px currentColor);
}

.card:hover .card-icon {
  transform: scale(1.1);
}

.card h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}

/* 联系区域样式 */
.contact {
  padding: 5rem 2rem;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.contact h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 3rem;
}

.contact-info {
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
}

.contact-item svg {
  flex-shrink: 0;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 1rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  color: inherit;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.5);
}

.form-group textarea {
  min-height: 150px;
  resize: vertical;
}

.submit-button {
  padding: 1rem 2rem;
  background: transparent;
  border: 1px solid currentColor;
  color: inherit;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 30px;
}

.submit-button:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

/* GSAP示例区域样式 */
.gsap-demo {
  padding: 5rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.gsap-scroll-demo {
  margin-top: 5rem;
}

/* 移动端滚动按钮样式 */
.scroll-btn-container {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.scroll-btn {
  background: rgba(255, 255, 255, 0.2); /* 半透明白色背景 */
  border: 1px solid rgba(255, 255, 255, 0.5); /* 提高边框透明度 */
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white; /* 默认白色图标 */
  backdrop-filter: blur(5px); /* 添加背景模糊效果 */
}

.scroll-icon {
  width: 24px;
  height: 24px;
  color: inherit; /* 继承父元素颜色 */
  stroke: currentColor; /* 确保SVG路径使用当前颜色 */
}

.scroll-btn:hover {
  background: rgba(255, 255, 255, 0.3); /* 悬停时加深背景 */
  border-color: rgba(255, 255, 255, 0.7); /* 提高悬停时边框透明度 */
  transform: scale(1.1);
}

/* 深色主题适配 */
:root[data-theme="dark"] .scroll-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.5);
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); /* 添加阴影提高可见性 */
}

:root[data-theme="dark"] .scroll-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.7);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* 浅色主题适配 */
:root[data-theme="light"] .scroll-btn {
  background: rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.3);
  color: black;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

:root[data-theme="light"] .scroll-btn:hover {
  background: rgba(0, 0, 0, 0.2);
  border-color: rgba(0, 0, 0, 0.4);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-section {
    flex-direction: column;
    padding: 2rem;
    height: auto;
    gap: 2rem; /* 使用 gap 来确保子元素之间的间距 */
  }
  
  .left-title, .right-title {
    text-align: center;
    width: 100%; /* 在移动端占据全宽 */
    min-width: auto;
  }
  
  .header-section > :nth-child(2) {
    margin: 0; /* 移除水平边距，适应垂直布局 */
  }
  
  .left-title h1, .right-title h1 {
    font-size: 2.5rem;
  }
  
  .hero-content h1 {
    font-size: 2.5rem;
  }
  
  .hero-content h2 {
    font-size: 1.2rem;
  }
  
  .service {
    flex-direction: column;
  }
  
  .service-number {
    width: auto;
    margin-bottom: 1rem;
  }
  
  /* 移动端卡片样式 */
  .cards-container.mobile-cards {
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    padding: 1rem;
    gap: 1rem;
    margin: 1rem 0;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 10+ */
    width: 100%;
    max-width: 100vw;
  }
  
  .cards-container.desktop-cards {
    display: none;
  }
  
  .mobile-cards-wrapper {
    display: block;
  }
  
  .gsap-demo {
    padding: 2rem 1rem;
  }
}

@media (min-width: 769px) {
  .cards-container.mobile-cards {
    display: none;
  }
  
  .mobile-cards-wrapper {
    display: none;
  }
}

/* GSAP动画相关样式 */
.service-content h2, .service-content p {
  will-change: transform, opacity;
}

.hero-content h1, .hero-content h2, .hero-content p {
  will-change: transform, opacity;
}
</style>