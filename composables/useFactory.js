const useFactory = () => {
  // const state = useState('errorMsg', () => {
  //   return {
  //     zdocs: [],
  //     doc: {},
  //     count: 0,
  //     totalCount: 0,
  //     errorMsg: '',
  //     message: '',
  //     referenceMedia: '',
  //     selectedMedia: [],
  //     showAlert: false,
  //     alertHeading: '',
  //     alertParagraph: '',
  //     alertAction: '',
  //     showAlertCancelBtn: true,
  //     showAttributesSlideout: false,
  //   }
  // })
  const errorMsg = useState('errorMsg', () => '')
  const message = useState('message', () => '')
  const galleryMedia = useState('galleryMedia', () => [])
  const mediaReference = useState('mediaReference', () => [])
  const showMediaSelector = useState('showMediaSelector', () => false)
  // const showCartSlideout = useState('showCartSlideout', () => false)

  const alert = useState('alert', () => {
    return {
      show: false,
      heading: '',
      paragraph: '',
      action: '',
      showCancelBtn: true,
      // showAttributesSlideout: false,
    }
  })

  const fetchAll = async (resource, params) => {
    errorMsg.value = null
    message.value = null
    try {
      const response = await $fetch(`/api/v1/${resource}`, { params })
      return response
    } catch (error) {
      errorMsg.value = error.data
      return []
    }
  }

  const fetchBySlug = async (resource, slug) => {
    // errorMsg.value = null
    // message.value = null
    let response = null
    try {
      if (slug) response = await $fetch(`/api/v1/${resource}`, { params: { slug } })
      return response
    } catch (error) {
      // errorMsg.value = error.data
      return { ok: false, errorMsg: error.data }
    }
  }

  const saveDoc = async (resource, doc) => {
    errorMsg.value = null
    message.value = null
    let response = null
    try {
      if (doc._id) {
        response = await $fetch(`/api/v1/${resource}`, {
          method: 'PATCH',
          params: { id: doc._id },
          body: doc,
        })
      } else {
        response = await $fetch(`/api/v1/${resource}`, { method: 'POST', body: doc })
      }
      message.value = `${doc.name} saved succesfully`
      return response
    } catch (error) {
      errorMsg.value = error.data
      return null
    }
  }

  const saveDocs = async (resource, docs) => {
    errorMsg.value = null
    message.value = null
    let response = null
    try {
      response = await $fetch(`/api/v1/${resource}`, { method: 'POST', body: docs })
      console.log(response)
      return response
    } catch (error) {
      errorMsg.value = error.data
      return null
    }
  }

  const deleteById = async (resource, id) => {
    errorMsg.value = null
    message.value = null
    try {
      const response = await $fetch(`/api/v1/${resource}`, {
        method: 'DELETE',
        params: { id },
      })
      return response
    } catch (err) {
      errorMsg.value = err.data
      return null
    }
  }

  const deleteMany = async (resource, condition) => {
    console.log('CD', condition)
    errorMsg.value = null
    message.value = null
    try {
      const response = await $fetch(`/api/v1/${resource}`, {
        method: 'DELETE',
        params: condition,
      })
      return response
    } catch (err) {
      errorMsg.value = err.data
      return null
    }
  }

  return {
    // state,
    errorMsg,
    message,
    galleryMedia,
    mediaReference,
    showMediaSelector,
    alert,
    fetchAll,
    saveDoc,
    saveDocs,
    fetchBySlug,
    deleteById,
    deleteMany,
  }
}

export default useFactory
