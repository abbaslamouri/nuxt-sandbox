<script setup>
import { useMessage } from '~/store/useMessage'

const props = defineProps({
  productAttributes: {
    type: Array,
  },
  productId: {
    type: String,
  },
  // variants: {
  //   type: Array,
  // },
  // attributes: {
  //   type: Array,
  // },
  // attributeTerms: {
  //   type: Array,
  // },

  // showSlideout: {
  //   type: Boolean,
  // },
  // index: Number,
})

const emit = defineEmits(['saveVariants', 'hideSlidout', 'compAttributesUpdated'])

const appMessage = useMessage()
const attributes = ref([])
const attributeTerms = ref([])
const showSlideout = ref(false)
const showAlert = ref(false)
const compAttributes = ref([])

for (const prop in props.productAttributes) {
  compAttributes.value.push(props.productAttributes[prop])
}

const router = useRouter()

const currentProductAttributes = JSON.stringify(props.productAttributes)

const attributeParams = computed(() => {
  return {
    fields: 'name, slug',
  }
})

// Set query params
const attributeTermsParams = computed(() => {
  return {
    fields: 'name, slug, parent',
  }
})

const fetchAttributes = async () => {
  appMessage.errorMsg = null
  try {
    const response = await $fetch('/api/v1/attributes', { params: attributeParams.value })
    attributes.value = response.docs
    console.log('Attributes', attributes.value)
  } catch (error) {
    appMessage.errorMsg = error.data
  }
}

const fetchAttributeTerms = async () => {
  appMessage.errorMsg = null
  try {
    const response = await $fetch('/api/v1/attributeterms', { params: attributeTermsParams.value })
    attributeTerms.value = response.docs
    console.log('Terms', attributeTerms.value)
  } catch (error) {
    appMessage.errorMsg = error.data
  }
}

await Promise.all([fetchAttributes(), fetchAttributeTerms()])

const getAttribute = (attributeId) => {
  // return prodState.selectedItem.attributes.filter((el) => el.item._id == attributeId)[0].item
}

const getTerms = (attributeId) => {
  // const terms = prodState.selectedItem.attributes.filter((el) => el.item._id == attributeId)[0].terms
  // return terms
}

const removeVariant = () => {
  // if (!confirm('Are you sure?')) return
  // prodState.selectedItem.variants.splice(props.index, 1)
}

const updateVariant = (attribute, termId) => {
  // console.log('AT', attribute)
  // console.log(value)
  // const term = attribute.terms.find((t) => t._id == termId)
  // console.log('T', term)
  // if (!prodState.selectedItem.variants[props.index].attrTerms.length) {
  // prodState.selectedItem.variants[props.index].attrTerms.push(term)
  // }
}

const closeSlideout = () => {
  console.log('Before', JSON.parse(currentProductAttributes))
  console.log('COMPARE', currentProductAttributes === JSON.stringify(props.productAttributes))
  if (currentProductAttributes !== JSON.stringify(props.productAttributes)) return (showAlert.value = true)
  showSlideout.value = false
  // const newAttributes = []
  // for (const prop in props.productAttributes) {
  //   if (Object.values(props.productAttributes[prop].attribute).length)
  //     newAttributes.push(props.productAttributes[prop])
  // }
  // props.productAttributes = newAttributes
  // console.log('After', props.productAttributes)
}

const saveCompAttributes = () => {
  const newAttributes = []
  for (const prop in compAttributes.value) {
    if (Object.values(compAttributes.value[prop].attribute).length) newAttributes.push(compAttributes.value[prop])
  }
  compAttributes.value = newAttributes
  console.log('CCCC', compAttributes.value)
  // showSlideout.value = false
  // emit('productAttributesUpdated', newAttributes)
}

const updateCompAttributes = () => {
  const newAttributes = []
  for (const prop in compAttributes.value) {
    if (Object.values(compAttributes.value[prop].attribute).length) newAttributes.push(compAttributes.value[prop])
  }
  compAttributes.value = newAttributes
  console.log('CCCC', compAttributes.value)
  // showSlideout.value = false
  // emit('productAttributesUpdated', newAttributes)
}

