<script setup>
const props = defineProps({
  index: {
    type: Number,
  },
  allAttributeTerms: {
    type: Array,
    default: [],
  },
})

const { product } = useStore()
const { alert } = useFactory()

const termSelectId = ref('')
const termToDeleteId = ref(null)

const addTerm = () => {
  const term = props.allAttributeTerms.find((t) => t._id == termSelectId.value)
  if (term) {
    if (!product.value.attributes[props.index].terms) {
      product.value.attributes[props.index].terms = [term]
    } else {
      const index = product.value.attributes[props.index].terms.findIndex((t) => t._id == termSelectId.value)
      if (index == -1) product.value.attributes[props.index].terms.push(term)
    }
  }
  termSelectId.value = ''
}

const addAllTerms = () => {
  product.value.attributes[props.index].terms = props.allAttributeTerms.filter(
    (t) => t.parent._id == product.value.attributes[props.index].attribute._id
  )
}

const removeTerm = () => {
  const i = product.value.attributes[props.index].terms.findIndex((t) => t._id == termToDeleteId.value)
  if (i !== -1) product.value.attributes[props.index].terms.splice(i, 1)
  termToDeleteId.value = null
  alert.value.show = false
  alert.value.action = ''
}

const removeAllTerms = () => {
  product.value.attributes[props.index].terms = []
  alert.value.show = false
  alert.value.action = ''
}

const setAlert = (alertPayload, termId = null) => {
  termToDeleteId.value = termId
  alert.value.action = alertPayload.alertAction
  alert.value.heading = alertPayload.alertHeading
  alert.value.paragraph = alertPayload.alertParagraph
  alert.value.show = true
  console.log('A', alert.value)
}

watch(
  () => alert.value,
  (currentVal) => {
    console.log('W', currentVal)
    if (currentVal.show === 'ok' && currentVal.action === 'removeTerm') removeTerm()
    if (currentVal.show === 'ok' && currentVal.action === 'removeAllTerms') removeAllTerms()
  },
  { deep: true }
)
</script>

// font-size: 1rem; // padding: 0.3rem; // background-color: $slate-400; // color: white; // width: 9rem;

<template>
  <div>
    <div
      v-if="Object.keys(product.attributes[index].attribute).length"
      class="terms flex-row gap1 border border-slate-300 p1 br3 text-xs"
    >
      <div class="term-actions flex-col gap05 minw12">
        <button
          class="text-xs border bg-slate-400 text-slate-50 uppercase px1 py02 br3 cursor-pointer"
          @click.prevent="addAllTerms()"
        >
          Select All
        </button>
        <button
          class="text-xs border bg-slate-400 text-slate-50 uppercase px1 py02 br3 cursor-pointer"
          @click.prevent="
            setAlert({
              alertAction: 'removeAllTerms',
              alertHeading: 'Are you sure you want to remove all attribute terms?',
              alertParagraph: 'All product variants containing these terms will also be removed.',
            })
          "
        >
          Select None
        </button>
        <div class="border border-slate-400 py02 px05 br3">
          <select v-model="termSelectId" @change="addTerm" class="wfull">
            <option value="">Add term</option>
            <option
              v-for="term in allAttributeTerms.filter((t) => t.parent._id == product.attributes[index].attribute._id)"
              :key="term._id"
              :value="term._id"
              :disabled="product.attributes[index].terms.find((t) => t._id == term._id)"
            >
              {{ term.name }}
            </option>
          </select>
        </div>
      </div>

      <div class="border border-slate-300 minw12 br3 py05">
        <div class="list flex-row items-center gap05 wrap p1" v-if="product.attributes[index].terms.length">
          <div
            v-if="product.attributes[index].terms.length"
            class="shadow-md flex-row items-cdenter gap05 bg-slate-500 text-slate-50 py02 px05 br3"
            v-for="(term, j) in product.attributes[index].terms"
            :key="term._id"
          >
            <span>{{ term.name }}</span>
            <span
              class="remove-term"
              @click="
                setAlert(
                  {
                    alertAction: 'removeTerm',
                    alertHeading: 'Are you sure you want to remove this attribute term?',
                    alertParagraph: 'All product variants containing this term will also be removed.',
                  },
                  term._id
                )
              "
            >
              <IconsClose class="w1 h1 fill-slate-50" />
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
