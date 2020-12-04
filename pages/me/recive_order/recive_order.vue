<template>
	<view class="container">
		<view class="nodata" v-if="datalist.length==0">
			<image src="../../../static/zwdd.png" mode=""></image>
			<text class="c_28_888">暂时没有订单</text>
		</view>
		<view class="model_jiedan" v-for="item in datalist" :key='item.id'>
			<view class="flex_between">
				<text>订单编号：{{item.order_id}}</text>
				<text :style="(params.status==2||params.status==-1)?'color:#666':'color:#2E8EF4'">{{item.status==0?'新订单':item.status==1?'已接单':item.status==2?'已完成':'已取消'}}</text>
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
					<image @click="toPage('map',item)" src="../../../static/dizhi_s.png" v-if="item.status==1" mode="" class="icon_44"></image>
				</view>
				<view class="">
					详细地址：{{item.user_address}}
				</view>
			</view>
			<view class="" v-if="item.status==1">
				<view class="btn btn_bule"  @click="showProp(item)">
					确认回收
				</view>
			</view>
		</view>
		<!-- 弹出层 -->
		<van-popup class='middle_prop' :show='show' closeable @close="show=false" round>
			<!-- 余额不足 -->
			<view class="middle_text" v-if="prop=='余额'">
				<view class="prop_top">

				</view>
				<view class="prop_content">
					<text class="putongtext" style="display: block;margin-top: 150rpx;">余额不足，请前往充值</text>
				</view>
				<view class="prop_bottom">
					<view class="btn btn_bule" style="width: 340rpx;margin-bottom: 50rpx;" @click="toPage('rechange')">
						立即充值
					</view>
				</view>
			</view>
			<!-- 输入 -->
			<view class="middle_text" v-else>
				<view class="prop_top">

				</view>
				<view class="prop_content">
					<view class="" style="margin-top: 150rpx;">
						<view class="hasinput">
							
						<text class="putongtext hsz">请输入回收值：</text><input type="number" v-model="formdata.integral"/>
						</view>
						<view class="hasinput" style="margin-top: 60rpx;">
						<text class="putongtext hsz" >请输入回收重量(kg)：</text><input type="number" v-model="formdata.weight" />
						</view>
					</view>
				</view>
				<view class="prop_bottom">
					<view class="btn btn_bule" style="width: 340rpx;margin-bottom: 50rpx;" @click="complate(formdata)">
						确定
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
				params: {
					page: 1,
					limit: 10,
					status: '1,2,-1',
				},
				formdata: {
					integral:'',
					weight:'',
				},
				hasMore: true,
				datalist: [],
				loginshow: false,
				show: false,
				prop:''
			};
		},
		onLoad() {
			this.getList(this.params)
		},
		methods: {
			toPage(type,obj){
					switch (type) {
						case 'rechange':
							uni.navigateTo({
								url: '../rechange/rechange'
							})
							break;
						case 'map':
							let plugin = requirePlugin('routePlan');
							let key = 'XNJBZ-MEN64-OA7U7-DARCN-MKFNO-6RFFS';
				
							//使用在腾讯位置服务申请的key
							let referer = '旧衣服回收捐赠爱心哥'; //调用插件的app的名称
							let endPoint = JSON.stringify({ //终点
								'name': obj.user_address,
								'latitude': obj.user_latitude,
								'longitude': obj.user_longitude
							});
							uni.navigateTo({
								url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint + '&navigation=1'
							})
							break;
					}
			},
			showProp(obj) {
				this.show = true
				this.prop = '回收'
				Object.assign(this.formdata, {
					id: obj.order_id,
				})
			},
			complate(data) {
				this.$apis.RECYCLE_COMPLATE(data.id, data).then(res => {
					this.show = false
					this.getList(this.params)
				}).catch(err => {
					console.log(err, 'err')
					this.prop = '余额'
				})
			},
			sure(id) {
				this.$apis.RECYCLE_SURE(id).then(() => {
					// this.params.status = 1
					this.getList(this.params)
				})
			},
			getList(params) {
				uni.showLoading({

				})
				this.datalist = []
				this.hasMore = true
				Object.assign(params, {
					page: 1,
					limit: 10
				})
				this.$apis.RECYLE_LIST(params).then(res => {
					if (res.length < params.limit) {
						this.hasMore = false
					}
					this.datalist = res
					uni.hideLoading()
				})
			},
			loadMore(params) {
				this.$apis.RECYLE_LIST(params).then(res => {
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
				if(this.datalist.length==0){
					return
				}
				uni.showToast({
					title: '已加载全部',
					icon: 'none'
				})
			}
		},
	}
</script>

<style lang="scss">
	.container{
		    height: 98.1vh;
	}
.model_jiedan {
	margin-top: 0;
	.flex_between {
		+ view{
			padding: 0;
			border-bottom: none;
			>view{
				margin-top:40rpx;
			}
		}
	}
	>view:last-child{
		border-top: 1rpx solid #f3f3f3;
	}
}

</style>
