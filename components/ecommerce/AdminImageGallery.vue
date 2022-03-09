<script setup>
	import { useStore } from '~/store/useStore'
	import { useMessage } from '~/store/useMessage'

	const props = defineProps({
		// gallery: {
		// 	type: Array,
		// 	required: true,
		// },
		galleryIntro: {
			type: String,
		},
		galleryType: {
			type: String,
		},
	})

	defineEmits(['mediaSelectorClicked', 'selectFromProductImages', 'newMediaSelectBtnClicked'])

	const state = inject('state')

	const store = useStore()
	const appMessage = useMessage()
	const draggableElements = ref([])
	const pickIndex = ref(null)

	const removeGalleryImage = (index) => {
		props.gallery.splice(index, 1)
	}

	const handleDragstart = (event, index) => {
		pickIndex.value = index
		event.target.closest('.thumb').classList.remove('hovered')
	}

	const handleDragend = (event, index) => {
		for (const prop in draggableElements.value) {
			if (draggableElements.value[prop]) draggableElements.value[prop].closest('.thumb').classList.remove('hovered')
		}
	}

	const handleDragover = (event, index) => {
		event.target.closest('.thumb').classList.add('over')
	}

	const handleDragleave = (event) => {
		event.target.closest('.thumb').classList.remove('over')
	}
	const handleDrop = async (event, index) => {
		const pickedElement = props.gallery[pickIndex.value]
		const droppedElement = props.gallery[index]
		props.gallery[pickIndex.value] = droppedElement
		props.gallery[index] = pickedElement
		event.target.closest('.thumb').classList.remove('over')
	}

	const setFeaturedImage = (event) => {
		console.log(event.target, pickIndex.value)
		// state.selectedItem.featuredImage = props.gallery[pickIndex.value]
	}
</script>

<template>
	<section class="admin-image-gallery shadow-md" id="image-gallery">
		<header class="admin-section-header">Image Gallery</header>
		<div class="content">
			<div class="intro" v-if="galleryIntro">
				<IconsInfo />
				<p>{{ galleryIntro }}</p>
			</div>
			<div class="gallery">
				<div class="thumbs" v-if="state.doc.gallery && state.doc.gallery.length">
					<div
						class="thumb shadow-md relative"
						:class="{ product: galleryType === 'product' || galleryType == 'variant' }"
						v-for="(image, index) in state.doc.gallery"
						:key="image._id"
						@dragover="handleDragover($event, index)"
						@drop="handleDrop($event, index)"
						@dragleave="handleDragleave($event, index)"
						@dragover.prevent
						@mouseenter="$event.target.classList.add('hovered')"
						@mouseleave="$event.target.classList.remove('hovered')"
					>
						<div
							class="thumb__draggable"
							:class="{ first: index == 0 }"
							:ref="(el) => (draggableElements[index] = el)"
							draggable="true"
							@dragstart="handleDragstart($event, index)"
							@dragend="handleDragend($event, index)"
						>
							<img :src="image.path" :alt="`${image.name} Photo`" draggable="false" />
							<span class="thumb__delete" @click.prevent="removeGalleryImage(index)"><IconsDeleteFill /></span>
							<span class="thumb__move"><IconsMove /></span>
						</div>
						<span class="thumb__index">{{ index + 1 }}</span>
						<div class="thumb__tooltip">{{ image.name }}</div>
					</div>
				</div>
			</div>
			<div class="image-select-actions">
				<button class="btn btn-image-select" @click.prevent="$emit('newMediaSelectBtnClicked')">
					<IconsImage />
					<span> Select New Images </span>
				</button>
				<button
					v-if="galleryType === 'variant' && store.product.gallery.length"
					class="btn btn-image-select"
					@click.prevent="$emit('selectFromProductImages')"
				>
					<IconsImage />
					<span> Select From Product Images </span>
				</button>
			</div>

			<p>PNG, JPG, and GIF Accepted</p>
		</div>
	</section>
</template>

