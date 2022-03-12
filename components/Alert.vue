<script setup>
defineProps({
  outerBoxWidth: {
    type: Number,
    default: 50,
  },
  outerBoxHeight: {
    type: Number,
    default: 40,
  },
  showOkBtn: {
    type:Boolean,
    default: true
  },
  showCancelBtn: {
    type:Boolean,
    default: true
  }
  
})

defineEmits(['cancel', 'ok'])
</script>

<template>
  <div class="alert text-sm">
    <div class="overlay"></div>
    <div class="wrapper" @click.self="$emit('cancel')">
      <div class="content" :style="{ width: `${outerBoxWidth}%`, 'min-height': `${outerBoxHeight}%` }">
        <header><IconsError /></header>
        <main>
          <slot></slot>
        </main>
        <footer>
          <button class="btn btn-secondary" @click.prevent="$emit('cancel')" v-if="showCancelBtn">Cancel</button>
          <button class="btn btn-primary" @click.prevent="$emit('ok')" v-if="showOkBtn">OK</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.alert {
  .wrapper {
    position: fixed;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    z-index: 999999;

    .content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2rem;
      padding: 4rem;
      background-color: white;
      border-radius: 5px;
      overflow: auto;
      text-align: center;
      line-height: 2.5rem;
      letter-spacing: 0.1rem;
      // font-size: 1.5rem;

      footer {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .btn {
        padding: 1rem 3rem;
        border-radius: 5px;
        border: 1px solid $slate-300;
        font-size: 1.3rem;
        letter-spacing: 0.15rem;
      }

      svg {
        width: 10rem;
        height: 10rem;
        fill: $yellow-400;
      }
    }
  }
}
</style>
