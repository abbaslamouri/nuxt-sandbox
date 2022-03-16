<script setup>
const emit = defineEmits(['saveAttributes', 'closeSlideout'])

const { product, variants } = useStore()
const { errorMsg, alert } = useFactory()

const attributeToDelteIndex = ref(null)
const termToDeleteId = ref(null)
const termsToDeleteAttrId = ref(null)

const allAttributes = (await $fetch(`/api/v1/attributes`, { fields: 'name, slug' })).docs
const allAttributeTerms = (await $fetch(`/api/v1/attributeterms`, { fields: 'name, slug, parent' })).docs

const current = JSON.stringify(product.value.attributes)

const removeVariantByTermId = (termId) => {
  // let j = 0
  // while (j < store.variants.length) {
  //   const k = store.variants[j].attrTerms.findIndex((t) => t._id == termId)
  //   const countBefore = store.variants[j].attrTerms.length
  //   if (k !== -1) store.variants[j].attrTerms.splice(k, 1)
  //   const countAfter = store.variants[j].attrTerms.length
  //   if (countBefore != countAfter) store.variants[j].discard = true
  //   j++
  // }
  // store.variants = store.variants.filter((el) => !el.discard)
}

const insertEmptyAttribute = (attribute, terms, defaultTerm) => {
  if (product.value.attributes.length == allAttributes.length)
    return (errorMsg.value = 'You have used up all available attributes')
  product.value.attributes.push({
    attribute,
    terms,
    defaultTerm,
    enabled: true,
    variation: true,
  })
}

const addAllAttributes = () => {
  for (const prop in allAttributes) {
    const attribute = allAttributes[prop]
    const terms = allAttributeTerms.filter((t) => t.parent._id == allAttributes[prop]._id)
    insertEmptyAttribute(attribute, terms, terms[0])
  }
}

const updateAttribute = (payload) => {
  const { attributeId, newAttributeId } = payload
  const index = product.value.attributes.findIndex((a) => a.attribute._id == attributeId)
  if (index !== -1) {
    product.value.attributes[index].attribute = allAttributes.find((a) => a._id == newAttributeId)
    product.value.attributes[index].terms = []
    product.value.attributes[index].defaultTerm = allAttributeTerms.filter((t) => t.parent._id == newAttributeId)[0]
  }
}

const closeSlideout = () => {
  if (current !== JSON.stringify(product.value.attributes)) {
    showAlert(
      'You have unsaved changes',
      'Please save your changes before closing this window or click cancel to exit without saving.',
      'closeSlideout',
      false
    )
  } else {
    emit('closeSlideout')
  }
}

const showRemoveAllAttributesAlert = () => {
  showAlert(
    'Are you sure you want to delete all attributes',
    'Any variants accociated with this attribute will aso be deleted.',
    'removeAllAttributes',
    true
  )
}

const saveAttributes = async () => {
  if (current == JSON.stringify(product.value.attributes)) return emit('closeSlideout')

  const newAttributes = []
  for (const prop in product.value.attributes) {
    if (!product.value.attributes[prop].attribute._id)
      return (errorMsg.value = `Please select a value for attribute ${prop * 1 + 1} `)
    if (!product.value.attributes[prop].terms.length)
      return (errorMsg.value = `Attributes must contain at least one term.  Please select a value for attribute ${
        prop * 1 + 1
      }`)

    newAttributes.push(product.value.attributes[prop])
  }
  product.value.attributes = newAttributes
  emit('saveAttributes')
  emit('closeSlideout')
}

const cancelAttributesUpdate = () => {
  product.value.attributes = JSON.parse(current)
  emit('closeSlideout')
}

const removeAllAttributes = () => {
  product.value.attributes = []
  alert.value.show = false
  alert.value.action = ''
}


const showRemoveAttributeAlert = (attributeIndex) => {
  attributeToDelteIndex.value = attributeIndex
  showAlert(
    'Are you sure you want to delete this attribute?',
    'All product variants associated with this attribute will also be removed.',
    'removeAttribute',
    true
  )
}

const removeAttribute = () => {
  product.value.attributes.splice(attributeToDelteIndex.value, 1)
  alert.value.show = false
  alert.value.action = ''
}

const handleAddTerm = (payload) => {
  const { attributeId, termId } = payload
  const index = product.value.attributes.findIndex((a) => a.attribute._id == attributeId)
  if (index !== -1) {
    const term = allAttributeTerms.find((t) => t._id == termId)
    if (term) {
      if (!product.value.attributes[index].terms.length) {
        product.value.attributes[index].terms = [term]
      } else {
        const i = product.value.attributes[index].terms.findIndex((t) => t._id == termId)
        if (i == -1) product.value.attributes[index].terms.push(term)
      }
    }
  }
}

