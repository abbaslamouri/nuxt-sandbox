<script setup>
import { useCart } from '~/store/useCart'
import { useMessage } from '~/store/useMessage'

const { state, fetchAll } = useProduct()
const cart = useCart()
const appMessage = useMessage()
const products = ref([])
const route = useRoute()
const listType = ref('tile')
const showSelectQtys = ref([])
const slides = ref(['assets/vday-d-3.webp', 'assets/dott-baristatray-choco.webp'])
const heroBgImage = computed(() =>
  route.name === 'original-coffee-pods' ? 'assets/hero-original.webp' : 'assets/hero-virtuo.webp'
)

const response = await fetchAll()
if (state.errorMsg) {
  appMessage.errorMsg = state.errorMsg
  products.value = []
} else {
  for (const prop in response.docs) {
    // console.log(response.docs[prop].categories.map((g) => g.slug).includes('free-samples'))
    if (!response.docs[prop].categories.map((g) => g.slug).includes('free-samples'))
      products.value.push(response.docs[prop])
  }
  // products.value = response.docs
  for (const prop in products.value) {
    showSelectQtys.value[prop] = false
  }
}
// console.log(products.value)

// const pages = computed(() =>
// 	state.totalItemCount % perPage.value
// 		? parseInt(state.totalItemCount / perPage.value) + 1
// 		: parseInt(state.totalItemCount / perPage.value)
// )
// state.query.fields = 'name,slug,price'
// state.query.page = 1
// state.query.limit = perPage.value
// state.query.populate = 'featuredImage categories'
// state.sort.field = 'createdAt'
// state.sort.order = '-'
// state.query.sort = `${state.sort.order}${state.sort.field}`
// await Promise.all([actions.fetchAll(), actions.fetchCount()])
const setPage = async (currentPage) => {
  // console.log(currentPage)
  // state.query.page = currentPage
  // await actions.fetchAll()
}
const handleSearch = async () => {
  // await actions.fetchAll()
}
// watch(
//   () => selectedCategories.value,
//   async (newVal) => {
//     if (newVal) {
//       console.log(newVal)
//       filters.categories = selectedCategories.value
//     } else {
//       delete filters.categories
//     }
//   }
// )
// watch(
//   () => price,
//   async (newVal) => {
//     filters['price[gte]'] = newVal.min || '0'
//     filters['price[lte]'] = newVal.max || '0'
//   },
//   { deep: true }
// )
// watch(
//   () => filters,
//   async (newVal) => {
//     if (timer.value) {
//       clearTimeout(timer.value)
//     }
//     timer.value = setTimeout(async () => {
//       await Promise.all([await actions.fetchAll(filters), await actions.fetchCount(filters)])
//     }, 500)
//   },
//   { deep: true }
// )

// provide('products', products.value)
const addToCart = (quantity) => {
  if (!quantity) {
    appMessage.errorMsg = 'Please select quantity'
  } else {
    emit('selectQuantityBtnClicked', !props.showSelectQty)
    cart.addItem(props.product, quantity)
  }
}

const handleItemQuantitySelected = (event, i) => {
  // console.log(event.quantity, i)
  for (const prop in showSelectQtys.value) {
    showSelectQtys.value[prop] = false
  }
  showSelectQtys.value[i] = event.status
  cart.addItem(products.value[i], event.quantity)
}

const closeAllSelectQuantity = () => {
  for (const prop in showSelectQtys.value) {
    showSelectQtys.value[prop] = false
  }
}
</script>

