<template>
  <div>
    <i v-if="iconStyle==='el'" :class="[icon,'sub-el-icon']" />
    <svg-icon v-if="iconStyle==='svg'" :icon-class="icon"/>

    <span v-if="title" slot='title'>{{title}}</span>

  </div>
</template>

<script lang="ts">
// import { CreateElement, VNode } from 'vue'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'MenuItem'
})
export default class extends Vue {
  @Prop({ default: '' }) private icon!: string;
  @Prop({ default: '' }) private title!: string;

  get iconStyle() {
    if (this.icon && this.icon.includes('el-icon')) {
      return 'el'
    }
    if (this.icon && !this.icon.includes('el-icon')) {
      return 'svg'
    }
    return false
  }

  // render(h, CreateElement) {
  //   // const { icon, title } = context.props
  //   return h(
  //     <span>
  //       11
  //     </span>
  //   )
  // }
}

</script>
<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
