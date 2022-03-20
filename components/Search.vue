<script setup>
const emit = defineEmits(['searchKeywordSelected', 'clearSearch'])

const keyword = ref(null)

const emitSearchField = () => {
  emit('searchKeywordSelected', keyword.value)
}

const resetItems = () => {
  if (!keyword.value) emitSearchField()
}

const clearSearchField = () => {
  keyword.value = null
  emitSearchField()
}
</script>

<template>
  <div>
    <form class="relative br-3 test-sm bg-white" @keydown.enter.prevent="emitSearchField">
      <IconsSearch class="icon left-1 absolute fill-slate-400 top-50-per translate-y--50per" />
      <input
        class="w-full h-full px-3 py-1"
        type="text"
        placeholder="Search"
        aria-label="Search"
        v-model="keyword"
        @input="resetItems"
      />
      <button
        class="bt bt__close bg-white border absolute right-1 top-50-per translate-y--50per"
        @click.prevent="clearSearchField"
      >
        <IconsClose class="w-2 h-2" />
      </button>
    </form>
    <div class="text-xs p-1 flex-row gap-1 items-center" v-if="keyword">
      <div class="uppercase text-slate-400 font-bold">Filters</div>
      <div class="bg-slate-50 p-05 br-3 bg-white shadow-md flex-row items-center gap-1">
        Text Search: {{ keyword
        }}<IconsClose
          class="w-12p h-12p bg-slate-600 fill-slate-50 br-50per cursor-pointer"
          @click="clearSearchField"
        />
      </div>
      <button class="btn btn__primary py-02 px-1 text-xs cursor-pointer" @click="clearSearchField">Clear</button>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
