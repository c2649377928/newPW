/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'gsap' {
  import { gsap } from 'gsap/gsap-core'
  export default gsap
}

declare module 'gsap/ScrollTrigger' {
  import { ScrollTrigger } from 'gsap/all'
  export default ScrollTrigger
}

declare module 'gsap/all' {
  export * from 'gsap/gsap-core'
  export { ScrollTrigger } from 'gsap/ScrollTrigger'
}