<script setup>
import { useStore } from '~/store/useStore'

const props = defineProps({
  // productVariant: {
  //   type: Object,
  //   required: true,
  // },
  // productAttributes: {
  //   type: Array,
  //   required: true,
  // },
  index: {
    type: Number,
    required: true,
  },
  // attributes: {
  //   type: Array,
  // },
  // attributeTerms: {
  //   type: Array,
  // },
})

defineEmits(['mediaSelectorClicked', 'showVariantSlideout', 'slideoutEventEmitted'])

const store = useStore()

// const props = defineProps({
//   // variant: Object,
//   index: Number,
// })
const cardVariant = ref({})

const showActions = ref(false)
const showVariantSlideout = ref(false)
const showDeleteVariantAlert = ref(false)
const showVariantEditSlideout = ref(false)

cardVariant.value = { ...props.productVariant }

const getAttribute = (attributeId) => {
  // return prodState.selectedItem.attributes.filter((el) => el.item._id == attributeId)[0].item
}

const getTerms = (attributeId) => {
  // const terms = prodState.selectedItem.attributes.filter((el) => el.item._id == attributeId)[0].terms
  // return terms
}

const deleteProductVariant = () => {
  store.variants.splice(props.index, 1)
  showDeleteVariantAlert.value = false
  showActions.value = false
}

// const updateVariant = (attribute, termId) => {
// console.log('AT', attribute)
// console.log(value)
// const term = attribute.terms.find((t) => t._id == termId)
// console.log('T', term)
// if (!prodState.selectedItem.variants[props.i].attrTerms.length) {
// prodState.selectedItem.variants[props.i].attrTerms.push(term)
// }
// }

const openVariantEditSlideout = () => {
  showActions.value = false
  showVariantEditSlideout.value = true

  // if (!confirm('Are you sure?')) return
  // prodState.selectedItem.variants.splice(props.i, 1)
}

const getVariantAttribute = (term, j) => {
  if (Object.values(term).length) {
    return store.attributes.find((a) => a._id == term.parent._id)
  } else {
    return store.product.attributes[j].attribute
  }
}
</script>

<template>
  <div class="admin-product-variant row">
    <!-- <pre style="font-size: 1rem">{{ index }}==={{ store.variants }}</pre> -->
    <div class="id td">
      {{ index + 1 }}
    </div>
    <div class="thumb td">
      <img v-if="store.variants[index].gallery[1]" :src="store.variants[index].gallery[1].path" alt="Variant Image" />
      <img v-else src="/placeholder.png" alt="Variant Image" />
    </div>
    <div class="option td">
      <div v-for="(term, j) in store.variants[index].attrTerms" :key="term" class="attribute-term">
        <div class="attribute">
          {{ getVariantAttribute(term, j).name }}
        </div>
        <div class="term">
          {{ term.name }}
        </div>
      </div>
    </div>
    <div class="enabled td">{{ store.variants[index].enabled ? 'Enabled' : 'Disabled' }}</div>
    <div class="stock-qty td">
      <div v-if="!store.product.manageInventory">&infin;</div>
      <div v-else>{{ store.variants[index].stockQty }}</div>
    </div>
    <div class="price td">{{ store.variants[index].price }}</div>
    <div class="sale-price td">{{ store.variants[index].salePrice }}</div>
    <div class="sku td">{{ store.variants[index].sku }}</div>
    <div class="actions td">
      <button class="btn" @click.prevent="showActions = !showActions"><IconsMoreHoriz /></button>
      <div class="menu shadow-md" v-show="showActions">
        <a href="#" class="link" @click.prevent="openVariantEditSlideout">
          <div class="edit">Edit</div>
        </a>
        <a href="#" class="link" @click.prevent="showDeleteVariantAlert = true">
          <div class="cancel">Delete</div>
        </a>
      </div>
    </div>
    <Alert v-if="showDeleteVariantAlert" @ok="deleteProductVariant" @cancel="showDeleteVariantAlert = false">
      <h3>Are you sure you want to delete this product variation.</h3>
      <!-- <p>Please save your changes before closing this window or click cancel to exit without saving</p> -->
    </Alert>
    <EcommerceAdminProductVariantEditSlideout
      v-if="showVariantEditSlideout"
      :index="index"
      :showVariantEditSlideout="showVariantEditSlideout"
      @slideoutEventEmitted="showVariantEditSlideout = false"
    />
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.admin-product-variant {
  cursor: pointer;

  .td {
    display: flex;
    align-items: center;
  }

  .id {
    background-color: $slate-400;
    color: $slate-50;
    border-radius: 3px;
    font-size: 1.5rem;
  }

  .thumb {
    width: 5rem;
    height: 5rem;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .option {
    display: flex;
    .attribute-term {
      display: flex;
      align-items: center;
      // cursor: pointer;

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
    }
  }

  .actions {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
