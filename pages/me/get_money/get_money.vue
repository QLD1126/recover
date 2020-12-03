<template>
	<view class="main">
		<view class="model top">
			<image src="../../../static/bgjb.png" mode="" class="model"></image>
			<view class="">
				<view class="ewm_btn" @click="toPage">
					设置收款码
				</view>
				<view class="t_28_f">
					余额（元）
				</view>
				<view class="">
					￥{{info.integral}}
				</view>
			</view>
		</view>
		<view class="flex_between">
			<text class="s_title">提款金额</text>
			<text class="c_28_888" @click="money=info.integral">全部</text>
		</view>
		<view class="">
			<input class="input" type="digit" v-model="money" placeholder="请输入提现金额（1元起提）" :disabled="info.integral=='0.00'?true:false" />
		</view>
		<view class="s_title">
			到账方式
		</view>
		<view class="flex_between">
			<view class="">
				<image src="../../../static/wxdz.png" class="icon_44" mode=""></image>
				<text class="">提现到微信</text>
			</view>
			<view class="">
				<radio checked="true" /><text></text>
			</view>
		</view>
		<view class="btn_line" @click="sure">
			提交申请
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info: uni.getStorageSync('USERINFO'),
				money: ''
			};
		},
		methods: {
			sure() {
				uni.showLoading({

				})
				this.$apis.EXPORT_MONEY({
					money: this.money
				}).then((res) => {
					this.getUserinfo()

				})
			},
			getUserinfo() {
				this.$apis.USERINFO().then(res => {
					this.info = res
					uni.setStorageSync('USERINFO', res)
					// uni.hideLoading()
					uni.showToast({
						title: '申请提现成功!'
					})
				})
			},
			toPage() {
				uni.navigateTo({
					url: '../setEwm/setEwm'
				})
			}
		}
	}
</script>

<style lang="scss">
	.icon_44 {
		margin-right: 10rpx;
	}

	.main {
		>view {
			width: 702rpx;
			margin: 0 auto;
		}

		.flex_between {
			background: #fff;
			width: 700rpx;
			padding: 0rpx 25rpx;
			height: 106rpx;
			line-height: 106rpx;
			// margin-bottom: 40rpx;
		}

		.icon {
			width: 40rpx;
			height: 40rpx;
			margin-right: 20rpx;

			+text {
				font-size: 28rpx;
				font-weight: bold;
			}
		}

		.btn {
			width: 464rpx;
			// margin-top: 318rpx;
			position: absolute;
			left: 143rpx;
			bottom: 100rpx;
		}

		.btn_line {
			width: 464rpx;
			margin-top: 10vh;
		}

		.input {
			padding: 40rpx;
			padding-left: 20rpx;
			margin-bottom: 60rpx;
		}

		.top {
			position: relative;
			width: 702rpx;
			height: 286rpx;
			margin-bottom: 60rpx;

			>image {
				position: absolute;
				top: 0;
				width: 100%;
				height: 100%;
				// z-index: -1;
			}

			>view {
				width: 100%;
				position: absolute;
				top: 0;
				padding: 60rpx 0;
				text-align: center;

				>view {
					margin: 0 auto;
				}

				.ewm_btn {
					width: 156rpx;
					height: 52rpx;
					line-height: 52rpx;
					background: #ffffff;
					border-radius: 26rpx;
					color: #23CED7;
					font-size: 24rpx;
					position: absolute;
					top: 30rpx;
					right: 30rpx;

				}

				>view:last-child {
					font-size: 60rpx;
					font-weight: bold;
					color: #fff;
					margin-top: 60rpx;
				}
			}
		}
	}
</style>
