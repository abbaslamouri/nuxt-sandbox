<script setup>
// const prodState = inject('prodState')
// const attState = inject('attState')
// const attTermsState = inject('attTermsState')
import uniq from 'lodash.uniq'
import isEqual from 'lodash.isequal'
import { useStore } from '~/store/useStore'
import { useMessage } from '~/store/useMessage'

const props = defineProps({
  // attributes: {
  //   type: Object,
  //   required: true,
  // },
  // attributeTerms: {
  //   type: Array,
  //   required: true,
  // },
  // productAttribute: {
  //   type: Object,
  //   required: true,
  // },
  index: {
    type: Number,
  },
})

const emit = defineEmits(['cardAttributeUpdated', 'cardAttributeAttributeUpdated', 'attributeToDeleteSelected'])

const store = useStore()
const appMessage = useMessage()

// const cardAttribute = ref({})
const attributeSelectId = ref('')
const cardDefaultTerm = ref({})
const cardDefaultTermId = ref(null)
const termSelectId = ref('')
const termToDeleteId = ref(null)
const showActions = ref(false)
const showDeleteAttributeAlert = ref(false)
const showDeleteTermAlert = ref(false)
const showDeleteAllTermsAlert = ref(false)

// attributeSelectId.value = store.product.attributes[props.index].attribute._id
// cardDefaultTermId.value = store.product.attributes[props.index].defaultTerm._id

// const attributeSelect = ref(props.prodAttr.attribute._id ? props.prodAttr.attribute._id : '')
// const cardDefaultTerm = ref(props.prodAttr.defaultTerm._id ? props.prodAttr.defaultTerm._id : '')

// cardAttribute.value = { ...props.productAttribute }

const attributesSelectOptions = () =>
  store.attributes.map((a) => {
    return { key: a._id, name: a.name }
  })

const updateAttribute = (event) => {
  console.log('E', event.target.value)
  const newAttr = store.attributes.find((a) => a._id == event.target.value)
  console.log('ID', event.target.value)
  console.log(store.attributeTerms)
  console.log('NEW', newAttr)
  console.log('NEW', event.target.value)
  store.product.attributes[props.index].attribute = newAttr
  store.product.attributes[props.index].terms = []
  const newAttrTerms = store.attributeTerms.filter((t) => t.parent._id == event.target.value)
  console.log('NEWTERM', newAttrTerms)

  store.product.attributes[props.index].defaultTerm = newAttrTerms[0]
  // cardDefaultTermId.value = store.product.attributes[props.index].defaultTerm._id

  // for (const prop in prodState.selectedItem.attributes[props.i].terms) {
  //   removeVariantByTermId(prodState.selectedItem.attributes[props.i].terms[prop]._id)
  // }
  // prodState.selectedItem.attributes[props.i].terms = []
  // prodState.selectedItem.attributes[props.i].attribute = attributes.find((a) => a._id == attributeSelect.value)
  // prodState.selectedItem.attributes[props.i].defaultTerm = attTermsState.items.find(
  //   (t) => t.parent == attributeSelect.value
  // )
}

const setTermToDelete = (termId) => {
  termToDeleteId.value = termId
  showDeleteTermAlert.value = true
}

const removeVariantByTermId = (termId) => {
  // let j = 0
  // while (j < prodState.selectedItem.variants.length) {
  //   const k = prodState.selectedItem.variants[j].attrTerms.findIndex((t) => t._id == termId)
  //   const countBefore = prodState.selectedItem.variants[j].attrTerms.length
  //   // console.log('Before', countBefore)
  //   if (k !== -1) prodState.selectedItem.variants[j].attrTerms.splice(k, 1)
  //   const countAfter = prodState.selectedItem.variants[j].attrTerms.length
  //   // console.log('After', countAfter)
  //   if (countBefore != countAfter) prodState.selectedItem.variants[j].discard = true
  //   j++
  // }
  // prodState.selectedItem.variants = prodState.selectedItem.variants.filter((el) => !el.discard)
  // if (!prodState.selectedItem.variants.length) prodState.selectedItem.variants = []
}

const removeDuplicateVariants = () => {
  // prodState.selectedItem.variants = Array.from(
  //   prodState.selectedItem.variants
  //     .reduce((map, obj) => {
  //       let id = ''
  //       for (const prop in obj.attrTerms) {
  //         id = `${id}_${obj.attrTerms[prop]._id}`
  //       }
  //       // console.log(id)
  //       return map.set(id, obj)
  //     }, new Map())
  //     .values()
  // )
}

