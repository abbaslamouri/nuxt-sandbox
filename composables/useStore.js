const useStore = () => {
  const store = useState('store', () => {
    return {
      docs: [],
      doc: {},
      count: 0,
      totalCount: 0,
      errorMsg: '',
      message: '',
      referenceMedia: '',
      selectedMedia: [],
      showAlert: false,
      alertHeading: '',
      alertParagraph: '',
      alertAction: '',
      showAlertCancelBtn: true,
      showAttributesSlideout: false,
    }
  })

  const product = useState('product', () => {})
  const variants = useState('variants', () => {})

  const fetchAll = async (params) => {
    store.value.errorMsg = null
    store.value.message = null
    try {
      const response = await $fetch(`/api/v1/products`, { params })
      // console.log(response)
      store.value.docs = response.docs
      store.value.count = response.count
      store.value.totalCount = response.totalCount
    } catch (error) {
      store.value.errorMsg = error.data
    }
  }

  const fetchBySlug = async (slug) => {
    store.value.errorMsg = null
    store.value.message = null
    try {
      const response = await $fetch(`/api/v1/products`, { params: { slug } })
      // console.log(response)
      store.value.doc = response
    } catch (error) {
      store.value.errorMsg = error.data
    }
  }

  const saveDoc = async (doc) => {
    store.value.errorMsg = null
    store.value.message = null
    // console.log('KKKKKK', resource)
    try {
      if (doc._id) {
        await $fetch(`/api/v1/products`, {
          method: 'PATCH',
          params: { id: doc._id },
          body: doc,
        })
      } else {
        await $fetch(`/api/v1/products`, { method: 'POST', body: doc })
      }
      store.valuemessage = `Category ${doc.name} saved succesfully`
    } catch (error) {
      store.value.errorMsg = error.data
    }
  }

  const deleteById = async (docId) => {
    store.value.errorMsg = null
    store.value.message = null
    try {
      await $fetch(`/api/v1/products`, {
        method: 'DELETE',
        params: { id: docId },
      })
    } catch (err) {
      store.value.errorMsg = err.data
    }
  }

  return { product, variants, store, fetchAll, saveDoc, fetchBySlug, deleteById }
}

export default useStore
