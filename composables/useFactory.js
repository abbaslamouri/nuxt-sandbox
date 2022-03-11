const useFactory = () => {
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
  const errorMsg = useState('errorMsg', () => '')
  const message = useState('message', () => '')
  const alert = useState('alert', () => {
    return {
      showAlert: false,
      alertHeading: '',
      alertParagraph: '',
      alertAction: '',
      showAlertCancelBtn: true,
      showAttributesSlideout: false,
    }
  })

  const fetchAllDocs = async (resource, params) => {
    errorMsg.value = null
    message.value = null
    try {
      const response = await $fetch(`/api/v1/${resource}`, { params })
      return response
    } catch (error) {
      errorMsg.value = error.data
    }
  }

  const fetchBySlug = async (resource, slug) => {
    errorMsg.value = null
    message.value = null
    try {
      const response = await $fetch(`/api/v1/${resource}`, { params: { slug } })
      return response
    } catch (error) {
      errorMsg.value = error.data
    }
  }

  const saveDoc = async (resource, doc) => {
    errorMsg.value = null
    message.value = null
    // console.log('KKKKKK', resource)
    try {
      if (doc._id) {
        await $fetch(`/api/v1/${resource}`, {
          method: 'PATCH',
          params: { id: doc._id },
          body: doc,
        })
      } else {
        await $fetch(`/api/v1/${resource}`, { method: 'POST', body: doc })
      }
      message.value = `Category ${doc.name} saved succesfully`
    } catch (error) {
      errorMsg.value = error.data
    }
  }

  const deleteById = async (resource, docId) => {
    errorMsg.value = null
    message.value = null
    try {
      await $fetch(`/api/v1/${resource}`, {
        method: 'DELETE',
        params: { id: docId },
      })
    } catch (err) {
      errorMsg.value = err.data
    }
  }

  return { state, errorMsg, message, alert, fetchAllDocs, saveDoc, fetchBySlug, deleteById }
}

export default useFactory
