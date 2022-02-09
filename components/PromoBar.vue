<script setup>
const showModal = ref(false)
</script>

<script>
export default {}
</script>

<template>
  <section class="promo-bar">
    <div class="wrapper">
      <div class="promo">
        <div class="content">
          <h3>FREE BARISTA TRAY & CHOCOLATES</h3>
          <h4>WITH COFFEE PURCHASE</h4>
          <p>VERTUO: <span class="emphasis">BARISTA2022</span> | ORIGINAL: <span class="emphasis">BARISTA22</span></p>
          <button class="btn" @click="showModal = true">Lear More</button>
        </div>
      </div>
      <div class="promo">
        <div class="content">
          <h3>SAVE $22 <span>WITH CARAFE STARTER PACK</span></h3>
          <p>ncludes 2 free coffee sleeves. Exclusively for Vertuo Next machines.</p>
          <p>VERTUO: <span class="emphasis">BARISTA2022</span> | ORIGINAL: <span class="emphasis">BARISTA22</span></p>
          <button class="btn">Lear More</button>
        </div>
      </div>
    </div>
    <div class="details" v-show="showModal">
      <Modal @closeModal="showModal = false">
        <template #header>
          <h3 class="modal-header">COFFEE OFFER ONLY AVAILABLE AT NESPRESSO</h3>
        </template>
        <template #default>
          <div class="modal-content">
            <p>
              Purchase 20 or more <span class="emphasis">Vertuo</span> sleeves to receive one (1) barista tray and two
              (2) boxes of chocolates. Code: <span class="emphasis">BARISTA2022</span> Until 3/7.
            </p>
            <p>
              Purchase 25 or more Original sleeves to receive one (1) barista towel and two (2) boxes of chocolates.
              Code: <span class="emphasis">BARISTA2022</span>Until 3/7.
            </p>
            <div class="terms-conditions">
              <h4>TERMS & CONDITIONS</h4>
              <p>
                Offer associated with promo code can be redeemed only one time per customer during the promotion period.
                Offers cannot be combined with any other offers. Offers valid for purchases made until dates indicated
                or while supplies last in the U.S. only, exclusively at Nespresso.com. Taxes may apply. Promo codes
                apply to coffee offers. Offer not transferable and not valid on purchases made Nespresso
                BusinessSolutions accounts or at Nespresso retail locations.
              </p>
            </div>

            <!-- <div class="image">
              <img src="assets/N-Welcome-Kit-ICE-VL-200x167-AW.webp" alt="Nespree0 Welcome Offer" />
            </div> -->
          </div>
        </template>

        <template #footer>
          <div class="modal-footer"></div>
        </template>
      </Modal>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.promo-bar {
  background-color: #d28f75;
  display: flex;
  align-items: center;
  justify-content: center;

  .wrapper {
    // border: 1px solid red;
    width: 996px;
    display: flex;
    // align-items: center;
    // justify-content: center;
    color: white;

    .promo {
      flex: 1;

      &:first-child {
        border-right: 1px solid $slate-200;
      }

      .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        padding: 4rem;
        font-size: 1.4rem;
        letter-spacing: 0.15rem;

        h3 {
          font-weight: 600;

          span {
            font-weight: 300;
          }
        }

        h4 {
          font-weight: 300;
        }

        p {
          font-weight: 300;
          margin-top: 1rem;
          text-align: center;

          .emphasis {
            font-weight: 600;
          }
        }

        .btn {
          color: white;
          font-size: 1.5rem;
          text-transform: none;
          letter-spacing: 0.2rem;
          margin-top: 1rem;
          border: none;
          text-decoration: underline;
        }
      }
    }
  }

  .details {
    font-size: 1.2rem;

    .modal-header {
      text-transform: uppercase;
    }

    .modal-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2rem;

      p {
        text-align: center;
        line-height: 1.6rem;
      }

      .emphasis {
        text-transform: uppercase;
        font-weight: 700;
        font-size: 1.4rem;
      }

      .image {
        width: 20rem;
        height: 20rem;
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }

      .terms-conditions {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        justify-content: flex-start;

        p {
          text-align: left;
        }
        // align-items: flex-start;
      }
    }
    .modal-footer {
      text-align: center;
      line-height: 1.6rem;
    }
  }
}
</style>
