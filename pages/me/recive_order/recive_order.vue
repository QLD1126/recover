<template>
	<view class="container">
		<view class="model_jiedan">
			<view class="flex_between">
				<text>订单编号：20200928123456</text>
				<text>新订单</text>
			</view>
			<view class="">
		
				<view class="">
					重量：20kg
				</view>
				<view class="">
					服务地址：四川省成都市武侯区天府大道北段 1903号
					<image src="../../static/dizhi_s.png" mode="" class="icon_44"></image>
				</view>
				<view class="">
					距离：300m
				</view>
			</view>
			<view class="">
				<view class="btn btn_bule" v-if="1==1">
					确认接单
				</view>
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

</style>
