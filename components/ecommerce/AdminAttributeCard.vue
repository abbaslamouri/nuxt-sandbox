<script setup>
import slugify from 'slugify'
import { useMessage } from '~/store/useMessage'

const props = defineProps({
  attribute: {
    type: Object,
    required: true,
  },
  attributeTerms: {
    type: Array,
  },
  i: {
    type: Number,
  },
})

const emit = defineEmits(['termSaved', 'attributeDeleted'])

// const showNewTermForm = ref(false); // Tp toggle new term form
const appMessage = useMessage()
const showActions = ref(false)
const newTerm = ref('')
const attInputFocus = ref(false)
const termInputRef = ref(null)
const showAlert = ref(false)
const newAttribute = reactive({
  ...props.attribute,
})

// const attributeTerms = computed(() => props.terms.filter((t) => t.parent == attribute._id))

// const handletermInputRefBtnClick = async (index) => {
//   console.log('REF', termInputRef.value);
//   showNewTermForm.value = true;
//   setTimeout(() => {
//     termInputRef.value.focus();
//   }, 10);
// };
const saveAttribute = async () => {
  try {
    if (newAttribute.name) {
      newAttribute.slug = slugify(newAttribute.name, { lower: true })
      if (!newAttribute._id) {
        $fetch('/api/v1/attributes', {
          method: 'POST',
          body: newAttribute,
        })
      } else {
        $fetch('/api/v1/attributes', {
          method: 'PATCH',
          body: newAttribute,
          params: { id: newAttribute._id },
        })
      }
    }
    appMessage.successMsg = `Attribute ${newAttribute.name} saved succesfully`
  } catch (error) {
    appMessage.errorMsg = error.data
  }
}

const deleteAttribute = async () => {
  // Delete all terms assocaited with this attrubute
  await Promise.all(
    props.attributeTerms.map(async (item) => {
      console.log('IIIII', item)
      await $fetch('/api/v1/attributeterms', {
        method: 'DELETE',
        params: { id: item._id },
      })
    })
  )
  await $fetch('/api/v1/attributes', {
    method: 'DELETE',
    params: { id: props.attribute._id },
  })
  emit('attributeDeleted')

  // if (!confirm('Are you sure? This attribute and all associated terms will be deleted')) return
  // attState.selectedItem = props.attribute
  // await attActions.deleteItem()
  // attTermsState.selectedItems = attTermsState.items.filter((el) => el.parent == props.attribute._id)
  // await attTermsActions.deleteItems()
  showActions.value = false
  showAlert.value = false
}

const addAttributeTerm = async () => {
  if (!props.attribute.name) return
  appMessage.errorMsg = null
  try {
    const termSlug = slugify(newTerm.value, { lower: true })
    if (!props.attributeTerms.find((t) => t.slug === termSlug)) {
      await $fetch('/api/v1/attributeterms', {
        method: 'POST',
        body: { name: newTerm.value, slug: termSlug, parent: props.attribute },
      })
    }
    appMessage.successMsg = `Attribute Term ${newTerm.value} was added succesfully`
    newTerm.value = ''
    emit('termSaved')
  } catch (error) {
    appMessage.errorMsg = error.data
  }
}

const deleteTerm = async (termId) => {
  console.log(termId)
  appMessage.errorMsg = null
  try {
    await $fetch('/api/v1/attributeterms', {
      method: 'DELETE',
      params: { id: termId },
    })
    const term = props.attributeTerms.find((t) => t._id == termId)
    appMessage.successMsg = `Attribute Term ${term.name} was deleted succesfully`
    emit('termSaved')
  } catch (error) {
    appMessage.errorMsg = error.data
  }
}
</script>

<template>
  <div class="admin-attribute row">
    <!-- {{ newAttribute }}==={{ attributeTerms }} -->
    <div class="name td">
      <div class="base-input">
        <input
          type="text"
          required
          label="Attribute Name"
          placeholder="Attribute Name"
          v-model="newAttribute.name"
          @keyup.enter="saveAttribute"
        />
      </div>
      <!-- <FormsBaseInput required label="Attribute Name" placeholder="Attribute Name" v-model="newAttribute.name" /> -->
    </div>
    <div class="terms td shadow-md" @click="termInputFocus">
      <div class="list" v-for="(term, j) in attributeTerms" :key="term">
        <span>{{ term.name }}</span>
        <IconsClose @click="deleteTerm(term._id)" />
      </div>
      <div class="form-group" @click="checkIfAttribute">
        <input
          ref="termInputRef"
          type="text"
          v-model="newTerm"
          placeholder="Attribute Terms (Example: Green,
        Blue, Green ...)"
          :disabled="newAttribute.name == ''"
          @keyup.enter="addAttributeTerm"
          @focus="termInputRef.closest('.terms').classList.add('selected')"
        />
      </div>
    </div>
    <div class="actions td">
      <button class="btn" @click.prevent="showActions = !showActions" :class="{ active: showActions }">
        <IconsMoreHoriz />
      </button>
      <div class="menu shadow-md" v-show="showActions">
        <a href="#" class="link"><div class="advanced">Advanced</div></a>
        <a href="#" class="link" @click.prevent="showAlert = true" v-if="attribute._id">
          <div class="cancel">Delete</div>
        </a>
      </div>
    </div>
    <Alert v-if="showAlert" @ok="deleteAttribute" @cancel="showAlert = false">
      <h3>Are you sure you want to delete attribute {{ attribute.name }}?</h3>
      <p>This attribute and all associated terms will be deleted.</p>
    </Alert>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.admin-attribute {
  font-size: 1.2rem;

  .name {
    width: 30rem;
  }

  .terms {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
    border: 1px solid $slate-200;
    padding: 0.7rem 2rem;
    cursor: text;

    &.selected {
      border: 3px solid $sky-200;
    }

    .list {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border: 1px solid $slate-300;
      background-color: white;
      padding: 0.5rem 1rem;
      border-radius: 5px;
      font-weight: 500;
    }

    .form-group {
      width: 100%;
      flex: 1;

      input {
        width: 100%;
        font-size: 1.2rem;
        width: 100%;

        &:focus {
          border: none;
        }

        &:disabled {
          // background-color: #ddd;
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
    }

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
</style>
