<template>
	<view class="nodata">
		<image :src="image" mode=""></image>
		<!-- <image :src="image" mode=""></image> -->
		<view class="c_28_888">{{description}}</view>
		<view class="btn_2_88" @click="toPage" v-if="hasBtn">
			{{ btnContent }}
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			description: {
				type: String,
				default: '暂无数据'
			},
			image: {
				type: String,
				default: '/static/zwdd.png'
			},
			hasBtn: {
				type: Boolean,
				default: false
			},
			btnContent: {
				type: String,
				default: '去逛逛'
			},
			// 是否执行组件事件
			native: {
				type: Boolean,
				default: true
			}
		},
		methods: {
			toPage() {
				// console.log('我是子组件')
				if (this.native) {
					uni.switchTab({
						url: '/pages/shop/shop'
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	// 列表无数据
	.nodata {
		// height: 100vh;
		width: 100vw;
		text-align: center;
		background: #f3f3f3;
		>image {
			width: 547rpx;
			height: 342rpx;
			margin-top: 20vh;

			+view {
				color: #ccc;

				+view {
					width: 318rpx;
					margin: 0 auto;
					margin-top: 100rpx;
				}

			}
		}
		.btn_2_88{
			display: inline-block;
			padding: 0 40rpx;
			height: 88rpx;
			line-height: 88rpx;
			border-radius: 44rpx;
			color: #fff;
			text-align: center;
			background: #23CED7;
			font-size: 32rpx;
		}
	}
</style>
