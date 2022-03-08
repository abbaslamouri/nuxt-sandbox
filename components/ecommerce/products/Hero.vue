<script setup>
const route = useRoute()

console.log(route.name)

const heroBgImage = computed(() =>
  route.name === 'original-coffee-pods' ? 'assets/hero-original.webp' : 'assets/hero-virtuo.webp'
)
</script>

<template>
  <section
    class="hero wfull flex-col justify-center gap3 px3 text-slate-50 bg-norepeat bg-cover minh-40 uppercase"
    :style="{ backgroundImage: `url(${heroBgImage})` }"
  >
    <div class="links flex-row">
      <NuxtLink class="link" :to="{ name: 'original-coffee-pods', params: { slug: ' ' } }">
        <button class="btn btn__hero">
          <IconsOriginalActive />
          <span :class="{ active: route.name === 'original-coffee-pods' }">Original</span>
        </button>
      </NuxtLink>
      <NuxtLink class="link" :to="{ name: 'virtuo-coffee-pods', params: { slug: ' ' } }">
        <button class="btn btn__hero">
          <IconsVirtuoActive />
          <span :class="{ active: route.name === 'vertuo-coffee-pods' }">Virtuo</span>
        </button>
      </NuxtLink>
    </div>
    <div class="content flex-col items-center justify-center gap2">
      <div class="tracking-wider">Original</div>
      <h1 class="text-5xl text-center tracking-widest">The Classic Espresso Experience</h1>
      <NuxtLink class="flex-row items-center gap1" :to="{ name: 'original-coffee-pods', params: { slug: ' ' } }">
        <span class="tracking-wider">Learn more about the original system</span>
        <IconsChevronRight class="fill-slate-50" />
      </NuxtLink>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
