<script setup>
useMeta({
  title: 'Product | YRL',
})

const { product, variants } = useStore()
const {
  errorMsg,
  message,
  galleryMedia,
  mediaReference,
  showMediaSelector,
  fetchBySlug,
  fetchAll,
  saveDoc,
  saveDocs,
  deleteMany,
} = useFactory()

const route = useRoute()
const router = useRouter()

const selectedTerms = ref([])
const selectedVariant = ref({})
let response = null

const productSlug = route.params.productSlug === ' ' ? null : route.params.productSlug

response = await fetchBySlug('products', productSlug)
if (response && response.ok === false) errorMsg.value = response.error
if (response) product.value = response
if (product.value.productType === 'variable') {
  variants.value = product.value._id
    ? (
        await fetchAll('variants', {
          fields: 'product, attrTerms, gallery enabled price salePrice',
          product: product.value._id,
        })
      ).docs
    : []

  selectedVariant.value = { ...variants.value[0] }
  selectedTerms.value = selectedVariant.value.attrTerms.map((t) => t._id)
}

const getProductImage = () => {
  if (product.value.productType === 'simple') {
    console.log('KKKKKKKK')
    return product.value.gallery && product.value.gallery[1] ? product.value.gallery[1].path : '/placeholder.png'
  } else if (product.value.productType === 'variable') {
    return selectedVariant.gallery && selectedVariant.gallery[0]
      ? selectedVariant.gallery[0].path
      : product.value.gallery && product.value.gallery[1]
      ? product.value.gallery[1].path
      : '/placeholder.png'
  }
}

const setSelectedTerms = (i, termId) => {
  let found = null
  selectedTerms.value[i] = termId
  for (const prop in variants.value) {
    if (
      JSON.stringify(variants.value[prop].attrTerms.map((t) => t._id).sort()) ===
      JSON.stringify(selectedTerms.value.sort())
    ) {
      found = variants.value[prop]._id
      break
    }
  }
  selectedVariant.value = variants.value.filter((v) => v._id == found)[0]
  selectedTerms.value = selectedVariant.value.attrTerms.map((t) => t._id)
}
</script>

<template>
  <div class="border-red flex-row justify-center">
    <div class="relative">
      <div class="w996 h60 border-pink overflow-hidden">
        <img class="img" :src="getProductImage()" :alt="`${product.name} Photo`" />
      </div>

      <div>
        <div class="minw40 shadow-md absolute top0 right0 minh-56 bg-slate-50 p4 flex-col items-center">
          <h2 class="title font-700">
            {{ product.name }}
          </h2>
          <div>
            <EcommerceProductsCoffeeIntensity :intensity="product.intensity" :total="13" v-if="product.intensity" />
          </div>
          <button class="btn btn__checkout wfull justify-between px1 py05">
            <IconsShoppingBag />
            Add To Bag
            <IconsPlus />
          </button>
        </div>
      </div>
    </div>

    <div>
      <div v-for="(attribute, index) in product.attributes" :key="attribute.attribute._id">
        <div class="base-select">
          <select @change="setSelectedTerms(index, $event.target.value)">
            <option
              v-for="term in attribute.terms"
              :key="term._id"
              :value="term._id"
              :selected="selectedVariant.attrTerms && selectedVariant.attrTerms.map((t) => t._id).includes(term._id)"
            >
              {{ term.name }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.img {
  width: 160rem;
  height: 60 rem;
  position: absolute;
  top: 0;
  right: 22rem;
}

.title {
  line-height: 10rem;
  letter-spacing: 0.5rem;
  font-size: 3rem;
}
</style>
