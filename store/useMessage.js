import { defineStore } from 'pinia'

export const useMessage = defineStore('message', {
  state: () => {
    return {
      errorMsg: null,
      snackbar: {
        show: false,
        message: '',
        type: 'Error',
        duration: 10,
        position: 'top-left',
      },
    }
  },
  actions: {
    setSnackbar(show = false, message = '', type = 'Error', duration = 30, position) {
      this.snackbar.show = show
      this.snackbar.message = message
      this.snackbar.type = type
      this.snackbar.duration = duration
      this.snackbar.position = position
    },
  },
})
