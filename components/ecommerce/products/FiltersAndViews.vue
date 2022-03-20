<script setup>
const listType = ref('tile')
</script>

<template>
  <section class="flex-row items-center justify-between w996 p2">
    <div class="flex-row items-center gap3 px3 py1 border"><span>Filter</span> <IconsFilter /></div>
    <div class="flex-col items-center gap1">
      <span>View</span>
      <div class="icons flex-row gap1">
        <IconsListTiled
          @click="listType = 'tile'"
          class="icon fill-slate-400 cursor-pointer"
          :class="{ selected: listType === 'tile' }"
        />
        <IconsListBulleted
          @click="listType = 'list'"
          class="icon fill-slate-400 cursor-pointer"
          :class="{ selected: listType === 'list' }"
        />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.icon {
  &.selected {
    fill: $slate-800;
  }
}
</style>
