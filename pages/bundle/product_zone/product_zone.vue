<template>
	<view class="contain">
		<view class="row condition bg-white mt20">
			<view :class="'tag row-center ' + (comprehensive ? 'primary' : '')" @tap="onNormal">综合</view>
			<view class="tag row-center" data-type="priceSort" @tap="onPriceSort">
				<text :class="priceSort ? 'primary' : ''">价格</text>
				<view>
					<trigonometry direction="up" size="small" :color="priceSort == 'desc' ? '#FF5058' : '#333'">
					</trigonometry>
					<trigonometry size="small" :color="priceSort == 'asc' ? '#FF5058' : '#333'"></trigonometry>
				</view>
			</view>
			<view class="tag row-center" data-type="saleSort" @tap="onSaleSort">
				<text :class="saleSort ? 'primary' : ''">销量</text>
				<view>
					<trigonometry direction="up" size="small" :color="saleSort == 'desc' ? '#FF5058' : '#333'">
					</trigonometry>
					<trigonometry size="small" :color="saleSort == 'asc' ? '#FF5058' : '#333'"></trigonometry>
				</view>
			</view>
		</view>
		<ProductZone :list="list"></ProductZone>
	</view>
</template>

<script>
	import {
		getGoodsSearch
	} from '@/api/store'
	import {
		loadingType
	} from '@/utils/type';
	import {
		trottle,
		loadingFun
	} from '@/utils/tools'
	import ProductZone from '@/components/productZone/productZone.vue'
	export default {
		components: {
			ProductZone
		},
		data() {
			return {
				page: 1,
				catesType: "",
				status: loadingType.LOADING,
				list: [],
				priceSort: '',
				saleSort: ''
			}
		},
		created() {
			this.onNormal = trottle(this.onNormal, 500, this);
			this.onPriceSort = trottle(this.onPriceSort, 500, this);
			this.onSaleSort = trottle(this.onSaleSort, 500, this);
		},
		onLoad(options) {
			this.page = 1
			this.catesType = options.type
			if (options.type == 1) {
				uni.setNavigationBarTitle({
					title: '消费专区'
				})
			} else {
				uni.setNavigationBarTitle({
					title: '兑货专区'
				})
			}
			this.getGoodsListFun(options.type)
		},
		computed: {
			comprehensive() {
				const {
					priceSort,
					saleSort
				} = this
				if (priceSort == '' && saleSort == '') {
					return true;
				}			
				return false;
			},
		},
		methods: {
			async getGoodsListFun(type) {
				let {
					page,
					catesType,
					status,
					list,
					priceSort,
					saleSort,
				} = this
				const params = {
					category_id: type == "" ? catesType : type,
					page_no: page,
					price: priceSort,
					sales_sum: saleSort
				}
				const data = await loadingFun(getGoodsSearch, page, list, status, params)
				if (!data) return
				console.log(data);
				this.list = data.dataList
				this.page = data.page
			},
			
			onRefresh() {
				this.page = 1
				this.list = []
				this.status = loadingType.LOADING
				this.$nextTick(() => {
					this.getGoodsListFun("");
				});
			},
			
			onNormal() {
				this.priceSort = ''
				this.saleSort = ''
				this.onRefresh();
			},
			
			onPriceSort() {
				let {
					priceSort
				} = this;
				this.saleSort = ''
				this.priceSort = priceSort == 'asc' ? 'desc' : 'asc'
				this.onRefresh();
			},
			
			onSaleSort() {
				let {
					saleSort
				} = this;
				this.priceSort = ''
				this.saleSort = saleSort == 'desc' ? 'asc' : 'desc'
				this.onRefresh();
			},
		}
	}
</script>

<style lang="scss" scoped>
	.waterfall {
		background: #f1f1f1;
		min-height: 100vh;
		position: relative;
	}

	.condition {
		height: 80rpx;
		border-radius: 10rpx;

		.tag {
			flex: 1;
		}
	}

	.waterfall-item {
		overflow: hidden;
		margin: 10rpx;
		border-radius: 6px;
		background: #fff;
	}

	.waterfall-item__image {
		width: 100%;

		image {
			width: 100%;
			display: block;
		}
	}

	.waterfall-item__ft {
		padding: 20rpx;
		background: #fff;

		&__title {
			margin-bottom: 10rpx;
			line-height: 40rpx;

			.value {
				font-size: 28rpx;
				color: #303133;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
				text-overflow: ellipsis;
				word-break: break-all;
			}
		}

		&__desc .value {
			font-size: 28rpx;
			color: #606266;
		}
	}

	.product-price {
		display: flex;
		align-items: center;
		margin-top: 10rpx;

		.price {
			font-size: 32rpx;
			color: #ff4d4f;
			font-weight: bold;
		}

		.original-price {
			font-size: 24rpx;
			color: #999;
			text-decoration: line-through;
			margin-left: 10rpx;
		}
	}

	.empty-state {
		position: absolute;
		left: 50%;
		top: 40%;
		transform: translate(-50%, -50%);
		display: flex;
		flex-direction: column;
		align-items: center;

		.empty-image {
			width: 160rpx;
			height: 160rpx;
			margin-bottom: 24rpx;
		}

		.empty-text {
			font-size: 28rpx;
			color: #999999;
		}
	}
</style>