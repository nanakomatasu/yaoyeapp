<template>
	<view class="user-withdraw">
		<view class="user-tab-container">
			<template v-if="tixianType == 'wp'">
				<view class="bg-white form-container">
					<view class="input-item row md">
						<view class="input-label ">姓名</view>
						<input v-model="exchangeName" placeholder="请输入姓名"></input>
					</view>
					<view class="input-item row md">
						<view class="input-label ">交易所账号</view>
						<input v-model="exchangeAccount" placeholder="请输入交易所账号"></input>
					</view>
				</view>
				<view class="bg-white withdraw-container mt20">
					<view class="input row-center">
						<input v-model="money" placeholder="0.00"></input>
						<view class="column" style="flex: none;">
							<view class="xs" style="color: #BBBBBB" v-if="tixianType == 'wp'">
								可提现文票{{wenpiao}}张
							</view>
						</view>
					</view>
				</view>
				<view class="withdraw-btn bg-primary lg white row-center" @tap="applyWithdrawFun(1)">
					确认</view>
				<navigator :url="recordUrl" hover-class="none" class="mt20 nr lighter row-center">记录</navigator>
			</template>
			<!-- 			非文票提现 -->
			<tabs :active="active" :line-width="40" @change="onChange" :config="{itemWidth: 200}"
				v-if="tixianType != 'wp'">
				<tab :title="item.name == '钱包余额' ?  '补贴积分' : item.name" :name="item.value"
					v-for="(item, index) in widthDrawWay" :key="index">
					<template v-if="item.value == 1 || item.value == 2">
						<view class="bg-white form-container" v-if="item.value == 1">
							<view class="input-item row md">
								<view class="input-label ">姓名</view>
								<input v-model="exchangeName" placeholder="请输入姓名"></input>
							</view>
							<view class="input-item row md">
								<view class="input-label ">交易所账号</view>
								<input v-model="exchangeAccount" placeholder="请输入交易所账号"></input>
							</view>
							<view class="input-item row md" v-if="item.value == 1">
								<view class="input-label">提数权</view>
								<input v-model="money" :placeholder="exchangeTips"></input>
							</view>
							<view class="withdraw-info" v-if="item.value == 1">
								<view class="info-row">当前可提：{{butieJifen}}</view>
								<view class="info-row">手续费：{{Number(widthDrawConfig.btjftxsxf) * 100}}%</view>
								<view class="info-row">实际到账：{{actualAmount}}</view>
								<view class="info-note">说明：每笔数权的冻结期为T+1天</view>
							</view>
						</view>
						<view class="bg-white withdraw-container mt20" v-if="item.value != 1">
							<view class="input row-center">
								<!-- 								<view style="font-size: 23px;align-self: flex-end;margin-bottom: 5px"
									v-if="tixianType != 'wp'">¥</view> -->
								<input v-model="money" placeholder="0.00"></input>
								<view class="column" style="flex: none;">
									<!-- <view class="xs primary" style="text-align: right;" @tap="allWithdraw">全部提现</view> -->
									<view class="xs" style="color: #BBBBBB" v-if="item.value == 2">
										可转兑票补贴积分{{butieJifen}}
									</view>
								</view>
							</view>
						</view>
						<view class="withdraw-btn bg-primary lg white row-center" @tap="applyWithdrawFun(item.value)">
							确认</view>
						<view class="mt20 nr lighter row-center" v-if="item.value != 1" @click="navButieMingxi">记录
						</view>
						<navigator :url="recordUrl" hover-class="none" class="mt20 nr lighter row-center"
							v-if="item.value != 2">记录</navigator>
					</template>
					<template v-if="item.value == 3">
						<view class="bg-white form-container">
							<view class="input-item row md">
								<view class="input-label ">微信账号</view>
								<input v-model="account" placeholder="请输入微信账号"></input>
							</view>
							<view class="input-item row md">
								<view class="input-label ">真实姓名</view>
								<input v-model="realName" placeholder="请输入真实姓名"></input>
							</view>
							<view class="input-item row md">
								<view class="input-label ">备注</view>
								<input v-model="remark" placeholder="（选填）"></input>
							</view>
							<view class="uploader-container row mt20">
								<uploader @after-read="afterRead" :file-list="fileList" :max-upload="1"
									:deletable="true" useSlot @delete="handleDelete">
									<view>
										<view class="upload-area row-center">
											<image src="/static/images/uploader_icon.png"></image>
										</view>
										<view class="mt10 normal nr" style="line-height: 36rpx;text-align: center;">
											微信收款码</view>
									</view>
								</uploader>
							</view>
						</view>
						<view class="bg-white withdraw-container mt10">
							<view class="input row-center">
								<view style="font-size: 23px;align-self: flex-end;margin-bottom: 5px">¥</view>
								<input v-model="money" placeholder="0.00"></input>
								<view class="column" style="flex: none;">
									<view class="xs primary" style="text-align: right;" @tap="allWithdraw">全部提现</view>
									<view class="xs" style="color: #BBBBBB">
										可提现余额￥{{formatNumber(widthDrawConfig.able_withdraw)}}
									</view>
								</view>
							</view>
							<view class="tips mt10 muted row xs">
								提示：提现需扣除服务费{{formatNumber(widthDrawConfig.poundage_percent)}}%，请自行缴纳税款
								<!-- <view  class="primary ml5">¥ {{widthDrawConfig.able_withdraw}}</view> -->
							</view>
						</view>
						<view class="withdraw-btn bg-primary lg white row-center" @tap="applyWithdrawFun(item.value)">
							确认提现</view>
						<navigator url="/pages/bundle/user_withdraw_code/user_withdraw_code" hover-class="none"
							class="mt20 nr lighter row-center">提现记录</navigator>
					</template>
					<template v-if="item.value == 4">
						<view class="bg-white form-container">
							<view class="input-item row md">
								<view class="input-label ">支付宝账号</view>
								<input v-model="account" placeholder="请输入支付宝账号"></input>
							</view>
							<view class="input-item row md">
								<view class="input-label ">真实姓名</view>
								<input v-model="realName" placeholder="请输入真实姓名"></input>
							</view>
							<view class="input-item row md">
								<view class="input-label ">备注</view>
								<input v-model="remark" placeholder="（选填）"></input>
							</view>
							<view class="uploader-container row mt20">
								<uploader @after-read="afterRead" :file-list="fileList" :max-upload="1"
									:deletable="true" useSlot @delete="handleDelete">
									<view class="column-center">
										<view class="upload-area row-center">
											<image src="/static/images/uploader_icon.png"></image>
										</view>
										<view class="mt10 normal nr" style="line-height: 36rpx;text-align: center;">
											支付宝收款码</view>
									</view>
								</uploader>
							</view>
						</view>
						<view class="bg-white withdraw-container mt10">
							<view class="input row-center">
								<view style="font-size: 23px;align-self: flex-end;margin-bottom: 5px">¥</view>
								<input v-model="money" placeholder="0.00"></input>
								<view class="column" style="flex: none;">
									<view class="xs primary" style="text-align: right;" @tap="allWithdraw">全部提现</view>
									<view class="xs" style="color: #BBBBBB">
										可提现余额￥{{formatNumber(widthDrawConfig.able_withdraw)}}
									</view>
								</view>
							</view>
							<view class="tips mt10 muted row xs">
								提示：提现需扣除服务费{{formatNumber(widthDrawConfig.poundage_percent)}}%，请自行缴纳税款
								<!-- <view class="primary ml5">¥ {{widthDrawConfig.able_withdraw}}</view> -->
							</view>
						</view>
						<view class="withdraw-btn bg-primary lg white row-center" @tap="applyWithdrawFun(item.value)">
							确认提现</view>
						<navigator url="/pages/bundle/user_withdraw_code/user_withdraw_code" hover-class="none"
							class="mt20 nr lighter row-center">
							提现记录
						</navigator>
					</template>
					<template v-if="item.value == 5">
						<view class="bg-white form-container">
							<view class="input-item row md">
								<view class="input-label ">银行卡账号</view>
								<input v-model="account" placeholder="请输入银行卡账号"></input>
							</view>
							<view class="input-item row md">
								<view class="input-label ">真实姓名</view>
								<input v-model="realName" placeholder="请输入真实姓名"></input>
							</view>
							<view class="input-item row md">
								<view class="input-label ">提现银行</view>
								<input v-model="bank" placeholder="请输入提现银行"></input>
							</view>
							<view class="input-item row md">
								<view class="input-label ">银行支行</view>
								<input v-model="subbank" placeholder="请输入银行支行"></input>
							</view>
							<view class="input-item row md">
								<view class="input-label ">备注</view>
								<input v-model="remark" placeholder="（选填）"></input>
							</view>
						</view>
						<view class="bg-white withdraw-container mt10">
							<view class="input row-center">
								<view style="font-size: 23px;align-self: flex-end;margin-bottom: 5px">¥</view>
								<input v-model="money" placeholder="0.00"></input>
								<view class="column" style="flex: none;">
									<view class="xs primary" style="text-align: right;" @tap="allWithdraw">全部提现</view>
									<view class="xs" style="color: #BBBBBB">
										可提现余额￥{{formatNumber(widthDrawConfig.able_withdraw)}}
									</view>
								</view>
							</view>
							<view class="tips mt10 muted row xs">
								提示：提现需扣除服务费{{formatNumber(widthDrawConfig.poundage_percent)}}%，请自行缴纳税款
								<!-- <view class="primary ml5">¥ {{widthDrawConfig.able_withdraw}}</view> -->
							</view>
						</view>
						<view class="withdraw-btn bg-primary lg white row-center" @tap="applyWithdrawFun(item.value)">
							确认提现</view>
						<navigator url="/pages/bundle/user_withdraw_code/user_withdraw_code" hover-class="none"
							class="mt20 nr lighter row-center">
							提现记录
						</navigator>
					</template>
				</tab>
			</tabs>
		</view>
	</view>
