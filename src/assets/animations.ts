// 动画和交互效果
import { ref } from 'vue';

// 滚动动画
export function useScrollAnimation() {
  const animateOnScroll = () => {
    // 使用正确的选择器而不是空字符串
    const elements = document.querySelectorAll('.service, .contact, .social');
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementPosition < windowHeight * 0.8) {
        element.classList.add('animate');
      }
    });
  };

  return { animateOnScroll };
}

// 鼠标跟随效果
export function useMouseFollower() {
  const mouseX = ref(0);
  const mouseY = ref(0);

  const updateMousePosition = (event: MouseEvent) => {
    mouseX.value = event.clientX;
    mouseY.value = event.clientY;
    
    const follower = document.querySelector('.mouse-follower') as HTMLElement;
    if (follower) {
      follower.style.transform = `translate(${mouseX.value}px, ${mouseY.value}px)`;
    }
  };

  const initMouseFollower = () => {
    const follower = document.createElement('div');
    follower.classList.add('mouse-follower');
    document.body.appendChild(follower);
    
    document.addEventListener('mousemove', updateMousePosition);
  };

  return { initMouseFollower };
}

// 文本动画
export function useTextAnimation() {
  const animateText = (selector: string) => {
    const element = document.querySelector(selector);
    if (!element) return;
    
    const text = element.textContent || '';
    element.textContent = '';
    
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);
  };

  return { animateText };
}

// 页面过渡动画
export function usePageTransition() {
  const pageTransition = ref(false);
  
  const startTransition = () => {
    pageTransition.value = true;
    
    setTimeout(() => {
      pageTransition.value = false;
    }, 1000);
  };
  
  return { pageTransition, startTransition };
}