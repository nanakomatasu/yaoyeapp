<template>
	<view class="user" :style="[background]">
		<view class="header">
			<!-- #ifndef  H5 -->
			<view class="custom-navbar">
				<view class="navbar-title">个人中心</view>
			</view>
			<!-- #endif -->
			<view class="user-info row-between">
				<view class="info row">
					<image class="avatar mr20 flexnone" @tap="goLogin"
						:src="isLogin ? userInfo.avatar : '/static/images/my_portrait_empty.png'"></image>
					<view class="white" v-if="isLogin">
						<view class="name xxl line1">{{userInfo.nickname}}
						</view>
						<view class="user-id row-between" v-if="userInfo.sn">
							<view class="xs white ml20 mr20" style="color: #000000;">会员ID: {{userInfo.sn || ''}}</view>
							<view class="xs normal copy-btn row-center ml5" @tap.stop="onCopy">复制</view>
						</view>
					</view>
					<view class="black" v-else @tap="goLogin">
						<view style="font-size: 42rpx">点击登录</view>
						<view class="sm">登录体验更多功能</view>
					</view>
				</view>
				<!--                <view class="row" style="align-self: flex-start;">
                    <view class="user-opt" style="margin-right: 30rpx;" @tap="goPage('/pages/bundle/message_center/message_center')" >
                        <view class="dot row-center" v-if="userInfo.notice_num"></view>
                        <image style="width:58rpx;height: 58rpx;" src="/static/images/icon_my_news.png"></image>
                    </view>
                    <view class="user-opt" @tap="goPage('/pages/bundle/user_profile/user_profile')">
                        <image style="width:58rpx;height: 58rpx;" src="/static/images/icon_my_setting.png"></image>
                    </view>
                </view> -->
			</view>
		</view>
		<text class="level-text" style="color: #A37E55;" v-if="isLogin">个人等级:V{{userInfo.level}}</text>
		<text class="level-text" style="margin-left: 30rpx;color: #A37E55;" v-if="isLogin">团队等级:R{{userInfo.level2}}</text>
		<view class="my-assets bg-white">
			<view class="title row lg">我的资产</view>
			<view class="assets-container">
				<view class="nav row">
