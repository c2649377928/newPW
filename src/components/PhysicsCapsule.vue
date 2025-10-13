<template>
  <div class="physics-container">
    <div class="container">
      <div class="header">
      </div>

      <!-- 移除 .box 容器，直接使用 .canvas-container -->
      <div ref="physicsBox" class="canvas-container"></div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, reactive } from 'vue';
import Matter from 'matter-js';

const physicsBox = ref(null);
const capsules = ref([]);
const gravityEnabled = ref(true);

let engine;
let render;
let mouseConstraint;
let runner;
let boxWidth = 600;
let boxHeight = 400;

// 颜色和文本数组
// 用于为胶囊分配不同的颜色和标签文本
const colors = [
  "#FF6B6B",  // 红色系
  "#4ECDC4",  // 青色系
  "#45B7D1",  // 蓝色系
  "#96CEB4",  // 绿色系
  "#FFEAA7",  // 黄色系
  "#DDA0DD",  // 紫色系
  "#98D8C8",  // 浅绿色系
];

// 程序员优点文本数组
const programmerStrengths = [
  "团队 协作",
  "解决 问题",
  "持续 学习",
  "注重 细节",
  "创新 思维",
  "沉着 稳重",
  "适应力 强",
  "总结 优化",
  "高效 执行",
  "态度 严谨",
  "沟通能力",
  "目标 导向"
];

// 初始化物理引擎
const initPhysics = () => {
  // 获取容器元素的实际尺寸
  const boxRect = physicsBox.value.getBoundingClientRect();
  boxWidth = boxRect.width;
  boxHeight = boxRect.height;
  
  // 检查当前主题
  const currentTheme = document.documentElement.getAttribute('data-theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const backgroundColor = currentTheme === 'dark' ? '#1a1a1a' : '#ffffff';
  
  // 创建引擎
  engine = Matter.Engine.create();
  engine.world.gravity.y = 0.5; // 降低重力值，避免物体被过度拉向底部产生"吸附"效果

  // 创建渲染器，canvas 比容器大 4px
  render = Matter.Render.create({
    element: physicsBox.value,
    engine: engine,
    options: {
      width: boxWidth + 2,      // canvas 比容器宽大 4px
      height: boxHeight + 6,    // canvas 比容器高大 4px
      wireframes: false,         // 使用线框模式
      background: backgroundColor, // 背景跟随系统主题
      showAngleIndicator: false, // 是否显示角度指示器
      showVelocity: false,      // 是否显示速度矢量
      offset: { x: 0, y: 0 },   // 移除偏移，通过 CSS 居中
    },
  });

  // 创建增强型边界墙体（厚度增加到200px，向外扩展100px形成防护结构）
  // 调整墙体位置以适应新的 canvas 尺寸（比容器大 4px）
  const walls = [
    // 顶部边界墙体 - 防止物体向上飞出
    Matter.Bodies.rectangle((boxWidth + 4) / 2, -100, boxWidth + 204, 200, { 
      isStatic: true,           // 静态物体，不会受到力的影响
      restitution: 0.05,        // 低弹性系数，减少反弹
      friction: 0.0001,         // 极低摩擦力，防止粘滞
    }),
    // 下边界墙体（地面）- 物体落在此处
    Matter.Bodies.rectangle((boxWidth + 4) / 2, boxHeight + 102, boxWidth + 204, 200, { 
      isStatic: true,
      restitution: 0.05,        // 低弹性系数，减少反弹
      friction: 0.0001,         // 极低摩擦力，防止粘滞
    }),
    // 左边界墙体 - 防止物体向左飞出
    Matter.Bodies.rectangle(-100, (boxHeight + 4) / 2, 200, boxHeight + 204, { 
      isStatic: true,
      restitution: 0.05,        // 低弹性系数，减少反弹
      friction: 0.0001,         // 极低摩擦力，防止粘滞
    }),
    // 右边界墙体 - 防止物体向右飞出
    Matter.Bodies.rectangle(boxWidth + 102, (boxHeight + 4) / 2, 200, boxHeight + 204, { 
      isStatic: true,
      restitution: 0.05,        // 低弹性系数，减少反弹
      friction: 0.0001,         // 极低摩擦力，防止粘滞
    }),
  ];

  Matter.World.add(engine.world, walls);

  // 创建鼠标约束 - 用于拖拽物体
  mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: Matter.Mouse.create(render.canvas),
    constraint: {
      stiffness: 0.2,          // 约束刚度，控制拖拽时的弹性
      render: {
        visible: false,        // 不显示约束线
      },
    },
  });

  Matter.World.add(engine.world, mouseConstraint);
  render.mouse = mouseConstraint.mouse;
  
  // 添加移动端触摸支持
  const canvas = render.canvas;
  canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
  canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
  canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

  // 运行引擎和渲染器
  runner = Matter.Runner.create();
  Matter.Runner.run(runner, engine);
  Matter.Render.run(render);

  // 监听渲染事件，用于绘制文本
  Matter.Events.on(render, 'afterRender', function() {
    const context = render.context;
    
    // 设置文本渲染优化属性
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = 'bold 14px Arial, sans-serif';
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    
    // 检查当前主题
    const currentTheme = document.documentElement.getAttribute('data-theme') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const textColor = currentTheme === 'dark' ? '#ffffff' : '#000000';
    context.fillStyle = textColor;
    
    // 遍历所有胶囊，绘制文本
    capsules.value.forEach(capsule => {
      const body = capsule.body;
      const text = capsule.text;
      if (body && text) {
        const position = body.position;
        const angle = body.angle;
        
        context.save();
        
        // 优化文本渲染清晰度
        const x = Math.round(position.x) + 0.5;
        const y = Math.round(position.y) + 0.5;
        
        context.translate(x, y);
        context.rotate(angle);
        
        // 添加文本阴影以增强可读性
        context.shadowColor = currentTheme === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)';
        context.shadowBlur = 2;
        context.shadowOffsetX = 1;
        context.shadowOffsetY = 1;
        
        context.fillText(text, 0, 0);
        context.restore();
      }
    });
  });

  // 监听拖拽事件
  Matter.Events.on(mouseConstraint, "startdrag", function (event) {
    event.body.isDragging = true;
    // 更新胶囊状态，标记为正在拖拽
    const capsule = capsules.value.find(
      (c) => c.body.id === event.body.id
    );
    if (capsule) {
      capsule.isDragging = true;
    }
  });

  Matter.Events.on(mouseConstraint, "enddrag", function (event) {
    event.body.isDragging = false;
    // 更新胶囊状态，标记为结束拖拽
    const capsule = capsules.value.find(
      (c) => c.body.id === event.body.id
    );
    if (capsule) {
      capsule.isDragging = false;
    }
  });

  // 创建初始胶囊
  createInitialCapsules();

  // 动画循环
  // const animate = () => {
  //   const now = performance.now();
  //   const delta = now - stats.lastTime;
  //   stats.fps = Math.round(1000 / delta);
  //   stats.lastTime = now;
  //
  //   requestAnimationFrame(animate);
  // };
  // requestAnimationFrame(animate);
};

