<script setup>
import { useStore } from '~/store/useStore'
defineEmits(['slideoutEventEmitted'])
const store = useStore()
</script>

<template>
  <section class="variants-content shadow-md" id="variants">
    <header class="admin-section-header">
      <p class="title">Variant</p>
      <button class="btn btn-heading" @click="$emit('slideoutEventEmitted', true)">
        <span v-show="!store.variants.length">Add</span>
        <span v-show="store.variants.length">Edit</span>
      </button>
    </header>
    <div class="content">
      <div>Different types of this product (e.g. size, color)</div>
      <div class="variants">
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';
.variants-content {
  background-color: white;
  border-radius: 5px;
  padding: 2rem 2rem 4rem;

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 2rem;

    .title {
      font-size: 80%;
    }

    .variants {
      display: flex;
      flex-direction: column;
      gap: 2rem;

      .variant {
        display: flex;
        align-items: center;
        gap: 1rem;

        .terms {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 2rem;

          .term {
            background-color: $slate-500;
            color: $slate-50;
            font-size: 80%;
            padding: 0.25rem 1rem 0.5rem;
            border-radius: 2rem;
          }
        }
      }
    }
  }
}
</style>
