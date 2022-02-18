<script setup>
import slugify from 'slugify'
// import { useError } from '~/pinia/useError'
const { state: attState, actions: attActions } = useFactory('attributes')
const { state: attTermsState, actions: attTermsActions } = useFactory('attributeterms')
provide('attState', attState)
provide('attActions', attActions)
provide('attTermsState', attTermsState)
provide('attTermsActions', attTermsActions)

// const appError = useError()

const currentAttrs = ref([])
const attributeRefs = ref([])

onMounted(() => {
  // console.log(attributeRefs.value.$el);
  // for (const prop in attributeRefs.value) console.log(attributeRefs.value[prop].$el.querySelector('.form-group input'));
})

// Populate attribute and atribute terms states
await Promise.all([attActions.fetchAll(), attTermsActions.fetchAll()])
// currentAttrs.value = [...attState.items];

for (const prop in attState.items) {
  currentAttrs.value[prop] = { ...attState.items[prop] }
}

const saveAttributes = async () => {
  for (const prop in attState.items) {
    if (!attState.items[prop].name) {
      // appError.setSnackbar(true, 'Attribute name is required', 'Error')
      return
    }
  }
  await Promise.all(
    attState.items.map(async (item) => {
      item.slug = slugify(item.name, { lower: true })
      attState.selectedItem = { ...item }
      if (!item._id) {
        attState.items = attState.items.filter((a) => a.slug != item.slug)
        // const index = attState.items.findIndex((el) => el.slug == response.data.slug);
        // if (index != -1) attState.items.splice(index, 1);
        await attActions.saveItem()
      } else {
        if (!currentAttrs.value.find((a) => a.slug == item.slug)) await attActions.saveItem()
      }
    })
  )
  // if (!attState.errorMsg) appError.setSnackbar(true, 'Attributes saved succesfully', 'Success')
}

// const removeTermInputsHiddenClass = () => {
//   for (const prop in attributeRefs.value) {
//     attributeRefs.value[prop].$el.querySelector('.form-group input').classList.add('hidden');
//   }
// };
</script>

<script>
export default {
  layout: 'admin',
}
</script>

<template>
  <div class="admin-attributes">
    <!-- <pre style="font-size: 1rem">{{ attState.items }}</pre> -->
    <!-- <pre style="font-size: 1rem">{{ attTermsState.items }}</pre> -->
    <!-- {{ attributeRefs }} -->
    <header>
      <h2>Attributes</h2>
      <!-- <NuxtLink class="link" :to="{ name: 'admin-products-attributes-slug', params: { slug: ' ' } }"> -->
      <button class="btn btn-primary" @click="attState.items.push({})">Add New</button>
      <!-- </NuxtLink> -->
    </header>
    <main>
      <form @keypress.enter.prevent>
        <div class="table">
          <div class="table__header">
            <div class="row">
              <div class="th">Name</div>
              <div class="th">Options</div>
              <div class="th">Actions</div>
            </div>
          </div>
          <div class="table__body">
            <ProductsAdminAttribute
              :attribute="attribute"
              :i="i"
              class="row"
              v-for="(attribute, i) in attState.items"
              :key="attribute._id"
              :ref="
                (el) => {
                  if (el) attributeRefs[i] = el
                }
              "
            />
          </div>
        </div>
        <button class="btn btn-primary" @click="saveAttributes">Save Changes</button>
      </form>
    </main>
    <!-- <footer> -->
    <!-- <button class="btn btn-secondary">Cancel</button> -->
    <!-- </footer> -->
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.admin-attributes {
  // border: 1px solid red;
  height: 95%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 4rem 2rem;
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2rem;
  }

  main {
    form {
      display: flex;
      flex-direction: column;
      gap: 2rem;

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