<!-- 					<view class="column-center assets-item" @tap="goPage('/pages/bundle/user_wallet/user_wallet')">
						<view class="xl primary">{{formatNumber(userInfo.user_money)}}</view>
						<view class="sm">余额</view>
					</view> -->
					<view class="column-center assets-item" @tap="goPage('/pages/bundle/user_bill/user_bill?type=0')">
						<view class="xl primary">{{formatNumber(userInfo.user_money)}}</view>
						<view class="sm">消费券</view>
					</view>
					<view class="column-center assets-item" @tap="goPage('/pages/bundle/user_bill/user_bill?type=0&score=6')">
						<view class="xl primary">{{formatNumber(userInfo.subsidy_points)}}</view>
						<view class="sm">补贴</view>
					</view>
					<view class="column-center assets-item" @tap="goPage('/pages/bundle/user_bill/user_bill?type=0&score=8')">
						<view class="xl primary">{{formatNumber(Number(userInfo.the_documents) + Number(userInfo.extractable))}}</view>
						<view class="sm">我的票</view>
					</view>
				</view>
				<view class="nav row">
					<view class="column-center assets-item" @tap="goPage('/pages/bundle/user_bill/user_bill?type=0&score=7')">
						<view class="xl primary">{{formatNumber(userInfo.user_pointsto_be_released)}}</view>
						<view class="sm">锁仓积分</view>
					</view>
					<view class="column-center assets-item" @tap="goPage('/pages/bundle/user_bill/user_bill?type=0&score=4')">
						<view class="xl primary">{{formatNumber(userInfo.ticket_points)}}</view>
						<view class="sm">兑票积分</view>
					</view>
					<view class="column-center assets-item" @tap="goPage('/pages/bundle/user_bill/user_bill?type=0&score=5')">
						<view class="xl primary">{{formatNumber(userInfo.earn_points)}}</view>
						<view class="sm">兑货积分</view>
					</view>
				</view>
			</view>
		</view>
		<view class="order-nav bg-white">
			<view class="title row-between" @tap="goPage('/pages/user_order/user_order')">
				<view class="lg">我的订单</view>
				<view class="muted sm row">
					全部订单
					<image class="icon-sm ml10" src="/static/images/arrow_right.png"></image>
				</view>
			</view>
			<view class="nav row">
				<view class="item column-center mb20" @tap="goPage('/pages/user_order/user_order?type=pay')">
					<view class="icon-contain">
						<view v-if="userInfo.wait_pay" class="badge xs row-center bg-white">
							{{userInfo.wait_pay}}
						</view>
						<image class="nav-icon" src="/static/mine/quanbu.png"></image>
					</view>
					<view class="sm mt10">待付款</view>
				</view>
				<view class="item column-center mb20" @tap="goPage('/pages/user_order/user_order?type=delivery')">
					<view class="icon-contain">
						<view v-if="userInfo.wait_delivery" class="badge xs row-center bg-white">
							{{userInfo.wait_delivery}}
						</view>
						<image class="nav-icon mb10" src="/static/mine/daizhifu.png"></image>
					</view>
					<view class="sm">待发货</view>
				</view>
				<view class="item column-center mb20" @tap="goPage('/pages/user_order/user_order?type=delivery')">
					<view class="icon-contain">
						<view v-if="userInfo.wait_take" class="badge xs row-center bg-white">
							{{userInfo.wait_take}}
						</view>
						<image class="nav-icon" src="/static/mine/daishouhuo.png"></image>
					</view>
					<view class="sm mt10">待收货</view>
				</view>
				<view class="item column-center mb20"
					@tap="goPage('/pages/bundle/goods_comment_list/goods_comment_list')">
					<view class="icon-contain">
						<view v-if="userInfo.wait_comment" class="badge xs row-center bg-white">
							{{userInfo.wait_comment}}
						</view>
						<image class="nav-icon" src="/static/mine/daipingjia.png"></image>
					</view>
					<view class="sm mt10">商品评价</view>
				</view>
				<view class="item column-center mb20" @tap="goPage('/pages/bundle/post_sale/post_sale')">
					<view class="icon-contain">
						<view v-if="userInfo.after_sale" class="badge xs row-center bg-white">
							{{userInfo.after_sale}}
						</view>
						<image class="nav-icon" src="/static/mine/tuikuan.png"></image>
					</view>
					<view class="sm mt10">退款/售后</view>
				</view>
			</view>
		</view>
		<view class="server-nav bg-white" v-if="menuList && menuList.length > 0">
			<view>
				<view class="title row-between">
					<view class="lg">我的功能</view>
				</view>
			</view>
			<view class="nav row wrap">
				<button v-for="(item, index) in menuList" :key="index" class="item column-center mb20"
					hover-class="none" :open-type="item.link_type == 3 ?'contact' :''" @tap="tapMenu(item)"
					style="width: 25%;">
					<image class="nav-icon" :src="item.image"></image>
					<view class="sm mt10">{{item.name}}</view>
				</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapActions
	} from 'vuex'
	import {
		getUser
	} from '@/api/user';
	import {
		getMenu
	} from '@/api/store'
	import {
		toLogin,
		wxMnpLogin
	} from '@/utils/login'
	import {
		menuJump,
		copy,
		setTabbar
	} from '@/utils/tools'
	import Cache from '@/utils/cache'
	const app = getApp()
	export default {
		data() {
			return {
				showNav: false,
				navH: 0,
				navBg: 0,
				menuList: [],
				statusBarH: ""
			};
		},

		components: {},
		props: {},

		onLoad(options) {
			setTabbar()
			this.getMenuFun();
		},

		onShow() {
			this.getUser();
			this.getCartNum()
		},
		onPageScroll(e) {
			const top = uni.upx2px(100)
			const {
				scrollTop
			} = e
			let percent = scrollTop / top > 1 ? 1 : scrollTop / top
			this.navBg = percent
		},

		onUnload() {},
		onPullDownRefresh() {
			this.getUser().then(() => {
				uni.stopPullDownRefresh();
			})
			this.getMenuFun();
		},
		onShareAppMessage() {
			const shareInfo = Cache.get('shareInfo')
			return {
				title: shareInfo.mnp_share_title,
				path: "pages/index/index?invite_code=" + this.inviteCode
			};
		},
		methods: {
			...mapActions(['getCartNum', 'getUser']),
			formatNumber(value) {
				if (value === undefined || value === null || value === '') return '0.00';
				const num = parseFloat(value);
				if (isNaN(num)) return '0.00';
				return num.toFixed(5);
			},
			goLogin() {
				let {
					isLogin
				} = this;
				if (isLogin) {
					uni.navigateTo({
						url: '/pages/bundle/user_profile/user_profile'
					});
					return;
				}
				toLogin()
			},

			goPage(url) {
				if (!this.isLogin) return toLogin()
				uni.navigateTo({
					url
				});
			},
			tapMenu(item) {
				if (!this.isLogin) return toLogin()
				console.log(item)
				menuJump(item)
			},
			async getMenuFun() {
				const {
					data,
					code
				} = await getMenu({
					type: 2,
				})
				if (code == 1) {
					this.menuList = data
				}
			},

			onCopy(e) {
				copy(this.userInfo.sn)
			},



		},
		computed: {
			...mapGetters(["cartNum", "userInfo", "inviteCode", "appConfig"]),
			background() {
				const {
					center_setting
				} = this.appConfig
				return center_setting.top_bg_image ? {
					'background-image': `url(${center_setting.top_bg_image})`
				} : {}
			},
		}
	};
