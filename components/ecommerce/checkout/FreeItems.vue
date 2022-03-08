<script setup>
import { useCart } from '~/store/useCart'
import { useAuth } from '~/store/useAuth'
import { useMessage } from '~/store/useMessage'

useMeta({
  title: 'Checkout | YRL',
})
definePageMeta({
  layout: 'checkout',
})

const { state, fetchAll } = useProduct()
const router = useRouter()
const cart = useCart()
const auth = useAuth()
const appMessage = useMessage()
// const showSelectQtys = ref([])
const promoCode = ref(null)
const coupon = ref('')

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
  console.log(freeSamples.value)
})

const handleCheckout = async () => {
  if (auth.authenticated) {
    // console.log(auth.user)
    // cart.updateCustomerInfo(auth.user)
    await cart.saveCart()
    router.push({ name: 'shipping' })
  } else {
    router.push('/secure?redirect=/shipping')
  }
}
</script>

<template>
  <div class="aside bg-slate-50">
    <div class="intro">Add Free Sample Pack and Recycling Bag</div>
    <div class="free-samples">
      <div v-for="freeSample in freeSamples" :key="freeSample._id">
        <div class="row" v-if="!cart.items.find((item) => item.product == freeSample._id)">
          <div class="product">
            <div class="image">
              <img
                v-if="freeSample.gallery[1]"
                :src="freeSample.gallery[1].path"
                :alt="`${freeSample.gallery[1].name} Image`"
              />
              <img
                v-else-if="freeSample.gallery[0]"
                :src="freeSample.gallery[0].path"
                :alt="`${freeSample.gallery[0].name} Image`"
              />
              <img v-else src="placeholder.png" :alt="`Placeholder Image`" />
            </div>
            <div class="title">
              <p>{{ freeSample.name }}</p>
            </div>
          </div>
          <div class="quantity">
            <div class="price">$0.00</div>
            <button class="btn btn-secondary" @click="cart.addItem(freeSample, 1)"><IconsPlus /></button>
          </div>
        </div>
      </div>
    </div>
    <div class="nyc">
      <h3>NYC: No Bag Needed</h3>
      <p>Just place used capsules in your blue recycling bin</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.aside {
  background-color: $slate-50;
  width: 320px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  .intro {
    text-align: center;
    font-weight: 700;
    letter-spacing: 0.15rem;
  }

  .free-samples {
    .row {
      border-bottom: 1px solid $stone-300;

      .product {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .image {
          width: 10rem;
          height: 10rem;

          img {
            max-width: 100%;
            object-fit: contain;
          }
        }

        .title {
          font-size: 1.4rem;
          font-weight: 700;
        }
      }

      .quantity {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 2rem 2rem;

        .btn {
          background-color: $green-700;
          border-radius: 3px;
          padding: 1rem;

          svg {
            fill: $slate-50;
            width: 1.5rem;
            height: 1.5rem;
          }
        }
      }
    }
  }

  .nyc {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    h3 {
      font-size: 2rem;
    }
    p {
      text-align: center;
    }
  }
}
</style>
