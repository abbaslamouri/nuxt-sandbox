<script setup>
const router = useRouter()
const route = useRoute()
const { state, actions } = useFactory('attributes')

// Fetch attribute based on slug
state.query.slug = route.params.slug
await actions.fetchAll()
state.selectedItem = route.params.slug !== ' ' ? state.items[0] : { name: '' }

const save = async () => {
  await actions.saveItem()
  if (!state.errorMsg) router.push({ name: 'admin-products-attributes' })
}

const handleCancel = async () => {
  router.push({ name: 'admin-products-attributes' })
}
</script>

<script>
export default {
  layout: 'admin',
}
</script>

<template>
  <div class="attributes">
    <form @submit.prevent="save">
      <h2></h2>
      {{ state.selectedItem }}
      <div class="inputs">
        <FormsBaseInput
          type="text"
          label="Name"
          v-model="state.selectedItem.name"
          :required="true"
          minlength="3"
          maxlength="25"
          hint="Enter a valid attribute name"
        />
      </div>
      <div class="actions">
        <button class="btn submit primary" v-if="!state.selectedItem.slug" @click="save">Create Attribute</button>
        <button class="btn submit primary" v-else>Update Attribute</button>
        <button class="btn submit outline" @click.prevent="handleCancel">Cancel</button>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped></style>
