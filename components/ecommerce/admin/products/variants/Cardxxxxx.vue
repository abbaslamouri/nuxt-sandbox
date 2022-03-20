<script setup>
// import { useStore } from '~/store/useStore'

const props = defineProps({
  index: {
    type: Number,
    required: true,
  },
  showDeleteVariantAlert: {
    type: Boolean,
    default: true,
  },
  showAction: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'setActions',
  'resetActions',
  'removeVariant',
  'mediaSelectorClicked',
  'showVariantSlideout',
  'slideoutEventEmitted',
  'showDeleteVariantAlertEmitted',
  'showActionsEmitted',
])

const allAttributes = inject('allAttributes')
const allAttributeTerms = inject('allAttributeTerms')

const { product, variants } = useStore()

// const store = useStore()

// console.log(variants.value)

// const showActions = ref(false)
// const showDeleteVariantAlert = ref(false)
const showVariantEditSlideout = ref(false)

const getVariantAttribute = (term, j) => {
  if (Object.values(term).length) {
    return allAttributes.find((a) => a._id == term.parent._id)
  } else {
    return product.value.attributes[j].attribute
  }
}

const handleDeleteVariantBtnClick = () => {
  emit('showDeleteVariantAlertEmitted', true)
  emit('showActionsEmitted', false)
  // props.showDeleteVariantAlert = true
  // props.showActions = false
}
const deleteVariant = () => {
  store.variants.splice(props.index, 1)
  emit('showDeleteVariantAlertEmitted', false)

  // props.showDeleteVariantAlert = false
}

const openVariantEditSlideout = () => {
  // props.showActions = false
  showVariantEditSlideout.value = true
  emit('resetActions', false)
}
</script>

<template>
  <div>
    <div class="row border border-slate-200 items-center" v-if="!showVariantEditSlideout">
      <!-- <pre style="font-size: 1rem">{{ index }}==={{ variants }}</pre> -->
      <div class="td bg-slate-300 br3 p1">
        {{ index + 1 }}
      </div>
      <div class="td">
        <div class="w5 h5">
          <img
            class="w-full hfull contain"
            v-if="variants[index].gallery[0]"
            :src="variants[index].gallery[0].path"
            alt="Variant Image"
          />
          <img class="w-full hfull contain" v-else src="/placeholder.png" alt="Variant Image" />
        </div>
      </div>
      <div class="td flex-row">
        <div class="flex-row" v-for="(term, j) in variants[index].attrTerms" :key="term">
          <div class="attribute">
            {{ getVariantAttribute(term, j).name }}
          </div>
          <div class="term">
            {{ term.name }}
          </div>
        </div>
      </div>
      <div class="enabled td">{{ variants[index].enabled ? 'Enabled' : 'Disabled' }}</div>
      <div class="stock-qty td">
        <div v-if="!product.manageInventory">&infin;</div>
        <div v-else>{{ variants[index].stockQty }}</div>
      </div>
      <div class="price td">{{ variants[index].price }}</div>
      <div class="sale-price td">{{ variants[index].salePrice }}</div>
      <div class="sku td">{{ variants[index].sku }}</div>
      <EcommerceAdminActions
        class="td"
        :showAction="showAction"
        :showEdit="true"
        @moreHoriz="$emit('setActions', { index: index, action: !showAction })"
        @deleteAction="$emit('removeVariant', index)"
        @editAction="openVariantEditSlideout"
      />
    </div>

    <EcommerceAdminProductsVariantsEditSlideout
      v-else
      :index="index"
      :showVariantEditSlideout="showVariantEditSlideout"
      @closeSlideout="showVariantEditSlideout = false"
    />
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.attribute {
  background-color: $slate-400;
  color: white;
  padding: 0.25rem 0.5rem 0.3rem;
  border-radius: 2rem 0 0 2rem;
}

.term {
  background-color: $slate-200;
  padding: 0.25rem 0.5rem 0.3rem;
  border-radius: 0 2rem 2rem 0;
}

.actions {
  display: flex;
  justify-content: flex-end;
}
</style>
