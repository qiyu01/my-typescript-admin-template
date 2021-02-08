<template>
  <div class="table">
    <el-table
      ref="elTable"
      v-loading="loading"
      v-bind="$attrs"
      :data="data"
      :span-method="merge ? mergeMethod : spanMethod"
      v-on="$listeners"
      @sort-change="sortChange"
    >
      <column
        v-for="item in column"
        :key="item.label || item.prop || item.type"
        v-bind="$attrs"
        :column="item"
      />
    </el-table>
    <pagination
      v-if="total"
      :total="total"
      :page.sync="currPage"
      :page-size.sync="currPageSize"
      v-bind="$attrs"
      v-on="$listeners"
      @pagination="params => $emit('search', params)"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import Column from './column'

export default {
  components: { Pagination, Column },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    column: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    },
    spanMethod: {
      type: Function,
      default: null
    },
    merge: {
      type: Array,
      default: () => []
    },
    // 每页条数
    pageSize: {
      type: Number,
      default: 10
    },
    // 总条数
    total: {
      type: Number,
      default: 0
    },
    // 当前页码
    page: {
      type: Number,
      default: 1
    },
    orderBy: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      mergeLine: {},
      mergeIndex: {}
    }
  },
  computed: {
    dataLength() {
      return this.data.length
    },
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
  watch: {
    merge() {
      this.getMergeArr(this.data, this.merge)
    },
    dataLength() {
      this.getMergeArr(this.data, this.merge)
    }
  },
  created() {
    this.getMergeArr(this.data, this.merge)
  },
  methods: {
    // 清空用户的选择
    clearSelection() {
      this.$refs.elTable.clearSelection()
    },
    // 切换某一行的选中状态
    toggleRowSelection(row, selected) {
      this.$refs.elTable.toggleRowSelection(row, selected)
    },
    // 切换所有行的选中状态
    toggleAllSelection() {
      this.$refs.elTable.toggleAllSelection()
    },
    /**
     * 用于可展开表格与树形表格，切换某一行的展开状态
     * @params <boolean> expanded  true则展开
     */
    toggleRowExpansion(row, expanded) {
      this.$refs.elTable.toggleRowExpansion(row, expanded)
    },
    // 设定某一行为选中行
    setCurrentRow(row) {
      this.$refs.elTable.setCurrentRow(row)
    },
    // 清空排序条件
    clearSort() {
      this.$refs.elTable.clearSort()
    },
    clearFilter(columnKey) {
      this.$refs.elTable.clearFilter(columnKey)
    },
    // 对 Table 进行重新布局
    doLayout() {
      this.$refs.elTable.doLayout()
    },
    /**
     * 手动对 Table 进行排序
     * @params <string> prop 指定排序列
     * @params <string> order 指定排序顺序
     */
    sort(prop, order) {
      this.$refs.elTable.sort(prop, order)
    },
    getMergeArr(tableData, merge) {
      if (!merge) return
      this.mergeLine = {}
      this.mergeIndex = {}
      merge.forEach((item, k) => {
        tableData.forEach((data, i) => {
          if (i === 0) {
            this.mergeIndex[item] = this.mergeIndex[item] || []
            this.mergeIndex[item].push(1)
            this.mergeLine[item] = 0
          } else {
            if (data[item] === tableData[i - 1][item]) {
              this.mergeIndex[item][this.mergeLine[item]] += 1
              this.mergeIndex[item].push(0)
            } else {
              this.mergeIndex[item].push(1)
              this.mergeLine[item] = i
            }
          }
        })
      })
    },
    mergeMethod({ row, column, rowIndex, columnIndex }) {
      const index = this.merge.indexOf(column.property)
      if (index > -1) {
        const _row = this.mergeIndex[this.merge[index]][rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    // 排序
    sortChange({ column, prop, order }) {
      let orderBy = ''
      if (order) {
        orderBy =
          order === 'ascending'
            ? `${prop}-asc`
            : `${prop}-desc`
      }
      this.$emit('update:orderBy', orderBy)
      this.currPage = 1
      this.$emit('search', {
        page: 1,
        pageSize: this.currPageSize
      })
    }
  }
}
</script>
