<script setup>
	import slugify from 'slugify'
	import { useMessage } from '~/store/useMessage'
	import { useStore } from '~/store/useStore'

	useMeta({
		title: 'Product | YRL',
	})
	definePageMeta({
		layout: 'admin',
	})

	const { state, save, fetchSingle, fetchCategories, saveVariants, deleteVariants } = useProduct()

	const route = useRoute()
	const router = useRouter()
	const store = useStore()
	const appMessage = useMessage()
	const product = ref({})
	const variants = ref([])
	const showAttributesSlideout = ref(false)
	const showMediaSelector = ref(false) // media selector toggler
	const galleryIntro = ref(
		'This image gallery contains all images associated with this product including its variants.'
	)
	const slug = route.params.slug === ' ' ? null : route.params.slug

	let response = await fetchSingle(slug)
	if (state.errorMsg) {
		appMessage.errorMsg = state.errorMsg
		store.product = []
	} else {
		store.product = response
		response = await fetchCategories()
		if (state.errorMsg) {
			appMessage.errorMsg = state.errorMsg
			store.categories = []
		} else {
			store.categories = response.docs
		}
	}

	// Set category gallery
	const selectMedia = async (event) => {
		console.log('mediap', event)
		// showMediaSelector.value = false
		for (const prop in event) {
			const index = store.product.gallery.findIndex((el) => el._id === event[prop]._id)
			if (index === -1) {
				store.product.gallery.push(event[prop])
			}
		}
	}

	const saveProduct = async () => {
		store.product.slug = slugify(store.product.name, { lower: true })
		if (!store.product.permalink) store.product.permalink = slugify(store.product.name, { lower: true })
		response = await save(store.product)
		if (state.errorMsg) return (appMessage.errorMsg = state.errorMsg)
		// console.log('S', store.product)
		// console.log('R', response)
		store.product._id = response._id
		await deleteVariants(store.product._id)
		console.log('KKKKKKKXXX')

		if (state.errorMsg) return (appMessage = state.errorMsg)
		if (!store.variants.length) {
			router.push({ name: 'admin-ecommerce-products-slug', params: { slug: store.product.slug } })
			return (appMessage.successMsg = 'product saved succesfully')
		}
		console.log('SV', store.variants)
		await saveVariants(store.variants)
		if (state.errorMsg) return (appMessage = state.errorMsg)
		appMessage.successMsg = 'product and variants saved succesfully'
		router.push({ name: 'admin-ecommerce-products-slug', params: { slug: store.product.slug } })
	}

	const handleNewMediaSelectBtnClicked = () => {
		store.referenceMedia = 'productMedia'
		store.showMediaSelector = true
	}

	watch(
		() => store.selectedMedia,
		(currentVal) => {
			console.log(currentVal)
			if (store.referenceMedia === 'productMedia') selectMedia(currentVal)
			// store.showMediaSelector = false
			// store.selectedMedia = []
		},
		{ deep: true }
	)

	provide('saveProduct', saveProduct)
</script>

<template>
	<div class="product-details">
		<Html>
			<Head><Title>Product</Title></Head>
		</Html>

		<div class="go-back" id="product-go-back">
			<NuxtLink class="link" :to="{ name: 'admin-ecommerce-products' }">
				<IconsArrowWest /><span>Products</span>
			</NuxtLink>
		</div>

		<h3 class="header">Edit Product</h3>
		<!-- <pre style="font-size: 1rem">{{ store.product }}</pre> -->
		<div class="columns">
			<div class="left shadow-md">
				<EcommerceAdminProductLeftSidebar :product="product" />
			</div>

			<div class="center">
				<EcommerceAdminProductDetails :product="product" />
				<EcommerceAdminProductPrice :product="product" />
				<EcommerceAdminImageGallery
					:gallery="store.product.gallery"
					:galleryIntro="galleryIntro"
					galleryType="product"
					@newMediaSelectBtnClicked="handleNewMediaSelectBtnClicked"
				/>
				<section class="attributes" id="attributes" v-if="store.product._id && store.product.type === 'variable'">
					<EcommerceAdminProductAttributesContent />
					<EcommerceAdminProductAttributesSlideout
						v-if="store.showAttributesSlideout"
						:productAttributes="product.attributes"
						:productId="product._id"
						:showAttributesSlideout="showAttributesSlideout"
						@slideoutEventEmitted="showAttributesSlideout = $event"
					/>
				</section>
				<section
					class="variants"
					id="variants"
					v-if="store.product._id && store.product.type === 'variable' && store.product.attributes.length"
				>
					<EcommerceAdminProductVariantsContent
						:productVariants="variants"
						@slideoutEventEmitted="store.showVariantsSlideout = $event"
					/>
					<EcommerceAdminProductVariantsSlideout
						v-if="store.showVariantsSlideout"
						@slideoutEventEmitted="store.showVariantsSlideout = $event"
						@saveProduct="saveProduct"
					/>
				</section>
				<EcommerceAdminProductShippingOptions />
				<EcommerceAdminProductDigitalDelivery />
				<EcommerceAdminProductExtraFields />
				<EcommerceAdminProductSeo />
				<EcommerceAdminProductMisc />
			</div>
			<div class="right">
				<EcommerceAdminProductRightSidebar @productStatusUpdated="product.status = $event" @saveProduct="saveProduct" />
			</div>
		</div>
		<!-- <div class="media-selector" v-if="showMediaSelector">
			<LazyMediaUploader
				@mediaSelected="selectMedia"
				@mediaSelectCancel="showMediaSelector = false"
				v-if="showMediaSelector"
			/>
		</div> -->
		<div class="go-to-top">
			<a href="#product-go-back" class="btn">Go To Top</a>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	@import '@/assets/scss/variables';

	.product-details {
		max-width: 1280px;
		min-height: 100vh;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;

		.link {
			display: flex;
			align-items: center;
			gap: 0.3rem;

			svg {
				width: 1.8rem;
				height: 1.8rem;
			}
		}

		.columns {
			display: grid;
			grid-template-columns: 18rem 1fr 25rem;
			gap: 2rem;
			align-items: flex-start;

			.left {
				position: sticky;
				top: 10rem;
				background-color: white;
				border: 1px solid $slate-100;
				border-radius: 3px;
				padding: 2rem 0.5rem;
			}

			.center {
				display: flex;
				flex-direction: column;
				gap: 3rem;
			}

			.right {
				position: sticky;
				top: 10rem;
				display: flex;
				flex-direction: column;
				gap: 2rem;
			}
		}

		.link {
			font-weight: 500;
			color: $slate-400;

			&:hover {
				color: $slate-800;
			}
		}

		.go-to-top {
			text-align: right;
			// border: 1px solid red;
			position: sticky;
			bottom: 5rem;

			a {
				display: inline-block;
			}
		}
	}
</style>
