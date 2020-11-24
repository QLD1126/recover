<template>
	<view class="container">
		<view class="flex_between">
			<view class="">
				<view class="a">
					回收获得
				</view>
				<view class="c_28_888">
					2020-08-28 15:25:13
				</view>
			</view>
			<view class="blue">
				+50
			</view>
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
		padding-top: 10rpx;
	}
	.flex_between {
		// width: 650rpx;
		margin: 20rpx 0;
		padding: 40rpx 25rpx;
		background: #fff;

		.a {
			position: relative;
			top: -10rpx;
		}
		.c_28_888 {
			position: relative;
			top: 20rpx;
		}
		.blue{
			font-size: 32rpx;
			font-weight: bold;
			color: #2E8EF4;
		}
	}
</style>
