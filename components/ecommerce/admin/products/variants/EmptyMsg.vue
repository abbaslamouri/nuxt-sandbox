<script setup>
defineEmits(['closeSlideout'])
</script>

<template>
  <div class="empty-variant-message">
    <div class="card">
      <h3>Set up attributes for this product</h3>
      <p class="message">
        Variants help you to sell products with slight differences, but are still the same product. For example, you
        might sell a t-shirt in different colors, or a plant pot in different sizes.<br /><br />You can configure
        variants to have their own price, SKU, and stock inventory. To get started, create attributes and attribute
        terms for your variants. Attributes define the type of variant (e.g. color). Terms are a choice your customer
        can make within that group (e.g. blue).
      </p>
      <p class="sub-message"><IconsInfo />Using this feature requires you to save the product first.</p>
      <button class="btn btn-primary" @click="$emit('closeSlideout')">Cancel</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.empty-variant-message {
  margin-top: 20rem;
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  justify-content: center;

  .card {
    display: flex;
    flex-direction: column;
    // gap:2rem;
    padding: 4rem;
    border: 1px solid $slate-200;
    background-color: $slate-50;
    border-radius: 5px;
    max-width: 60rem;

    p {
      margin-block-start: 1em;
      margin-block-end: 1em;
    }

    .sub-message {
      background-color: $sky-100;
      padding: 1rem 3rem;
      display: flex;
      align-items: center;
      gap: 2rem;
      border-radius: 1rem;

      svg {
        fill: $sky-600;
      }
    }

    .btn {
      align-self: flex-end;
    }
  }
}
</style>
