<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  message: {
    type: String,
    default: '',
  },
  show: {
    type: Boolean,
    default: false,
  },
  duration: {
    type: [String, Number],
    default: 30,
  },
  snackbarType: {
    type: String,
    default: 'Error',
    validator: (value) => {
      return !value || ['Success', 'Warning', 'Error', 'Info'].includes(value)
    },
  },
  position: {
    type: String,
    default: 'top-right',
  },
})

const emit = defineEmits(['hideSnackbar'])

let timeout = ref(null)
const getType = () =>
  ['Success', 'Warning', 'Error', 'Info'].includes(props.snackbarType) ? props.snackbarType : 'Success'
const getPosition = () => (['top-right', 'top-left'].includes(props.position) ? props.position : 'top-left')

watchEffect(() => {
  clearTimeout(timeout.value)
  if (props.duration != 0) {
    if (props.show) {
      timeout.value = setTimeout(() => {
        emit('hideSnackbar')
      }, props.duration * 1000)
    }
  }
})

const title = computed(() =>
  props.title ? props.title : props.snackbarType.charAt(0).toUpperCase() + props.snackbarType.slice(1)
)
const transitionName = computed(() => (getPosition().includes('right') ? 'rtl' : 'ltr'))
</script>

<template>
  <transition :name="transitionName">
    <div
      class="snackbar"
      :class="{
        error: snackbarType === 'Error',
        success: snackbarType === 'Success',
        'top-right': position === 'top-right',
        'top-left': position === 'top-left',
      }"
      v-show="show"
    >
      <div class="icon">
        <component :is="`Icons${getType()}`" />
      </div>
      <div class="content">
        <h3 class="title">{{ title }}</h3>
        <div class="message" v-html="message"></div>
      </div>
      <button class="btn" @click="$emit('hideSnackbar')"><IconsClose /></button>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.snackbar {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
  position: fixed;
  z-index: 99;
  top: 7rem;
  font-size: 1.4rem;
  z-index: 999999;
  color: $slate-50;
  letter-spacing: 0.1rem;
  max-width: 60%;

  &.top-left {
    left: 5rem;
  }

  &.top-right {
    right: 5rem;
  }

  .icon {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    padding: 0.4rem;
    svg {
      width: 2rem;
      height: 2rem;
    }
  }

  .content {
    line-height: 2.5rem;
  }

  .btn {
    border: none;

    svg {
      width: 2rem;
      height: 2rem;
    }
  }

  &.error {
    background: $red-700;
    border-left: 1rem solid $red-400;

    .icon {
      background: $red-400;

      svg {
        fill: $red-50;
        width: 2rem;
        height: 2rem;
      }
    }
  }

  &.success {
    background: $green-700;
    border-left: 1rem solid $green-400;

    .icon {
      background: $green-400;

      svg {
        fill: $green-50;
        width: 2rem;
        height: 2rem;
      }
    }
  }
}
</style>
