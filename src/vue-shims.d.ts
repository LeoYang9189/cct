declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, any>
  export default component
}

declare module '@vue/runtime-core' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface GlobalProperties {}
}