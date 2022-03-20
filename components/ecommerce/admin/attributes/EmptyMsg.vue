<script setup>
// defineProps({
//   allAttributes: {
//     type: Array,
//   },
// })
// const { product } = useStore()

// defineEmits(['slideoutEventEmitted'])
</script>

<template>
  <div class="flex-row items-center justify-center mt-10 text-sm">
    <div class="bg-slate-200 max-w-60 p-4 flex-col gap2 br-5">
      <h3>Create Attributes</h3>
      <div class="message">
        create attributes and attribute terms for your products. Attributes define the type of variant (e.g. color).
        Terms are a choice your customer can make within that group (e.g. blue).
      </div>
      <!-- <div class="flex-row items-center gap2 bg-slate-50 p2 br3" v-if="!product._id">
        <IconsInfo />Using this feature requires you to save the product first.
      </div> -->
      <!-- <div v-if="!allAttributes" class="flex-col gap1">
        <p>You have not created any attributes yet. Click the link below to creaate new attributes for your peoducts</p>
        <NuxtLink class="link items-self-end" :to="{ name: 'admin-ecommerce-attributes' }">
          <span>Go to Attributes</span>
        </NuxtLink>
      </div> -->
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
