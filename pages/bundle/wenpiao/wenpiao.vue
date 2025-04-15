<template>
	<view class="wenpiao-container">
		<!-- Price Section -->
		<view class="price-section">
			<view class="price-label">
				<text class="price-indicator">价格</text>
			</view>
			<view class="current-price">
				<text>当前价格：{{ formatNumber(wenpiaoCanshu.money) }}</text>
			</view>
			<!-- <view class="time-buttons">
				<view class="time-btn" :class="{ active: timeType === 'hour' }" @click="switchTimeType('hour')">小时</view>
				<view class="time-btn" :class="{ active: timeType === 'day' }" @click="switchTimeType('day')">天</view>
			</view> -->
		</view>
		<!-- Chart Section -->
		<view class="chart-container">
			<view class="chart-wrapper" v-if="hourTimeLabels.length > 0">
				<canvas canvas-id="priceChart" id="priceChart" class="charts" @touchend="tap"/>
			</view>
			<view class="empty-state" v-else>
				<text class="empty-text">暂无价格数据</text>
			</view>
		</view>
		
		<!-- Total Section -->
		<!-- Data List Section -->
		<view class="data-list-section">
			<view class="list-header">
				<text class="header-item">日期</text>
				<text class="header-item">金额</text>
			</view>
			<scroll-view class="list-content" scroll-y>
				<template v-if="hourTimeLabels.length > 0">
					<view class="list-item" v-for="(item, index) in wenpiaoData" :key="index">
						<text class="item-date">{{ item.date }}</text>
						<text class="item-money">{{ formatNumber(item.money) }}</text>
					</view>
				</template>
				<view class="empty-state" v-else>
					<text class="empty-text">暂无价格数据</text>
				</view>
			</scroll-view>
		</view>
		<view class="total-section">
			<text class="period">{{ currentReceipt.name || '--' }}</text>
			<text class="total-amount">{{ formatNumber(currentReceipt.number_copies) || '--' }}</text>
			<text class="total-label">总量</text>
			<view class="price-formula">
				<text class="formula-item">开始价格：{{ formatNumber(currentReceipt.money1) || '--' }}</text>
				<text class="formula-item">结束价格：{{ formatNumber(currentReceipt.money2) || '--' }}</text>
			</view>
		</view>
		
		<!-- Exchange Section -->
		<view class="exchange-section">
			<view class="exchange-input">
				<text class="exchange-label">兑换数量：</text>
				<input class="exchange-amount" type="number" placeholder="输入兑换数量" v-model="exchangeAmount" />
			</view>
			<view class="hint-section">
				<text class="hint">当前持有{{formatNumber(wenpiao)}}张</text>
				<view class="action-buttons">
					<view class="exchange-record" @click="toExchangeRecord">
						<text>兑换记录</text>
						<text class="iconfont icon-right"></text>
					</view>
					<view class="withdraw-btn" @click="toWithdraw">
						<text>去提票</text>
						<text class="iconfont icon-right"></text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- Button -->
		<view class="confirm-btn" @click="confirmExchange">
			<text>确定兑换</text>
		</view>
	</view>
</template>