const deleteDbVariants = async () => {
  appMessage.errorMsg = null
  try {
    const response = await $fetch('/api/v1/variants/delete-many', {
      method: 'POST',
      params: { id: store.product._id },
    })
    console.log('deletedCount', response.deletedCount)
  } catch (error) {
    appMessage.errorMsg = error.data
  }
}

const saveDbVariants = async () => {
  appMessage.errorMsg = null
  try {
    let message = ''
    let error = ''
    await Promise.all(
      store.variants.map(async (variant) => {
        try {
          const response = await $fetch(`/api/v1/variants`, {
            method: 'POST',
            body: variant,
          })
          message += ` deleted.<br>`
        } catch (err) {
          console.error('MyERROR', err)
          error += `${err.data}.<br>`
        }
      })
    )
    appMessage.successMsg = 'Product variants saved succesfully'
    emit('slideoutEventEmitted', false)
    console.log('saved', store.variants)
    // router.push({ name: 'admin-ecommerce-products-slug', params: { slug: response.slug } })
  } catch (error) {
    appMessage.errorMsg = error.data
  }
}

const updateVariants = async () => {
  console.log('Save', store.variants)
  let errorMsg = ''
  for (const vprop in store.variants) {
    for (const prop in store.variants[vprop].attrTerms) {
      if (!Object.keys(store.variants[vprop].attrTerms[prop]).length)
        errorMsg += `Terms missing for attribute ${
          getVariantAttribute(store.variants[vprop].attrTerms[prop], prop).name
        }<br>`
    }
  }
  if (errorMsg) {
    appMessage.errorMsg = `Attribute terms are required<br> ${errorMsg}`
  } else {
    await deleteDbVariants()
    await saveDbVariants()
    emit('saveProduct')
  }
}

const setDefaultTerm = (event) => {
  console.log('E', event.target.value)
  const term = store.attributeTerms.find((t) => t._id == event.target.value)
  console.log('T', term)

  if (term) store.product.attributes[props.index].defaultTerm = term
}

const deleteAttribute = () => {
  console.log('var before', store.product.attributes[props.index].attribute._id)
  const attributeId = store.product.attributes[props.index].attribute._id
  console.log(attributeId)
  for (const prop in store.variants) {
    const i = store.variants[prop].attrTerms.findIndex((t) => t.parent._id == attributeId)
    if (i !== -1) store.variants[prop].attrTerms.splice(i, 1)
  }
  store.product.attributes.splice(props.index, 1)

  for (const prop in store.variants) {
    let i = prop
    while (i < store.variants.length - 1) {
      i++
      console.log(
        isEqual(
          store.variants[prop].attrTerms.map((t) => t._id),
          store.variants[i].attrTerms.map((t) => t._id)
        )
      )
      if (
        isEqual(
          store.variants[prop].attrTerms.map((t) => t._id),
          store.variants[i].attrTerms.map((t) => t._id)
        )
      ) {
        store.variants[prop].delete = true
      }
    }
  }
  store.variants = store.variants.filter((v) => !v.delete)
  console.log('XXXXX', store.variants)
  updateVariants()

  showDeleteAttributeAlert.value = false
  showActions.value = false
  // emit('attributeToDeleteSelected', props.index)
  // if (!confirm('Are you sure?')) return
  // // Remove all terms whose parent attarubute is to be deleted and mark all variants with empty eterms fro deletion
  // let j = 0
  // while (j < prodState.selectedItem.variants.length) {
  //   const k = prodState.selectedItem.variants[j].attrTerms.findIndex(
  //     (t) => t.parent == prodState.selectedItem.attributes[props.i].attribute._id
  //   )
  //   if (k !== -1) prodState.selectedItem.variants[j].attrTerms.splice(k, 1)
  //   if (!prodState.selectedItem.variants[j].attrTerms.length) prodState.selectedItem.variants[j].delete = true
  //   j++
  // }
  // // Delete all marked variations
  // prodState.selectedItem.variants = prodState.selectedItem.variants.filter((el) => !el.delete)
  // // Delete attribute
  // prodState.selectedItem.attributes.splice(props.i, 1)
  // removeDuplicateVariants()
  // // console.log(xx)
  // // [...new Set(prodState.selectedItem.variants.map((el) => el))]
}

const addAllTerms = () => {
  store.product.attributes[props.index].terms = store.attributeTerms.filter(
    (t) => t.parent._id == store.product.attributes[props.index].attribute._id
  )
}

