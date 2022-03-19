<script setup>
defineProps({
  product: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="extra-fields" id="extra-fields">
    <header class="admin-section-header">
      <p class="title">Extra Fields</p>
      <button class="btn btn-heading" @click="product.extraFields.push({ name: '', isRequired: false })">
        <IconsPlus />
        <span>Add</span>
      </button>
    </header>
    <div class="content">
      <p>Collect custom information from your customer.</p>
      <div class="fields">
        <div class="field" v-for="(field, k) in product.extraFields" :key="`extra-field-${k}`">
          <div class="name">
            <FormsBaseInput label="Extra Field" placeholder="Extra Field" v-model="product.extraFields[k].name" />
          </div>
          <div class="is-required">
            <FormsBaseToggle v-model="product.extraFields[k].isRequired" label="Required" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.extra-fields {
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

    .fields {
      display: flex;
      flex-direction: column;
      gap: 3rem;
      .field {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 2rem;

        .name {
          flex: 1;
        }
      }
    }
  }
}
</style>
