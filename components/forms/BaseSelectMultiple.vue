<script setup>
defineProps({
  modelValue: {
    type: Array,
    default: [],
  },
  options: {
    type: Array,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
  hint: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'itemsSelected'])

const uuid = useUniqueId().getId()
const items = ref([])
const inputRefs = ref([])
const showListBox = ref(false)

const addItem = (event) => {
  const index = items.value.findIndex((item) => item == event.target.value)
  if (index === -1) items.value.push(event.target.value)
  else items.value.splice(index, 1)
  emit('update:modelValue', items.value)
}

onMounted(() => {
  document.addEventListener('click', (evt) => {
    const flyoutElement = document.querySelector('.listbox-area')
    let targetElement = evt.target // clicked element
    do {
      if (targetElement == flyoutElement) {
        return
      }
      targetElement = targetElement.parentNode
    } while (targetElement)

    showListBox.value = false
  })
})
</script>

<script>
export default {
  inheritAttrs: false,
}
</script>

<template>
  <div class="listbox-area">
    <button class="select" @click="showListBox = !showListBox">
      <div class="label" v-if="!items.length" role="label">Select Categories</div>
      <div class="selected-options" v-else>
        <span class="option" v-for="item in items" :key="item"> {{ options.find((c) => c.key == item).name }}</span>
      </div>
      <IconsChevronUp v-if="showListBox" />
      <IconsChevronDown v-else />
    </button>
    <div class="dropdown-options shadow-md" role="listbox" tabindex="-1" v-show="showListBox">
      <div
        v-for="(option, index) in options"
        class="list-item"
        :id="`list-item-${uuid}-${option.key}`"
        role="option"
        :key="option.key"
        tabindex="0"
        :aria-selected="items.includes(option.key)"
      >
        <label class="form-control" :class="{ disabled: inputRefs[index] && inputRefs[index].disabled }">
          <input
            :ref="(el) => (inputRefs[index] = el)"
            readonly
            type="checkbox"
            :value="option.key"
            @click="addItem"
            :checked="modelValue.includes(option.key)"
          />
          <div class="label">{{ option.name }}</div>
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/scss/variables';

.listbox-area {
  display: flex;
  flex-direction: column;

  .select {
    display: grid;
    grid-template-rows: 2fr;
    grid-template-columns: 1fr 2rem;
    gap: 1rem;
    align-items: center;
    padding: 1rem;
    width: 100%;
    background-color: transparent;
    border: 2px solid $slate-500;
    border-radius: 5px 5px 0 0;
    cursor: pointer;

    .label {
      grid-row: 1 / 2;
      grid-column: 1 / 2;
    }

    .selected-options {
      grid-row: 1 / 2;
      grid-column: 1 / 2;
      width: 100%;
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      font-size: 1.4rem;

      .option {
        background-color: $slate-700;
        color: $slate-50;
        padding: 0.2rem 0.5rem;
        border-radius: 5px;
      }
    }

    svg {
      grid-row: 1 / 2;
      grid-column: 2 / 3;
      width: 2rem;
      height: 2rem;
      display: inline-block;
    }
  }

  .dropdown-options {
    gap: 1rem;
    border: 1px solid $slate-400;
    border-top: none;
    border-radius: 0 0 5px 5px;

    .list-item {
      padding: 1rem 1rem;
      border-bottom: 1px solid $slate-300;

      &:hover {
        background-color: $slate-200;
      }

      .form-control {
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5em;

        &.disabled {
          color: $slate-400;
          cursor: not-allowed;
        }

        input[type='checkbox'] {
          display: grid;
          place-content: center;
          appearance: none;
          background-color: #fff;
          margin: 0;
          font: inherit;
          color: currentColor;
          width: 1.75rem;
          height: 1.75rem;
          border: 0.15rem solid currentColor;
          border-radius: 0.15rem;
          cursor: pointer;

          &:checked::before {
            transform: scale(1);
            background-color: CanvasText;
            transform-origin: bottom left;
            clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
          }

          &::before {
            content: '';
            width: 1.25rem;
            height: 1.25rem;
            transform: scale(0);
            transition: 120ms transform ease-in-out;
            box-shadow: inset 1em 1em $slate-700;
          }

          &:disabled {
            color: $slate-300;
            cursor: not-allowed;
          }
        }
      }
    }
  }
}

// .base-select {
//   display: flex;
//   align-items: center;
//   gap: 1rem;

//   select {
//     padding: 0.5rem 1rem;
//   }
// }
</style>
