<script setup>
defineProps({
  product: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="shipping-options shadow-md" id="shipping-options">
    <header class="admin-section-header">
      <p class="title">Shipping Options</p>
      <FormsBaseToggle v-model="product.shippingOptions" label="Enabled" />
    </header>
  </div>
</template>

<style lang="scss" scoped>
.shipping-options {
  background-color: white;
  border-radius: 5px;
  padding: 2rem 2rem;

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .sku-inventory {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;

      .sku {
        flex: 1;
      }

      .inventory {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        font-size: 1.3rem;

        .available {
          display: flex;
          align-items: center;
          gap: 1rem;

          .title {
            font-weight: 600;
          }
        }
      }
    }
  }
}
</style>
