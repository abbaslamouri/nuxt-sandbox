<script setup>
const props = defineProps({
  product: {
    type: Object,
  },
})
const emit = defineEmits(['productMiscEmitted'])
const productMisc = reactive({
  thankYouPage: props.product.thankYouPage,
  sortOrder: props.product.sortOrder,
})

watch(
  () => productMisc,
  (current) => {
    console.log(current)
    emit('productMiscEmitted', current)
  },
  { deep: true }
)
</script>

<template>
  <div class="misc shadow-md" id="misc">
    <header class="admin-section-header">Misc</header>
    <div class="content">
      <FormsBaseInput label="Thank You Page" placeholder="https://" v-model="productMisc.thankYouPage" />
      <FormsBaseInput label="Sort Order" placeholder="Sort Order" v-model="productMisc.sortOrder" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.misc {
  background-color: white;
  border-radius: 5px;
  padding: 2rem 2rem 4rem;

  .content {
    display: flex;
    flex-direction: column;
    gap: 3rem;

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