<script>
import uCharts from '@/uni_modules/qiun-data-charts/js_sdk/u-charts/u-charts.js';
import { zhexian, zhexiantucanshu, wenpiaoExchange } from '../../../api/store';
var uChartsInstance = {};
export default {
	data() {
		return {
			price: '',
			timeType: 'hour', // 'hour' or 'day'
			hourTimeLabels: [],
			dayTimeLabels: [],
			chartsDate: [],
			cWidth: 750,
			cHeight: 450,
			wenpiaoData: [],
			wenpiaoCanshu: {},
			exchangeAmount: '',
			exchangeName: '',
			exchangeAccount: '',
			wenpiao: '',
		}
	},
	computed: {
		currentTimeLabels() {
			return this.timeType === 'hour' ? this.hourTimeLabels : this.dayTimeLabels
		},
		currentReceipt() {
			return this.wenpiaoCanshu?.receipt?.[0] || {};
		}
	},
	onReady() {
		//设置图表尺寸
		this.cWidth = uni.upx2px(720);
		this.cHeight = uni.upx2px(450);  // 减小图表高度
		// this.getServerData();
	},
	onShow() {
		this.getCanshu()
		this.getZhexian()
	},
	methods: {
		goBack() {  
			uni.navigateBack()
		},
		confirmExchange() {
			if (!this.exchangeAmount) {
				uni.showToast({
					title: '请输入兑换数量',
					icon: 'none'
				})
				return
			}
			wenpiaoExchange({
				uid:uni.getStorageSync('uid'),
				quantity:this.exchangeAmount
			}).then(res => {
				if(res.code === 1) {
					uni.showToast({
						title: '兑换请求已提交',
						icon: 'none'
					})
					setTimeout(() => {
						this.getZhexian()
						this.getCanshu()
					}, 1000)
				}
			})
		},
		getZhexian() {
			zhexian({
				uid:uni.getStorageSync('uid'),
			}).then(res => {
				if(res.code === 1) {
					const user = uni.getStorageSync('userInfo')
					this.wenpiao = user.the_documents
					const chartsData = []
					this.hourTimeLabels = [] 
					if(res.data.length == 0) {
						return
					}// 清空时间标签数组
					
					// 获取最新的6个数据点（不需要反转）
					const displayData = res.data.slice(-6)
					
					// 处理数据
					displayData.forEach(i => {
						this.hourTimeLabels.push(this.formatTime(i.date))
						chartsData.push(this.formatNumber(i.money))
					})

					console.log('图表数据:', {
						categories: this.hourTimeLabels,
						series: chartsData
					})
					
					this.wenpiaoData = res.data.reverse() // 保持列表数据的原始顺序
					setTimeout(() => {
						const chartData = {
							categories: this.hourTimeLabels,
							series: [{
								name: "价格",
								data: chartsData,
								color: "#F34443"
							}]
						};
						this.drawCharts('priceChart', chartData);
					}, 300)
				}
			})
		},
		getCanshu() {
			zhexiantucanshu({
				uid:uni.getStorageSync('uid')
			}).then(res => {
				if(res.code === 1) {
					this.wenpiaoCanshu = res.data || {};
				}
			}).catch(err => {
				console.error('获取参数失败:', err);
				this.wenpiaoCanshu = {};
			})
		},
		toExchangeRecord() {
			uni.navigateTo({
				url: '/pages/bundle/user_bill/user_bill?type=1&score=8'
			})
		},
		switchTimeType(type) {
			if (this.timeType !== type) {
				this.timeType = type
				// 切换时重新获取数据
				// this.getServerData();
				
				// 更新价格
				if (type === 'day') {
					this.price = '126.3200'
				} else {
					this.price = '135.8544'
				}
			}
		},
		drawCharts(id, data) {
			// 计算Y轴的最大最小值
			const values = data.series[0].data.map(v => parseFloat(v));
			const min = Math.min(...values);
			const max = Math.max(...values);
			const padding = (max - min) * 0.1; // 上下留10%的空间

			// 如果只有一条数据，调整Y轴的最大值
			const adjustedMax = data.categories.length <= 3 ? max + 1 : max + padding;
			const adjustedMin = data.categories.length <= 3 ? Math.max(0, min - 1) : Math.max(0, min - padding);

			const ctx = uni.createCanvasContext(id, this);
			uChartsInstance[id] = new uCharts({
				type: "line",
				context: ctx,
				width: this.cWidth,
				height: this.cHeight,
				categories: data.categories,
				series: data.series,
				animation: true,
				background: "#FFFFFF",
				color: ["#F34443"],
				padding: [15, 5, 15, 0],  // 减少下方padding
				enableScroll: false,
				legend: {
					show: false
				},
				xAxis: {
					disableGrid: true,
					fontColor: "#999999",
					axisLine: true,
					axisLineColor: "#CCCCCC",
					calibration: true,
					itemCount: 6,
					fontSize: 11,
					margin: 4,
					rotateLabel: true,
					boundaryGap: "center",  // 设置边界间隔
					width: this.cWidth * 0.95  // 控制X轴宽度
				},
				yAxis: {
					gridType: "dash",
					dashLength: 4,
					splitNumber: 4,
					gridColor: "#CCCCCC",
					format: "val",
					data: [{
						min: adjustedMin,
						max: adjustedMax,
						tofix: 2,
						unit: '',
						labelCount: 4,
						fontSize: 10
					}],
					fontColor: "#999999",
					axisLine: true,
					axisLineColor: "#CCCCCC",
					fontSize: 10,
					width: 25
				},
				extra: {
					line: {
						type: "straight",
						width: 2,
						activeType: "hollow"
					},
					tooltip: {
						showBox: true,
						showArrow: true,
						borderWidth: 1,
						borderColor: "#F34443",
						borderRadius: 4,
						bgColor: "#FFFFFF",
						fontColor: "#666666",
						fontSize: 11,
						padding: 8
					}
				}
			});
		},
		tap(e) {
			uChartsInstance[e.target.id].touchLegend(e);
			uChartsInstance[e.target.id].showToolTip(e);
		},
		formatNumber(value) {
			if (value === undefined || value === null || value === '') return '--';
			const num = parseFloat(value);
			if (isNaN(num)) return '--';
			return num.toFixed(2);
		},
		formatTime(dateStr) {
			if (!dateStr) return '--';
			const time = dateStr.split(' ')[1];  // 分割日期字符串，获取时间部分
			if (!time) return '--';
			return time.substring(0, 5);  // 只返回时:分
		},
		toWithdraw() {
			uni.navigateTo({
				url:'/pages/bundle/user_withdraw/user_withdraw?type=wp'
			})
			// uni.navigateTo({
			// 	url: '/pages/bundle/wenpiao/withdraw'
			// })
		}
	}
}
</script>