<template>
  <div class="oroginal-coffee-pods">
    <!-- {{ cart.cart }} -->

    <section class="offers-carousel">
      <Carousel :slides="slides" indicators controls interval="5" height="10" />
    </section>
    <section class="hero" :style="{ backgroundImage: `url(${heroBgImage})` }">
      <div class="links">
        <NuxtLink class="link" :to="{ name: 'original-coffee-pods', params: { slug: ' ' } }">
          <button class="btn">
            <IconsOriginalActive />
            <span>Original</span>
          </button>
        </NuxtLink>
        <NuxtLink class="link" :to="{ name: 'virtuo-coffee-pods', params: { slug: ' ' } }">
          <button class="btn">
            <IconsVirtuoActive />
            <span>Virtuo</span>
          </button>
        </NuxtLink>
      </div>
      <div class="content">
        <div>Original</div>
        <h1>The Classic Espresso Experience</h1>
        <NuxtLink class="link" :to="{ name: 'original-coffee-pods', params: { slug: ' ' } }">
          <button class="btn btn-primary">
            <span>Learn more about the original system</span>
          </button>
        </NuxtLink>
      </div>
    </section>
    <section class="filters-views">
      <div class="filter"><span>Filter</span> <IconsFilter /></div>
      <div class="view">
        <span>View</span>
        <div class="icons">
          <IconsListTiled @click="listType = 'tile'" :class="{ selected: listType === 'tile' }" />
          <IconsListBulleted @click="listType = 'list'" :class="{ selected: listType === 'list' }" />
        </div>
      </div>
    </section>
    <div v-if="products.length" class="products">
      <div class="header" :style="{ backgroundImage: `url('assets/barista-creations-coffee-capsules-desktop2.webp')` }">
        <h3 class="title">ISPIRAZIONE ITALIANA</h3>
        <h4 class="sub-title">
          Unique flavors inspired by Italian roasting traditions passed down through generations
        </h4>
        <NuxtLink class="link" :to="{ name: 'original-coffee-pods', params: { slug: ' ' } }">
          <button class="btn btn-primary">
            <span>Discover the range</span>
            <IconsChevronRight />
          </button>
        </NuxtLink>
      </div>
      <div class="main">
        <!-- <Search v-model="state.query.keyword" @handleSubmit="handleSearch" /> -->
        <EcommerceProductCard
          v-for="(product, i) in products"
          :key="product._id"
          :product="product"
          :listType="listType"
          @itemQuantitySelected="handleItemQuantitySelected($event, i)"
          :showSelectQty="showSelectQtys[i]"
        />
        <!-- <Pagination :page="page" :pages="pages" @pageSet="setPage" v-if="pages > 1" /> -->
      </div>
    </div>
    <div v-else class="no-products shadow-md">
      <div class="inner">
        <h3 class="">Add your first physical or digital product</h3>
        <div class="">Add your roduct and variants. Products must have at least a name and a price</div>
        <NuxtLink class="link" :to="{ name: 'original-coffee-pods', params: { slug: ' ' } }">
          <button class="btn btn-primary">
            <IconsPlus />
            <span>Add</span>
          </button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';
.oroginal-coffee-pods {
  min-height: 100%;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .offers-carousel {
    width: 996px;
    background-color: white;
  }

  .hero {
    position: relative;
    width: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    height: auto;
    min-height: 40rem;
    text-transform: uppercase;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 2rem 3rem;
    padding: 0 3rem;
    color: $slate-50;
    .links {
      display: flex;
      align-items: center;
      .btn {
        background-color: $slate-50;
        color: $slate-800;
        border-radius: 5px;
        padding: 1rem 2rem;
        font-size: 1.2rem;
        letter-spacing: 0.2rem;
        svg {
          // width: 4rem;
          // height: 4rem;
        }
        span {
          opacity: 0.5;
        }
      }
    }
    .content {
      align-self: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 2rem;
      letter-spacing: 0.25rem;
      text-align: center;
      h1 {
        font-size: 5rem;
        letter-spacing: 1rem;
        max-width: 996px;
      }
      .link {
        .btn {
          background-color: transparent;
          border: none;
          font-size: 1.4rem;
          letter-spacing: 0.25rem;
          &:hover {
            color: $slate-300;
          }
        }
      }
    }
    // background-image: url('assets/');
  }

  .filters-views {
    border: 1px solid teal;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2rem;
    width: 100%;
    max-width: 996px;

    .filter {
      display: flex;
      align-items: center;
      gap: 3rem;
      color: $slate-600;
      border: 1px solid $slate-400;
      padding: 1rem 3rem;
    }

    .view {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      align-items: center;

      .icons {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;

        svg {
          width: 3rem;
          height: 3rem;
          fill: $slate-400;

          &.selected {
            fill: $slate-800;
          }
        }
      }
    }
  }

  .products {
    width: 100%;
    // border: 1px solid red;
    width: 100%;
    max-width: 996px;

    .header {
      background-repeat: no-repeat;
      background-size: cover;
      color: $slate-50;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      align-items: center;
      h3 {
        // font-weight: 400;
        font-size: 2rem;
        letter-spacing: 0.5rem;
      }
      h4 {
        font-weight: 400;
        letter-spacing: 0.1rem;
      }

      .btn {
        display: flex;
        gap: 1rem;
        background-color: transparent;
        border: none;

        svg {
          border: 1px solid $slate-50;
          border-radius: 50%;
        }
      }
    }

    .main {
      display: flex;
      // justify-content: space-evenly;
      flex-wrap: wrap;
      // border: 1px solid green;
    }
  }
  .no-products {
    height: 92vh;
    display: flex;
    justify-content: center;
    align-items: center;
    .inner {
      gap: 1rem;
      border: 1px solid $slate-200;
      display: flex;
      flex-direction: column;
      gap: 2rem;
      transform: translateY(-50%);
      background-color: White;
      padding: 4rem;
      border-radius: 5px;
      .link {
        align-self: flex-end;
      }
      // justify-content: center;
      // align-items: center;
      // absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border rounded flex flex-col gap-1 items-start w-84 p-4 space-y-2
    }
  }
  .btn {
    svg {
      fill: $slate-50;
      width: 1.8rem;
      height: 1.8rem;
    }
  }
}
// h-full relative py-6 px-4
</style>
