<script setup>
const props = defineProps({
  index: {
    type: Number,
  },
})

const emit = defineEmits(['closeSlideout'])

const { product, variants } = useStore()
const { alert } = useFactory()
const allAttributes = inject('allAttributes')
const current = ref(null)
current = JSON.stringify(variants.value[props.index])

const getVariantAttribute = (term, j) => {
  if (Object.values(term).length) {
    return allAttributes.find((a) => a._id == term.parent._id)
  } else {
    return product.value.attributes[j].attribute
  }
}

const closeSlideout = () => {
  if (current !== JSON.stringify(variants.value[props.index])) {
    showAlert(
      'You have unsaved changes',
      'Please save your changes before closing this window or click cancel to exit without saving',
      'closeSlideout'
    )
  } else {
    emit('closeSlideout', false)
  }
}

const cancelVariant = () => {
  variants.value[props.index] = JSON.parse(current)
  emit('closeSlideout', false)
}

const saveVariant = () => {
  current.value = null
  emit('closeSlideout', false)
}

const showAlert = (heading, paragraph, action, showCancelBtn = false) => {
  alert.value.heading = heading
  alert.value.paragraph = paragraph
  alert.value.action = action
  alert.value.showCancelBtn = showCancelBtn
  alert.value.show = true
}

watch(
  () => alert.value,
  (currentVal) => {
    if (currentVal.show === 'ok' && currentVal.action === 'removeAttribute') removeAttribute()
    if (currentVal.show === 'ok' && currentVal.action === 'closeSlideout') alert.value.show = false
  },
  { deep: true }
)
</script>

<template>
  <Slideout @closeSlideout="closeSlideout">
    <template v-slot:header>
      <div class="flex-row gap2 ietms-center">
        <div class="text-md font-bold">Edit Variant:</div>
        <div class="flex-row items-center gap1" v-for="(term, j) in variants[index].attrTerms" :key="`term-${j}`">
          <span class="font-bold">{{ getVariantAttribute(term, j).name }}:</span>
          <span v-if="Object.keys(term).length">{{ term.name }}</span>
        </div>
      </div>
    </template>
    <template v-slot:default>
      <div class="flex-col gap2 p2">
        {{ variants[index] }}==={{ current == JSON.stringify(variants[index]) }}
        <EcommerceAdminProductsVariantsOptions :index="index" />
        <EcommerceAdminProductsVariantsGallery :index="index" />
        <EcommerceAdminProductsVariantsPrice :index="index" />
        <EcommerceAdminProductsVariantsStock :index="index" />
        <EcommerceAdminProductsVariantsDescription :index="index" />
      </div>
    </template>
    <template v-slot:footer>
      <EcommerceAdminSlideoutFooter
        :disableSaveBtn="current == JSON.stringify(variants[index])"
        @ok="saveVariant"
        @cancel="cancelVariant"
      />
    </template>
  </Slideout>
</template>

<style lang="scss" scoped></style>