<style>
.wenpiao-container {
	background-color: #f9f6f1;
	min-height: 100vh;
	position: relative;
	padding-bottom: 50px;
}

.header {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 44px;
	position: relative;
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

.price-section {
	padding: 15px;
	position: relative;
}

.price-indicator {
	color: #f34443;
	font-size: 14px;
	position: relative;
	padding-left: 20px;
}

.price-indicator::before {
	content: '';
	position: absolute;
	left: 0;
	top: 50%;
	transform: translateY(-50%);
	width: 16px;
	height: 2px;
	background-color: #f34443;
}

.current-price {
	margin-top: 10px;
	font-size: 16px;
}

.time-buttons {
	position: absolute;
	right: 15px;
	top: 15px;
	display: flex;
	border-radius: 4px;
	overflow: hidden;
	border: 1px solid #dddddd;
}

.time-btn {
	padding: 6px 12px;
	font-size: 12px;
	background-color: #f5f5f5;
}

.time-btn.active {
	background-color: #f34443;
	color: #ffffff;
}

.data-list-section {
	margin: 15px;
	background-color: #ffffff;
	border-radius: 8px;
	overflow: hidden;
}

.list-header {
	display: flex;
	background-color: #f5f5f5;
	padding: 12px 15px;
	border-bottom: 1px solid #eeeeee;
}

.header-item {
	flex: 1;
	text-align: center;
	font-size: 14px;
	color: #333;
	font-weight: 500;
}

.list-content {
	height: 300rpx;
	position: relative;
}

.list-item {
	display: flex;
	padding: 12px 15px;
	border-bottom: 1px solid #eeeeee;
}

.item-date, .item-money {
	flex: 1;
	text-align: center;
	font-size: 14px;
	color: #666;
}

.total-section {
	margin: 15px 15px 15px;
	background-color: #f34443;
	border-radius: 8px;
	color: #ffffff;
	padding: 20px;
	text-align: center;
}

.period {
	font-size: 14px;
}

.total-amount {
	font-size: 28px;
	font-weight: bold;
	margin: 10px 0;
}

.total-label {
	font-size: 14px;
}

.price-formula {
	margin-top: 15px;
	padding-top: 15px;
	border-top: 1px solid rgba(255, 255, 255, 0.3);
}

.formula-item {
	display: block;
	font-size: 14px;
	margin-bottom: 5px;
}

.exchange-section {
	margin: 15px;
	background-color: #ffffff;
	border-radius: 8px;
	padding: 15px;
}

.exchange-input {
	display: flex;
	align-items: center;
	padding: 12px 0;
	border-bottom: 1px solid #eeeeee;
}

.exchange-label {
	font-size: 14px;
	color: #333;
	width: 80px;
}

.exchange-amount {
	flex: 1;
	font-size: 14px;
}

.hint-section {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 15px;
}

.hint {
	font-size: 12px;
	color: #999;
}

.action-buttons {
	display: flex;
	align-items: center;
}

.exchange-record, .withdraw-btn {
	font-size: 12px;
	color: #333;
	display: flex;
	align-items: center;
	margin-left: 15px;
}

.icon-right {
	margin-left: 5px;
}

.confirm-btn {
	margin: 15px;
	background-color: #f34443;
	border-radius: 25px;
	height: 50px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #ffffff;
	font-size: 16px;
	left: 0;
	right: 0;
}

.chart-container {
	margin: 15px 0;
	background-color: #ffffff;
	border-radius: 8px;
	padding: 15px 0;
	height: 500rpx;
	width: 100%;
	overflow: hidden;
	position: relative;
}

.chart-wrapper {
	width: 100%;
	height: 100%;
}

.charts {
	width: 100%;
	height: 100%;
}

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 40rpx 0;
	height: 100%;
}

.empty-icon {
	width: 160rpx;
	height: 160rpx;
	margin-bottom: 20rpx;
}

.empty-text {
	font-size: 28rpx;
	color: #999;
}
</style>