<script setup>
defineProps({
  showAction: {
    type: Boolean,
  },
  showEdit: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['moreHoriz', 'editAction', 'deleteAction'])
</script>

<template>
  <div class="flex-row border-red">
    <div class="shadow-md p1 border border-slate-300 flex-col gap05" v-show="showAction">
      <a href="#" class="text-slate-800 font-bold" @click.prevent="$emit('editAction')" v-if="showEdit">
        <div class="">Edit</div>
      </a>
      <a href="#" class="text-red-700 font-bold" @click.prevent="$emit('deleteAction')">
        <div>Delete</div>
      </a>
    </div>
    <button class="btn btn__close p05" @click.prevent="$emit('moreHoriz')">
      <IconsMoreHoriz />
    </button>
  </div>
</template>

<style lang="scss" scoped></style>
