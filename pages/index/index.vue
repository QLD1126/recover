<template>
	<view class="container">
		<view class="top">
			<view class="flex_between">
				<view class="">
					<image class="icon_44" src="../../static/dz.png" mode=""></image>
					<text>当前位置：{{city}}</text>
				</view>
				<view class="">
					<van-switch :checked="userInfo.on_line" size="28rpx" active-color='#06C261' @change='setLine' class='switch' />
					<text>回收状态</text>
				</view>

			</view>
			<view class="tabbar">
				<view class="" v-for='(item,index) in titleArr' :key='index' @click="navbarTap(item.type)">
					<text>{{item.title}}</text>
					<view :class="params.status==item.type?'white':'bule'">

					</view>
				</view>
			</view>
		</view>
		<image src="../../static/zwdd.png" mode="" v-if="1==2"></image>
		<view v-else>
			<view class="model_jiedan" v-for="item in datalist" :key='item.id'>
				<view class="flex_between">
					<text>订单编号：{{item.order_id}}</text>
					<text :style="(params.status==2||params.status==-1)?'color:#666':'color:#2E8EF4'">{{params.status==0?'新订单':params.status==1?'已接单':params.status==2?'已完成':'已取消'}}</text>
				</view>
				<view class="">
					<view class="" v-if="params.status!==0">
						联系人姓名：{{item.real_name}}
					</view>
					<view class="" v-if="params.status!==0">
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
						<image src="../../static/dizhi_s.png" mode="" class="icon_44" v-if="params.status==1"></image>
					</view>
					<view class="" v-if="params.status!==0">
						详细地址：{{item.user_address}}
					</view>
					<view class="" v-if="params.status==0">
						距离：{{item.juli}}m
					</view>
				</view>
				<view class="">
					<view class="btn btn_bule" v-if="!params.status" @click="sure(item.order_id)">
						确认接单
					</view>
					<view class="btn btn_bule" v-else-if="params.status==1" @click="showProp(item)">
						确认回收
					</view>
					<view class="btn btn_bule" style="background: #ccc;" v-else @click="deleteOrder(item.order_id)">
						删除订单
					</view>
				</view>
			</view>
		</view>
		<!-- 弹出层 -->
		<van-popup class='middle_prop' :show='show' closeable @close="onClose" round>
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
						<text class="putongtext hsz">请输入回收值：</text><input type="number" v-model="formdata.integral" />
					</view>
				</view>
				<view class="prop_bottom">
					<view class="btn btn_bule" style="width: 340rpx;margin-bottom: 50rpx;" @click="complate(formdata)">
						确定
					</view>
				</view>
			</view>
		</van-popup>
		<!-- 登录 -->
		<van-action-sheet :show="loginshow" :actions="actions" @close="show=false" @getuserinfo="getUserInfo" />
	</view>
</template>

