<script setup>
// import { useStore } from '~/store/useStore'

const props = defineProps({
  index: {
    type: Number,
  },
  allAttributes: {
    type: Array,
    default: [],
  },
  allAttributeTerms: {
    type: Array,
    default: [],
  },
})

const emit = defineEmits(['termToDeleteUpdated', 'termsToDeleteUpdated'])

const store = inject('store')

const saveProduct = inject('saveProduct')

// const store = useStore()
const termSelectId = ref('')
const termToDeleteId = ref(null)
const showActions = ref(false)
const showDeleteAttributeAlert = ref(false)
const showDeleteTermAlert = ref(false)
const showDeleteAllTermsAlert = ref(false)

const updateAttribute = (event) => {
  store.value.doc.attributes[props.index].attribute = props.allAttributes.find((a) => a._id == event.target.value)
  store.value.doc.attributes[props.index].terms = []
  store.value.doc.attributes[props.index].defaultTerm = props.allAttributeTerms.filter(
    (t) => t.parent._id == event.target.value
  )[0]
}

const setDefaultTerm = (event) => {
  console.log('E', event.target.value)
  const term = props.allAttributeTerms.find((t) => t._id == event.target.value)
  console.log('T', term)

  if (term) store.value.doc.attributes[props.index].defaultTerm = term
}

const addAllTerms = () => {
  store.value.doc.attributes[props.index].terms = props.allAttributeTerms.filter(
    (t) => t.parent._id == store.value.doc.attributes[props.index].attribute._id
  )
}

const setTermToDelete = (termId) => {
  termToDeleteId.value = termId
  showDeleteTermAlert.value = true
}

const removeTerm = () => {
  const index = store.value.doc.attributes[props.index].terms.findIndex((t) => t._id == termToDeleteId.value)
  if (index !== -1) store.value.doc.attributes[props.index].terms.splice(index, 1)
  showDeleteTermAlert.value = false
  emit('termToDeleteUpdated', termToDeleteId.value)
  termToDeleteId.value = null
}

const removeAllTerms = () => {
  store.value.doc.attributes[props.index].terms = []
  showDeleteAllTermsAlert.value = false
  const termsToDelete = store.value.doc.attributes[props.index].terms.map((t) => {
    return t._id
  })
  for (const prop in termsToDelete) {
    emit('termToDeleteUpdated', termsToDelete[prop])
  }
}

const addTerm = () => {
  const term = props.allAttributeTerms.find((t) => t._id == termSelectId.value)
  if (term) {
    if (!store.value.doc.attributes[props.index].terms) {
      store.value.doc.attributes[props.index].terms = [term]
    } else {
      const index = store.value.doc.attributes[props.index].terms.findIndex((t) => t._id == termSelectId.value)
      if (index == -1) store.value.doc.attributes[props.index].terms.push(term)
    }
  }
  termSelectId.value = ''
}

const deleteAttribute = () => {
  const attributeId = store.value.doc.attributes[props.index].attribute._id
  for (const prop in store.variants) {
    const i = store.variants[prop].attrTerms.findIndex((t) => t.parent._id == attributeId)
    if (i !== -1) store.variants[prop].attrTerms.splice(i, 1)
  }
  store.value.doc.attributes.splice(props.index, 1)
  store.variants = []
  saveProduct(store.product)
  showDeleteAttributeAlert.value = false
  showActions.value = false
}

const cancelDeleteAttribute = () => {
  showDeleteAttributeAlert.value = false
  showActions.value = false
}

const handleDeleteAttributeBtnClick = () => {
  showDeleteAttributeAlert.value = true
  showActions.value = false
}
</script>

