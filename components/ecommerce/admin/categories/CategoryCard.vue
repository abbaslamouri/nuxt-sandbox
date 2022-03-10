<script setup>
const props = defineProps({
  category: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['deleteCategory'])

const showActions = ref(false)
const showAlert = ref(false)

const proceed = () => {
  emit('deleteCategory', props.category._id)
  showAlert.value = false
}
</script>

<template>
  <div class="row border-b-slate-200 p1">
    <div class="td">
      <div class="w5 h5">
        <img
          class="wfull hfull contain"
          v-if="category.gallery.length && category.gallery[0] && category.gallery[0].mimetype.includes('image')"
          :src="`${category.gallery[0].path}`"
        />
        <img v-else class="wfull hfull contain" :src="`/placeholder.png`" />
      </div>
      <h3 class="title">{{ category.name }}</h3>
    </div>
    <div class="td">{{ category.slug }}</div>
    <div class="td" v-if="category.parent">{{ category.parent.name }}</div>
    <div class="td" v-else>-</div>
    <div class="actions td">
      <button class="btn" @click.prevent="showActions = !showActions"><IconsMoreHoriz /></button>
      <div class="menu shadow-md" v-show="showActions">
        <NuxtLink class="link" :to="{ name: 'admin-ecommerce-categories-slug', params: { slug: category.slug } }">
          <span>Edit</span>
        </NuxtLink>
        <a href="#" class="link" @click.prevent="showAlert = true">
          <div class="cancel">Delete</div>
        </a>
      </div>
    </div>
    <Alert v-if="showAlert" @ok="proceed" @cancel="showAlert = false">
      <h3>Are you sure you want to delete category {{ category.name }}?</h3>
      <p>You will not be able to recover this category.</p>
    </Alert>
  </div>
</template>

<style lang="scss" scoped></style>
