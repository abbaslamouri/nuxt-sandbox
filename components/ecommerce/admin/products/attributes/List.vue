<script setup>
const emit = defineEmits([
  'addTerm',
  'addAllTerms',
  'removeAttribute',
  'removeTerm',
  'removeAllTerms',
  'updateAttribute',
])

const { product } = useStore()
const { fetchAll } = useFactory()
const { errorMsg } = useAppState()


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
  <table class="text-xs shadow-md">
    <thead>
      <tr class="bg-slate-200">
        <th>ID</th>
        <th class="">Attribute</th>
        <th>Enable</th>
        <th>Variation</th>
        <th>Default Term</th>
        <th>Terms</th>
        <th class="text-right minw12">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(attribute, index) in product.attributes" :key="`attribute-${index}`">
        <td>
          <div class="bg-slate-200 p1 br3">{{ index + 1 }}</div>
        </td>
        <td>
          <EcommerceAdminProductsAttributesAttribute
            :attribute="attribute"
            :allAttributes="allAttributes"
            :allAttributeTerms="allAttributeTerms"
            @updateAttribute="$emit('updateAttribute', $event)"
          />
        </td>
        <td class="">
          <FormsBaseToggle
            v-model="product.attributes[index].enabled"
            v-if="Object.keys(product.attributes[index].attribute).length"
          />
        </td>
        <td class="">
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
            :attribute="attribute"
            :allAttributeTerms="allAttributeTerms"
            @addTerm="$emit('addTerm', $event)"
            @addAllTerms="$emit('addAllTerms', $event)"
            @removeTerm="$emit('removeTerm', $event)"
            @removeAllTerms="$emit('removeAllTerms', $event)"
          />
        </td>
        <td>
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
</template>

<style lang="scss" scoped></style>
