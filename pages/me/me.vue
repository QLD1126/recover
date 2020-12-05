<template>
	<view class="container">
		<image src="../../static/bgjb.png" class="bg" mode=""></image>
		<view class="">
			<view class="top" :style="userInfo.open_pay==1?'':'height: 215rpx;'">
				<view class="flex_between">
					<view class="">
						<image @click="lookPic(userInfo.avatar)" :src="userInfo.avatar" mode=""></image>
						<text>{{userInfo.nickname}}</text>
					</view>
					<view class="">
						<text>{{userInfo.phone}}</text>
						<!-- <text class="iconfont icon-fanhuizuojiantouxiangzuoshangyibuxianxing"></text> -->
					</view>
				</view>
				<!-- 我的环保币 -->
				<view class="box_702 flex_between" v-if="userInfo.open_pay==1">
					<view class="" @click="toPage('rechange')">
						<text>我的环保币:{{userInfo.integral||0}}</text>
						<view class="">
							充值
						</view>
					</view>
					<view>
						<text @click="toPage('list')">环保币记录</text>
						<view class="" @click="toPage('getmoney')">
							提现
						</view>
					</view>
				</view>
			</view>
			<!-- 主体 -->
			<view class="main">
				<view class="ul_list">
					<view class="" v-for="(item,index) in ulArr" :key='index' @click="toPage('page',item.url)" :style="userInfo.open_pay==1?'':'margin-top:2vh'">
						<view class="">
							<!-- <image src="" mode=""></image> -->
							<image class="icon_44" :src="item.img" mode=""></image>
							<text>{{item.title}}</text>
						</view>
						<text class="iconfont icon-fanhuizuojiantouxiangzuoshangyibuxianxing"></text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				ulArr: [{
					img: '../../static/jdjl.png',
					title: '我的接单记录',
					url: './recive_order/recive_order'
				}],
				userInfo: uni.getStorageSync('USERINFO'),
			};
		},
		onShow() {
			this.getUserinfo()
		},
		methods: {
			getUserinfo() {
				this.$apis.USERINFO().then(res => {
					this.userInfo = res
					uni.setStorageSync('USERINFO', res)
				})
			},
			lookPic(url) {
				uni.previewImage({
					urls: url
				})
			},
			toPage(type, url) {
				switch (type) {
					//动态的路径要加./,
					case 'rechange':
						if (this.userInfo.open_pay == 1) {
							uni.navigateTo({
								url: 'rechange/rechange',
							})
						} else {
							uni.showModal({
								title: '提示',
								content: '暂未开启',
								showCancel: false
							})
						}
						break;
					case 'getmoney':
						if (this.userInfo.open_pay == 1) {
							uni.navigateTo({
								url: 'get_money/get_money'
							})
						} else {
							uni.showModal({
								title: '提示',
								content: '暂未开启',
								showCancel: false
							})
						}
						break;
					case 'page':
						uni.navigateTo({
							url: url,
						})
						break;
					case 'list':
						// 交易记录
						uni.navigateTo({
							url: 'reansa_list/reansa_list',
						})
						break;
				}
			},
		},
		onPullDownRefresh() {
			setTimeout(()=>{
				this.getUserinfo()
				uni.stopPullDownRefresh()
			},1000)
		}
	}
</script>

<style lang="scss">
	.container {
		background: rgba(0, 0, 0, 0);
	}

	.bg {
		width: 100vw;
		height: 427rpx;
		position: absolute;
		top: -50rpx;
		z-index: -1;
	}

	.top {
		width: 710rpx;
		height: 300rpx;
		padding: 20rpx;
		position: relative;

		.flex_between:first-child {
			margin-top: 8vh;
			color: #fff;
			font-size: 28rpx;

			image {
				width: 88rpx;
				height: 88rpx;
				border-radius: 50%;
				margin-right: 20rpx;

				+text {
					position: relative;
					top: -38rpx;
				}
			}

			>view {
				height: 88rpx;
				line-height: 88rpx;

			}
		}

		.box_702 {
			padding: 40rpx;
			background: #fff;
			font-size: 28rpx;
			border-radius: 10rpx;
			/* align-items: center; */
			margin-top: 130rpx;
			position: absolute;
			width: 630rpx;
			bottom: -90rpx;
			box-shadow: -1rpx 10rpx 10rpx #f3f3f3;

			>view {
				>text {
					display: block;
					color: #FBA914;
					margin-bottom: 20rpx;
				}

				>view {
					text-align: center;
					width: 136rpx;
					height: 36rpx;
					line-height: 36rpx;
					background: #fba914;
					border-radius: 18px;
					color: #fff;
					margin: 0 auto;
				}
			}
		}
	}

	.main {
		>view {
			background-color: #fff;
		}

		>.ul_list {
			>view {
				width: 710rpx;
				height: 106rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 20rpx;
				margin-top: 100rpx;

				>view {
					>image {
						width: 44rpx;
						height: 44rpx;
						// margin-top: 10rpx;
						position: relative;
						top: 10rpx;
					}

					+text {
						font-size: 26rpx;
					}
				}

			}
		}
	}
</style>
