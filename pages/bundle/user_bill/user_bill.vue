<template>
	<!--pages/user_bill/user_bill.wxml-->
	<view class="user-bill">
		<view class="amount-info" v-if="score == 8" @click="navWenPiao">
			<view class="amount-item">
				<text class="amount-label">持有总量：</text>
				<text class="amount-value">{{user.the_documents}}</text>
			</view>
			<view class="amount-item">
				<text class="amount-label">可提数量：</text>
				<text class="amount-value">{{user.extractable}}</text>
			</view>
		</view>
		<tabs :active="active" line-width="40" @change="onChange">
			<tab :title="tabs1">
				<view class="list mt20">
					<view v-for="(item, index) in lists" :key="index" class="item">
						<view class="bill-list bg-white">
							<view class="bill-item row-between">
								<view>
									<view class="black mb10">{{item.source_type}}</view>
									<view class="xs muted">{{item.create_time}}</view>
								</view>
								<view :class="'lg ' + (item.change_type == 1 ? 'income' : '')">{{item.change_amount}}
								</view>
							</view>
						</view>
					</view>
				</view>
				<loading-footer :status="loadingStatus" slotEmpty>
					<view class="data-null column-center" slot="empty">
						<image class="img-null" src="/static/images/order_null.png" />
						<text class="nr muted">暂无记录～</text>
					</view>
				</loading-footer>
			</tab>
			<tab :title="tabs2">
				<view class="list mt20">
					<view v-for="(item, index) in lists" :key="index" class="item">
						<view class="bill-list bg-white">
							<view class="bill-item row-between">
								<view>
									<view class="black mb10">{{item.source_type}}</view>
									<view class="xs muted">{{item.create_time}}</view>
								</view>

								<view class="lg">{{item.change_amount}}</view>
							</view>
						</view>
					</view>
				</view>
				<loading-footer :status="loadingStatus" slotEmpty>
					<view class="data-null column-center" slot="empty">
						<image class="img-null" src="/static/images/order_null.png" />
						<text class="nr muted" v-if="score != 5">暂无支出记录～</text>
						<text class="nr muted" v-if="score == 5">暂无兑换记录～</text>
					</view>
				</loading-footer>
			</tab>
			<tab :title="tabs3">
				<view class="list mt20">
					<view v-for="(item, index) in lists" :key="index" class="item">
						<view class="bill-list bg-white">
							<view class="bill-item row-between">
								<view>
									<view class="black mb10">{{item.source_type}}</view>
									<view class="xs muted">{{item.create_time}}</view>
								</view>
								<view class="lg income">{{item.change_amount}}</view>
							</view>
						</view>
					</view>
				</view>
				<loading-footer :status="loadingStatus" slotEmpty>
					<view class="data-null column-center" slot="empty">
						<image class="img-null" src="/static/images/order_null.png"></image>
						<text class="nr muted" v-if="score != 5">暂无收入记录～</text>
						<text class="nr muted" v-if="score == 5">暂无增加记录～</text>
					</view>
				</loading-footer>
			</tab>
		</tabs>
	</view>
</template>

<script>
	// +----------------------------------------------------------------------
	// | likeshop100%开源免费商用商城系统
	// +----------------------------------------------------------------------
	// | 欢迎阅读学习系统程序代码，建议反馈是我们前进的动力
	// | 开源版本可自由商用，可去除界面版权logo
	// | 商业版本务必购买商业授权，以免引起法律纠纷
	// | 禁止对系统程序代码以任何目的，任何形式的再发布
	// | gitee下载：https://gitee.com/likeshop_gitee
	// | github下载：https://github.com/likeshop-github
	// | 访问官网：https://www.likeshop.cn
	// | 访问社区：https://home.likeshop.cn
	// | 访问手册：http://doc.likeshop.cn
	// | 微信公众号：likeshop技术社区
	// | likeshop团队 版权所有 拥有最终解释权
	// +----------------------------------------------------------------------
	// | author: likeshopTeam
	// +----------------------------------------------------------------------
	import {
		getAccountLog
	} from "@/api/user";
	import {
		loadingType
	} from "@/utils/type";
	import {
		loadingFun
	} from "@/utils/tools"
	export default {
		data() {
			return {
				active: 0,
				lists: [],
				page: 1,
				score: 1,
				loadingStatus: loadingType.LOADING,
				tabs1: '全部',
				tabs2: '减少',
				tabs3: '增加',
				user: {}
			};
		},

		components: {},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			console.log(options, "option.type")
			this.active = parseInt(options.type);
			this.user = uni.getStorageSync('userInfo')
			if (options.score) {
				this.score = parseInt(options.score)
				switch(parseInt(options.score)) {
					case 4:
					uni.setNavigationBarTitle({
						title:'兑票明细'
					});
					break;
					case 5:
					this.tabs2 = '已兑换'
					this.tabs3 = '增加'
					uni.setNavigationBarTitle({
						title:'兑货明细'
					});
					break;
					case 6:
					uni.setNavigationBarTitle({
						title:'补贴明细'
					});
					break;
					case 7:
					uni.setNavigationBarTitle({
						title:'锁仓明细'
					});
					break;
					case 8:
					uni.setNavigationBarTitle({
						title:'文票明细'
					});
					break;
				}
			}
			this.getAccountLogFun(this.active);
		},


		onReachBottom: function() {
			this.getAccountLogFun(this.active);
		},

		methods: {
			onChange(e) {
				this.active = e;
				this.cleanStatus();
				this.getAccountLogFun(e);
			},
			
			navWenPiao() {
				uni.navigateTo({
					url:'/pages/bundle/wenpiao/wenpiao'
				})
			},

			cleanStatus() {
				// 清理状态
				this.page = 1;
				this.lists = [];
				this.loadingStatus = loadingType.LOADING
			},

			getAccountLogFun(type) {
				let changeType = 0;
				changeType = type == 0 ? 0 : type == 1 ? 2 : 1;
				let {
					lists,
					loadingStatus,
					page,
					score
				} = this;
				loadingFun(getAccountLog, page, lists, loadingStatus, {
					source: score,
					type: changeType
				}).then(res => {
					if (res) {
						this.page = res.page;
						this.lists = res.dataList
						this.loadingStatus = res.status
					}
				})
			}

		}
	};
</script>
<style lang="scss">
	/* pages/user_bill/user_bill.wxss */
	.user-bill {
		.amount-info {
			display: flex;
			justify-content: space-between;
			padding: 20rpx 30rpx;
			background-color: #fff;
			
			.amount-item {
				display: flex;
				align-items: center;
				
				.amount-label {
					font-size: 24rpx;
					color: #999;
					margin-right: 10rpx;
				}
				
				.amount-value {
					font-size: 28rpx;
					color: #666;
				}
			}
		}
		.list {
			.item {
				.time {
					padding: 30rpx;
				}

				.bill-list {
					.bill-item {
						padding: 20rpx 30rpx;
						border-bottom: $-solid-border;

						.income {
							color: $-color-primary;
						}
					}
				}
			}
		}
	}

	.order-null {
		padding-top: 200rpx;
	}

	.data-null {
		padding-top: 150rpx;
	}
</style>