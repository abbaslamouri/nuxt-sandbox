<script setup>
const props = defineProps({
  doc: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  showActionsKeys: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['actionBtnClicked', 'deleteDocEmitted'])

const showAlert = ref(false)

const proceed = () => {
  showAlert.value = false
  emit('deleteDocEmitted', props.doc)
}
</script>

<template>
  <div class="row border-b-slate-200 p1">
    <div class="td">
      <div class="w5 h5">
        <img
          class="w-full hfull contain"
          v-if="doc.gallery.length && doc.gallery[0] && doc.gallery[0].mimetype.includes('image')"
          :src="`${doc.gallery[0].path}`"
        />
        <img v-else class="w-full hfull contain" :src="`/placeholder.png`" />
      </div>
      <h3 class="title">{{ doc.name }}</h3>
    </div>
    <div class="td">{{ doc.slug }}</div>
    <div class="td" v-if="doc.parent">{{ doc.parent.name }}</div>
    <div class="td" v-else>-</div>
    <div class="td flex-row justify-end gap1 minw12">
      <div class="menu shadow-md p1 border border-stone-300 font-bold" v-if="showActionsKeys">
        <NuxtLink class="link" :to="{ name: 'admin-ecommerce-categories-slug', params: { slug: doc.slug } }">
          Edit
        </NuxtLink>
        <a href="#" class="text-red-700" @click.prevent="showAlert = true">Delete</a>
      </div>
      <button class="btn btn__close p1" @click.prevent="$emit('actionBtnClicked', index)"><IconsMoreHoriz /></button>
    </div>
    <Alert v-if="showAlert" @ok="proceed" @cancel="showAlert = false">
      <h3>Are you sure you want to delete category {{ doc.name }}?</h3>
      <p>You will not be able to recover this doc.</p>
    </Alert>
  </div>
</template>

<style lang="scss" scoped></style>
