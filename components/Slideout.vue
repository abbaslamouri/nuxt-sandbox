<script setup>
defineEmits(['closeSlideout'])
</script>

<template>
  <section class="slideout">
    <div class="overlay"></div>
    <div class="slideout__wrapper" @click.self="$emit('closeSlideout')">
      <div class="slideout__content">
        <div class="slideout__header shadow-md">
          <slot name="header"></slot>
          <button class="btn close"><IconsClose @click="$emit('closeSlideout')" /></button>
        </div>
        <div class="slideout__main">
          <slot></slot>
        </div>
        <div class="slideout__footer shadow-md">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';
</style>
