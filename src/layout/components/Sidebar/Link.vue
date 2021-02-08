<template>
  <component :is="type" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script lang="ts">
// import { CreateElement, VNode } from 'vue'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { isExternal } from '@/utils/validate'

@Component({
  name: 'MenuLink'
})
export default class extends Vue {
  @Prop({ required: true }) private to!: string;
  get isExternal() {
    return isExternal(this.to)
  }

  get type() {
    if (this.isExternal) {
      return 'a'
    }
    return 'router-link'
  }

  private linkProps(to:string) {
    if (this.isExternal) {
      return {
        href: to,
        target: '_blank',
        rel: 'noopener'
      }
    }
    return {
      to: to
    }
  }
}
</script>
