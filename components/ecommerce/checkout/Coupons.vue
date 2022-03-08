<script setup>
const promoCode = ref(null)
</script>

<template>
  <div class="promo-code">
    <div class="header">Promo Code</div>
    <div class="main">
      <div class="title">Enter promo code</div>
      <form>
        <div class="input">
          <FormsBaseInput
            label="Promo Code"
            placeholder="Promo Code"
            v-model="promoCode"
            hint="Please enter a valid coupon code"
          />
        </div>
        <button class="btn bttn-secondary">Apply Coupon</button>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.promo-code {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem 0;
  font-size: 1.4rem;
  border-bottom: 1px solid $stone-300;

  .header {
    background-color: $stone-300;
    padding: 2rem;
  }

  .main {
    display: flex;
    align-items: center;
    gap: 2rem;
    padding: 2rem;

    form {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 3rem;

      .input {
        width: 100%;
      }

      .btn {
        min-width: 15rem;
        width: 15rem;
        align-self: center;
        border-radius: 3px;
        padding: 1rem 3rem;
      }
    }
  }
}
</style>
