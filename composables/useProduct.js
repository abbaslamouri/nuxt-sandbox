const useFactory = () => {
	const state = reactive({
		params: {
			fields:
				'name, slug, price, salePrice, permalink, categories, excerpt, description, intensity, roastiness, attributes, gallery, manageInventory',
		},
		categoryParams: {
			fields: 'name, slug, permalink, description, parent, gallery',
		},
		attributeParams: {
			fields: 'name, slug',
		},

		attributeTermsParams: {
			fields: 'name, slug, parent',
		},
		variantParams: {
			fields: 'product, attrTerms, gallery, price, salePrice, sku, stockQty, enabled',
		},

		errorMsg: '',
	})

	const fetchAll = async (payload) => {
		state.errorMsg = null
		try {
			const response = await $fetch('/api/v1/products', { params: { ...state.params, ...payload } })
			return {
				docs: response.docs,
				count: response.count,
				totalCount: response.totalCount,
			}
		} catch (error) {
			state.errorMsg = error.data
			return false
		}
	}

	const fetchSingle = async (slug) => {
		state.errorMsg = null
		try {
			if (slug) {
				state.params.slug = slug
				const response = await $fetch('/api/v1/products', { params: { ...state.params, indexPage: false } })
				return response.docs[0]
			} else {
				return {
					name: '',
					type: 'simple',
					attributes: [],
					categories: [],
					gallery: [],
					extraFields: [],
				}
			}
		} catch (error) {
			state.errorMsg = error.data
			return false
		}
	}

	const save = async (product) => {
		state.errorMsg = null
		let response = null
		try {
			if (!product.name || !product.price) {
				state.errorMsg = 'Product name and price are required'
				return false
			}
			if (product._id) {
				response = await $fetch('/api/v1/products', {
					method: 'PATCH',
					body: product,
					params: { id: product._id },
				})
			} else {
				response = await $fetch('/api/v1/products', {
					method: 'POST',
					body: product,
				})
			}
			return response
		} catch (error) {
			state.errorMsg = error.data
			return false
		}
	}

	const deleteSingle = async (id) => {
		state.errorMsg = null
		try {
			await $fetch('/api/v1/products', { method: 'DELETE', params: { id } })
			return true
		} catch (error) {
			state.errorMsg = error.data
			return false
		}
	}

	const fetchCategories = async () => {
		state.errorMsg = null
		try {
			const response = await $fetch('/api/v1/categories', { params: state.categoryParams })
			return {
				docs: response.docs,
				count: response.count,
				totalCount: response.totalCount,
			}
		} catch (error) {
			state.errorMsg = error.data
			return false
		}
	}

	const fetchAttributes = async () => {
		state.errorMsg = null
		try {
			const response = await $fetch('/api/v1/attributes', { params: state.attributeParams })
			return {
				docs: response.docs,
				count: response.count,
				totalCount: response.totalCount,
			}
		} catch (error) {
			state.errorMsg = error.data
			return false
		}
	}

	const fetchAttributeTerms = async () => {
		state.errorMsg = null
		try {
			const response = await $fetch('/api/v1/attributeterms', { params: state.attributeTermsParams })
			return {
				docs: response.docs,
				count: response.count,
				totalCount: response.totalCount,
			}
		} catch (error) {
			state.errorMsg = error.data
			return false
		}
	}

	const fetchVariants = async (productId) => {
		state.errorMsg = null
		try {
			state.variantParams.product = productId
			const response = await $fetch('/api/v1/variants', { params: state.variantParams })
			return {
				docs: response.docs,
				count: response.count,
				totalCount: response.totalCount,
			}
		} catch (error) {
			state.errorMsg = error.data
			return false
		}
	}

	const saveVariants = async (variants) => {
		state.errorMsg = null
		let error = ''
		await Promise.all(
			variants.map(async (variant) => {
				try {
					await $fetch(`/api/v1/variants`, {
						method: 'POST',
						body: variant,
					})
				} catch (err) {
					error += `${err.data}.<br>`
				}
			})
		)
		if (!error) {
			return true
		} else {
			state.errorMsg = error
			return false
		}
	}

	const deleteVariants = async (productId) => {
		state.errorMsg = null
		try {
			const response = await $fetch('/api/v1/variants/delete-many', {
				method: 'POST',
				params: { productId },
			})
			console.log(response)
			return true
		} catch (error) {
			state.errorMsg = error.data
			return false
		}
	}

	return {
		state,
		fetchAll,
		fetchSingle,
		save,
		deleteSingle,
		fetchCategories,
		fetchAttributes,
		fetchAttributeTerms,
		fetchVariants,
		saveVariants,
		deleteVariants,
	}
}

export default useFactory
