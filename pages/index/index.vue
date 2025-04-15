<template>
	<view class="index home-bg" :style="[navBackground]">
		<!-- #ifdef H5 -->
		<download-nav v-if="isShowDownload"></download-nav>
		<!-- #endif -->
		<view class="custom-sticky">
			<view class="custom-navbar" :style="[navBackground]">
				<view class="row logo-wrap flex1" v-show="navBg < 1 && showLogo">
					<image :src="logo" mode="heightFix" class="logo ml30"></image>
				</view>
				<view class="flex1 row nav-search" v-show="navSearch">
					<navigator hover-class="none" @click="goPage('/pages/bundle/message_center/message_center')">
						<image class="icon-md ml30" src="/static/images/icon_news.png">
						</image>
					</navigator>
					<navigator class="ml20 flex1 mr20" hover-class="none" url="/pages/goods_search/goods_search">
						<view class="custom-search">
							<view class="search-placeholder">搜索</view>
						</view>
					</navigator>
				</view>
			</view>
		</view>
		<view class="flex1 row" v-if="showLogo">
			<navigator hover-class="none" @click="goPage('/pages/bundle/message_center/message_center')">
				<image class="icon-md ml30" src="/static/images/icon_news.png">
				</image>
			</navigator>
			<navigator class="ml20 flex1 mr20" hover-class="none" url="/pages/goods_search/goods_search">
				<view class="custom-search">
					<view class="search-placeholder">搜索</view>
				</view>
			</navigator>
		</view>
		<view class="contain">
			<view class="main">
				<!-- <bubble-tips top="50rpx" :discharge="isDischarge"></bubble-tips> -->
				<swipers :pid="1" height="322rpx" padding="20rpx 0"></swipers>
				<u-notice-bar :list="gundongList" mode="vertical" :is-circular="true" :duration="2000" :font-size="28"
					:padding="20" :bg-color="'#fff'" :color="'#333'" :icon-color="'#D92525'" class="mt20"></u-notice-bar>
				<!-- 导航入口 -->
				<view class="nav bg-white" v-if="navList.length">
					<swiper :style="'height:' + navSwiperH + 'rpx;'" @change="swiperChange">
						<swiper-item v-for="(items, index) in navList" :key="index">
							<view class="nav-list row wrap">
								<view v-for="(item, index2) in items" :key="index2" @tap="tapMenu(item)"
									class="nav-item column-center">
									<image class="nav-icon" :src="item.image"></image>
									<view class="name xs">{{item.name}}</view>
								</view>
							</view>
						</swiper-item>
					</swiper>
					<view class="dots" v-if="navList.length > 1">
						<view v-for="(item, index) in navList" :key="index"
							:class="'dot ' + (index == currentSwiper ? 'active' : '')"></view>
					</view>
				</view>
				<!-- 新功能区域 -->
				<view class="new-feature bg-white row mt20">
					<view class="feature-item column-center" v-for="(item, index) in featureList" :key="index"
						@click="goPage(item.url)">
						<view class="feature-icon">
							<image :src="item.icon" mode="scaleToFill" />
						</view>
						<view class="feature-name xs">{{ item.name }}</view>
					</view>
				</view>
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
				<ProductZone :list="cateGoods"></ProductZone>
				<!-- 领卷 -->
				<swipers :is-swiper="false" :pid="23" height="170rpx" padding="20rpx 0 0"></swipers>
				<!-- 活动专区 -->
				<!-- 秒杀 -->
				<!-- 热销 -->
				<!-- 新品推荐 -->
			</view>
		</view>
		<u-popup class="coupons-popup" v-model="showCoupop" mode="center">
			<view class="wrap">
				<image class="coupon-bg" src="/static/images/home_coupon_bg.png"></image>
				<scroll-view :scroll-y="true" style="height: 460rpx;margin-top: 300rpx;">
					<view class="item" v-for="(item, index) in couponPopList" :key="item.id">
						<image class="img" src="/static/images/pop_bg_coupon.png"></image>
						<view class="row item-con">
							<view class="row-center price">
								<price-format color="#FF2C3C" :showSubscript="true" :subscriptSize="32" :first-size="56"
									:second-size="40" :price="item.money" />
							</view>
							<view class="ml20 mr20">
								<view class="bold md lighter">{{item.name}}</view>
								<view class="xs muted mt10">{{item.use_goods_type}}</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
			<view class="white row-center bg-primary lg btn br60" @click="showCoupop = false">立即领取</view>
		</u-popup>
		<!-- #ifdef APP-PLUS -->
		<lyg-popup v-if="appConfig.app_agreement" title="服务协议和隐私政策"
			protocolPath='/pages/bundle/server_explan/server_explan?type=0'
			policyPath='/pages/bundle/server_explan/server_explan?type=1' policyStorageKey="has_read_privacy">
		</lyg-popup>
		<!-- #endif -->
	</view>
