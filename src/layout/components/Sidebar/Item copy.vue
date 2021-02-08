<script lang="jsx">

import { CreateElement, VNode } from 'vue'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({
  name: 'MenuItem'
})
export default class extends Vue {
  // @Prop() private icon!: string;
  // @Prop() private title!: string;

  // render(h:CreateElement):VNode {
  //   return h("div",
  //    {
  //      attrs: { id: "app" },
  //      class: {
  //        "v-app": true
  //      }
  //    },
  //    [h("div", { staticClass: "v-app-wrap" }, this.$slots.default)]
  // }

  render(h, CreateElement) {
    // const { icon, title } = context.props
    return h(
      <span>
        11
      </span>
    )
  }
}

</script>
