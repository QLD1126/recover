<template>
	<view class="container">
		<view class="model_jiedan" v-for="item in datalist">
			<view class="flex_between">
				<text>订单编号：{{item.order_id}}</text>
				<text>新订单</text>
			</view>
			<view class="">
				<view class="">
					联系人姓名：{{item.real_name}}
				</view>
				<view class="">
					联系人电话：{{item.user_phone}}
				</view>
				<view class="">
					类型：{{item.category}}
				</view>
				<view class="">
					重量：{{item.weight}}kg
				</view>
				<view class="dizhi">
					服务地址：
					<text>
						{{item.user_location}}
					</text>
				</view>
				<view class="">
					详细地址：{{item.user_address}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import api from '../../../common/api/api.js'
	export default {
		data() {
			return {
				params: {
					page: 1,
					limit: 10,
					status: '1,2,-1',
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
				this.datalist = []
				this.hasMore = true
				Object.assign(params, {
					page: 1,
					limit: 10
				})
				api.RECYLE_LIST(params).then(res => {
					if (res.length < params.limit) {
						this.hasMore = false
					}
					this.datalist = res
					uni.hideLoading()
				})
			},
			loadMore(params) {
				api.RECYLE_LIST(params).then(res => {
					if (res.length < params.limit) {
						this.hasMore = false
					}
					this.datalist = this.datalist.concat(res)
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

</style>
