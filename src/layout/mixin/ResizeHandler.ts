import { ECharts } from 'echarts'
import { Component,Watch, Vue } from 'vue-property-decorator'
import { Route } from 'vue-router'
import { AppModule } from '@/store/modules/app'

const { body } = document
const WIDTH = 992 // refer to Bootstrap's responsive design

interface Isidebar{
  opened:boolean
}
export enum DeviceType {
  Mobile,
  Desktop,
}

@Component({
  name: 'ResizeMixin'
})
export default class extends Vue {
  // private device!: string
  // public sidebar!: Isidebar 

  @Watch('$route', { immediate: true })
  private onRouteChange(route: Route) {
    if (this.device === DeviceType.Mobile && this.sidebar.opened) {
      AppModule.CloseSideBar( false )
      // store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }

  get sidebar() {
    return AppModule.sidebar
  }

  get device() {
    return AppModule.device
  }

  beforeMount() {
    window.addEventListener('resize', this.$_resizeHandler)
  }
  mounted() {
    const isMobile = this.$_isMobile()
    if (isMobile) {
      AppModule.ToggleDevice( DeviceType.Mobile )
      AppModule.CloseSideBar( true )
      // store.dispatch('app/toggleDevice', 'mobile')
      // store.dispatch('app/closeSideBar', { withoutAnimation: true })
    }
  }

  beforeDestroy() {
    window.removeEventListener('resize', this.$_resizeHandler)
  }



  private $_resizeHandler(){
    if (!document.hidden) {
      const isMobile = this.$_isMobile()
      AppModule.ToggleDevice( isMobile ? DeviceType.Mobile:DeviceType.Desktop )
      // store.dispatch('app/toggleDevice', isMobile ? 'mobile' : 'desktop')

      if (isMobile) {
        AppModule.CloseSideBar( true )
        // store.dispatch('app/closeSideBar', { withoutAnimation: true })
      }
    }

  }

  private $_isMobile(){
    const rect = body.getBoundingClientRect()
      return rect.width - 1 < WIDTH
  }
   
}

