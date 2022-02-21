<script setup>
import { useMessage } from '~/store/useMessage'

const props = defineProps({
  product: {
    type: Object,
  },
  attributes: {
    type: Array,
  },
  attributeTerms: {
    type: Array,
  },
  // variants: {
  //   type: Array,
  // },
  // showSlideout: {
  //   type: Boolean,
  // },
  // index: Number,
})

const emit = defineEmits(['compAttributesUpdated'])

const appMessage = useMessage()
const compAttributes = ref([])

for (const prop in props.product.attributes) {
  compAttributes.value.push(props.product.attributes[prop])
  // compAttributes.value[prop].attribute = { ...props.product.attributes[prop].attribute }
  // compAttributes.value[prop].defaultTerm = props.product.defaultTerms[prop].defaultTerm
  // compAttributes.value[prop].terms = [...props.product.termss[prop].terms]
}

// import { useError } from '~/pinia/useError'

// const appError = useError()

// const attState = inject('attState')
// const prodState = inject('prodState')
// const attTermsState = inject('attTermsState')
// const attributeSelect = inject('attributeSelect')

const attributeSelect = ref('')

const insertEmptyAttribute = () => {
  if (props.product.attributes.length == props.attributes.length)
    return (appMessage.errorMsg = 'You have used all available attributes')
  compAttributes.value.push({ attribute: {}, terms: [], defaultTerm: '' })
}

const updateCompAttribute = (event) => {
  console.log('E', event)
  console.log('EF', compAttributes.value)
  compAttributes.value[event.index] = event.attr
}

const addAttribute = () => {
  console.log(attributeSelect.value)
  // const attribute = attState.items.find((el) => el._id == attributeSelect.value)
  // console.log(attribute)
  // const terms = attTermsState.items.filter((el) => el.parent == attribute._id)
  // console.log(terms)
  // attribute.visible = true
  // attribute.variation = true
  // prodState.selectedItem.attributes.push({ attribute, defaultTerm: terms[0] })
  // attributeSelect.value = ''
}

// watch(attributeSelect, (current, prev) => {
// 	console.log(current)
// 	const attribute = attState.items.find((el) => el._id == current)
// 	console.log(attribute)
// 	const terms = attTermsState.items.filter((el) => el.parent == attribute._id)
// 	console.log(terms)
// 	attribute.visible = true
// 	attribute.variation = true
// 	prodState.selectedItem.attributes.push({ attribute, defaultTerm: terms[0] })
// 	attributeSelect.value = ''
// })

watch(
  () => compAttributes.value,
  (current) => {
    console.log(current)
    emit('compAttributesUpdated', compAttributes.value)
  },
  { deep: true }
)
</script>

<template>
  <div class="admin-product-attributes-panel shadow-md">
    <div class="attributes">
      <header>
        <h2>Attributes</h2>
        <button class="btn btn-primary" @click="insertEmptyAttribute">Add New</button>
      </header>
      <main>
        <form @keypress.enter.prevent v-if="product.attributes.length">
          <div class="table">
            <div class="table__header">
              <div class="row">
                <div class="th">Attribute</div>
                <div class="th">Default Term</div>
                <div class="th">Terms</div>
                <div class="th">Actions</div>
              </div>
            </div>
            <div class="table__body">
              <div class="attribute" v-for="(attribute, index) in compAttributes">
                <EcommerceAdminProductAttributeCard
                  :compAttributes="compAttributes"
                  :attributes="attributes"
                  :attributeTerms="attributeTerms"
                  :attribute="attribute"
                  :index="index"
                  @compAttributeUpdated="updateCompAttribute"
                />
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.admin-product-attributes-panel {
  background-color: white;
  // border: 1px solid red;
  height: 95%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  // padding: 4rem 2rem;
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2rem;
    background-color: $slate-300;
  }

  main {
    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .btn {
        align-self: flex-end;
        margin-top: 1rem;
      }
    }
    // flex: 1;
    // border: 1px solid red;
  }
  // footer {
  //   display: flex;
  //   justify-content: flex-end;
  //   gap: 2rem;
  //   padding: 1rem 3rem;

  //   .btn {
  //     padding: 2rem 3rem;
  //     border-radius: 5px;
  //   }
  // }
}
</style>
