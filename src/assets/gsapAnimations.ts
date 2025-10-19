// GSAP动画示例
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// 注册ScrollTrigger插件
gsap.registerPlugin(ScrollTrigger);

// 滚动触发动画
export function useGsapScrollTrigger() {
  // 这里可以使用GSAP的ScrollTrigger插件创建滚动动画
  const createScrollAnimation = (element: string, animationProps: gsap.TweenVars) => {
    // 查找元素
    const el = document.querySelector(element);
    if (!el) return;
    
    // 创建滚动触发动画
    gsap.fromTo(
      el,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );
  };

  // 创建更复杂的滚动触发序列动画
  const createScrollSequence = (elements: string[]) => {
    elements.forEach((selector, index) => {
      const el = document.querySelector(selector);
      if (!el) return;
      
      gsap.fromTo(
        el,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
            // 添加标记以便调试
            markers: false
          }
        }
      );
    });
  };

  return { createScrollAnimation, createScrollSequence };
}

// 鼠标跟随动画
export function useGsapMouseFollower() {
  let follower: HTMLElement | null = null;
  
  const initMouseFollower = () => {
    // 创建跟随元素
    follower = document.createElement('div');
    follower.classList.add('gsap-mouse-follower');
    document.body.appendChild(follower);
    
    // 初始化GSAP动画
    const mousePos = { x: 0, y: 0 };
    
    // 监听鼠标移动
    document.addEventListener('mousemove', (e) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
      
      // 使用GSAP创建平滑跟随效果
      gsap.to(follower, {
        duration: 0.3,
        x: mousePos.x,
        y: mousePos.y,
        ease: "power2.out"
      });
    });
  };

  return { initMouseFollower };
}

// 文本逐字动画
export function useGsapTextAnimation() {
  const animateText = (selector: string) => {
    const element = document.querySelector(selector) as HTMLElement;
    if (!element) return;
    
    const text = element.innerText;
    element.innerHTML = '';
    
    // 创建每个字符的span元素
    text.split('').forEach((char, i) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.display = 'inline-block';
      element.appendChild(span);
      
      // 使用GSAP为每个字符添加动画
      gsap.fromTo(
        span,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: i * 0.05,
          ease: "back.out(1.7)"
        }
      );
    });
  };

  return { animateText };
}

// 页面切换动画
export function useGsapPageTransition() {
  const pageTransition = () => {
    // 创建覆盖层
    const overlay = document.createElement('div');
    overlay.classList.add('gsap-page-transition');
    document.body.appendChild(overlay);
    
    // 使用GSAP创建页面过渡动画
    const tl = gsap.timeline();
    
    tl.to(overlay, {
      duration: 0.5,
      scaleX: 1,
      transformOrigin: "right",
      ease: "power2.inOut"
    }).to(overlay, {
      duration: 0.5,
      scaleX: 0,
      transformOrigin: "left",
      ease: "power2.inOut",
      delay: 0.2
    });
    
    // 清理
    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    }, 1200);
  };

  return { pageTransition };
}

// 创建视差滚动效果
export function useGsapParallax() {
  const createParallax = (element: string, speed: number = 0.5) => {
    const el = document.querySelector(element);
    if (!el) return;
    
    gsap.to(el, {
      y: () => (window.scrollY * speed),
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  };
  
  return { createParallax };
}

// 文本交错动画
export function useGsapTextStagger() {
  // 为元素内的文本创建交错动画
  const createTextStagger = (element: string | HTMLElement, options: gsap.TweenVars = {}) => {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!el) return;
    
    const defaultOptions = {
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.02,
      ease: "power2.out"
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    
    gsap.fromTo(
      el,
      { opacity: 0, y: 30 },
      finalOptions
    );
  };
  
  // 为多个元素创建交错动画
  const createElementsStagger = (elements: string | NodeList | HTMLElement[], options: gsap.TweenVars = {}) => {
    const defaultOptions = {
      opacity: 0,
      y: 30,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out"
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    
    let elementList: HTMLElement[] = [];
    
    if (typeof elements === 'string') {
      elementList = Array.from(document.querySelectorAll(elements)) as HTMLElement[];
    } else if (elements instanceof NodeList) {
      elementList = Array.from(elements) as HTMLElement[];
    } else {
      elementList = elements as HTMLElement[];
    }
    
    if (elementList.length === 0) return;
    
    gsap.fromTo(
      elementList,
      { opacity: 0, y: 30 },
      finalOptions
    );
  };
  
  // 为元素创建基于滚动的交错动画
  const createScrollStagger = (elements: string | NodeList | HTMLElement[], options: gsap.TweenVars = {}) => {
    const defaultOptions = {
      opacity: 0,
      y: 30,
      duration: 1.0,
      stagger: 0.2,
      ease: "power2.out"
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    
    let elementList: HTMLElement[] = [];
    
    if (typeof elements === 'string') {
      elementList = Array.from(document.querySelectorAll(elements)) as HTMLElement[];
    } else if (elements instanceof NodeList) {
      elementList = Array.from(elements) as HTMLElement[];
    } else if (Array.isArray(elements)) {
      // 处理ref数组
      elementList = elements.filter(el => el !== null) as HTMLElement[];
    } else {
      elementList = [elements] as HTMLElement[];
    }
    
    if (elementList.length === 0) return;
    
    // 为每个元素创建独立的滚动触发器
    elementList.forEach((el, i) => {
      const delay = i * (finalOptions.stagger || 0.2);
      
      gsap.fromTo(
        el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: finalOptions.duration,
          delay: delay,
          ease: finalOptions.ease,
          scrollTrigger: {
            trigger: el,
            start: finalOptions.scrollTrigger?.start || "top 85%",
            toggleActions: finalOptions.scrollTrigger?.toggleActions || "play none none reverse"
          }
        }
      );
    });
  };
  
  return { createTextStagger, createElementsStagger, createScrollStagger };
}