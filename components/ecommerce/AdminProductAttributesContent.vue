<script setup>
import { useStore } from '~/store/useStore'

defineEmits(['slideoutEventEmitted'])

const store = useStore()
</script>

<template>
  <section class="attributes-content shadow-md" id="attributes">
    <header class="admin-section-header">
      <p class="title">Attributes</p>
      <button class="btn btn-heading" @click="$emit('slideoutEventEmitted', true)">
        <span v-show="!store.product.attributes.length">Add</span>
        <span v-show="store.product.attributes.length">Edit</span>
      </button>
    </header>
    <div class="content">
      <div>Different attributes for this product (e.g. size, color)</div>
      <div class="attributes">
        <!-- <div class="attribute" v-for="attribute in store.product.attributes" :key="attribute.attribute._id">
          <p class="attribute-name">{{ attribute.attribute.name }}:</p>
          <div class="terms">
            <div class="term" v-for="term in attribute.terms" :key="term._id">
              <span class="term-name">{{ term.name }}</span>
            </div>
          </div>
        </div> -->
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';
.attributes-content {
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

    .attributes {
      display: flex;
      flex-direction: column;
      gap: 2rem;

      .attribute {
        display: flex;
        align-items: center;
        gap: 1rem;

        .terms {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 2rem;
          // border: 1px solid red;

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
