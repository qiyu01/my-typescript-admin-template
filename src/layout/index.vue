<template>
  <div :class="classObj" class="app-wrapper">
    <div class="app-header">
      <div class="app-header-left">
        <img src="@/assets/common/logo.png" class="logo">
        <div class="title">邻药优选</div>
      </div>
      <div class="app-header-right">
        <span>{{ userName }},欢迎你！</span>
        <span class="separator">|</span>
        <el-button type="text" style="color: #333" @click="logout">退出</el-button>
      </div>
    </div>
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <!-- <navbar :class="{'fixed-header': fixedHeader}" /> -->
      <!-- <app-main /> -->
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'

import Sidebar from './components/Sidebar/index.vue'
import ResizeMixin from './mixin/ResizeHandler'
import { AppModule } from '@/store/modules/app'
import { SettingsModule } from '@/store/modules/settings'
import { UserModule } from '@/store/modules/user'

@Component({
  name: 'SidebarItem',
  components: { Sidebar }
})
export default class extends mixins(ResizeMixin) {
  get fixedHeader() {
    return SettingsModule.fixedHeader
  }

  get classObj() {
    return {
      withoutAnimation: this.sidebar.withoutAnimation
    }
  }

  get userName() {
    return UserModule.name || 'Hello'
  }

  private handleClickOutside() {
    AppModule.CloseSideBar(false)
  }

  // 登出
  private logout() {
    this.$confirm('确定登出？', {
      closeOnClickModal: false
    }).then(() => {
      UserModule.LogOut().then((res:any) => {
        this.$router.push('/login')
      })
    })
  }
}

</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    // top: 70;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
  .app-header{
    height: 50px;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1002;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #ffffff;
    box-shadow: 0px 3px 20px 0px
    rgba(0, 0, 0, 0.06);
    background-color:#fff;
    padding: 0 20px;
    &-left{
      display: flex;
      align-items: center;
      .logo{
        width: 26px;
        height: 26px;
        margin-right: 3px;
      }
      .title{
        font-size: 18px;
        color: #333333;
        font-weight: bold;
      }
    }
    &-right{
      font-size: 14px;
      color: #333333;
      .separator{
        margin: 0 10px;
        color: #909399;
	      opacity: 0.5;
      }
    }
  }
</style>
