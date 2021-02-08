<template>
  <div v-if="total>0" class="pagination-container">
    <el-pagination
      :background="background"
      :current-page.sync="currPage"
      :page-size.sync="currPageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { scrollTo } from '@/utils/scrollTo'

export default {
  name: 'Pagination',
  props: {
    total: {
      required: true,
      type: Number
    },
    page: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 50, 100]
      }
    },
    layout: {
      type: String,
      // default: 'total, sizes, prev, pager, next, jumper'
      default: 'total, prev, pager, next,sizes, jumper'
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    currPage: {
      get() {
        return this.page
      },
      set(val) {
        this.$emit('update:page', val)
      }
    },
    currPageSize: {
      get() {
        return this.pageSize
      },
      set(val) {
        this.$emit('update:pageSize', val)
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.currPageSize = val // 强制设置pageSize
      this.$emit('update:page', 1)
      this.$emit('pagination', { page: 1, pageSize: val })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    handleCurrentChange(val) {
      this.$emit('pagination', { page: val, pageSize: this.pageSize })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.pagination-container {
  padding: 32px 0;
  text-align: right;
}

.el-pagination__total,
.el-pagination__sizes {
  // float: left;
}

.pagination-container.hidden {
  display: none;
}
.el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev, .el-pagination.is-background .el-pager li{
  background-color: #fff;
}
</style>
