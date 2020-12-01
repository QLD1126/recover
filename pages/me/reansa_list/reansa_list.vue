<template>
	<view class="container">
		<view class="flex_between" v-for="item in datalist" :key='item.id'>
			<view class="">
				<view class="a">
					{{item.title}}
				</view>
				<view class="c_28_888">
					<!-- 2020-08-28 15:25:13 -->
					{{item.time}}
				</view>
			</view>
			<view :class="item.pm==1?'red':'blue'">
				{{item.pm==1?'+':'-'}}{{item.number}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				params: {
					page: 1,
					limit: 10,
					status: null,
				},
				hasMore: true,
				datalist: [],
			};
		},
		onLoad() {
			this.getList(this.params)
		},
		methods: {
			getList(params) {
				uni.showLoading({

				})
				// if()
				this.datalist = []
				this.hasMore = true
				Object.assign(params, {
					page: 1,
					limit: 10
				})
				this.$apis.BILL(params).then(res => {
					if (res.length < params.limit) {
						this.hasMore = false
					}
					this.datalist = res
					uni.hideLoading()
				})
			},
			
			loadMore(params) {
				this.$apis.BILL(params).then(res => {
					if (res.length < params.limit) {
						this.hasMore = false
					}
					this.datalist = this.datalist.concat(res)
					// console.log('我触底了',)
					uni.hideLoading()
				})
			},
		},
		onReachBottom() {
			if (this.hasMore) {
				uni.showLoading({})
				this.params.page++
				// console.log(this.params, 11)
				this.loadMore(this.params)
			} else {
				uni.showToast({
					title: '已加载全部',
					icon: 'none'
				})
			}
		},
	}
</script>

<style lang="scss">
	.container {
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

		.blue {
			font-size: 32rpx;
			font-weight: bold;
			color: #2E8EF4;
		}
		.red{
			font-size: 32rpx;
			font-weight: bold;
			color: red;
		}
	}
</style>
