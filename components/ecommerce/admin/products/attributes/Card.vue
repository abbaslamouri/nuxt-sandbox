<script setup>
const props = defineProps({
  index: {
    type: Number,
  },
  showAction: {
    type: Boolean,
  },
  // allAttributes: {
  //   type: Array,
  //   default: [],
  // },
  // allAttributeTerms: {
  //   type: Array,
  //   default: [],
  // },
})

const emit = defineEmits(['removeAttribute', 'removeTerm', 'setActions', 'resetActions'])

const { product } = useStore()
// const { alert } = useFactory()
const { errorMsg, fetchAll } = useFactory()

const updateAttribute = (event) => {
  product.value.attributes[props.index].attribute = props.allAttributes.find((a) => a._id == event.target.value)
  product.value.attributes[props.index].terms = []
  product.value.attributes[props.index].defaultTerm = props.allAttributeTerms.filter(
    (t) => t.parent._id == event.target.value
  )[0]
}

const allAttributes = (await $fetch(`/api/v1/attributes`, { fields: 'name, slug' })).docs
const allAttributeTerms = (await $fetch(`/api/v1/attributeterms`, { fields: 'name, slug, parent' })).docs

// const removeAttribute = () => {
//   const attributeId = product.value.attributes[props.index].attribute._id
//   for (const prop in product.value.variants) {
//     const i = product.value.variants[prop].attrTerms.findIndex((t) => t.parent._id == attributeId)
//     if (i !== -1) product.value.variants[prop].attrTerms.splice(i, 1)
//   }
//   product.value.attributes.splice(props.index, 1)
//   emit('resetActions', { index: props.index, action: false })
//   alert.value.show = false
//   alert.value.action = ''
// }

// const setAlert = (alertPayload) => {
//   alert.value.action = alertPayload.alertAction
//   alert.value.heading = alertPayload.alertHeading
//   alert.value.paragraph = alertPayload.alertParagraph
//   alert.value.show = true
//   console.log('A', alert.value)
// }

// watch(
//   () => alert.value,
//   (currentVal) => {
//     console.log('W', currentVal)
//     if (currentVal.show === 'ok' && currentVal.action === 'removeAttribute') removeAttribute()
//   },
//   { deep: true }
// )
</script>

<template>
  <div class="row border border-slate-200 p1">
    <div class="td bg-slate-300 br3 p1 items-self-center">{{ index * 1 + 1 }}</div>
    <EcommerceAdminProductsAttributesAttribute
      class="td"
      :index="index"
      :allAttributes="allAttributes"
      :allAttributeTerms="allAttributeTerms"
    />
    <div class="td">
      <FormsBaseToggle
        v-model="product.attributes[index].enabled"
        v-if="Object.keys(product.attributes[index].attribute).length"
      />
    </div>
    <div class="td">
      <FormsBaseToggle
        v-model="product.attributes[index].variation"
        v-if="Object.keys(product.attributes[index].attribute).length && product.attributes[index].enabled"
      />
    </div>
    <EcommerceAdminProductsAttributesDefaultTerm class="td" :allAttributeTerms="allAttributeTerms" :index="index" />
    <EcommerceAdminProductsAttributesTerms
      class="td"
      :index="index"
      :allAttributeTerms="allAttributeTerms"
      @removeTerm="$emit('removeTerm', $event)"
    />
    <EcommerceAdminActions
      class="td"
      :showAction="showAction"
      :showEdit="false"
      @moreHoriz="$emit('setActions', { index: index, action: !showAction })"
      @deleteAction="$emit('removeAttribute', index)"
    />
  </div>
</template>

<style lang="scss" scoped></style>
