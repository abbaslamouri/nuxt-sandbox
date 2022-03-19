<script setup>
defineProps({
  product: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="seo shadow-md" id="seo">
    <header class="admin-section-header">Seo</header>
    <div class="content">
      <FormsBaseInput label="Custom Permalink" placeholder="Custom Permalink" v-model="product.permalink" />
      <FormsBaseInput label="SEO Title" placeholder="SEO Title" v-model="product.seoTitle" />
      <FormsBaseInput label="SEO Description" placeholder="SEO Description" v-model="product.seoDescription" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.seo {
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
