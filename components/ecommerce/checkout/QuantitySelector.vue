<script setup>
const props = defineProps({
  minVal: {
    type: Number,
    required: true,
  },
  maxVal: {
    type: Number,
    required: true,
  },
  stepVal: {
    type: Number,
    required: true,
  },
  btnText: {
    type: [String, Number],
  },
  showSelectQty: {
    type: Boolean,
  },
  parentComponent: {
    type: String,
  },
})

const emit = defineEmits(['okBtnClicked', 'cancel'])
const uuid = useUniqueId().getId()

const quantity = ref(null)
const quantitySelectorPosition = ref(null)
const quantityArr = ref([])
const quantitySelectorOffset = ref(null)

let i = props.minVal
while (i <= props.maxVal) {
  quantityArr.value.push(i)
  i += props.stepVal
}
if (quantityArr.value.length <= 5) {
  quantitySelectorOffset.value = `-110px`
} else if (quantityArr.value.length > 5 && quantityArr.value.length <= 10) {
  quantitySelectorOffset.value = `-150px`
} else if (quantityArr.value.length > 10 && quantityArr.value.length <= 15) {
  quantitySelectorOffset.value = `-190px`
} else if (quantityArr.value.length > 15 && quantityArr.value.length <= 20) {
  quantitySelectorOffset.value = `-230px`
} else if (quantityArr.value.length > 20 && quantityArr.value.length <= 25) {
  quantitySelectorOffset.value = `-270px`
} else if (quantityArr.value.length > 25 && quantityArr.value.length <= 30) {
  quantitySelectorOffset.value = `-310px`
} else {
  quantitySelectorOffset.value = `-350px`
}

if (process.client) {
  document.addEventListener('click', (event) => {
    if (
      !event.target.closest(`.quantity-selector-${uuid}`) &&
      !event.target.classList.contains(`quantity-selector-input`)
    ) {
      console.log('PPPPPP', event.target.classList)
      emit('cancel')
    }
  })
}
const setQuantitySelectorPosition = (event) => {
  const position = event.target.getBoundingClientRect().y
  console.log(position)
  if (position < 320) quantitySelectorPosition.value = 'below'
  else quantitySelectorPosition.value = null
  emit('okBtnClicked', { status: !props.showSelectQty, quantity: null })
}

const handleQuantityBtnClick = (qty) => {
  emit('okBtnClicked', { status: false, quantity: qty })
  quantity.value = null
}
</script>

<template>
  <div class="quantity-selector relative" :class="{ cart: parentComponent === 'cart' }">
    <button class="btn btn__quantity-selector" @click.stop="setQuantitySelectorPosition">
      <client-only>
        <div class="" v-if="btnText">{{ btnText }}</div>
        <IconsPlus v-else class="fill-slate-50" />
      </client-only>
    </button>
    <div class="selector absolute bg-stone-200 z-9 p1 br3" v-if="showSelectQty" :class="quantitySelectorPosition">
      <ul class="flex-row wrap">
        <li
          class="quantity flex-row gap1 items-center justify-center text-xs w4 h4 ml-1 cursor-pointer"
          v-for="n in quantityArr"
          :key="`predefined-quantity-${n}`"
          @click="handleQuantityBtnClick(n)"
        >
          <span>{{ n }}</span>
        </li>
      </ul>
      <div class="flex-row">
        <input
          :class="`px1 text-xs flex-1 quantity-selector-input`"
          type="text"
          v-model="quantity"
          placeholder="Add custom quantity"
          @change="handleQuantityBtnClick(quantity)"
        />
        <button class="btn btn__quantity-selector" @click="handleQuantityBtnClick(quantity)">OK</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.quantity-selector {
  .selector {
    top: v-bind(quantitySelectorOffset);
    left: 50%;
    width: 215px;
    transform: translateX(-50%);
    background-color: $stone-200;

    &.below {
      top: 130%;
      &::before {
        top: -20px;
        border-color: transparent transparent $stone-200 transparent;
      }
    }

    &::before {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border-width: 10px;
      border-style: solid;
      border-color: $stone-200 transparent transparent transparent;
    }

    .quantity {
      border-right: 1px solid $stone-400;
      span {
        padding: 0.5rem;
        border-radius: 3px;
        width: 30px;
        height: 30px;
        text-align: center;
      }

      &:hover {
        span {
          border: 1px solid $stone-400;
        }
      }

      &:nth-of-type(5n) {
        border-right: none;
      }
    }
  }

  &.cart {
    .selector {
      top: -70px;
      left: -115px;

      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 210px;
        transform: translateY(-50%);
        border-width: 10px;
        border-style: solid;
        border-color: transparent transparent transparent $stone-200;
      }
    }
  }
}
</style>