const addTerm = () => {
  const term = store.attributeTerms.find((t) => t._id == termSelectId.value)
  if (term) {
    if (!store.product.attributes[props.index].terms) {
      store.product.attributes[props.index].terms = [term]
    } else {
      const index = store.product.attributes[props.index].terms.findIndex((t) => t._id == termSelectId.value)
      if (index == -1) store.product.attributes[props.index].terms.push(term)
    }
  }
  termSelectId.value = ''
}

const cancelDeleteAttribute = () => {
  showDeleteAttributeAlert.value = false
  showActions.value = false
}

const removeTerm = () => {
  // console.log('HHHHHHH')
  const index = store.product.attributes[props.index].terms.findIndex((t) => t._id == termToDeleteId.value)
  if (index !== -1) store.product.attributes[props.index].terms.splice(index, 1)
  showDeleteTermAlert.value = false

  // if (!confirm('Are you sure?')) return
  // prodState.selectedItem.attributes[props.i].terms.splice(j, 1)
  // removeVariantByTermId(termId)
  // let j = 0
  // prodState.selectedItem.attributes[props.i].terms.splice(i, 1)
  // while (j < prodState.selectedItem.variants.length) {
  //   const k = prodState.selectedItem.variants[j].attrTerms.findIndex((t) => t._id == termId)
  //   if (k !== -1) prodState.selectedItem.variants[j].discard = true
  //   j++
  // }
  // prodState.selectedItem.variants = prodState.selectedItem.variants.filter((el) => !el.discard)
  // if (prodState.selectedItem.variants.length < 2) prodState.selectedItem.variants = []
  // if (!prodState.selectedItem.attributes[props.i].terms.length)
  // delete prodState.selectedItem.attributes[props.i].terms
  // if (prodState.selectedItem.attributes[props.i].terms.length < 2) {
  //   while (j < prodState.selectedItem.variants.length) {
  //     const k = prodState.selectedItem.variants[j].attrTerms.findIndex(
  //       (t) => t._id == prodState.selectedItem.attributes[props.i].terms[0]._id
  //     )
  //     if (k !== -1) {
  //       // prodState.selectedItem.variants[j].attrTerms.splice(k, 1)
  //       // if (prodState.selectedItem.variants[j].attrTerms.length < 2)
  //       prodState.selectedItem.variants[j].attrTerms.splice(k, 1)
  //     }
  //     j++
  //   }
  // }
  // prodState.selectedItem.variants = prodState.selectedItem.variants.filter((el) => !el.delete)
  // prodState.selectedItem.attributes[props.i].terms.splice(0, 1)
  // if (prodState.selectedItem.attributes[props.i].terms.length < 2) {
  //   prodState.selectedItem.variants.filter((v) => {
  //     return v.attrTerms.filter((a) => a.parent != prodState.selectedItem.attributes[props.i].item._id)
  //   })
  // }
  // j = 0
  // while (j < prodState.selectedItem.variants.length) {
  //   const k = prodState.selectedItem.variants[j].attrTerms.findIndex((t) => t._id == termId)
  //   if (k !== -1) {
  //     prodState.selectedItem.variants[j].attrTerms.splice(k, 1)
  //     if (prodState.selectedItem.variants[j].attrTerms.length < 2) prodState.selectedItem.variants[j].delete = true
  //   }
  //   j++
  // }
}

const removeAllTerms = () => {
  store.product.attributes[props.index].terms = []
  showDeleteAllTermsAlert.value = false

  // // Remove all terms from ttribute
  // if (!confirm('Are you sure?')) return
  // for (const prop in prodState.selectedItem.attributes[props.i].terms) {
  //   removeVariantByTermId(prodState.selectedItem.attributes[props.i].terms[prop]._id)
  // }
  // prodState.selectedItem.attributes[props.i].terms = []
  // const index = prodState.selectedItem.attributes.findIndex(
  //   (a) => a._id == prodState.selectedItem.attributes[props.i]._id
  // )
  // console.log(index)
  // if (index !== -1) prodState.selectedItem.attributes[props.i].terms = []
}

// watch(
//   () => prodState.selectedItem.attributes[props.i],
//   (current, old) => {
//     console.log('C', current)
//     console.log('O', old)
//   },
//   { deep: true }
// )

// watch(
//   () => cardAttribute.value,
//   (current) => {
//     console.log(current)
//     emit('cardAttributeUpdated', { attr: current, index: props.index })
//   },
//   { deep: true }
// )
</script>

