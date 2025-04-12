<template>
	<view class="content-main">
		<view class="team-card center-box">
			<view class="card-title">我的团队</view>
			<view class="card-total">
				<view class="card-total-item">
					<view class="card-total-item-title">团队总人数</view>
					<view class="card-total-item-data">{{canshuInfo.Total_number_of_team_members}}</view>
				</view>
				<view class="card-total-item">
					<view class="card-total-item-title">小市场总业绩</view>
					<view class="card-total-item-data">{{canshuInfo.community_performance}}</view>
				</view>
				<view class="card-total-item">
					<view class="card-total-item-title">直推总人数</view>
					<view class="card-total-item-data">{{canshuInfo.Total_number_of_direct_referrals}}</view>
				</view>
			</view>
			<view class="card-efficient">
				<view class="card-efficient-item">
					<view class="card-efficient-item-title">团队有效人数</view>
					<view class="card-efficient-item-data">{{canshuInfo.Effective_number_of_staff }}</view>
				</view>
				<view class="card-efficient-item">
					<view class="card-efficient-item-title">我的团队业绩</view>
					<view class="card-efficient-item-data">{{canshuInfo.team_performance}}</view>
				</view>
				<view class="card-efficient-item">
					<view class="card-efficient-item-title">直推有效人数</view>
					<view class="card-efficient-item-data">{{canshuInfo.Number_of_effective_direct_referrals}}</view>
				</view>
			</view>
		</view>
		<view class="switch-tabs center-box">
			<view class="switch-tab-item" v-for="item in switchTabsList" :key="item.id"
				:class="[selectTabId == item.id ? 'select-tab-item' : '']" @click="changeTabId(item.id)">{{item.title}}
			</view>
		</view>
		<scroll-view scroll-y="true" class="scroll-view center-box" @scrolltolower="loadMore" refresher-enabled @refresherrefresh="onRefresh" :refresher-triggered="isRefreshing">
			<view class="team-user">
				<view class="team-user-info-item" v-for="item in teamList" :key="item.id">
					<view class="first-line">
						<view class="user-avatar">
							<image :src="baseUrl + item.avatar" mode="aspectFill">
							</image>
						</view>
						<view class="user-info">
							<view class="user-nick">
								{{item.nickname}}
							</view>
							<view class="join-time">{{item.create_time}}</view>
						</view>
						<view class="action-buttons">
							<view class="action-btn personal">个人等级V{{item.level}}</view>
							<view class="action-btn team">团队等级R{{item.level2}}</view>
						</view>
					</view>
					<view class="second-line">
						<view class="second-line-content">
							<view class="second-line-item">
								<view class="second-line-item-title">团队总人数</view>
								<view class="second-line-item-data">{{item.my_team}}</view>
							</view>
							<view class="second-line-item">
								<view class="second-line-item-title">团队有效人数</view>
								<view class="second-line-item-data">{{item.my_team_yx}}</view>
							</view>
							<view class="second-line-item">
								<view class="second-line-item-title">团队业绩</view>
								<view class="second-line-item-data">{{item.team_performance}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="loading-more" v-if="hasMore">
				<text>加载中...</text>
			</view>
			<view class="no-more" v-else>
				<text>没有更多了</text>
			</view>
		</scroll-view>
	</view>

</template>

<script>
	import {
		getMyteam,
		getMyteamCanshu
	} from '../../../api/user'
	import { imageBaseUrl } from '../../../config/app'
	export default {
		data() {
			return {
				selectTabId: 1,
				page: 1,
				canshuInfo: {},
				baseUrl:'',
				switchTabsList: [{
						id: 1,
						title: "团队"
					},
					{
						id: 2,
						title: "直推"
					}
				],
				teamList: [],
				hasMore: true,
				isRefreshing: false
			}
		},
		onLoad() {
			this.getMyTeamCanshuFun()
			this.getMyteamFun()
			this.baseUrl = imageBaseUrl
		},
		methods: {
			changeTabId(id) {
				this.selectTabId = id
				this.page = 1
				this.teamList = []
				this.hasMore = true
				this.getMyteamFun()
			},
			backPages() {
				uni.navigateBack()
			},
			getMyTeamCanshuFun() {
				const uid = uni.getStorageSync('userInfo').id
				getMyteamCanshu({
					uid: uid
				}).then(res => {
					if (res.code == 1) {
						this.canshuInfo = res.data
					}
				})
			},
			getMyteamFun() {
				const uid = uni.getStorageSync('userInfo').id
				let {
					selectTabId,
					page
				} = this
				getMyteam({
					uid: uid,
					type: selectTabId,
					page: page
				}).then(res => {
					if(res.code == 1) {
						if (page === 1) {
							this.teamList = res.data
						} else {
							this.teamList = [...this.teamList, ...res.data]
						}
						this.hasMore = res.data.length > 0
					}
					this.isRefreshing = false
				})
			},
			loadMore() {
				if (this.hasMore) {
					this.page++
					this.getMyteamFun()
				}
			},
			onRefresh() {
				this.isRefreshing = true
				this.page = 1
				this.getMyteamFun()
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background: linear-gradient(180deg, #E4DFD9 0%, #E7DBCD 36%, #E4D8C8 67%, #DDCAB0 100%);
		background-size: cover;
	}

	.content-main {
		padding: 0 32rpx;
	}

	.navigation-bar {
		background: transparent;
		overflow: hidden;
		width: 100%;
		height: 196rpx;

		.navgation-bar-content {
			position: relative;
			margin-top: 88rpx;
			width: 100%;
			height: 108rpx;
			text-align: center;
		}

		.text-color {
			color: #1A1A1A;
		}
	}

	.team-card {
		box-sizing: border-box;
		// height: 348rpx;
		border-radius: 8rpx 8rpx 8rpx 8rpx;
		background: linear-gradient(89deg, #A37E55 0%, #AC773D 100%);
		;
		color: #fff;
		padding: 32rpx;

		.card-title {
			font-size: 32rpx;
			font-weight: bold;
		}

		.card-total {
			width: 100%;
			box-sizing: border-box;
			padding: 0 32rpx;
			font-size: 32rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 108rpx;
			margin-top: 32rpx;

			.card-total-item {
				height: 108rpx;
				display: flex;
				flex-direction: column;
				align-items: center;

				.card-total-item-title {}

				.card-total-item-data {
					margin-top: 20rpx;
				}
			}
		}

		.card-efficient {
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 24rpx;

			.card-efficient-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				font-size: 24rpx;


				.card-efficient-item-data {
					margin-top: 8rpx;
				}
			}
		}
	}

	.switch-tabs {
		margin-top: 32rpx;
		display: flex;
		align-items: center;

		.switch-tab-item {
			margin-right: 20rpx;
			padding: 14rpx 78rpx;
			border-radius: 60rpx 60rpx 60rpx 60rpx;
			border: 2rpx solid #AB783F;
			text-align: center;
			font-size: 28rpx;
			color: #AB783F;
		}

		.select-tab-item {
			background: linear-gradient(90deg, #A37E55 0%, #AB773E 100%);
			color: #fff;
		}
	}

	.scroll-view {
		box-sizing: border-box;
		padding: 32rpx 0;
		height: 63vh;

		.team-user {
			width: 100%;

			.team-user-info-item {
				width: 100%;
				padding: 24rpx;
				background: #FFFFFF;
				border-radius: 16rpx;
				margin-bottom: 24rpx;

				.first-line {
					display: flex;
					align-items: center;
					position: relative;

					.user-avatar {
						width: 80rpx;
						height: 80rpx;
						border-radius: 50%;
						overflow: hidden;

						image {
							width: 100%;
							height: 100%;
							object-fit: cover;
						}
					}

					.user-info {
						margin-left: 20rpx;
						flex: 1;

						.user-nick {
							font-size: 28rpx;
							color: #333;
							font-weight: bold;
						}

						.join-time {
							font-size: 24rpx;
							color: #999;
							margin-top: 8rpx;
						}
					}

					.action-buttons {
						display: flex;
						gap: 12rpx;

						.action-btn {
							padding: 4rpx 12rpx;
							border-radius: 24rpx;
							font-size: 22rpx;

							&.personal {
								color: #fff;
								background: #AA7840;
							}

							&.team {
								color: #fff;
								background: #AA7840;
							}
						}
					}
				}

				.second-line {
					margin-top: 20rpx;
					padding-top: 20rpx;
					border-top: 1px solid #F5F5F5;

					.second-line-content {
						display: flex;
						justify-content: space-between;

						.second-line-item {
							text-align: center;

							.second-line-item-title {
								font-size: 24rpx;
								color: #999;
							}

							.second-line-item-data {
								font-size: 28rpx;
								color: #333;
								margin-top: 8rpx;
								font-weight: bold;
							}
						}
					}
				}
			}
		}
	}

	.loading-more, .no-more {
		text-align: center;
		padding: 20rpx 0;
		color: #999;
		font-size: 24rpx;
	}
</style>