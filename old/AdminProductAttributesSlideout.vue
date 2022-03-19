<script setup>
	import { useStore } from '~/store/useStore'
	import { useMessage } from '~/store/useMessage'

	defineEmits(['saveVariants', 'slideoutEventEmitted'])

	const { state, fetchAttributes, fetchAttributeTerms } = useProduct()
	const saveProduct = inject('saveProduct')

	const store = useStore()
	const appMessage = useMessage()
	const showAlert = ref(false)
	const showDeleteAllAttributesAlert = ref(false)
	const deletedTerms = ref([])
	const current = ref(null)
	let response = null

	// Fetch all atributes
	response = await fetchAttributes()
	if (state.errorMsg) {
		appMessage.errorMsg = state.errorMsg
		store.attributes = []
	} else {
		store.attributes = response.docs
	}

	// Fetch all attribute terms
	response = await fetchAttributeTerms()
	if (state.errorMsg) {
		appMessage.errorMsg = state.errorMsg
		store.attributeTerms = []
	} else {
		store.attributeTerms = response.docs
	}

	current.value = JSON.stringify(store.product.attributes)

	const removeVariantByTermId = (termId) => {
		let j = 0
		while (j < store.variants.length) {
			const k = store.variants[j].attrTerms.findIndex((t) => t._id == termId)
			const countBefore = store.variants[j].attrTerms.length
			if (k !== -1) store.variants[j].attrTerms.splice(k, 1)
			const countAfter = store.variants[j].attrTerms.length
			if (countBefore != countAfter) store.variants[j].discard = true
			j++
		}
		store.variants = store.variants.filter((el) => !el.discard)
	}

	const insertEmptyAttribute = (attribute, terms, defaultTerm) => {
		if (store.product.attributes.length == store.attributes.length)
			return (appMessage.errorMsg = 'You have used all available attributes')
		store.product.attributes.push({
			attribute,
			terms,
			defaultTerm,
			enabled: true,
			variation: true,
		})
	}

	const addAllAttributes = () => {
		console.log(store.attributes)
		console.log(store.attributeTerms)
		for (const prop in store.attributes) {
			console.log(console.log(store.attributeTerms.filter((t) => t.parent._id == store.attributes[prop]._id)))
			const attribute = store.attributes[prop]
			const terms = store.attributeTerms.filter((t) => t.parent._id == store.attributes[prop]._id)
			insertEmptyAttribute(attribute, terms, terms[0])
		}
	}

	const closeSlideout = () => {
		if (current.value !== JSON.stringify(store.product.attributes)) {
			appMessage.alertHeading = 'You have unsaved changes'
			appMessage.alertParagraph =
				'Please save your changes before closing this window or click cancel to exit without saving'
			appMessage.showAlertCancelBtn = false

			// appMessage.alertAction = 'closeAlert'
			return (appMessage.showAlert = true)
		}
		store.showAttributesSlideout = false
	}

	const handleShowDeleteAttributesAlert = () => {
		appMessage.alertHeading = 'Are you sure you want to delete all attributes'
		appMessage.alertParagraph = 'All variants accociated with this product will aso be deleted'
		appMessage.alertAction = 'deleteAllAttributes'
		return (appMessage.showAlert = true)
	}

	const updateAttributes = async () => {
		if (current.value == JSON.stringify(store.product.attributes)) return (store.showAttributesSlideout = false)
		const newAttributes = []
		let errorMsg = ''
		for (const prop in store.product.attributes) {
			if (Object.values(store.product.attributes[prop].attribute).length) {
				newAttributes.push(store.product.attributes[prop])
			} else {
				errorMsg = `You must select attribute terms.  Please select a value for attribute ${prop * 1 + 1} `
				break
			}
		}
		if (errorMsg) return (appMessage.errorMsg = errorMsg)
		store.product.attributes = newAttributes
		for (const prop in deletedTerms.value) {
			removeVariantByTermId(deletedTerms.value[prop])
		}
		saveProduct(store.product)
		current.value = JSON.stringify(store.product.attributes)
		store.showAttributesSlideout = false
	}

	const cancelAttributesUpdate = () => {
		store.product.attributes = JSON.parse(current.value)
		store.showAttributesSlideout = false
	}

	const deleteAllAttributes = () => {
		store.product.attributes = []
		showDeleteAllAttributesAlert.value = false
	}

	watch(
		() => appMessage.showAlert,
		(currentVal) => {
			if (currentVal !== 'ok') return
			appMessage.alertHeading = ''
			appMessage.alertParagraph = ''
			if (appMessage.alertAction === 'deleteAllAttributes') deleteAllAttributes()
			appMessage.showAlert = false
		},
		{ deep: true }
	)
</script>

<template>
	<Slideout @closeSlideout="closeSlideout" class="attributes">
		<template v-slot:header>
			<h3 class="title">Edit Attributes</h3>
		</template>
		<template v-slot:default>
			<div class="attributes-details">
				<!-- <pre style="font-size: 1rem">{{ deletedTerms }}</pre> -->
				<header>
					<h2>Attributes</h2>
					{{ appMessage.showAlert }}
					<div class="actions">
						<button class="btn btn-primary" @click="insertEmptyAttribute({}, [], {})">Add Attribute</button>
						<button class="btn btn-primary" @click="addAllAttributes">Add All Attributes</button>
						<button class="btn btn-secondary delete-all-attributes" @click="handleShowDeleteAttributesAlert">
							Delete All Attributes
						</button>
					</div>
				</header>
				<main>
					<div v-if="!store.product.attributes.length">
						<EcommerceAdminProductEmptyAttributesMsg @slideoutEventEmitted="$emit('slideoutEventEmitted', $event)" />
					</div>
					<div v-else class="table admin-product-attributes">
						<div class="table__header">
							<div class="row">
								<div class="th">ID</div>
								<div class="th">Attribute</div>
								<div class="th">Enable</div>
								<div class="th">Variation</div>
								<div class="th">Default Term</div>
								<div class="th">Terms</div>
								<div class="th">Actions</div>
							</div>
						</div>
						<div class="table__body">
							<EcommerceAdminProductAttributeCard
								v-for="(attribute, index) in store.product.attributes"
								:index="index"
								@termToDeleteUpdated="deletedTerms.push($event)"
							/>
						</div>
					</div>
				</main>
			</div>
		</template>
		<template v-slot:footer>
			<div class="actions">
				<button class="btn btn-secondary" @click.prevent="cancelAttributesUpdate">Cancel</button>
				<button
					class="btn btn-primary"
					@click.prevent="updateAttributes"
					:disabled="current == JSON.stringify(store.product.attributes)"
				>
					Save Changes
				</button>
			</div>
		</template>
	</Slideout>
</template>

<style lang="scss" scoped>
	@import '@/assets/scss/variables';

	.attributes {
		.attributes-details {
			display: flex;
			flex-direction: column;
			gap: 2rem;
			overflow: auto;
			padding: 2rem;

			header {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 2rem;
				background-color: $slate-300;
			}

			.delete-all-attributes {
				align-self: flex-end;
			}
		}

		.actions {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			gap: 2rem;

			.btn {
				&:disabled {
					background-color: $slate-400;
					cursor: not-allowed;
				}
			}
		}
	}
</style>
