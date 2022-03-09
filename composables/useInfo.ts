// const apiFetch = $fetch.create({ baseURL: '/api/v1' })
// import { useMessage } from '~/store/useMessage'
// import { useStore } from '~/store/useStore'

export const useCounter = () => useState < number > ('counter', () => 0)
export const useColor = () => useState < string > ('color', () => 'pink')
// const store = useStore()
// const appMessage = useMessage()

// import { useState } from '#app'

// const useInfo = () => {
// 	const state = reactive({
// 		errorMsg: '',
// 	})

// const statex = useState('state', () => 'PPPPPP')

// const fetchAll = async (params) => {
// 	appMessage.errorMsg = 'XXXXXXX'
// 	state.errorMsg = null
// 	try {
// 		const response = await $fetch(`/api/v1/${resource}`, { params })
// 		console.log(response)
// 		return {
// 			docs: response.docs,
// 			count: response.count,
// 			totalCount: response.totalCount,
// 		}
// 	} catch (error) {
// 		state.errorMsg = error.data
// 	}
// }

// const fetchCount = async (params) => {
//   state.errorMsg = ''
//   const { data, error } = await useFetch(`/v1/${resource}/count`, {
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
//   const { data, error } = await useFetch(`/v1/${resource}/`, {
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
//     await http.delete(`v1/${resource}/${id}`)
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

// 	return { state }
// }

// export default useInfo
