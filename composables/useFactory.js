const useFactory = () => {
  const galleryMedia = useState('galleryMedia', () => [])
  const mediaReference = useState('mediaReference', () => [])

  const fetchAll = async (resource, params) => {
    try {
      const response = await $fetch(`/api/v1/${resource}`, { params })
      return response
    } catch (error) {
      return { ok: false, errorMsg: error.data }
    }
  }

  const fetchBySlug = async (resource, slug) => {
    let response = null
    try {
      if (slug) response = await $fetch(`/api/v1/${resource}`, { params: { slug } })
      return response
    } catch (error) {
      return { ok: false, errorMsg: error.data }
    }
  }

  const fetchById = async (resource, id) => {
    let response = null
    try {
      if (id) response = await $fetch(`/api/v1/${resource}`, { params: { id } })
      return response
    } catch (error) {
      return { ok: false, errorMsg: error.data }
    }
  }

  const saveDoc = async (resource, doc) => {
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
      return response
    } catch (error) {
      return { ok: false, errorMsg: error.data }
    }
  }

  const saveDocs = async (resource, docs) => {
    let response = null
    try {
      response = await $fetch(`/api/v1/${resource}`, { method: 'POST', body: docs })
      console.log(response)
      return response
    } catch (error) {
      return { ok: false, errorMsg: error.data }
    }
  }

  const deleteDoc = async (resource, id) => {
    try {
      const response = await $fetch(`/api/v1/${resource}`, {
        method: 'DELETE',
        params: { id },
      })
      return { status: 'ok', data: response }
    } catch (error) {
      return { status: 'error', data: error.data }
    }
  }

  const deleteMany = async (resource, condition) => {
    try {
      const response = await $fetch(`/api/v1/${resource}`, {
        method: 'DELETE',
        params: condition,
      })
      return { status: 'ok', data: response }

      // return response
      // console.log('RRRRRR', response)
    } catch (error) {
      // console.log('EEEEEE', error.data)
      // return { ok: false, errorMsg: error.data }
      return { status: 'error', data: error.data }
    }
  }

  return {
    galleryMedia,
    mediaReference,
    fetchAll,
    fetchById,
    fetchBySlug,
    saveDoc,
    saveDocs,
    deleteDoc,
    deleteMany,
  }
}

export default useFactory
