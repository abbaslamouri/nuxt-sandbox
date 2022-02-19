<script setup>
import slugify from 'slugify'
import { useMessage } from '~/store/useMessage'

useMeta({
  title: 'Attributes | YRL',
})
definePageMeta({
  layout: 'admin',
})

// const attributeRefs = ref([])

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

// Fetch all attributes and terms
await Promise.all([fetchAllAttributes(), fetchAllTerms()])

const handleTermUpdated = async () => {
  await fetchAllTerms()
}

const handleAttributeUpdated = async () => {
  await fetchAllAttributes()
}

// Set current page
const setPage = async (currentPage) => {
  page.value = currentPage
  await fetchAllAttributes()
}
</script>

<template>
  <div class="admin-attributes">
    <header>
      <h2>Attributes</h2>
      <button class="btn btn-primary" @click="attributes.push({ name: '', terms: [] })">Add New</button>
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
            <EcommerceAdminAttributeCard
              v-for="attribute in attributes"
              :attribute="attribute"
              :key="attribute._id"
              :attributeTerms="terms.filter((t) => t.parent._id == attribute._id)"
              @termUpdated="handleTermUpdated"
              @attributeUpdated="handleAttributeUpdated"
            />
          </div>
        </div>
      </form>
    </main>
    <footer>
      <Pagination :page="page" :pages="pages" @pageSet="setPage" v-if="pages > 1" />
      <!-- <button class="btn btn-primary" @click.prevent="saveAttributes">Save Changes</button> -->
    </footer>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.admin-attributes {
  min-height: 92vh;
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
    flex: 1;

    form {
      display: flex;
      flex-direction: column;
      gap: 2rem;

      .btn {
        align-self: flex-end;
        margin-top: 1rem;
      }
    }
  }
}
</style>
