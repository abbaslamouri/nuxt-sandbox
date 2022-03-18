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
console.log(route)

response = await fetchBySlug('products', productSlug)
if (response && response.ok === false) errorMsg.value = response.error
if (response) product.value = response
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
  <div>
    <div class="maxw60 border border-slate-300">
      <img
        class="wfull hfull contain"
        :src="
          selectedVariant.gallery && selectedVariant.gallery[0]
            ? selectedVariant.gallery[0].path
            : product.gallery && product.gallery[1]
            ? product.gallery[1].path
            : '/placeholder.png'
        "
        alt=""
      />
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

<style lang="scss"></style>
