<script setup>
defineProps({
  product: {
    type: Object,
    required: true,
  },
})
defineEmits(['itemToDeleteEmitted'])

const showActions = ref(false)
const showAlert = ref(false)

const handleDeleteBtnClick = async () => {
  showActions.value = false
  showAlert.value = true
}
</script>

<template>
  <div class="product row shadow-md">
    <div class="thumb-title td">
      <div class="thumb">
        <img
          v-if="product.gallery && product.gallery[1] && product.gallery[1].path"
          :src="`${product.gallery[1].path}`"
        />
        <img
          v-else-if="product.gallery && product.gallery[0] && product.gallery[0].path"
          :src="`${product.gallery[0].path}`"
        />
        <img v-else class="thumb" :src="`/placeholder.png`" />
      </div>
      <h3 class="title">{{ product.name }}</h3>
    </div>
    <div class="stock td">{{ product.stockQty }}</div>
    <div class="stock td">{{ product.orders }}</div>
    <div class="stock td">{{ product.sales }}</div>
    <div class="actions td">
      <button class="btn" @click.prevent="showActions = !showActions"><IconsMoreHoriz /></button>
      <div class="menu shadow-md" v-show="showActions">
        <NuxtLink class="link" :to="{ name: 'admin-ecommerce-products-slug', params: { slug: product.slug } }">
          <span>Edit</span>
        </NuxtLink>
        <a href="#" class="link" @click.prevent="handleDeleteBtnClick">
          <div class="cancel">Delete</div>
        </a>
      </div>
    </div>
    <Alert @cancel="showAlert = false" @ok="$emit('itemToDeleteEmitted', product._id)" v-show="showAlert">
      <div class="modal-content">
        <h3>Are you sure you want to delete this item?</h3>
        <p>Your data will be lost forever</p>
      </div>
    </Alert>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.product {
  padding: 1rem;

  .thumb-title {
    display: flex;
    align-items: center;
    gap: 2rem;

    .thumb {
      width: 5rem;
      height: 5rem;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
  }
}
</style>
