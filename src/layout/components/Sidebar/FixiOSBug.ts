import { Component,Watch, Vue } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'

export enum DeviceType {
  Mobile,
  Desktop,
}

@Component({
  name: 'FixiOSBug'
})
export default class extends Vue {
  
  get device() {
      return AppModule.device
    }
  
  mounted() {
    // In order to fix the click on menu on the ios device will trigger the mouseleave bug
    // https://github.com/PanJiaChen/vue-element-admin/issues/1135
    this.fixBugIniOS()
  }
  
  private fixBugIniOS() {
      const $subMenu = this.$refs.subMenu    
      if ($subMenu) {
        console.log($subMenu)
        const handleMouseleave = ($subMenu as Vue&{handleMouseleave:Function}).handleMouseleave
        ($subMenu as Vue & { handleMouseleave : Function}).handleMouseleave = (e:any) => {
          if (this.device === DeviceType.Mobile) {
            return
          }
          handleMouseleave(e)
        }
      }
    }
  
}