const handleAddAllTerms = (attributeId) => {
  const index = product.value.attributes.findIndex((a) => a.attribute._id == attributeId)
  if (index !== -1) product.value.attributes[index].terms = allAttributeTerms.filter((t) => t.parent._id == attributeId)
}

const showRemoveTermAlert = (termId) => {
  termToDeleteId.value = termId
  showAlert(
    'Are you sure you want to remove this attribute term?',
    'Any variants containing this term will also be removed.',
    'removeTerm',
    true
  )
}

const removeTerm = async () => {
  for (const prop in product.value.attributes) {
    const i = product.value.attributes[prop].terms.findIndex((t) => t._id == termToDeleteId.value)
    if (i !== -1) product.value.attributes[prop].terms.splice(i, 1)
  }
  for (const prop in variants.value) {
    const term = variants.value[prop].attrTerms.find((t) => t._id == termToDeleteId.value)
    if (term) variants.value[prop].toDelete = true
  }
  variants.value = variants.value.filter((v) => !v.toDelete)
  termToDeleteId.value = null
  alert.value.show = false
  alert.value.action = ''
}

const showRemoveAllTermsAlert = (attributeId) => {
  termsToDeleteAttrId.value = attributeId
  showAlert(
    'Are you sure you want to remove all terms associated with this attribute?',
    'Any product variants containing these terms will also be removed.',
    'removeAllTerms',
    true
  )
}

const removeAllTerms = () => {
  const index = product.value.attributes.findIndex((a) => a.attribute._id == termsToDeleteAttrId.value)
  if (index !== -1) product.value.attributes[index].terms = []
  alert.value.show = false
  alert.value.action = ''
}

const showAlert = (heading, paragraph, action, showCancelBtn) => {
  alert.value.heading = heading
  alert.value.paragraph = paragraph
  alert.value.action = action
  alert.value.showCancelBtn = showCancelBtn
  alert.value.show = true
}

watch(
  () => alert.value.show,
  (currentVal) => {
    if (currentVal === 'ok' && alert.value.action === 'closeSlideout') alert.value = false
    if (currentVal === 'ok' && alert.value.action === 'removeAttribute') removeAttribute()
    if (currentVal === 'ok' && alert.value.action === 'removeAllAttributes') removeAllAttributes()
    if (currentVal === 'ok' && alert.value.action === 'removeTerm') removeTerm()
    if (currentVal === 'ok' && alert.value.action === 'removeAllTerms') removeAllTerms()
  }
  // { deep: true }
)
</script>

<template>
  <Slideout class="attributes" @closeSlideout="closeSlideout">
    <template v-slot:header>
      <h3>Edit Attributes</h3>
    </template>
    <template v-slot:default>
      <div class="flex-col gap2 p2">
        <header class="flex-row items-center justify-between bg-slate-200 p2">
          <h2>Attributes</h2>
          <div class="flex-row gap2">
            <button class="btn btn__primary py05 px2 text-xs" @click="insertEmptyAttribute({}, [], {})">
              Add Attribute
            </button>
            <button class="btn btn__primary py05 px2 text-xs" @click="addAllAttributes">Add All Attributes</button>
            <button class="btn btn__secondary py05 px2 text-xs" @click="showRemoveAllAttributesAlert">
              Remove All Attributes
            </button>
          </div>
        </header>
        <main>
          <EcommerceAdminProductsProductEmptyAttributesMsg
            v-if="!product.attributes.length"
            :allAttributes="allAttributes"
          />
          <EcommerceAdminProductsAttributesList
            v-else
            @removeAttribute="showRemoveAttributeAlert"
            @addTerm="handleAddTerm"
            @addAllTerms="handleAddAllTerms"
            @removeTerm="showRemoveTermAlert"
            @removeAllTerms="showRemoveAllTermsAlert"
            @updateAttribute="updateAttribute"
          />
        </main>
      </div>
    </template>
    <template v-slot:footer>
      <div class="flex-row items-center justify-end gap2">
        <button class="btn btn_secondary py05 px3" @click.prevent="cancelAttributesUpdate">Cancel</button>
        <button
          class="btn btn__primary py05 px3"
          :class="{ disabled: current == JSON.stringify(product.attributes) }"
          @click.prevent="saveAttributes"
        >
          Save Changes
        </button>
      </div>
    </template>
  </Slideout>
</template>

<style lang="scss" scoped></style>
