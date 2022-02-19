<script setup>
// import { useError } from '~/pinia/useError'

// const appError = useError()

const attState = inject('attState')
const prodState = inject('prodState')
const attTermsState = inject('attTermsState')
// const attributeSelect = inject('attributeSelect')

const attributeSelect = ref('')

const insertEmptyAttribute = () => {
  if (prodState.selectedItem.attributes.length == attState.items.length)
    // return appError.setSnackbar(true, 'You have used all available attributes', 'Error')

  prodState.selectedItem.attributes.push({ attribute: '', terms: [], defaultTerm: '' })
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
</script>

<template>
  <div class="admin-product-attributes-panel shadow-md">
    <!-- <pre style="font-size: 1rem">{{ prodState.selectedItem }}</pre> -->
    <div class="attributes">
      <header>
        <h2>Attributes</h2>
        <button class="btn btn-primary" @click="insertEmptyAttribute">Add New</button>
      </header>
      <main>
        <form @keypress.enter.prevent v-if="prodState.selectedItem.attributes.length">
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
              <div class="attribute" v-for="(item, i) in prodState.selectedItem.attributes">
                <ProductsAdminProductAttribute :i="i" :prodAttr="item" class="row" />
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
