<script setup>
const props = defineProps({
  attribute: {
    type: Object,
    default: [],
  },
  allAttributeTerms: {
    type: Array,
    default: [],
  },
})

const emit = defineEmits(['addTerm', 'addAllTerms', 'removeTerm', 'removeAllTerms'])

const termSelectId = ref('')

const handleAddTerm = () => {
  emit('addTerm', { attributeId: props.attribute.attribute._id, termId: termSelectId.value })
  setTimeout(() => {
    termSelectId.value = ''
  }, 500)
}
</script>

<template>
  <div>
    <div
      v-if="Object.keys(attribute.attribute).length"
      class="terms flex-row gap1 border border-slate-300 p1 br3 text-xs"
    >
      <div class="term-actions flex-col justify-center gap05">
        <button
          class="text-xs border bg-slate-400 text-slate-50 px1 py02 br3 cursor-pointer"
          @click.prevent="$emit('addAllTerms', attribute.attribute._id)"
          v-if="
            attribute.terms.length != allAttributeTerms.filter((t) => t.parent._id == attribute.attribute._id).length
          "
        >
          Select All
        </button>

        <button
          class="text-xs minw12 border bg-slate-400 text-slate-50 px1 py02 br3 cursor-pointer"
          @click.prevent="$emit('removeAllTerms', attribute.attribute._id)"
          v-if="attribute.terms.length"
        >
          Select None
        </button>

        <div
          class="border border-slate-400 py02 px05 br3"
          v-if="
            attribute.terms.length != allAttributeTerms.filter((t) => t.parent._id == attribute.attribute._id).length
          "
        >
          <select v-model="termSelectId" @change="handleAddTerm" class="wfull text-xs">
            <option value="">Add term</option>
            <option
              v-for="term in allAttributeTerms.filter((t) => t.parent._id == attribute.attribute._id)"
              :key="term._id"
              :value="term._id"
              :disabled="attribute.terms.find((t) => t._id == term._id)"
            >
              {{ term.name }}
            </option>
          </select>
        </div>
      </div>

      <div class="border border-slate-300 minw12 br3 py05">
        <div class="list flex-row items-center gap05 wrap p1" v-if="attribute.terms.length">
          <div
            v-if="attribute.terms.length"
            class="shadow-md flex-row items-cdenter gap05 bg-slate-500 text-slate-50 py02 px05 br3"
            v-for="(term, j) in attribute.terms"
            :key="term._id"
          >
            <span>{{ term.name }}</span>
            <span class="cursor-pointer" @click="$emit('removeTerm', term._id)">
              <IconsClose class="w1 h1 fill-slate-50" />
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
