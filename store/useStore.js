import { defineStore } from 'pinia'

export const useStore = defineStore('store', {
  state: () => {
    return {
      // products: [],
      // productsCount: null,
      // productsTotalCount: null,
      product: {},
      variants: [],
      categories: [],
      attributes: [],
      attributeTerms: [],
      showAttributesSlideout: false,
      showVariantsSlideout: false,
      // showVariantEditSlideout: false,
    }
  },
})
