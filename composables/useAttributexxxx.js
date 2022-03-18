const useAttribute = () => {
  const state = useState('errorMsg', () => {
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

  const fetchAll = async (params) => {
    state.value.errorMsg = null
    state.value.message = null
    try {
      const response = await $fetch(`/api/v1/attributes`, { params })
      // console.log(response)
      state.value.docs = response.docs
      state.value.count = response.count
      state.value.totalCount = response.totalCount
    } catch (error) {
      state.value.errorMsg = error.data
    }
  }

  const fetchBySlug = async (slug) => {
    console.log(slug)
    state.value.errorMsg = null
    state.value.message = null
    try {
      const response = await $fetch(`/api/v1/attributes`, { params: { slug } })
      // console.log(response)
      state.value.doc = response
    } catch (error) {
      state.value.errorMsg = error.data
    }
  }

  const saveDoc = async (doc) => {
    state.value.errorMsg = null
    state.value.message = null
    // console.log('KKKKKK'attributes
    try {
      if (doc._id) {
        await $fetch(`/api/v1/attributes`, {
          method: 'PATCH',
          params: { id: doc._id },
          body: doc,
        })
      } else {
        await $fetch(`/api/v1/attributes`, { method: 'POST', body: doc })
      }
      state.valuemessage = `Category ${doc.name} saved succesfully`
    } catch (error) {
      state.value.errorMsg = error.data
    }
  }

  const deleteById = async (docId) => {
    state.value.errorMsg = null
    state.value.message = null
    try {
      await $fetch(`/api/v1/attributes`, {
        method: 'DELETE',
        params: { id: docId },
      })
    } catch (err) {
      state.value.errorMsg = err.data
    }
  }

  return { state, fetchAll, saveDoc, fetchBySlug, deleteById }
}

export default useAttribute