</template>

<script>
	import {
		applyWithdraw,
		getWithdrawConfig
	} from "@/api/user";
	import {
		butieTixian,
		wenpiaoWithdraw,
		butieToduipiao
	} from "../../../api/store";
	import {
		uploadFile,
		trottle
	} from "@/utils/tools";
	import {
		baseURL
	} from '@/config/app';
	import {
		withdrawType
	} from "@/utils/type"
	export default {
		data() {
			return {
				active: 0,
				money: '',
				account: '',
				realName: '',
				bank: '',
				subbank: '',
				qrCode: '',
				remark: '',
				fileList: [],
				widthDrawConfig: {},
				widthDrawWay: [],
				butieJifen: "",
				tixianType: '',
				wenpiao: '',
				exchangeName: '',
				exchangeAccount: '',
				exchangeTips: '最低提数权94.5',
				recordUrl: '',
				zhuanduipiao: ''
			};
		},

		computed: {
			actualAmount() {
				if (!this.money) return '0.00';
				const amount = this.money * (1 - Number(this.widthDrawConfig.btjftxsxf));
				return amount.toFixed(5);
			}
		},

		components: {},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onShow() {
			const user = uni.getStorageSync('userInfo')
			console.log(user);
			this.butieJifen = user.subsidy_points
			this.wenpiao = user.extractable
		},

		onLoad: function(options) {
			console.log(options.type);
			if (options.type) {
				this.tixianType = options.type
				this.recordUrl = '/pages/bundle/wenpiao/wenpiao_record?type=' + options.type
				this.zhuanduipiao = '/pages/bundle/user_bill/user_bill?type=0&score=6'
				uni.setNavigationBarTitle({
					title: '提票'
				})
			} else {
				this.recordUrl = '/pages/bundle/wenpiao/wenpiao_record?type=' + this.tixianType
			}
			this.getWithdrawConfigFun();
			this.applyWithdrawFun = trottle(this.applyWithdrawFun, 1000, this)
		},


		methods: {
			formatNumber(value) {
				if (value === undefined || value === null || value === '') return '0.00';
				const num = parseFloat(value);
				if (isNaN(num)) return '0.00';
				return num.toFixed(2);
			},
			allWithdraw(e) {
				const {
					widthDrawConfig
				} = this;
				console.log(widthDrawConfig, "widthDrawConfig")
				this.money = this.formatNumber(widthDrawConfig.able_withdraw)
			},

			onChange(e) {
				this.active = e
				this.account = "";
				this.realName = "";
				this.qrCode = "";
				this.remark = ""
				this.fileList = [];
				this.money = ""
			},

			getWithdrawConfigFun() {
				getWithdrawConfig().then(res => {
					if (res.code == 1) {
						this.widthDrawConfig = res.data
						this.widthDrawWay = res.data.type
						this.exchangeTips = "最低提数权" + res.data.zdtxje
						if (this.tixianType == '') {
							this.widthDrawWay.push({
								name: '转兑票',
								value: 2
							})
						}
					}
				});
			},

			afterRead(e) {
				const file = e;
				uni.showLoading({
					title: '正在上传中...',
					mask: true
				});
				file.forEach(item => {
					uploadFile(item.path).then(res => {
						uni.hideLoading();
						this.fileList.push(res);
						this.qrCode = res.url;
					});
				})
			},

			handleDelete(index) {
				this.fileList.splice(index, 1)
			},

			navButieMingxi() {
				uni.navigateTo({
					url: '/pages/bundle/user_bill/user_bill?type=0&score=6'
				})
			},

			// 申请提现
			applyWithdrawFun(type) {
				let {
					active,
					account,
					realName,
					qrCode,
					remark,
					money,
					bank,
					subbank,
					widthDrawWay,
					exchangeName,
					exchangeAccount,
					tixianType
				} = this;
				console.log(realName, "###", active, "###", money);

				switch (parseInt(type)) {
					case withdrawType.ACCOUNT:
						if (!exchangeName) return this.$toast({
							title: '请输入姓名'
						})
						if (!exchangeAccount) return this.$toast({
							title: '请输入交易所账号'
						})
						break;
					case withdrawType.WECHAT:
						break
					case withdrawType.PAY_WECHAT:
					case withdrawType.PAY_ALIPAY:
						if (!account) return this.$toast({
							title: '请输入账户信息'
						})
						if (!realName) return this.$toast({
							title: '请输入真实姓名'
						})
						if (!qrCode) return this.$toast({
							title: '请上传收款码'
						})
						break;
					case withdrawType.BANK:
						if (!account) return this.$toast({
							title: '请输入账户信息'
						})
						if (!realName) return this.$toast({
							title: '请输入真实姓名'
						})
						if (!bank) return this.$toast({
							title: '请输入提现银行'
						})
						if (!subbank) return this.$toast({
							title: '请输入银行支行'
						})
				}

				if (!money || money == '0') {
					this.$toast({
						title: '请输入提现金额'
					});
					return;
				}

				const data = {
					type: widthDrawWay[active].value,
					money: money,
					account: account,
					real_name: realName,
					money_qr_code: qrCode,
					remark: remark,
					bank,
					subbank
				};

				if (tixianType == 'wp') {
					const data2 = {
						uid: uni.getStorageSync('uid'),
						money: money,
						name: exchangeName,
						account: exchangeAccount
					}
					wenpiaoWithdraw(data2).then(res => {
						if (res.code == 1) {
							this.$toast({
								title: '提交成功'
							})
							setTimeout(() => {
								uni.navigateBack()
							}, 500)
						}
					});
				} else {
					if (type == 1) {
						const data2 = {
							uid: uni.getStorageSync('uid'),
							money: money,
							name: exchangeName,
							account: exchangeAccount
						}
						butieTixian(data2).then(res => {
							if (res.code == 1) {
								this.$toast({
									title: '提交成功'
								})
								setTimeout(() => {
									uni.navigateBack()
								}, 500)
							}
						});
					} else {
						const data2 = {
							uid: uni.getStorageSync('uid'),
							money: money
						}
						butieToduipiao(data2).then(res => {
							if (res.code == 1) {
								this.$toast({
									title: '提交成功'
								})
								setTimeout(() => {
									uni.navigateBack()
								}, 500)
							}
						})
					}
				}
			}

		}
	};