</template>

<script>
	import {
		mapGetters,
		mapActions
	} from 'vuex'
	import {
		gundongNotify
	} from '../../api/user';
	import {
		getHome,
		getMenu,
		getBestList,
		getGoodsSearch
	} from '@/api/store';
	import {
		loadingType
	} from '@/utils/type'
	import {
		loadingFun,
		menuJump,
		arraySlice,
		setTabbar,
		getRect,
		trottle
	} from '@/utils/tools'
	import {
		toLogin
	} from '@/utils/login'
	import Cache from '@/utils/cache'
	import {
		getRegisterCoupon
	} from '@/api/app'
	import ProductZone from '@/components/productZone/productZone.vue'
	const app = getApp()
	export default {
		components: {
			ProductZone
		},
		data() {
			return {
				navSwiperH: 374,
				logo: "",
				catesType: 1,
				navHeight: 0,
				currentSwiper: 0,
				page: 1,
				status: loadingType.LOADING,
				remainTime: "",
				navBg: 0,
				navList: [],
				news: [],
				goodsList: [],
				seckill: {},
				seckillGoods: [],
				hotGoods: [],
				newGoods: [],
				activityArea: [],
				showCoupop: false,
				couponPopList: [],
				coupon: [],
				isDischarge: true,
				enable: true,
				isShowDownload: false,
				cateGoods: [],
				priceSort: '',
				saleSort: '',
				gundongList: [],
				featureList: [{
						icon: '/static/home/baodan.png',
						name: '消费专区',
						url: '/pages/bundle/product_zone/product_zone?type=1',
						type: 'switch'
					},
					{
						icon: '/static/home/wenpiao.png',
						name: '权益兑换',
						url: '/pages/bundle/wenpiao/wenpiao'
					},
					{
						icon: '/static/home/duihuo.png',
						name: '兑货专区',
						url: '/pages/bundle/product_zone/product_zone?type=2',
						type: 'switch'
					},
					{
						icon: '/static/home/yaoqing.png',
						name: '邀请好友',
						url: '/pages/bundle/user_spread/user_spread'
					},
					{
						icon: '/static/home/kefu.png',
						name: '客服',
						url: '/pages/bundle/contact_offical/contact_offical'
					}
				]
			}
		},
		created() {
			this.onNormal = trottle(this.onNormal, 500, this);
			this.onPriceSort = trottle(this.onPriceSort, 500, this);
			this.onSaleSort = trottle(this.onSaleSort, 500, this);
		},
		async onLoad(options) {
			this.headerAction = wx.createAnimation({
				delay: 0,
				duration: 100,
				timingFunction: "ease-in-out"
			})

			setTabbar()
			this.navHeight = app.globalData.navHeight
			this.isDischarge = false;
			await this.getMenuFun()
			this.getGoodsListFun()
			console.log(this.appConfig)
			// #ifdef H5
			if (options && options.isapp == 1) {
				this.isShowDownload = true;
			}
			// #endif
		},
		async onShow() {
			this.getGundong()
			this.$nextTick(function() {
				getRect('.index').then((res) => {
					if (res.top == 0) {
						this.navBg = 0
					}
				})
			})

			// #ifdef H5
			this.enable = true
			// #endif
			await this.getHomeFun()
			this.getCartNum()
			this.isLogin && this.getRegisterCouponFun()
		},
		onHide() {
			// #ifdef H5
			this.enable = false
			// #endif
		},
		onReachBottom() {
			this.getBestListFun()
		},
		onPullDownRefresh() {
			this.getHomeFun()
			this.getMenuFun()
		},
		onShareAppMessage() {
			console.log(this.inviteCode)
			const shareInfo = Cache.get('shareInfo')
			return {
				title: shareInfo.mnp_share_title,
				path: "pages/index/index?invite_code=" + this.inviteCode
			};
		},
		onPageScroll(e) {
			const top = uni.upx2px(100)
			const {
				scrollTop
			} = e
			if (!this.enable) return
			let percent = scrollTop / top
			this.navBg = percent > 1 ? 1 : percent
		},
		destroyed() {
			this.isDischarge = true;
		},
		methods: {
			...mapActions(['getCartNum']),
			async getHomeFun() {
				const {
					code,
					data
				} = await getHome();
				uni.stopPullDownRefresh()
				if (code == 1) {
					const {
						coupon,
						news,
						seckill,
						host_goods,
						shop_logo,
						new_goods,
						activity_area
					} = data;
					this.remainTime = Math.abs(seckill.end_time - Date.parse(new Date()) / 1000);
					this.logo = shop_logo
					this.news = news
					this.seckillGoods = seckill.goods
					this.seckill = seckill
					this.hotGoods = host_goods
					this.coupon = coupon
					this.newGoods = new_goods
					this.activityArea = activity_area

				}
			},

			async getGoodsListFun() {
				let {
					page,
					catesType,
					status,
					cateGoods,
					priceSort,
					saleSort,
				} = this
				const params = {
					category_id: catesType,
					page_no: page,
					price: priceSort,
					sales_sum: saleSort
				}
				const data = await loadingFun(getGoodsSearch, page, cateGoods, status, params)
				if (!data) return
				console.log(data);
				this.cateGoods = [...data.dataList]
				this.page = data.page
			},

			async getMenuFun() {
				const {
					code,
					data
				} = await getMenu({
					type: 1
				});
				uni.stopPullDownRefresh()
				if (code == 1) {
					//   截取数组
					if (data.length <= 5) {
						this.navSwiperH = 200
					} else {
						this.navSwiperH = 374
					}
					this.navList = arraySlice(data);
				}
			},
			async getBestListFun() {
				let {
					page,
					goodsList,
					status
				} = this
				const data = await loadingFun(getBestList, page, goodsList, status)
				if (!data) return
				this.page = data.page
				this.goodsList = data.dataList
				this.status = data.status
			},
			async tapMenu(item) {
				if (!this.isLogin) return toLogin()
				menuJump(item)
			},
			goPage(url) {
				if (!this.isLogin) return toLogin()
				uni.navigateTo({
					url
				})
			},
			swiperChange(e) {
				this.currentSwiper = e.detail.current
			},
			getRegisterCouponFun() {
				getRegisterCoupon().then(res => {
					if (res.code == 1) {
						if (res.data && res.data.length) {
							this.showCoupop = true;
						}
						this.couponPopList = res.data;
					}
				})
			},

			getGundong() {
				const uid = uni.getStorageSync('userInfo').id
				gundongNotify({
					uid: uid
				}).then(res => {
					if (res.code == 1) {
						this.gundongList = []
						res.data.forEach(item => {
							this.gundongList.push(item.name)
						})
						console.log(res, '滚动通知----------------');
					}
				})
			},

			onRefresh() {
				this.page = 1
				this.cateGoods = []
				this.status = loadingType.LOADING
				this.$nextTick(() => {
					this.getGoodsListFun();
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
		},
		computed: {
			...mapGetters(["cartNum", "inviteCode", "appConfig"]),
			navBackground() {
				return this.seting.top_bg_image ? {
					'background-image': `url(${this.seting.top_bg_image})`
				} : {}
			},
			showLogo() {
				return this.seting.logo
			},
			navSearch() {
				if (this.showLogo === 0) return true

				return this.navBg < 1 ? false : true
			},
			seting() {
				const {
					index_setting
				} = this.appConfig
				return index_setting
			},
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
		}
	}
</script>

<style lang="scss">
	// // #ifdef H5
	// ::v-deep .home-bg {
	// 	background: url(../../static/images/bg_hometop.png) no-repeat;
	// 	background-size: 100% auto;
	// }

	// // #endif
	// .home-bg {
	// 	background: url(../../static/images/bg_hometop.png) no-repeat;
	// 	background-size: 100% auto;
	// }

	.index {
		min-height: 100vh;
		background: url('@/static/home/homeBack.png') no-repeat;
		background-size: 100% auto;
		background-attachment: fixed;
		background-position: top center;
		-webkit-overflow-scrolling: touch; // 优化 iOS 滚动
		// iOS specific fix
		@supports (-webkit-touch-callout: none) {
			background-attachment: fixed;
			background-size: 100% auto;
			background-color: #F8F3E9;
		}

		.logo-wrap {
			position: absolute;

			.logo {
				width: auto;
				height: 52rpx;
			}
		}

		.condition {
			height: 80rpx;
			border-radius: 10rpx;

			.tag {
				flex: 1;
			}
		}


		.header {
			.navigation-bar {
				padding-top: var(--status-bar-height);
				box-sizing: border-box;
			}
		}

		.contain {
			padding: 32rpx 32rpx 0;

			.main {
				position: relative;
				z-index: 9;
				padding: 0;

				.nav {
					position: relative;
					border-radius: 14rpx;

					.nav-item {
						width: 20%;
						margin-top: 30rpx;

						.nav-icon {
							width: 82rpx;
							height: 82rpx;
							margin-bottom: 15rpx;
						}
					}

					.dots {
						position: absolute;
						left: 50%;
						transform: translateX(-50%);
						bottom: 20rpx;
						display: flex;

						.dot {
							width: 10rpx;
							height: 6rpx;
							border-radius: 6rpx;
							margin-right: 10rpx;
							background-color: rgba(255, 44, 60, 0.4);

							&.active {
								width: 20rpx;
								background-color: $-color-primary;
							}
						}

					}

				}

				.information {
					height: 76rpx;
					box-shadow: 0px 0px 14px rgba(0, 0, 0, 0.06);
					padding: 0 20rpx;
					box-sizing: border-box;
					border-radius: 14rpx;

					.news {
						position: relative;

						.shade {
							position: absolute;
							width: 100%;
							height: 100%;
							z-index: 100;
						}
					}

					.icon-toutiao {
						width: 100%;
						height: 100%;
					}

					.gap-line {
						height: 28rpx;
						width: 1px;
						background-color: #DCDDDC;
						margin: 0 30rpx;
					}
				}

				.new-feature {
					height: 160rpx;
					box-shadow: 0px 0px 14px rgba(0, 0, 0, 0.06);
					padding: 20rpx;
					box-sizing: border-box;
					border-radius: 14rpx;
					margin-bottom: 20rpx;

					.feature-item {
						flex: 1;
						height: 100%;

						.feature-icon {
							width: 80rpx;
							height: 80rpx;
							margin-bottom: 10rpx;
							background-color: #f5f5f5;
							border-radius: 50%;
							overflow: hidden;

							image {
								width: 100%;
								height: 100%;
							}
						}

						.feature-name {
							color: #333;
						}
					}
				}

				.special-area {
					.item {
						width: 300rpx;
						border-radius: 20rpx;
						display: inline-block;
						overflow: hidden;
						margin-right: 20rpx;

						.title {
							padding: 10rpx 0;
						}

						.desc {
							background-color: #FEE9EB;
							padding: 6rpx 20rpx;
							border-radius: 60rpx;
							max-width: 260rpx;
						}
					}

				}



				.activity-header {
					height: 90rpx;
					padding: 0 20rpx;
				}

				.seckill {
					.dec {
						background-color: #FFFBDB;
						width: 150rpx;
					}
				}

				.hot,
				.new-goods {
					.title-image {
						width: 144rpx;
						height: 55rpx;
					}
				}
			}

			.goods {
				.goods-title {
					height: 100rpx;

					.line {
						width: 58rpx;
						height: 1px;
						background-color: #ccc;
						margin: 0 22rpx;
					}

					.icon {
						width: 38rpx;
						height: 38rpx;
					}
				}
			}
		}

		.coupon-pop-container {
			background-image: url(../../static/images/home_coupon_bg.png);
			width: 638rpx;
			height: 804rpx;
			background-size: 100% 100%;
			padding-top: 323rpx;

			.coupon-pop-lists {
				.coupon-pop-item {
					background-image: url(../../static/images/pop_bg_coupon.png);
					width: 488rpx;
					height: 150rpx;
					background-size: 100% 100%;
					margin-top: 20rpx;

					.coupon-left {
						width: 160rpx;
						height: 100%;
					}

					.coupon-right {
						padding-left: 30rpx;
						border-left: 1rpx dashed $-color-primary;
					}
				}
			}
		}

		.coupons-popup {
			.wrap {
				position: relative;
				width: 638rpx;
				height: 803rpx;
				overflow: hidden;

				.coupon-bg {
					position: absolute;
					top: 0;
					width: 100%;
					height: 100%;
				}

				.item {
					position: relative;
					width: 488rpx;
					height: 150rpx;
					margin: 0 auto 20rpx;
				}

				.img {
					position: absolute;
					width: 100%;
					height: 100%;
					z-index: 0;
				}

				.item-con {
					z-index: 10;
					position: relative;
					padding: 20rpx 0;
					height: 100%;
					box-sizing: border-box;

					.price {
						width: 160rpx;
						border-right: 1px dashed $-color-primary;
						height: 100%;
					}
				}
			}

			.btn {
				width: 478rpx;
				height: 84rpx;
				margin: 20rpx auto;
				box-sizing: border-box;
				border: 3px solid #F8D07C;
			}
		}
	}

	.custom-sticky {
		position: sticky;
		top: 50rpx;
		left: 0;
		width: 100%;
		z-index: 99;
	}

	.custom-navbar {
		height: 90rpx;
		display: flex;
		align-items: center;
		padding: 0 20rpx;
	}

	.custom-search {
		background-color: #fff;
		height: 62rpx;
		border-radius: 31rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
	}

	.search-placeholder {
		color: #999;
		font-size: 28rpx;
	}
</style>