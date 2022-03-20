<script setup>
import slugify from 'slugify'

const props = defineProps({
  attribute: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  attributeTerms: {
    type: Array,
  },
  showAction: {
    type: Boolean,
  },
})

const emit = defineEmits(['setActions', 'attributeUpdated', 'deleteAttribute'])

const { errorMsg, alert } = useAppState()
const { saveDoc, deleteDoc, deleteMany } = useFactory()
const newTerm = ref(null)
const termToDelete = ref('')
const termInputRef = ref(null)
const newAttribute = reactive({
  ...props.attribute,
})
let response = null

const saveAttribute = async () => {
  errorMsg.value = null
  if (!newAttribute.name) return (errorMsg.value = 'Attribute name is required')
  newAttribute.slug = slugify(newAttribute.name, { lower: true })
  response = await saveDoc('attributes', newAttribute)
  if (response.ok && response.ok === false) return (errorMsg.value = response.errorMsg)
  emit('attributeUpdated', response)
  errorMsg.value = null
}

const showDeleteAttributeAlert = () => {
  showAlert('Are you sure you want to delete this attribute?', '', 'deleteAttribute', true)
}

const deleteAttribute = async () => {
  errorMsg.value = null
  response = await deleteDoc('attributes', props.attribute._id)
  if (response.status === 'error') return (errorMsg.value = response.errorMsg)
  console.log('A', response)
  response = await deleteMany('attributeterms', { parent: props.attribute._id })
  if (response.status === 'error') return (errorMsg.value = response.errorMsg)
  console.log('T', response)
  alert.value.action = ''
  alert.value.show = false
}

const addAttributeTerm = async () => {
  errorMsg.value = null
  if (!props.attribute.name) return (errorMsg.value = 'Attribute name is required')
  const termSlug = slugify(newTerm.value, { lower: true })
  if (props.attributeTerms.find((t) => t.slug === termSlug))
    return (errorMsg.value = 'Terms must be unique for each attribute')
  response = await saveDoc('attributeterms', { name: newTerm.value, slug: termSlug, parent: props.attribute._id })
  if (response && response.ok === false) return (errorMsg.value = response.errorMsg)
  newTerm.value = ''
  emit('attributeUpdated')
}

const showDeleteTermAlert = (termId) => {
  termToDelete.value = termId
  showAlert(
    'Are you sure you want to delete this attribute term?',
    'You must also delete al variants containig this term',
    'deleteTerm',
    true
  )
}

const deleteTerm = async () => {
  errorMsg.value = null
  response = await deleteDoc('attributeterms', termToDelete.value)
  if (response.status === 'error') return (errorMsg.value = response.data)
  termToDelete.value = ''
  alert.value.action = ''
  alert.value.show = false
  emit('attributeUpdated')
}

const showAlert = (heading, paragraph, action, showCancelBtn) => {
  alert.value.heading = heading
  alert.value.paragraph = paragraph
  alert.value.action = action
  alert.value.showCancelBtn = showCancelBtn
  alert.value.show = true
}

watch(
  () => alert.value.show,
  (currentVal) => {
    if (currentVal === 'ok' && alert.value.action === 'deleteAttribute') deleteAttribute()
    if (currentVal === 'ok' && alert.value.action === 'deleteTerm') deleteTerm()
  }
)
</script>

<template>
  <tr class="admin-attribute row">
    <td class="max-w-10">
      <div class="base-input">
        <input type="text" required v-model="newAttribute.name" @keyup.enter="saveAttribute" />
      </div>
    </td>
    <td>
      <div
        class="attribute-terms flex-row wrap items-center gap-05"
        @click="termInputFocus"
        v-show="attribute._id"
      >
        <div
          class="flex-row gap-05 border border-slate-300 br-3 text-sm items-center py-02 px-05 text-slate-50 bg-slate-500"
          v-for="(term, j) in attributeTerms"
          :key="term"
        >
          <span>{{ term.name }}</span>
          <button class="btn btn__secondary">
            <IconsClose class="w-1 h-1 fill-slate-50" @click="showDeleteTermAlert(term._id)" />
          </button>
        </div>
        <div class="form-group" @click="checkIfAttribute">
          <input
          class="py-02 px-1"
            ref="termInputRef"
            type="text"
            v-model="newTerm"
            placeholder="Attribute Term"
            :disabled="newAttribute.name == ''"
            @keyup.enter="addAttributeTerm"
            @focus="termInputRef.closest('.attribute-terms').classList.add('selected')"
          />
        </div>
      </div>
    </td>
    <td class="minw12">
      <EcommerceAdminActions
        :showAction="showAction"
        @moreHoriz="$emit('setActions', { index: index, action: !showAction })"
        @deleteAction="showDeleteAttributeAlert"
        @cancel="$emit('setActions', { index: index, action: false })"
      />
    </td>
  </tr>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

td {
  border-bottom: 1px solid $stone-300;
  padding: 2rem;
}
</style>
