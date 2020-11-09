<script>
import { QUploaderBase } from 'quasar'
import Papa from 'papaparse'

export default {
  name: 'axiosUploader',
  mixins: [ QUploaderBase ],
  data () {
    return {
      uploadTarget: 'splunk',
      uploadConfig: {
        quoteChar: '"',
        header: true,
        skipEmptyLines: true
      },
      uploading: false,
      progress: 0,
      sizeLabel: 0,
      uploadedLabel: 0
    }
  },
  watch: {
    files (value) {
      this.resetUpload()
    }
  },
  computed: {
    isUploading () {
      return this.uploading
    },
    isBusy () {
      return false
    },
    uploadProgress () {
      return this.uploadedLabel / this.sizeLabel || 0
    },
    uploadedSizeLabel () {
      return `${this.uploadedLabel} Rows`
    },
    uploadSizeLabel () {
      return `${this.sizeLabel} Rows`
    }
  },
  methods: {
    resetUpload () {
      this.sizeLabel = 0
      this.uploadedLabel = 0
      this.uploading = false
    },
    uploadSuccess (response) {
      this.uploadedLabel += 1
      if (this.uploadProgress === 1) {
        this.uploading = false
        this.__updateFile(this.files[0], 'uploaded')
      }
    },
    uploadFile (results) {
      this.sizeLabel = results.data.length
      results.data.forEach(element => {
        var postData = {
          integration: this.uploadTarget,
          ...element
        }
        this.$axios
          .post('/coverage/indexes', postData)
          .then(response => this.uploadSuccess())
      })
    },
    abort () {
      if (this.source) {
        this.reset()
      }
    },
    upload () {
      if (this.canUpload === false) {
        return
      }
      this.uploading = true
      Papa.parse(this.files[0], {
        ...this.uploadConfig,
        complete: this.uploadFile
      })
    }
  }
}
</script>