// 创建胶囊
const createCapsule = (x, y, width, height, color, text) => {
  // 检查当前主题
  const currentTheme = document.documentElement.getAttribute('data-theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const strokeColor = currentTheme === 'dark' ? '#ffffff' : '#000000';
  
  // 创建物理实体（使用圆角矩形近似胶囊形状）
  const capsuleBody = Matter.Bodies.rectangle(x, y, width, height, {
    // 使用圆角使矩形看起来像胶囊
    chamfer: { radius: Math.min(width, height) / 2 },
    render: {
      fillStyle: "transparent",     // 填充颜色改为透明
      strokeStyle: strokeColor,     // 根据主题设置黑白边框颜色
      lineWidth: 2,                 // 设置边框宽度
    },
    // 物理属性设置 - 根据规范优化参数
    mass: 30,                 // 适中质量，使其稳定但不至于过重
    restitution: 0.6,         // 适中弹性系数，使碰撞后有一定反弹
    friction: 0.001,          // 低摩擦力，减少粘滞感
    frictionAir: 0.01,        // 适中空气摩擦力，保证流畅性
    density: 0.01,           // 适中密度
  });

  // 添加到世界
  Matter.World.add(engine.world, capsuleBody);

  // 创建胶囊数据对象
  const capsule = {
    body: capsuleBody,
    width: width,
    height: height,
    color: color,
    text: text,
    isDragging: false,
  };

  capsules.value.push(capsule);
  return capsule;
};

// 创建初始胶囊
const createInitialCapsules = () => {
  const capsulePositions = [
    { x: 50, y: boxHeight - 100, color: "#4ECDC4" },  // 青色
    { x: 150, y: boxHeight - 100, color: "#FF6B6B" }, // 红色
    { x: 250, y: boxHeight - 100, color: "#FFEAA7" }, // 黄色
    { x: 350, y: boxHeight - 100, color: "#96CEB4" }, // 绿色
    { x: 450, y: boxHeight - 100, color: "#45B7D1" }, // 蓝色
    { x: 100, y: boxHeight - 200, color: "#DDA0DD" }, // 紫色
    { x: 200, y: boxHeight - 200, color: "#98D8C8" }, // 浅绿色
    { x: 300, y: boxHeight - 200, color: "#FF6B6B" }, // 红色
    { x: 400, y: boxHeight - 200, color: "#4ECDC4" }, // 青色
    { x: 150, y: boxHeight - 300, color: "#FFEAA7" }, // 黄色
    { x: 250, y: boxHeight - 300, color: "#96CEB4" }, // 绿色
    { x: 350, y: boxHeight - 300, color: "#45B7D1" }, // 蓝色
  ];

  capsulePositions.forEach((position, i) => {
    // 调整胶囊位置以适应新的 canvas 尺寸
    const adjustedX = position.x + 2;  // 加上 2px 的偏移量
    const adjustedY = position.y + 2;  // 加上 2px 的偏移量
    
    const width = 80 + Math.random() * 40;      // 宽度在80-120像素之间
    const height = 30 + Math.random() * 20;     // 高度在30-50像素之间

    createCapsule(
      adjustedX,
      adjustedY,
      width,
      height,
      position.color,
      programmerStrengths[i]  // 使用程序员优点作为文本内容
    );
  });
};


// 组件挂载时初始化
onMounted(() => {
  initPhysics();
  window.addEventListener('resize', handleResize);
  // 添加主题变化监听器
  window.addEventListener('theme-changed', handleThemeChange);
});

// 处理窗口大小变化
function handleResize() {
  if (render && engine) {
    // 获取容器元素的实际尺寸
    const boxRect = physicsBox.value.getBoundingClientRect();
    const newWidth = boxRect.width;
    const newHeight = boxRect.height;
    
    // 只有当尺寸发生显著变化时才重新初始化
    if (Math.abs(newWidth - boxWidth) > 10 || Math.abs(newHeight - boxHeight) > 10) {
      // 停止当前的渲染和引擎
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      
      // 清理旧的世界
      Matter.World.clear(engine.world);
      Matter.Engine.clear(engine);
      
      // 重新初始化
      initPhysics();
    }
  }
}

// 添加触摸事件处理函数
let touchBody = null;
let touchConstraint = null;

function handleTouchStart(event) {
  if (event.touches.length > 0) {
    event.preventDefault();
    
    const touch = event.touches[0];
    const mouse = mouseConstraint.mouse;
    mouse.element.dispatchEvent(new MouseEvent('mousedown', {
      clientX: touch.clientX,
      clientY: touch.clientY
    }));
  }
}

function handleTouchMove(event) {
  if (event.touches.length > 0) {
    event.preventDefault();
    
    const touch = event.touches[0];
    const mouse = mouseConstraint.mouse;
    mouse.element.dispatchEvent(new MouseEvent('mousemove', {
      clientX: touch.clientX,
      clientY: touch.clientY
    }));
  }
}

function handleTouchEnd(event) {
  event.preventDefault();
  
  const mouse = mouseConstraint.mouse;
  mouse.element.dispatchEvent(new MouseEvent('mouseup'));
}

// 添加主题变化处理函数
function handleThemeChange(event) {
  if (render) {
    const newTheme = event.detail.theme;
    const backgroundColor = newTheme === 'dark' ? '#1a1a1a' : '#ffffff';
    render.options.background = backgroundColor;
    // 重新渲染以应用新的背景色
    Matter.Render.stop(render);
    Matter.Render.run(render);
    
    // 更新所有胶囊的边框颜色
    const strokeColor = newTheme === 'dark' ? '#ffffff' : '#000000';
    capsules.value.forEach(capsule => {
      capsule.body.render.strokeStyle = strokeColor;
    });
  }
}

// 组件卸载前清理 - 防止内存泄漏
onBeforeUnmount(() => {
  // 移除窗口大小变化监听器
  window.removeEventListener('resize', handleResize);
  // 移除主题变化监听器
  window.removeEventListener('theme-changed', handleThemeChange);
  
  // 移除触摸事件监听器
  if (render && render.canvas) {
    const canvas = render.canvas;
    canvas.removeEventListener('touchstart', handleTouchStart);
    canvas.removeEventListener('touchmove', handleTouchMove);
    canvas.removeEventListener('touchend', handleTouchEnd);
  }
  
  // 停止物理引擎运行器
  if (runner) {
    Matter.Runner.stop(runner);
  }
  // 停止渲染器
  if (render) {
    Matter.Render.stop(render);
  }
  // 清理物理世界和引擎
  if (engine) {
    Matter.World.clear(engine.world);
    Matter.Engine.clear(engine);
  }
});
</script>

<style scoped>
.physics-container {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 20px;
  box-sizing: border-box; /* 添加此行确保padding包含在width内 */
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%; /* 添加此行确保容器占满父元素 */
}

.header {
  margin-bottom: 20px;
}

h1 {
  color: #333;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
}

.description {
  color: #666;
  max-width: 600px;
  margin: 0 auto 20px;
}

/* 移除 .box 样式，新增 .canvas-container 样式 */
.canvas-container {
  width: 100%; /* 改为100%以适应容器宽度 */
  max-width: 598px; /* 添加最大宽度限制 */
  height: 398px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
  /* 使 canvas 居中显示 */
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 媒体查询：针对小屏幕设备 */
@media (max-width: 768px) {
  .canvas-container {
    width: calc(100vw - 40px);
    height: 50vh;
    min-height: 300px;
  }
  
  .physics-container {
    padding: 10px;
  }
  
  .container {
    width: 100%; /* 确保在小屏幕上也占满宽度 */
  }
}

@media (max-width: 480px) {
  .canvas-container {
    height: 40vh;
    min-height: 250px;
    width: calc(100vw - 20px); /* 调整为更合适的宽度计算 */
  }
  
  .physics-container {
    padding: 10px;
  }
}
</style>