import { defineStore } from 'pinia'

export const useStore = defineStore('store', {
  state: () => {
    return {
      product: {},
      variants: [],
      categories: [],
      attributes: [],
      attributeTerms: [],
      showAttributesSlideout:false
    }
  },
})
