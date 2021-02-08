<template>
  <div v-if="!item.hidden" class="menu-wrapper">
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item
          :index="resolvePath(onlyOneChild.path)"
          :class="{
            'submenu-title-noDropdown': !isNest,
            'submenu-title-common': item.name!=='Index'
          }"
        >
          <item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="onlyOneChild.meta.title" />
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'

import FixiOSBug from './FixiOSBug'
import { isExternal } from '@/utils/validate'
import Item from './Item.vue'
import AppLink from './Link.vue'
import path from 'path'

@Component({
  name: 'SidebarItem',
  components: { Item, AppLink }
})
export default class extends mixins(FixiOSBug) {
  @Prop({ default: () => {} }) private item!: Object;
  @Prop({ default: () => {} }) private isNest!: Object;
  @Prop() private basePath!: string;

  private onlyOneChild:any

  private hasOneShowingChild(children = [], parent:any) {
    const showingChildren = children.filter((item:any) => {
      if (item.meta.hidden) {
        return false
      } else {
        // Temp set(will be used if only has one showing child)
        this.onlyOneChild = item
        return true
      }
    })

    // When there is only one child router, the child router is displayed by default
    if (showingChildren.length === 1 && parent.name === 'Index') {
      return true
    }

    // Show parent if there are no child router to display
    if (showingChildren.length === 0) {
      this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
      return true
    }

    return false
  }

  private resolvePath(routePath:any) {
    if (isExternal(routePath)) {
      return routePath
    }
    if (isExternal(this.basePath)) {
      return this.basePath
    }
    return path.resolve(this.basePath, routePath)
  }
}
</script>

<style lang="scss">
.menu-wrapper{
.el-menu-item{
&:hover{
        background-color: rgba(248, 83, 64, 0.12)!important;
      }
&.is-active{
border-right: 4px solid#f85340;}
}

.el-submenu{
.el-submenu__title{
&:hover{
          background-color: rgba(248, 83, 64, 0.12)!important;
}
}
}
.submenu-title-common{
  padding-left: 48px!important;
  }
}
</style>
