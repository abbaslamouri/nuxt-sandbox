<script setup>
const props = defineProps({
  index: {
    type: Number,
  },
})

const { product, variants } = useStore()

const getTermValue = (attributeId) => {
  const term = variants.value[props.index].attrTerms.find((t) => t && t.parent && t.parent._id == attributeId)
  return term ? term._id : null
}

const setAttributeTerm = async (i, termId) => {
  const term = product.value.attributes[i].terms.find((t) => t._id == termId)
  const k = variants.value[props.index].attrTerms.findIndex(
    (t) => t && t.parent && t.parent._id == product.value.attributes[i].attribute._id
  )
  if (k !== -1) {
    variants.value[props.index].attrTerms[k] = term
  } else {
    variants.value[props.index].attrTerms[i] = term
  }
}
</script>

<template>
  <section class="shadow-md wfull bg-white p2 br5" id="details">
    <div class="flex-row items-center justify-between text-sm mb1">
      <div class="uppercase inline-block border-b-stone-300 font-bold pb05">Variant Options</div>
      <div></div>
    </div>
    <div class="flex-col gap2">
      <div class="flex-row gap2">
        <div class="flex1" v-for="(attribute, i) in product.attributes" :key="attribute.attribute._id">
          <div class="base-select">
            <select :value="getTermValue(attribute.attribute._id)" @change="setAttributeTerm(i, $event.target.value)">
              <option :value="null">Select Term</option>
              <option v-for="(term, j) in attribute.terms" :key="term._id" :value="term._id">{{ term.name }}</option>
            </select>
            <label>{{ attribute.attribute.name }}</label>
          </div>
        </div>
      </div>
      <div class="enabled">
        <FormsBaseToggle v-model="variants[index].enabled" label="Enabled" />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
