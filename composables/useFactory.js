// const apiFetch = $fetch.create({ baseURL: '/api/v1' })
// import { useMessage } from '~/store/useMessage'
// import { useStore } from '~/store/useStore'

// const store = useStore()
// const appMessage = useMessage()

const useFactory = (collection) => {
  const state = reactive({
    errorMsg: '',
  })
  const fetchAll = async (params) => {
    state.errorMsg = null
    try {
      const response = await $fetch('/api/v1/products', { params })
      console.log(response)
      // store.products = response.docs
      // store.productsCount = response.count
      // store.productsTotalCount = response.totalCount

      return {
        docs: response.docs,
        count: response.count,
        totalCount: response.totalCount,
      }
    } catch (error) {
      state.errorMsg = error.data
    }
  }

  // const fetchCount = async (params) => {
  //   state.errorMsg = ''
  //   const { data, error } = await useFetch(`/v1/${collection}/count`, {
  //     baseURL: state.baseURL,
  //     method: 'get',
  //     params: params,
  //   })
  //   if (error.value) {
  //     state.errorMsg = 'Error while fetching docs count'
  //     // appError.setSnackbar(true, state.errorMsg)
  //     return false
  //   } else {
  //     state.totalItemCount = data.value
  //     return data.value
  //   }
  // }

  // const fetchBySlug = async (slug, params) => {
  //   state.errorMsg = ''
  //   const { data, error } = await useFetch(`/v1/${collection}/`, {
  //     baseURL: state.baseURL,
  //     method: 'get',
  //     params: { ...params, slug },
  //     lazy: true,
  //   })
  //   if (error.value) {
  //     state.errorMsg = 'Error while fetching docs'
  //     // appError.setSnackbar(true, state.errorMsg)
  //     return false
  //   } else {
  //     state.selectedItem = data.value[0]
  //     return data.value
  //   }
  // }

  // const deleteById = async (id) => {
  //   state.errorMsg = ''
  //   try {
  //     await http.delete(`v1/${collection}/${id}`)
  //     const index = state.items.findIndex((el) => el._id == id)
  //     if (index !== -1) state.items.splice(index, 1)
  //     return true
  //   } catch (err) {
  //     // console.log('MyERROR', err.response)
  //     state.errorMsg = err.response.data.message || err.response.data.statusMessage
  //     // appError.setSnackbar(true, state.errorMsg)
  //     return false
  //   }
  // }

  return { state, fetchAll }
}

export default useFactory
