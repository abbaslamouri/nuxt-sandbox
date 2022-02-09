<script setup>
const categories = ref([])

try {
  // categories.value = await $fetch('/api/v1/categories', {
  //   params: { slug: 'original', populate: 'gallery parent', fields: 'name slug' },
  // })

  categories.value = await $fetch('/api/v1/categories/61ff01236543ad8f41ddd64')
  // categories.value = await $fetch('/api/v1/categories/', {
  //   method: 'POST',
  //   body: { name: 'original', slug: 'original', permalink: 'original' },
  // })
} catch (error) {
  // console.log('ERROR', error.data)
}

// const { data, error } = await useFetch(`/v1/${collection}/`, {
//   baseURL: state.baseURL,
//   method: 'get',
//   params,
//   lazy: true,
// })
// if (error.value) {
//   state.errorMsg = 'Error while fetching docs'
//   // appError.setSnackbar(true, state.errorMsg)
//   return false
// } else {
//   state.items = data.value
//   return data.value
// }
</script>

<template>
  <div>
    Home
    <pre>{{ categories }}</pre>
  </div>
</template>

<style lang="scss" scoped></style>
