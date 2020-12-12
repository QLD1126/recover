<template>
	<me-empty v-if="datalist.length<1"></me-empty>
	<view class="container" v-else>
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
		<uni-load-more :status="loadState"></uni-load-more>
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
				loadState:'more',
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
				Object.assign(params, {
					page: 1,
				})
				this.$apis.BILL(params).then(res => {
					this.datalist = res
					this.loadState = res.length < params.limit ? 'noMore' : 'more'
					uni.hideLoading()
				})
			},
			
			loadMore(params) {
				this.$apis.BILL(params).then(res => {
					this.datalist = this.datalist.concat(res)
					this.loadState = res.length < params.limit ? 'noMore' : 'more'
					uni.hideLoading()
				})
			},
		},
		onReachBottom() {
			if (this.loadState !== 'noMore') {
				this.loadState = 'loading'
				this.params.page++
				this.loadMore(this.params)
			}
		},
	}
</script>

<style lang="scss">
	.container {
		padding-top: 1rpx;
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