<template>
  <div class="admin-product-attribute shadow-md row">
    <div class="id td">{{ index * 1 + 1 }}</div>
    <div class="attribute td">
      <div class="base-select">
        <select @change="updateAttribute" class="centered">
          <option value="">Select Attribute</option>
          <option
            v-for="option in allAttributes.map((a) => {
              return { key: a._id, name: a.name }
            })"
            :key="option.key"
            :value="option.key"
            :selected="store.doc.attributes[index].attribute._id == option.key"
            :disabled="store.doc.attributes.find((a) => a.attribute._id == option.key)"
          >
            {{ option.name }}
          </option>
        </select>
      </div>
    </div>
    <div class="active td">
      <FormsBaseToggle
        v-model="store.doc.attributes[index].enabled"
        v-if="Object.keys(store.doc.attributes[index].attribute).length"
      />
    </div>
    <div class="variation td">
      <FormsBaseToggle
        v-model="store.doc.attributes[index].variation"
        v-if="Object.keys(store.doc.attributes[index].attribute).length && store.doc.attributes[index].enabled"
      />
    </div>
    <div class="default-term td">
      <div class="base-select" v-if="Object.keys(store.doc.attributes[index].attribute).length">
        <select @change="setDefaultTerm" :disabled="!store.doc.attributes[index].enabled">
          <option value="">Select Default Term</option>
          <option
            v-for="option in allAttributeTerms
              .filter((t) => t.parent._id == store.doc.attributes[index].attribute._id)
              .map((t) => {
                return { key: t._id, name: t.name }
              })"
            :key="option.key"
            :value="option.key"
            :selected="store.doc.attributes[index].defaultTerm._id == option.key"
          >
            {{ option.name }}
          </option>
        </select>
      </div>
    </div>

    <div class="terms td">
      <div v-if="Object.keys(store.doc.attributes[index].attribute).length" class="terms-wrapper">
        <div class="term-actions">
          <button class="btn" @click.prevent="addAllTerms()">Select All</button>
          <button class="btn" @click.prevent="showDeleteAllTermsAlert = true">Select None</button>
          <div class="base-select">
            <select v-model="termSelectId" @change="addTerm" class="centered">
              <option value="">Add term</option>
              <option
                v-for="term in allAttributeTerms.filter(
                  (t) => t.parent._id == store.doc.attributes[index].attribute._id
                )"
                :key="term._id"
                :value="term._id"
                :disabled="store.doc.attributes[index].terms.find((t) => t._id == term._id)"
              >
                {{ term.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="terms-list">
          <div class="list" v-if="store.doc.attributes[index].terms.length">
            <div
              v-if="store.doc.attributes[index].terms.length"
              class="term shadow-md"
              v-for="(term, j) in store.doc.attributes[index].terms"
              :key="term._id"
            >
              <span>{{ term.name }}</span>
              <span class="remove-term" @click="setTermToDelete(term._id)">
                <IconsClose />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="actions td">
      <button class="btn" @click.prevent="showActions = !showActions"><IconsMoreHoriz /></button>
      <div class="menu shadow-md" v-show="showActions">
        <a href="#" class="link" @click.prevent="handleDeleteAttributeBtnClick">
          <div class="cancel">Delete</div>
        </a>
      </div>
    </div>
    <Alert v-if="showDeleteAttributeAlert" @ok="deleteAttribute" @cancel="cancelDeleteAttribute">
      <h3>Are you sure you want to delete this attribute?</h3>
      <p>All variants associated with this attribute will also be removed.</p>
    </Alert>
    <Alert v-if="showDeleteTermAlert" @ok="removeTerm" @cancel="showDeleteTermAlert = false">
      <h3>Are you sure you want to remove this attribute term?</h3>
      <p>All variants associated with this term will also be removed.</p>
    </Alert>
    <Alert v-if="showDeleteAllTermsAlert" @ok="removeAllTerms" @cancel="showDeleteAllTermsAlert = false">
      <h3>Are you sure you want to remove all terms?</h3>
      <p>All variants associated with these terms will also be removed.</p>
    </Alert>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.admin-product-attribute {
  border: 1px solid $slate-200;
  border-radius: 3px;
  padding: 1rem;

  .id {
    background-color: $slate-300;
    padding: 1rem;
    border-radius: 3px;
  }

  .terms {
    .terms-wrapper {
      position: relative;
      border: 1px solid $slate-300;

      display: flex;
      gap: 1rem;
      font-size: 1.2rem;
      padding: 1rem;

      .term-actions {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        min-width: 12rem;

        .btn {
          font-size: 1rem;
          padding: 0.3rem;
          background-color: $slate-400;
          color: white;
          width: 9rem;
        }

        select {
          font-size: 1.2rem;
        }
      }

      .terms-list {
        padding: 0.7rem 2rem;
        width: 100%;
        min-height: 100%;
        border: 1px solid $slate-300;

        .list {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 1rem;
          width: 100%;
        }

        .term {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border: 1px solid $slate-300;
          background-color: white;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          font-weight: 500;

          svg {
            width: 1.2rem;
            height: 1.2rem;
            background-color: $slate-500;
            fill: $slate-50;
            padding: 0.1rem;
            border-radius: 50%;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
