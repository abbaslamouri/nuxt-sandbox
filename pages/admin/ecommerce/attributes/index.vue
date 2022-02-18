<script setup>
import slugify from 'slugify'
import { useMessage } from '~/store/useMessage'

useMeta({
  title: 'Attributes | YRL',
})
definePageMeta({
  layout: 'admin',
})

const currentAttrs = ref([])
const attributeRefs = ref([])

const appMessage = useMessage()
const attributes = ref([])
const count = ref(null) // item count taking into account params
const totalCount = ref(null) // Total item count in the database
const keyword = ref(null)
const page = ref(1)
const perPage = ref(6)
const sortField = ref('createdAt')
const sortOrder = ref('')
const terms = ref([])

const pages = computed(() =>
  count.value % perPage.value ? parseInt(count.value / perPage.value) + 1 : parseInt(count.value / perPage.value)
)

// Set query params
const attributeParams = computed(() => {
  return {
    fields: 'name, slug',
    page: page.value,
    limit: perPage.value,
    sort: `${sortOrder.value}${sortField.value}`,
    keyword: keyword.value,
  }
})

// Set query params
const attributeTermsParams = computed(() => {
  return {
    fields: 'name, slug, parent',
  }
})

const fetchAllAttributes = async () => {
  appMessage.errorMsg = null
  try {
    const response = await $fetch('/api/v1/attributes', { params: attributeParams.value })
    attributes.value = response.docs
    count.value = response.count
    totalCount.value = response.totalCount
    console.log(response)
  } catch (error) {
    appMessage.errorMsg = error.data
  }
}

const fetchAllTerms = async () => {
  appMessage.errorMsg = null
  try {
    const response = await $fetch('/api/v1/attributeterms', { params: attributeTermsParams.value })
    terms.value = response.docs
    console.log(response)
  } catch (error) {
    appMessage.errorMsg = error.data
  }
}

// Fetch all
// await fetchAll()

// Populate attribute and atribute terms states
await Promise.all([fetchAllAttributes(), fetchAllTerms()])
// currentAttrs.value = [...attState.items];

// const response = await $fetch('/api/v1/attributeterms', { params: params.value })
// terms.value = response.docs

console.log('ATTRIBUTES', attributes.value)
console.log('TERMS', terms.value)

// for (const prop in attState.items) {
//   currentAttrs.value[prop] = { ...attState.items[prop] }
// }

const handleTermSaved = async () => {
  await fetchAllTerms()
}

const handleAttributeDeleted = async () => {
  await fetchAllAttributes()
}

// const saveAttributes = async () => {
//   await Promise.all(
//     attributes.value.map(async (item) => {
//       if (item.name) {
//         console.log('SSSSSSSXXXXX', item)

//         item.slug = slugify(item.name, { lower: true })
//         if (!item._id) {
//           console.log('SSSSSSSXXXXX', item)

//           $fetch('/api/v1/attributes', {
//             method: 'POST',
//             body: item,
//           })
//         } else {
//           console.log('SSSSSSSXXXXXYYYYYY', item)

//           $fetch('/api/v1/attributes', {
//             method: 'PATCH',
//             body: item,
//             params: { id: item._id },
//           })
//         }
//       }
//     })
//   )
// }

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
      <button class="btn btn-primary" @click="attributes.push({ name: '', terms: [] })">Add New</button>
      <!-- </NuxtLink> -->
    </header>
    <main>
      <div>
        <div class="table">
          <div class="table__header">
            <div class="row">
              <div class="th">Name</div>
              <div class="th">Options</div>
              <div class="th">Actions</div>
            </div>
          </div>
          <div class="table__body">
            <EcommerceAdminAttributeCard
              v-for="(attribute, i) in attributes"
              :attribute="attribute"
              :i="i"
              :key="attribute._id"
              :ref="
                (el) => {
                  if (el) attributeRefs[i] = el
                }
              "
              :attributeTerms="terms.filter((t) => t.parent._id == attribute._id)"
              @termSaved="handleTermSaved"
              @attributeDeleted="handleAttributeDeleted"
            />
          </div>
        </div>
        <button class="btn btn-primary" @click.prevent="saveAttributes">Save Changes</button>
      </div>
    </main>
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
