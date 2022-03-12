<script setup>
// import { useStore } from '~/store/useStore'
// const store = useStore()
defineEmits(['showAttributesSlideout'])
const { product } = useStore()
</script>

<template>
  <section class="shadow-md wfull bg-white p2 br5" id="attributes">
    <div class="flex-row items-center justify-between text-sm mb1">
      <div class="uppercase inline-block border-b-stone-300 font-bold pb05">Attributes</div>
      <button class="btn btn-heading" @click="$emit('showAttributesSlideout', true)">
        <span v-show="!product.attributes.length">Add</span>
        <span v-show="product.attributes.length">Edit</span>
      </button>
    </div>
    <div class="flex-col gap2">
      content
      <!-- <div class="content">
      <div>Different attributes for this product (e.g. size, color)</div>
      <div class="attributes">
        <div class="attribute" v-for="attribute in product.attributes" :key="attribute.attribute._id">
          <p class="attribute-name">{{ attribute.attribute.name }}:</p>
          <div class="terms">
            <div class="term" v-for="term in attribute.terms" :key="term._id">
              <span class="term-name">{{ term.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div> -->
    </div>
  </section>
  <!-- <section class="attributes-content shadow-md" id="">
    <header class="admin-section-header">
      <p class="title">Attributes</p>
      <button class="btn btn-heading" @click="store.showAttributesSlideout = true">
        <span v-show="!product.attributes.length">Add</span>
        <span v-show="product.attributes.length">Edit</span>
      </button>
    </header>
  </section> -->
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
