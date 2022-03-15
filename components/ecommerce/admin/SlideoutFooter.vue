<script setup>
defineProps({
  disableSaveBtn: {
    type: Boolean,
    default: true,
  },
  cancelBtnText: {
    type: String,
    default: 'Cancel',
  },
  SaveBtnText: {
    type: String,
    default: 'Save Changes',
  },
})

defineEmits(['cancel', 'ok'])
</script>

<template>
  <div class="flex-row justify-end gap2">
    <button class="btn btn__secondary px2 py05" @click.prevent="$emit('cancel')">{{ cancelBtnText }}</button>
    <button class="btn btn__primary px2 py05" @click.prevent="$emit('ok')" :disabled="disableSaveBtn">{{ SaveBtnText }}</button>
  </div>
</template>

<style lang="scss" scoped></style>
