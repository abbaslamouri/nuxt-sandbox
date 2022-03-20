<script setup>
import { useCart } from '~/store/useCart'
import { useMessage } from '~/store/useMessage'

const { state, fetchAll } = useProduct()
const cart = useCart()
const appMessage = useMessage()
const freeSamples = ref([])

onMounted(async () => {
  const response = await fetchAll()
  if (state.errorMsg) {
    appMessage.errorMsg = state.errorMsg
  } else {
    for (const prop in response.docs) {
      if (response.docs[prop].categories.map((g) => g.slug).includes('free-samples'))
        freeSamples.value.push(response.docs[prop])
    }
  }
})
</script>
<template>
  <div class="w32 bg-slate-50 flex-col gap2 p2">
    <div class="text-center font-bold tracking-wide">Add Free Sample Pack and Recycling Bag</div>
    <div class="free-samples">
      <div v-for="freeSample in freeSamples" :key="freeSample._id">
        <div
          class="row py2 px1 border-bottom-stone-300"
          v-if="!cart.items.find((item) => item.product == freeSample._id)"
        >
          <div class="flex-row items-center justify-between">
            <div class="w20 h10">
              <img
                class="w-full hfull contain"
                v-if="freeSample.gallery[1]"
                :src="freeSample.gallery[1].path"
                :alt="`${freeSample.gallery[1].name} Image`"
              />
              <img
                class="w-full hfull contain"
                v-else-if="freeSample.gallery[0]"
                :src="freeSample.gallery[0].path"
                :alt="`${freeSample.gallery[0].name} Image`"
              />
              <img v-else src="placeholder.png" :alt="`Placeholder Image`" />
            </div>
            <div class="font-bold text-sm">
              <p>{{ freeSample.name }}</p>
            </div>
          </div>
          <div class="flex-row items-center justify-between">
            <div class="price">$0.00</div>
            <button class="btn btn__quantity-selector px1" @click="cart.addItem(freeSample, 1)"><IconsPlus /></button>
          </div>
        </div>
      </div>
    </div>
    <div class="text-center">
      <h3 class="my1">NYC: No Bag Needed</h3>
      <p>Just place used capsules in your blue recycling bin</p>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
