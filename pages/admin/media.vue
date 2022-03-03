<script setup>
useMeta({
  title: 'Media | YRL',
})
definePageMeta({
  layout: 'admin',
})
</script>

<script>
export default {
  layout: 'admin',
}
</script>

<template>
  <div class="media">
    <MediaUploader />
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.media {
  height: 92vh;
  width: 100%;
  background-color: $slate-100;
}
</style>
