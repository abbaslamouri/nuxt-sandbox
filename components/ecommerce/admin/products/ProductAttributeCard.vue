<script setup>
const props = defineProps({
  index: {
    type: Number,
  },
  showActions: {
    type: Boolean,
  },
  allAttributes: {
    type: Array,
    default: [],
  },
  allAttributeTerms: {
    type: Array,
    default: [],
  },
})

const emit = defineEmits(['resetActions'])

const { product } = useStore()
const { alert } = useFactory()

const updateAttribute = (event) => {
  product.value.attributes[props.index].attribute = props.allAttributes.find((a) => a._id == event.target.value)
  product.value.attributes[props.index].terms = []
  product.value.attributes[props.index].defaultTerm = props.allAttributeTerms.filter(
    (t) => t.parent._id == event.target.value
  )[0]
}

const removeAttribute = () => {
  const attributeId = product.value.attributes[props.index].attribute._id
  for (const prop in product.value.variants) {
    const i = product.value.variants[prop].attrTerms.findIndex((t) => t.parent._id == attributeId)
    if (i !== -1) product.value.variants[prop].attrTerms.splice(i, 1)
  }
  product.value.attributes.splice(props.index, 1)
  emit('resetActions', { index: props.index, action: false })
  alert.value.show = false
  alert.value.action = ''
}

const setAlert = (alertPayload) => {
  alert.value.action = alertPayload.alertAction
  alert.value.heading = alertPayload.alertHeading
  alert.value.paragraph = alertPayload.alertParagraph
  alert.value.show = true
  console.log('A', alert.value)
}

watch(
  () => alert.value,
  (currentVal) => {
    console.log('W', currentVal)
    if (currentVal.show === 'ok' && currentVal.action === 'removeAttribute') removeAttribute()
  },
  { deep: true }
)
</script>

<template>
  <div class="admin-product-attribute row border border-slate-200 p1">
    <div class="id td">{{ index * 1 + 1 }}</div>
    <EcommerceAdminProductsProductAttribute
      class="td"
      :index="index"
      :allAttributes="allAttributes"
      :allAttributeTerms="allAttributeTerms"
    />
    <div class="active td">
      <FormsBaseToggle
        v-model="product.attributes[index].enabled"
        v-if="Object.keys(product.attributes[index].attribute).length"
      />
    </div>
    <div class="variation td">
      <FormsBaseToggle
        v-model="product.attributes[index].variation"
        v-if="Object.keys(product.attributes[index].attribute).length && product.attributes[index].enabled"
      />
    </div>
    <EcommerceAdminProductsProductAttributeDefaultTerm
      class="td"
      :allAttributeTerms="allAttributeTerms"
      :index="index"
    />
    <EcommerceAdminProductsProductAttributeTerms class="td" :index="index" :allAttributeTerms="allAttributeTerms" />
    <div class="actions td">
      <div class="menu shadow-md" v-show="showActions">
        <a
          href="#"
          class="link"
          @click.prevent="
            setAlert({
              alertAction: 'removeAttribute',
              alertHeading: 'Are you sure you want to delete this attribute?',
              alertParagraph: 'All product variants associated with this attribute will also be removed.',
            })
          "
        >
          <div class="cancel">Delete</div>
        </a>
      </div>
      <button class="btn" @click.prevent="$emit('resetActions', { index: index, action: !showActions })">
        <IconsMoreHoriz />
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.admin-product-attribute {
  // border: 1px solid $slate-200;
  // border-radius: 3px;
  // padding: 1rem;

  .id {
    background-color: $slate-300;
    padding: 1rem;
    border-radius: 3px;
  }
}
</style>
