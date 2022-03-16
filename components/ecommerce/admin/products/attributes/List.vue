<script setup>
const emit = defineEmits(['removeAttribute', 'removeTerm'])

const { product } = useStore()
const { errorMsg, fetchAll } = useFactory()

const showActionKeys = ref([])
const deletedTerms = ref([])

const allAttributes = (await $fetch(`/api/v1/attributes`, { fields: 'name, slug' })).docs
const allAttributeTerms = (await $fetch(`/api/v1/attributeterms`, { fields: 'name, slug, parent' })).docs

const resetActions = () => {
  for (const prop in product.value.attributes) {
    showActionKeys.value[prop] = false
  }
}

const setActions = (payload) => {
  resetActions()
  showActionKeys.value[payload.index] = payload.action
}

const handleRemoveAttribute = (attributeIndex) => {
  resetActions()
  emit('removeAttribute', attributeIndex)
}
</script>

<template>
  <table class="text-xs">
    <colgroup>
      <col span="1" />
      <col span="1" />
      <col span="1" />
      <col span="1" />
      <col span="1" />
      <col span="1" />
      <col span="1"  />
    </colgroup>
    <thead>
      <tr>
        <th>ID</th>
        <th>Attribute</th>
        <th>Enable</th>
        <th>Variation</th>
        <th>Default Term</th>
        <th>Terms</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(attribute, index) in product.attributes" :key="`attribute-${index}`">
        <td>{{ index + 1 }}</td>
        <td>
          <EcommerceAdminProductsAttributesAttribute
            :index="index"
            :allAttributes="allAttributes"
            :allAttributeTerms="allAttributeTerms"
          />
        </td>
        <td>
          <FormsBaseToggle
            v-model="product.attributes[index].enabled"
            v-if="Object.keys(product.attributes[index].attribute).length"
          />
        </td>
        <td>
          <FormsBaseToggle
            v-model="product.attributes[index].variation"
            v-if="Object.keys(product.attributes[index].attribute).length && product.attributes[index].enabled"
          />
        </td>
        <td>
          <EcommerceAdminProductsAttributesDefaultTerm :allAttributeTerms="allAttributeTerms" :index="index" />
        </td>
        <td>
          <EcommerceAdminProductsAttributesTerms
            :index="index"
            :allAttributeTerms="allAttributeTerms"
            @removeTerm="$emit('removeTerm', $event)"
          />
        </td>
        <td class="flex-row gap1">
          <EcommerceAdminActions
            :showAction="showActionKeys[index]"
            :showEdit="false"
            @moreHoriz="setActions({ index: index, action: !showActionKeys[index] })"
            @deleteAction="handleRemoveAttribute(index)"
          />
        </td>
      </tr>
    </tbody>
  </table>
  <div class="table admin-product-attributes shadow-md">
    <div class="table__header bg-slate-200">
      <div class="row py2 px1">
        <div class="th">ID</div>
        <div class="th">Attribute</div>
        <div class="th">Enable</div>
        <div class="th">Variation</div>
        <div class="th">Default Term</div>
        <div class="th">Terms</div>
        <div class="th">Actions</div>
      </div>
    </div>
    <div class="table__body">
      <EcommerceAdminProductsAttributesCard
        v-for="(attribute, index) in product.attributes"
        :index="index"
        :showAction="showActionKeys[index]"
        @termToDeleteUpdated="deletedTerms.push($event)"
        @removeTerm="$emit('removeTerm', $event)"
        @removeAttribute="handleRemoveAttribute"
        @resetActions="resetActions"
        @setActions="setActions"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.attributes {
  .attributes-details {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    overflow: auto;
    padding: 2rem;

    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 2rem;
      background-color: $slate-300;
    }

    .delete-all-attributes {
      align-self: flex-end;
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
