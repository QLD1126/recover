<template>
	<view class="container">
		<view class="flex_between_list flex_between">
			<text class="s_title">充值方式 </text>
			<view class="">
				<image class="icon_44" src="../../../static/weixinzhifu@2x.png" mode=""></image>
				<text class="">微信</text>
			</view>
		</view>
		<view class="">
			<view class="flex_between_list">
				<text class="s_title">充值金额</text>
			</view>
			<view class="flex_between_list flex_between">
				<text class="bolder">￥</text>
				<input type="text" value="" />
			</view>
		</view>
		<view class="btn btn_bule">
			确认充值
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
.container{
	height: 100vh;
	>view{
		margin-bottom: 20rpx;
	}
	.bolder{
		font-size: 48rpx;
		font-weight: bold;
		color: 323232;
		+input{
			width: 88%;
			height: 100%;
			// background: #007AFF;
		}
	}
	.flex_between_list{
		border: none;
	}
	.btn{
		margin: 100rpx auto;
		width: 464rpx;
		margin-top: 101rpx;
		border-radius:44rpx ;
	}
}
</style>