<script>
	import api from '../../common/api/api.js'
	import qqmapsdk from '../../common/qqmapsdk.js'
	export default {
		data() {
			return {
				formdata: {
					integral: 0
				},
				params: {
					page: 1,
					limit: 10,
					status: 0,
				},
				hasMore: true,
				loginData: uni.getStorageSync('LOGIN_DATA'),
				datalist: [],
				city: '',
				userInfo: uni.getStorageSync('USERINFO') || {},
				loginshow: false,
				actions: [{
					name: '获取用户信息',
					color: '#07c160',
					openType: 'getUserInfo'
				}],
				titleArr: [{
						title: '新订单',
						type: 0
					},
					{
						title: '已接单',
						type: 1
					},
					{
						title: '已完成',
						type: 2
					},
					{
						title: '已取消',
						type: -1
					}
				],
				show: false,
				prop: 'zz',
				// indexData: {},
				loginData: uni.getStorageSync('LOGIN_DATA') || {},
			}
		},
		onLoad() {
			this.goLogin(this.loginData)
			this.getList(this.params)
		},
		methods: {
			toPage(type) {
				switch (type) {
					case 'rechange':
						uni.navigateTo({
							url: '../me/rechange/rechange'
						})
						break
				}
			},
			deleteOrder(id) {
				api.RECYCLE_REMOVE(id).then(() => {
					this.getList(this.params)
				})
			},
			sure(id) {
				api.RECYCLE_SURE(id).then(() => {
					this.params.status = 1
					this.getList(this.params)
				})
			},
			showProp(obj) {
				this.show = true
				this.prop = '回收'
				Object.assign(this.formdata, {
					id: obj.order_id,
					weight: obj.weight
				})
			},
			complate(data) {
				api.RECYCLE_COMPLATE(data.id, data).then(res => {
					this.show = false
					this.getList(this.params)
				}).catch(err => {
					console.log(err, 'err')
					this.prop = '余额'
				})
			},
			// 上下线
			setLine(e) {
				// if (this.userInfo.on_line) {
				uni.showModal({
					content: this.userInfo.on_line ? '关闭后系统将不会为你派发订单' : '开启后系统将为您派发订单',
					success: () => {
						this.userInfo.on_line = !this.userInfo.on_line
						// console.log(this.userInfo.on_line,111)
						api.RECYCLE_LINE(this.userInfo.on_line ? 1 : 0).then(() => {
							this.getuserinfo()
						})
					}
				})
			},
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
				api.RECYLE_LIST(params).then(res => {
					if (res.length < params.limit) {
						this.hasMore = false
					}
					res.forEach(item => {
						item.juli = 100
					})
					this.datalist = res
					uni.hideLoading()
				})
			},
			navbarTap(type) {
				Object.assign(this.params, {
					status: type,
					page: 1,
					limit: 10
				})
				this.getList(this.params)
			},
			loadMore(params) {
				api.RECYLE_LIST(params).then(res => {
					res.forEach(item => {
						item.juli = 100
					})
					if (res.length < params.limit) {
						this.hasMore = false
					}
					this.datalist = this.datalist.concat(res)
					// console.log('我触底了',)
					uni.hideLoading()
				})
			},
			onClose() {
				this.show = false
			},
			//微信授权登录
			getUserInfo(e) {
				var p = this.getSetting();
				p.then((isAuth) => {
					console.log('是否已经授权', isAuth);
					if (isAuth) {
						uni.showLoading({})
						let res = e.detail
						Object.assign(this.loginData, {
							iv: res.iv,
							encryptedData: res.encryptedData
						})
						this.goLogin(this.loginData)
					} else {
						uni.showToast({
							title: '授权失败，请确认授权已开启',
							mask: true,
							icon: 'none'
						})
					}
				});
			},
			goLogin(data) {
				uni.login({
					provider: 'weixin',
					success: (res) => {
						Object.assign(data, {
							jsCode: res.code,
						})
						api.LOGIN(data).then((res) => {
							// console.log(res, '登录')
							if (res.cache_key !== '') {
								Object.assign(this.loginData, {
									cache_key: res.cache_key
								})
							}
							uni.setStorageSync('TOKEN', res.token)
							uni.setStorageSync('LOGIN_DATA', this.loginData)
							this.loginshow = false
							// this.setLocation(this.localData)
							this.getuserinfo()

							uni.hideLoading()
						}).catch((error) => {
							this.loginshow = true
							console.log(error, this.loginshow)
						})
					}
				});
			},
			getuserinfo() {
				api.USERINFO().then(res => {
					res.on_line = res.on_line == 1 ? true : false
					this.getUserLocation(res.latitude, res.longitude)

					uni.setStorageSync('USERINFO', res)
					this.userInfo = res
				})
			},
			// 逆解析
			getUserLocation(lat, lng) {
				qqmapsdk.reverseGeocoder({
					location: {
						latitude: lat,
						longitude: lng
					},
					success: res => {
						let mapres = res.result
						this.city = mapres.address_component.city
						// console.log(mapres,1111)
					}
				})
			},
			//获取用户的当前设置
			getSetting() {
				return new Promise(function(resolve, reject) {
					uni.getSetting({
						success: function(res) {
							if (res.authSetting['scope.userInfo']) {
								// console.log('存在');
								resolve(true);
							} else {
								// console.log('不存在');
								resolve(false);
							}
						}
					})
				}).catch((e) => {
					console.log(e)
				});
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
	.dizhi {
		position: relative;
		display: flex;
		align-items: center;

		>text {
			display: inline-block;
			width: 60vw;

			+image {
				position: static;
			}
		}

	}

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
				margin-bottom: 25rpx;

				// margin-top: 10vh;
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

	.switch {
		position: relative;
		top: 11rpx;
		margin-right: 20rpx;
	}
</style>
