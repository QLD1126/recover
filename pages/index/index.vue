<template>
	<view class="container">
		<view class="top">
			<view class="flex_between">
				<view class="">
					<image class="icon_44" src="../../static/dz.png" mode=""></image>
					<text>当前位置：成都市</text>
				</view>
				<view class="">
					<van-switch :checked=" true" size="28rpx" active-color='#06C261' />
					<text>回收状态</text>
				</view>

			</view>
			<view class="tabbar">
				<view class="" v-for='(item,index) in titleArr' :key='index'>
					<text>{{item.title}}</text>
					<view :class="1==1?'white':'bule'">

					</view>
				</view>
			</view>
		</view>

		<image src="../../static/zwdd.png" mode="" v-if="1==2"></image>
		<view v-else>
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
					<view class="btn btn_bule" v-if="1==2">
						确认接单
					</view>
					<view class="btn btn_bule" style="background: #ccc;" v-else>
						删除订单
					</view>
				</view>
			</view>
		</view>
		<!-- 弹出层 -->
		<van-popup class='middle_prop' :show='show' closeable @close="onClose">
			<!-- 余额不足 -->
			<view class="middle_text" v-if="prop=='余额'">
				<view class="prop_top">

				</view>
				<view class="prop_content">
					<text class="putongtext" style="display: block;margin-top: 150rpx;">余额不足，请前往充值</text>
				</view>
				<view class="prop_bottom">
					<view class="btn btn_bule" style="width: 340rpx;margin-bottom: 50rpx;">
						立即充值
					</view>
				</view>
			</view>
			<!-- 位置 -->
			<view class="middle_text" v-else-if="prop=='位置'">
				<view class="prop_title">
					位置授权
				</view>
				<view class="prop_content">
					<text class="c_28_888">
						请现在授权设置页面授权获取位置 否则无法进行下一步
					</text>
				</view>
				<view class=" prop_bottom">
					<view class="btn btn_green">
						打开授权设置页
					</view>
				</view>
			</view>
			<!-- 输入 -->
			<view class="middle_text" v-else>
				<view class="prop_top">

				</view>
				<view class="prop_content">
					<view class="" style="margin-top: 150rpx;">
						<text class="putongtext hsz">请输入回收值：</text><input type="text" value="" />
					</view>
				</view>
				<view class="prop_bottom">
					<view class="btn btn_bule" style="width: 340rpx;margin-bottom: 50rpx;">
						立即充值
					</view>
				</view>
			</view>
	</view>
	</van-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				titleArr: [{
						title: '未接单',
						type: '1'
					},
					{
						title: '已接单',
						type: '2'
					},
					{
						title: '已完成',
						type: '3'
					},
					{
						title: '已取消',
						type: '4'
					}
				],
				show: false,
				prop: 'zz'
			}
		},
		onLoad() {

		},
		methods: {
			onClose() {
				this.show = false
			}

		}
	}
</script>

<style lang="scss">
	.hsz {
		+input {
			width: 282rpx;
			height: 48rpx;
			background: #f3f3f3;
			border-radius: 4rpx;
			display: inline-block;
			position: relative;
			top: 20rpx;
		}
	}

	.container {
		>.top {
			background-color: #2E8EF4;
			width: 96vw;
			padding: 2vw;
			color: #fff;

			.flex_between {
				margin-top: 10vh;

				image {
					width: 44rpx;
					height: 44rpx;
					position: relative;
					top: 10rpx;
				}
			}

			>.tabbar {
				width: 100%;
				background: #2E8EF4;
				position: relative;
				justify-content: space-between;

				.white {
					background: #fff;
				}
			}

			+image {
				margin: 261rpx auto;
				width: 547rpx;
				height: 342rpx;
				display: block;


			}


		}


	}

	.middle_prop {
		.ye {
			margin-top: 149rpx;
			margin-bottom: 80rpx;
			display: block;

		}

		// .middle_text{
		// 	height: 404rpx;
		// }
	}
</style>
