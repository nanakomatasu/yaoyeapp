<template>
	<view class="record-container">
		<!-- Record List -->
		<view class="record-list">
			<view class="record-item" v-for="(item, index) in recordList" :key="index">
				<view class="record-info">
					<view class="record-top">
						<text class="record-time">{{ formatTime(item.create_time) }}</text>
					</view>
					<view class="record-middle">
						<text class="record-title">{{item.remark}}</text>
						<text class="record-amount">{{ item.change_amount }}</text>
					</view>
				</view>
			</view>

			<!-- Empty State -->
			<view class="empty-state" v-if="recordList.length === 0">
				<image class="empty-image" src="/static/images/empty.png" mode="aspectFit"></image>
				<text class="empty-text">暂无兑换记录</text>
			</view>

			<!-- Load More -->
			<view class="load-more" v-if="hasMore && recordList.length > 0">
				<text>加载更多</text>
			</view>
			<view class="no-more" v-if="!hasMore && recordList.length > 0">
				<text>已经到底了</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		wenpiaoWithdrawRecord,
		butieWithdrawRecord
	} from '../../../api/store'
	export default {
		data() {
			return {
				page: 1,
				recordList: [],
				hasMore: false,
				recordType: ''
			}
		},
		onLoad(options) {
			console.log(options);
			if (options.type) {
				this.recordType = options.type
			}
			// Load record data when page loads
			this.getRecordList()
		},
		onReachBottom() {
			if (this.hasMore) {
				this.page++
				this.getRecordList()
			}
		},
		onPullDownRefresh() {
			this.page = 1
			this.recordList = []
			this.getRecordList()
			setTimeout(() => {
				uni.stopPullDownRefresh()
			}, 1000)
		},
		methods: {
			goBack() {
				uni.navigateBack()
			},
			formatTime(timestamp) {
				const date = new Date(timestamp * 1000)
				const year = date.getFullYear()
				const month = String(date.getMonth() + 1).padStart(2, '0')
				const day = String(date.getDate()).padStart(2, '0')
				const hours = String(date.getHours()).padStart(2, '0')
				const minutes = String(date.getMinutes()).padStart(2, '0')
				const seconds = String(date.getSeconds()).padStart(2, '0')
				return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
			},
			getRecordList() {
				const uid = uni.getStorageSync('userInfo').id
				if(this.recordType == 'wp') {
					wenpiaoWithdrawRecord({
						uid: uid
					}).then(res => {
						if (res.data && Array.isArray(res.data)) {
							this.recordList = res.data
							this.hasMore = false // Since we're getting all records at once
						}
					}).catch(err => {
						uni.showToast({
							title: '加载失败',
							icon: 'none'
						})
					})
				} else {
					butieWithdrawRecord({
						uid: uid
					}).then(res => {
						if (res.data && Array.isArray(res.data)) {
							this.recordList = res.data
							this.hasMore = false // Since we're getting all records at once
						}
					}).catch(err => {
						uni.showToast({
							title: '加载失败',
							icon: 'none'
						})
					})
				}

			}
		}
	}
</script>

<style>
	.record-container {
		background-color: #f9f6f1;
		min-height: 100vh;
	}

	.header {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 44px;
		position: relative;
		background-color: #ffffff;
		padding: 0 15px;
	}

	.back-icon {
		position: absolute;
		left: 15px;
	}

	.title {
		font-size: 18px;
		font-weight: 500;
	}

	.record-list {
		padding: 15px;
	}

	.record-item {
		background-color: #ffffff;
		border-radius: 8px;
		margin-bottom: 15px;
		padding: 15px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
	}

	.record-top {
		display: flex;
		justify-content: space-between;
		margin-bottom: 10px;
	}

	.record-time {
		font-size: 14px;
		color: #666;
	}

	.record-status {
		font-size: 14px;
	}

	.record-status.success {
		color: #07c160;
	}

	.record-status.pending {
		color: #ff9900;
	}

	.record-middle {
		display: flex;
		justify-content: space-between;
		margin-bottom: 10px;
	}

	.record-title {
		font-size: 16px;
		font-weight: bold;
		color: #333;
	}

	.record-amount {
		font-size: 16px;
		font-weight: bold;
		color: #f34443;
	}

	.record-bottom {
		display: flex;
		justify-content: space-between;
		font-size: 14px;
		color: #666;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 50px 0;
	}

	.empty-image {
		width: 120px;
		height: 120px;
		margin-bottom: 15px;
	}

	.empty-text {
		color: #999;
		font-size: 14px;
	}

	.load-more,
	.no-more {
		text-align: center;
		color: #999;
		font-size: 14px;
		padding: 15px 0;
	}
</style>