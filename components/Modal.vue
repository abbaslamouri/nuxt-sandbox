<script setup>
defineProps({
  outerBoxWidth: {
    type: Number,
    default: 50,
  },
  outerBoxHeight: {
    type: Number,
    default: 10,
  },
})
defineEmits(['closeModal'])
</script>

<template>
  <div class="modal">
    <div class="overlay"></div>
    <div class="wrapper" @click.self="$emit('closeModal')">
      <div class="content" :style="{ width: `${outerBoxWidth}%`, 'min-height': `${outerBoxHeight}%` }">
        <header>
          <slot name="header"></slot>
          <button class="btn btn-secondary" @click="$emit('closeModal')">
            <IconsClose />
          </button>
        </header>
        <main><slot></slot></main>
        <footer><slot name="footer"></slot></footer>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';
.modal {
  .wrapper {
    position: fixed;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    z-index: 9;

    .content {
      display: flex;
      flex-direction: column;
      // align-items: center;
      padding: 2rem;
      background-color: white;
      border-radius: 5px;
      // overflow: scroll;
      height: 100%;

      header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px #ccc solid;
        width: 100%;
        padding: 0 0 1rem 0;
        .btn {
          border: none;
          svg {
            background-color: transparent;
            width: 2rem;
            height: 2rem;
          }
        }
      }
      main {
        flex: 1;
        padding: 2rem;
        margin-top: 1rem;
        border-radius: 5px;
        overflow-y: scroll;
      }
      footer {
        width: 100%;
        padding: 1rem;
      }
    }
  }
}
</style>
