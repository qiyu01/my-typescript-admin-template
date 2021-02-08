<template>
  <el-dialog
    :visible="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="title"
    append-to-body
    width="520px"
    @close="$emit('close')"
  >
    <div class="import-dialog-wrap">
      <el-upload
        ref="upload"
        :on-change="readFile"
        :on-remove="removeFile"
        :auto-upload="false"
        :show-file-list="false"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        action
        style="display: inline-block"
      >
        <el-button :loading="loading" type="primary" class="el-icon-upload" size="medium">上传文件</el-button>
      </el-upload>
      <p>
        请上传编辑好xlsx文件。注意：Excel 2007的文件格式，<br>
        请参考模板文件。
      </p>
      <a @click="downloadTemplate()">点击下载模板</a>
    </div>
    <span slot="footer">
      <el-button size="small" @click="$emit('close')">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import request from '@/utils/request'

// 1 商品  2 店铺
const UPLOAD_TYPE = {
  1: 'product',
  2: 'shop'
}

const UPLOAD_FAIL_TYPE = {
  1: 'productFail',
  2: 'shopFail'
}

export default {
  name: 'ImportDialog',
  props: {
    title: {
      type: String,
      default: '批量导入'
    },
    uploadUrl: {
      type: String,
      default: ''
    },
    // 上传类型
    uploadType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      file: null,
      loading: false
    }
  },
  methods: {
    getExcelHeader(type) {
      const product = '商品编码|商品名称|规格|批准文号|生产厂家|价格'
      const shop = `店铺名称*|药师帮店铺ID*|店长姓名*|店长电话*|店铺地址—省*|店铺地址—市*|店铺地址—区*|店铺地址—街道*|详细地址*|BD姓名|BD电话|邻药店铺ID`

      const strMap = {
        product: product,
        productFail: `${product}|失败原因`,
        shop: shop,
        shopFail: `${shop}|失败原因`
      }

      return strMap[type].split('|')
    },
    getExcelFieldByCn(cn) {
      // 商品
      const product = {
        '商品编码': 'drugCode',
        '商品名称': 'drugName',
        '规格': 'pack',
        '批准文号': 'approval',
        '生产厂家': 'factoryName',
        '价格': 'price',
        '进货价': 'purchasePrice',
        '失败原因': 'failReason'
      }

      // 店铺
      const shop = {
        '店铺名称*': 'yxStoreName',
        '药师帮店铺ID*': 'drugStoreBranchId',
        '店长姓名*': 'managerName',
        '店长电话*': 'managerPhoneNo',
        '店铺地址—省*': 'provinceName',
        '店铺地址—市*': 'cityName',
        '店铺地址—区*': 'countyName',
        '店铺地址—街道*': 'streetName',
        '详细地址*': 'addr',
        'BD姓名': 'bdname',
        'BD电话': 'bdphoneNo',
        '邻药店铺ID': 'yxStoreId',
        '失败原因': 'failReason'
      }

      const CN_MAP = {
        product: product,
        shop: shop
      }
      return CN_MAP[UPLOAD_TYPE[this.uploadType]][cn]
    },
    // 导出excel
    exportExcel(header, data, fileName = `导出_${new Date().toString()}`) {
      const fieldOrder = header.map(this.getExcelFieldByCn)
      const transObj2Arr = obj => fieldOrder.map(k => obj[k])
      const body = data.map(transObj2Arr)
      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: header,
          data: body,
          filename: fileName
        })
      })
    },
    // 上传excel
    handleExcelUpload() {
      this.loading = true
      this.uploadExcel().then(res => {
        const { data: {
          errorNum, failNum, failDataList, successNum
        }, message } = res
        if (failDataList && failDataList.length > 0) {
          (async() => {
            try {
              await this.$alert(`导入成功${successNum}条，导入失败${errorNum || failNum}条`, '温馨提示', { confirmButtonText: '下载查看失败数据' })
              this.exportExcel(
                this.getExcelHeader(UPLOAD_FAIL_TYPE[this.uploadType]),
                failDataList,
                `${this.title}_失败数据`
              )
            } catch (e) {
              console.error(e)
            }
          })()
        } else {
          this.$message.success(message)
          this.$emit('close')
        }
        this.$emit('success')
      },
      err => {
        const { data, message } = err
        if (data && data.length > 0) {
          // 店铺导入处理
          (async() => {
            try {
              await this.$alert(message, '温馨提示', { confirmButtonText: '下载查看失败数据' })
              if (data && data.length > 0) {
                this.exportExcel(
                  this.getExcelHeader(UPLOAD_FAIL_TYPE[this.uploadType]),
                  data,
                  `${this.title}_失败数据`
                )
              }
            } catch (e) {
              console.error(e)
            }
          })()
        }
      }
      )
        .finally(() => {
          this.removeFile()
          this.loading = false
        })
    },
    readFile(file, fileList) {
      if (fileList.length > 1) {
        fileList[0] = fileList[1]
        fileList.pop()
      }
      this.file = file // upload
      this.handleExcelUpload()
    },
    removeFile() {
      this.file = null
    },
    // 下载模板
    downloadTemplate() {
      this.exportExcel(
        this.getExcelHeader(UPLOAD_TYPE[this.uploadType]),
        [],
        `${this.title}模板`
      )
    },
    uploadExcel() {
      return request({
        method: 'upload',
        url: this.uploadUrl,
        data: {
          'upload-file': this.file.raw
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .import-dialog-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    p {
      margin: 10px 0;
      font-size: 14px;
      color: #a2a4b3;
    }
    a {
      color: #f85340;
    }
    ::v-deep{
      .el-icon-upload {
        background-color: #000;
        border: none;
      }
    }
  }
</style>
