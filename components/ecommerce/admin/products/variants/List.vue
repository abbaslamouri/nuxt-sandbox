<script setup>
const emit = defineEmits(['removeVariant', 'saveVariants', 'closeSlideout'])

const { variants } = useStore()
const showActionKeys = ref([])

const resetActions = () => {
  for (const prop in variants.value) {
    showActionKeys.value[prop] = false
  }
}

const setActions = (payload) => {
  resetActions()
  showActionKeys.value[payload.index] = payload.action
}

const handleRemoveVariant = (variantIndex) => {
  resetActions()
  emit('removeVariant', variantIndex)
}
</script>

<template>
  <div class="table admin-product-variants" v-if="variants.length">
    <div class="table__header">
      <div class="row">
        <div class="th">ID</div>
        <div class="th">Image</div>
        <div class="th">Variation</div>
        <div class="th">Enabled</div>
        <div class="th">Stock Qty.</div>
        <div class="th">Price</div>
        <div class="th">Sale Price</div>
        <div class="th">SKU</div>
        <div class="th">Actions</div>
      </div>
    </div>
    <div class="table__body" v-show="variants.length">
      <EcommerceAdminProductsVariantsCard
        v-if="variants.length"
        v-for="(variant, index) in variants"
        :index="index"
        :showAction="showActionKeys[index]"
        @setActions="setActions"
        @resetActions="resetActions"
        @removeVariant="handleRemoveVariant"
      />
      <!-- <EcommerceAdminProductsVariantsCard
        v-if="variants.length"
        v-for="(variant, index) in variants"
        :index="index"
        :showAction="showActionKeys[index]"
        :showDeleteVariantAlert="showDeleteVariantAlerts[index]"
        :showActions="showActions[index]"
        @showDeleteVariantAlertEmitted="handleShowDeleteVariantAlert(index, $event)"
        @showActionsEmitted="handleShowActions(index, $event)"
      /> -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.variantss {
  .variants-details {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    overflow: auto;
    padding: 2rem;

    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      background-color: $slate-300;

      .variants-actions {
        display: flex;
        align-items: center;
        gap: 4rem;

        .base-select {
          width: 30rem;
          height: 4rem;
        }

        .price-actions {
          .regular-price,
          .sale-price {
            display: flex;
            align-items: center;
            gap: 1rem;
          }
        }
      }
    }
  }

  .actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 2rem;

    .btn {
      &:disabled {
        background-color: $slate-400;
        cursor: not-allowed;
      }
    }
  }
}
</style>