<style lang="scss" scoped>
	@import '@/assets/scss/variables';

	.admin-image-gallery {
		background-color: white;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;

		.content {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 2rem;

			.intro {
				display: flex;
				align-items: center;
				gap: 1rem;
				background-color: $sky-100;
				padding: 1rem 2rem;
				border-radius: 5px;
				font-size: 80%;

				svg {
					width: 3rem;
					height: 3rem;
					fill: $sky-600;
				}
			}

			.gallery {
				max-width: 50rem;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				gap: 2rem;

				.thumbs {
					display: grid;
					grid-template-columns: repeat(4, minmax(0, 1fr));
					gap: 1rem;
					padding: 2rem;
					min-height: 20px;
					border: 1px solid $slate-200;
					border-radius: 5px;

					.thumb {
						display: flex;
						justify-content: center;
						align-items: center;
						position: relative;
						border: 1px solid $slate-200;
						padding: 1rem;
						cursor: pointer;
						border-radius: 5px;

						&:first-child {
							grid-column: span 2 / span 2;
							grid-row: span 2 / span 2;
						}

						&.product {
							&:nth-of-type(n) {
								&::after {
									// content: 'Featured';
									position: absolute;
									top: 0rem;
									left: 50%;
									transform: translateX(-50%);
									font-size: 1rem;
									background-color: $slate-700;
									color: $slate-50;
									padding: 0.25rem 1rem;
									border-radius: 3px;
								}
							}
							&:nth-of-type(1) {
								&::after {
									content: 'Featured';
								}
							}

							&:nth-of-type(2) {
								grid-column: span 2 / span 2;
								grid-row: span 2 / span 2;
								&::after {
									content: 'Thumb';
								}
							}
							&:nth-of-type(3) {
								grid-column: span 2 / span 2;
								grid-row: span 2 / span 2;
								&::after {
									content: 'Body';
								}
							}
							&:nth-of-type(4) {
								grid-column: span 2 / span 2;
								grid-row: span 2 / span 2;
								&::after {
									content: 'Attributes';
								}
							}
							&:nth-of-type(5) {
								grid-column: span 2 / span 2;
								grid-row: span 2 / span 2;
								&::after {
									content: 'Recipe';
								}
							}
						}

						img {
							width: 100%;
							height: 100%;
							object-fit: contain;
						}

						&__delete {
							position: absolute;
							top: 1rem;
							right: 1rem;
							opacity: 0;
							visibility: hidden;

							svg {
								fill: $slate-50;
							}
						}

						&__move {
							position: absolute;
							top: 50%;
							left: 50%;
							transform: translate(-50%, -50%);
							opacity: 0;
							visibility: hidden;

							svg {
								fill: $slate-50;
							}
						}

						&__index {
							position: absolute;
							top: 2%;
							left: 2%;
							transform: translate(-50%, -50%);
							background-color: $slate-600;
							width: 1.5rem;
							height: 1.5rem;
							color: $slate-50;
							border-radius: 50%;
							font-size: x-small;
							display: flex;
							justify-content: center;
							align-items: center;
						}

						&__tooltip {
							position: absolute;
							top: -1.5rem;
							left: 50%;
							transform: translate(-50%, -100%);
							background-color: $slate-600;
							display: grid;
							grid-template-columns: minmax(max-content, 40rem);
							color: white;
							padding: 1rem 2rem;
							border-radius: 5px;
							font-weight: 500;
							opacity: 0;
							visibility: hidden;

							&::after {
								content: '';
								position: absolute;
								top: 100%;
								left: 50%;
								margin-left: -5px;
								border-width: 5px;
								border-style: solid;
								border-color: $slate-600 transparent transparent transparent;
							}
						}

						&.hovered {
							background-color: $slate-500;

							img {
								opacity: 0.1;
							}

							.thumb__tooltip,
							.thumb__delete,
							.thumb__move {
								opacity: 1;
								visibility: visible;
							}
						}

						&.over {
							opacity: 0.3;
							border: 2px dashed $slate-600;
						}

						&.featured-image,
						&.body-bg-image,
						&.attributes-image,
						&.recipe-image,
						&.thumb-image {
							// border: 1px solid red;
							min-width: 10rem;
							min-height: 10rem;
						}
					}
				}
			}

			.image-select-actions {
				display: flex;
				gap: 3rem;
			}
		}

		// .featured-image {
		//   min-height: 10rem;
		//   min-width: 1orem;
		//   border: 1px solid red;
		// }
	}
</style>
