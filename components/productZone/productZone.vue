<template>
	<view class="waterfall">
		<u-waterfall v-model="list" ref="uWaterfall" v-if="list.length > 0">
			<template v-slot:left="{leftList}">
				<view class="waterfall-item" v-for="(item, index) in leftList" :key="index" @click="navGoods(item)">
					<view class="waterfall-item__image">
						<image :src="item.image" mode="widthFix"></image>
					</view>
					<view class="waterfall-item__ft">
						<view class="waterfall-item__ft__title u-line-2">
							<text class="value">{{item.name}}</text>
						</view>
						<view class="product-price">
							<text class="price">¥{{item.price}}</text>
							<text class="original-price" v-if="item.originalPrice">¥{{item.originalPrice}}</text>
						</view>
					</view>
				</view>
			</template>
			<template v-slot:right="{rightList}">
				<view class="waterfall-item" v-for="(item, index) in rightList" :key="index" @click="navGoods(item)">
					<view class="waterfall-item__image">
						<image :src="item.image" mode="widthFix"></image>
					</view>
					<view class="waterfall-item__ft">
						<view class="waterfall-item__ft__title u-line-2">
							<text class="value">{{item.name}}</text>
						</view>
						<view class="product-price">
							<text class="price">¥{{item.price}}</text>
							<text class="original-price" v-if="item.originalPrice">¥{{item.originalPrice}}</text>
						</view>
					</view>
				</view>
			</template>
		</u-waterfall>
		<view class="empty-state" v-else>
			<image src="/static/images/goods_null.png" mode="aspectFit" class="empty-image"></image>
			<text class="empty-text">暂无商品</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'ProductZone',
		props: {
			list: {
				type: Array,
				default: () => []
			}
		},
		methods: {

			navGoods(item) {
				uni.navigateTo({
					url: `/pages/goods_details/goods_details?id=${item.id}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.waterfall {
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