<template>
  <div class="admin-product-attribute shadow-md row">
    <!-- {{ store.product.attributes[index].attribute._id }}===={{ store.product.attributes[index].defaultTerm.name }} -->
    <pre style="font-size: 1rem">{{ store.product.attributes[index].attribute._id }}</pre>
    <div class="attribute td">
      <div class="base-select">
        <select @change="updateAttribute" class="centered">
          <option value="">Attribute</option>
          <option
            v-for="option in store.attributes.map((a) => {
              return { key: a._id, name: a.name }
            })"
            :key="option.key"
            :value="option.key"
            :selected="store.product.attributes[index].attribute._id == option.key"
            :disabled="store.product.attributes.find((a) => a.attribute._id == option.key)"
          >
            {{ option.name }}
          </option>
        </select>
      </div>
    </div>
    <div class="default-term td">
      <div class="base-select" v-if="Object.keys(store.product.attributes[index].attribute).length">
        <select @change="setDefaultTerm">
          <option value="">Default Term</option>
          <option
            v-for="option in store.attributeTerms
              .filter((t) => t.parent._id == store.product.attributes[index].attribute._id)
              .map((t) => {
                return { key: t._id, name: t.name }
              })"
            :key="option.key"
            :value="option.key"
            :selected="store.product.attributes[index].defaultTerm._id == option.key"
          >
            {{ option.name }}
          </option>
        </select>
      </div>
    </div>
    <div class="active td">
      <FormsBaseToggle
        v-model="store.product.attributes[index].active"
        v-if="Object.keys(store.product.attributes[index].attribute).length"
      />
    </div>
    <div class="variation td">
      <FormsBaseToggle
        v-model="store.product.attributes[index].variation"
        v-if="Object.keys(store.product.attributes[index].attribute).length"
      />
    </div>
    <div class="terms td">
      <div v-if="Object.keys(store.product.attributes[index].attribute).length" class="terms-wrapper">
        <div class="term-actions">
          <button class="btn" @click.prevent="addAllTerms()">Select All</button>
          <button class="btn" @click.prevent="showDeleteAllTermsAlert = true">Select None</button>
          <div class="base-select">
            <select v-model="termSelectId" @change="addTerm" class="centered">
              <option value="">Add term</option>
              <option
                v-for="term in store.attributeTerms.filter(
                  (t) => t.parent._id == store.product.attributes[index].attribute._id
                )"
                :key="term._id"
                :value="term._id"
                :disabled="store.product.attributes[index].terms.find((t) => t._id == term._id)"
              >
                {{ term.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="terms-list">
          <div class="list" v-if="store.product.attributes[index].terms.length">
            <div
              v-if="store.product.attributes[index].terms.length"
              class="term shadow-md"
              v-for="(term, j) in store.product.attributes[index].terms"
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
        <a href="#" class="link" @click.prevent="showDeleteAttributeAlert = true">
          <div class="cancel">Delete</div>
        </a>
      </div>
    </div>
    <Alert v-if="showDeleteAttributeAlert" @ok="deleteAttribute" @cancel="cancelDeleteAttribute">
      <h3>Are you sure you want to delete this attribute?</h3>
      <p>All variants associated with this attribute will also be removed.</p>
    </Alert>
    <Alert v-if="showDeleteTermAlert" @ok="removeTerm" @cancel="showDeleteTermAlert = false">
      <h3>Are you sure you want to remove this term?</h3>
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

  .attribute {
    // width: 20rem;
  }

  // border: 1px solid red;

  .attribute-default-term {
    width: 20rem;
    // .base-select {
    //   select {
    //     padding: 1rem 2rem !important;
    //   }
    // }
    // border: 1px solid red;
  }

  .terms {
    .terms-wrapper {
      position: relative;
      border: 1px solid $slate-300;

      display: flex;
      // align-items: stretch;
      gap: 1rem;
      font-size: 1.2rem;
      padding: 1rem;
      .term-actions {
        // border: 1px solid teal;
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
        // display: flex;
        // align-items: center;
        padding: 0.7rem 2rem;
        width: 100%;
        min-height: 100%;
        border: 1px solid $slate-300;

        .list {
          // flex: 1;
          // border: 1px solid $slate-300;

          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 1rem;
          // height: 100%;
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

  // .attribute-actions {
  //   // border: 1px solid red;
  //   position: relative;
  //   justify-self: flex-end;

  //   .btn {
  //     // border: none;
  //     padding: 0.5rem;
  //     border-radius: 5px;
  //   }

  //   .menu {
  //     position: absolute;
  //     top: -40%;
  //     right: 100%;
  //     border: 1px solid $slate-300;
  //     padding: 1rem 2rem;
  //     background-color: white;
  //     z-index: 9;
  //     font-size: 1.4rem;

  //     .cancel {
  //       color: $red-500;
  //     }
  //   }
  // }
}
</style>