const cancelAttributes = () => {
  compAttributes.value = JSON.parse(currentProductAttributes)
  // emit('productAttributesUpdated', JSON.parse(currentProductAttributes))
  showSlideout.value = false
}

const updateVariants = async (event) => {
  // console.log('ECV', event)
  // await deleteVariants()
  // variants.value = event
  // await createVariants()
  // showSlideout.value = false
  // emit('saveVariants')
}

// watch(
//   () => compAttributes.value,
//   (current) => {
//     console.log(current)
//     emit('compAttributesUpdated', compAttributes.value)
//   },
//   { deep: true }
// )
</script>

<template>
  <section class="attributes" id="attributes">
    <EcommerceAdminProductAttributesSectionContent :productAttributes="compAttributes" />
    <EcommerceAdminProductAttributesSlideout />
  </section>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';
// .attributes {
//   background-color: white;
//   border-radius: 5px;
//   padding: 2rem 2rem 4rem;

//   // header {
//   //   display: flex;
//   //   align-items: center;
//   //   justify-content: space-between;
//   // }

//   .content {
//     display: flex;
//     flex-direction: column;
//     gap: 2rem;

//     .title {
//       font-size: 80%;
//     }

//     .attributes {
//       display: flex;
//       flex-direction: column;
//       gap: 2rem;

//       .attribute {
//         display: flex;
//         align-items: center;
//         gap: 1rem;

//         .terms {
//           flex: 1;
//           display: flex;
//           align-items: center;
//           gap: 2rem;
//           // border: 1px solid red;

//           .term {
//             background-color: $slate-500;
//             color: $slate-50;
//             font-size: 80%;
//             padding: 0.25rem 1rem 0.5rem;
//             border-radius: 2rem;
//           }
//         }
//       }
//     }
//   }
//   .attributes-variants {
//     width: 100%;
//     height: 100%;
//     background-color: $slate-100;
//     // border: 10px solid red;
//     display: flex;
//     flex-direction: column;
//     justify-content: space-between;

//     .header {
//       display: flex;
//       align-items: center;
//       justify-content: space-between;
//       padding: 2rem;
//       background-color: white;
//       // border: 1px solid red;

//       .btn {
//         border: none;

//         svg {
//           width: 2rem;
//           height: 2rem;
//         }
//       }
//     }
//     .admin-product-attributes-panel {
//       background-color: white;
//       // border: 1px solid red;
//       height: 95%;
//       display: flex;
//       flex-direction: column;
//       gap: 2rem;
//       // padding: 4rem 2rem;
//       header {
//         display: flex;
//         align-items: center;
//         justify-content: space-between;
//         padding: 2rem;
//         background-color: $slate-300;
//       }

//       main {
//         form {
//           display: flex;
//           flex-direction: column;
//           gap: 1rem;

//           .btn {
//             align-self: flex-end;
//             margin-top: 1rem;
//           }
//         }
//         // flex: 1;
//         // border: 1px solid red;
//       }
//       // footer {
//       //   display: flex;
//       //   justify-content: flex-end;
//       //   gap: 2rem;
//       //   padding: 1rem 3rem;

//       //   .btn {
//       //     padding: 2rem 3rem;
//       //     border-radius: 5px;
//       //   }
//       // }
//     }
//     .main {
//       flex: 1;
//       // border: 1px solid red;

//       // .attributes-variants {
//       //   display: flex;
//       //   flex-direction: column;
//       //   gap: 2rem;
//       // }
//     }

//     .footer {
//       width: 100%;
//       display: flex;
//       align-items: center;
//       justify-content: flex-end;
//       gap: 2rem;
//       padding: 2rem;
//       background-color: white;
//       // border: 1px solid red;
//     }
//   }
// }
</style>
