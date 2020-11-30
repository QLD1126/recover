<template>
	<view class="main">
		<view class="model top">
			<image src="../../../static/bgjb.png" mode="" class="model"></image>
			<view class="">
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
			<text class="c_28_888">全部</text>
		</view>
		<view class="">
			<input class="input" type="text" value="" placeholder="请输入提现金额（1元起提）"/>
		</view>
		<view class="s_title">
			到账方式
		</view>
		<view class="flex_between">
			<view class="">
				<image src="../../../static/wxdz.png" class="icon_44" mode=""></image>
				<text>提现到微信</text>
			</view>
			<!-- <label class="radio"> -->
			<view class="">
				<radio value="" /><text></text>
				<radio value="" /><text></text>
			</view>
			<!-- </label> -->
		</view>
		<view class="btn_line">
			提交申请
		</view>
	</view>
</template>

<script>
	import api from '../../../common/api/api.js'
	export default {
		data() {
			return {
info:uni.getStorageSync('USERINFO')
			};
		},
		onShow() {
			
		}
	}
</script>

<style lang="scss">
	.main {
		>view {
			width: 702rpx;
			margin: 0 auto;
		}
		.flex_between{
			background: #fff;
			width: 700rpx;
			padding: 0rpx 25rpx;
			height: 106rpx;
			line-height: 106rpx;
			// margin-bottom: 40rpx;
		}
		.icon_44{
			margin-right: 20rpx;
			+text{
				font-size: 28rpx;
				font-weight: bold;
			}
		}
		.btn_line{
			width: 464rpx;
			margin-top: 318rpx;
		}
		.input{
			padding: 40rpx;
			padding-left: 20rpx;
			margin-bottom: 60rpx;
		}
		.top {
			position: relative;
			width: 702rpx;
			height: 286rpx;
			// margin-bottom: 60rpx;
			margin: 20rpx auto 60rpx;
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