</script>
<style lang="scss">
	.user {
		background-image: url(../../static/mine/back.png);
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-attachment: fixed;
		background-position: center;
		min-height: 100vh;
		padding: 0 32rpx;

		.header {
			display: flex;
			flex-direction: column;
			height: 220rpx;

			.user-info {
				padding: 10rpx 20rpx;
				//#ifdef  H5 
				padding-top: 90rpx;

				//#endif
				.avatar {
					height: 100rpx;
					width: 100rpx;
					border-radius: 50%;
					overflow: hidden;
				}

				.name {
					text-align: left;
					margin-bottom: 5rpx;
					max-width: 400rpx;
					color: #000000;
					display: flex;
				}

				.user-id {
					border: 1px solid white;
					border-radius: 100rpx;

					.copy-btn {
						background-color: #FFDFDA;
						height: 40rpx;
						width: 90rpx;
						border-radius: 100rpx;
					}
				}

				.user-opt {
					position: relative;

					.dot {
						position: absolute;
						background-color: #ee0a24;
						border: 2rpx solid #FFFFFF;
						color: $-color-primary;
						border-radius: 100%;
						top: 6rpx;
						right: 0rpx;
						font-size: 22rpx;
						min-width: 16rpx;
						height: 16rpx;
					}
				}

				.buyer-type {
					background-color: #FFA200;
					height: 38rpx;
					padding: 0 10rpx;
				}
			}

			.member {
				flex: 1;
				padding: 0 20rpx;

				.member-entery {
					color: #FFE0A1;
					padding: 0 16rpx;
					width: 100%;
					height: 80rpx;
					background: url(../../static/images/bg_member_grade.png);
					background-size: 100%;
				}
			}

		}

		.order-nav {
			.icon-contain {
				position: relative;
			}
		}

		.order-nav,
		.my-assets {
			margin: 16rpx 0 0;
			border-radius: 8rpx;
		}

		.server-nav {
			margin: 16rpx 0;
			border-radius: 8rpx;
		}

		.title {
			height: 80rpx;
			padding: 0 24rpx;
			border-bottom: $-dashed-border;
		}

		.nav {
			padding: 20rpx 0 0;

			.assets-item {
				flex: 1;
			}

			.item {
				width: 25%;
			}

			.badge {
				padding: 0 6rpx;
				min-width: 24rpx;
				height: 24rpx;
				border-radius: 24rpx;
				box-sizing: border-box;
				border: 1rpx solid $-color-primary;
				color: $-color-primary;
				position: absolute;
				left: 30rpx;
				top: -8rpx;
				z-index: 2;
			}

			.nav-icon {
				width: 48rpx;
				height: 48rpx;
			}
		}
	}

	.custom-navbar {
		height: 90rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 20rpx;
		background: transparent;
		position: relative;
	}

	.navbar-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #000;
	}

	.iconfont {
		font-family: "iconfont";
	}

	.arrow-right {
		font-size: 24rpx;
		margin-left: 4rpx;
	}

	.my-assets {
		margin: 16rpx 0 0;
		border-radius: 8rpx;

		.assets-container {
			padding: 20rpx 0;
		}

		.nav {
			margin-bottom: 30rpx;

			&:last-child {
				margin-bottom: 0;
			}

			.assets-item {
				width: 33.33%;

				.xl {
					font-size: 32rpx;
					font-weight: bold;
					margin-bottom: 8rpx;
				}

				.sm {
					font-size: 24rpx;
					color: #999;
				}
			}
		}
	}
</style>