</script>
<style lang="scss">
	.van-tabs .van-tabs__wrap {
		border-radius: 10rpx;
	}

	.van-tabs__line {
		background: linear-gradient(90deg, #F79C0C 0%, #FF2C3C 100%);
		bottom: 8rpx !important;
		/* width: 50rpx !important; */
		height: 6rpx !important;
		border-radius: 100rpx;
	}

	.user-withdraw {
		.user-tab-container {
			padding: 20rpx 30rpx;

			::v-deep .scroll-view-h {
				background-color: #FFFFFF;
			}

			.withdraw-container {
				padding: 52rpx 72rpx;
				border-radius: 20rpx;

				.withdraw-info {
					margin-bottom: 20rpx;
					padding: 20rpx;
					background-color: #FFF1F1;
					border-radius: 10rpx;

					.info-row {
						font-size: 28rpx;
						color: #333;
						line-height: 1.8;
					}

					.info-note {
						font-size: 24rpx;
						color: #666;
						margin-top: 10rpx;
					}
				}

				.input {
					border-bottom: $-solid-border;

					input {
						width: 100%;
						height: 94rpx;
						text-align: left;
						font-size: 66rpx;
						margin-left: 30rpx;
					}
				}
			}

			.withdraw-btn {
				background: linear-gradient(80deg, #F95F2F 0%, #FF2C3C 100%);
				line-height: 44rpx;
				height: 84rpx;
				margin-top: 30rpx;
				border-radius: 100rpx;
			}

			.form-container {
				border-radius: 20rpx;
				padding: 0 36rpx 26rpx;
				line-height: 36rpx;
				margin-top: 10rpx;

				.withdraw-info {
					margin: 20rpx 0;
					padding: 20rpx;
					background-color: #FFF1F1;
					border-radius: 10rpx;

					.info-row {
						font-size: 28rpx;
						color: #333;
						line-height: 1.8;
					}

					.info-note {
						font-size: 24rpx;
						color: #666;
						margin-top: 10rpx;
					}
				}

				.input-item {
					padding: 28rpx 0 30rpx;
					border-bottom: $-solid-border;
				}

				.input-label {
					width: 200rpx;
					text-align: left;
					line-height: 36rpx;
				}

				input {
					flex: 1;
				}

				.uploader-container {
					.upload-area {
						width: 160rpx;
						height: 160rpx;
						border: 4rpx dashed #E5E5E5;
						border-radius: 10rpx;

						image {
							width: 54rpx;
							height: 44rpx;
						}
					}
				}
			}
		}
	}
</style>