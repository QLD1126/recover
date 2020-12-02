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
		<image src="../../static/zwdd.png" mode="" v-if="hasOrder"></image>
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
						<image @click="toPage('map',item)" src="../../static/dizhi_s.png" mode="" class="icon_44" v-if="params.status==1"></image>
					</view>
					<view class="" v-if="params.status!==0">
						详细地址：{{item.user_address}}
					</view>
					<view class="" v-if="params.status==0">
						距离：{{item.distance}}m
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
						<view class="hasinput">

							<text class="putongtext hsz">请输入回收值：</text><input type="number" v-model="formdata.integral" />
						</view>
						<view class="hasinput" style="margin-top: 60rpx;">
							<text class="putongtext hsz">请输入回收重量(kg)：</text><input type="number" v-model="formdata.weight" />
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
		<!-- 登录 -->
		<van-action-sheet :show="loginshow" :actions="actions" @close="show=false" @getuserinfo="getUserInfo" />
	</view>
</template>

<script>
	// import this.$apis from '../../common/this.$apis/this.$apis.js'
	import qqmapsdk from '../../common/qqmapsdk.js'
	import {
		public_data
	} from '../../common/public_data.js'
	let socketHost = public_data.socketHost
	export default {
		data() {
			return {
				// 弹出层
				loginshow: false,
				show: false,
				prop: 'zz',
				actions: [{
					name: '获取用户信息',
					color: '#07c160',
					openType: 'getUserInfo'
				}],
				// 列表
				formdata: {
					integral: '',
					weight: '',
				},
				params: {
					page: 1,
					limit: 10,
					status: 0,
				},
				hasMore: true,
				// 页面

				loginData: uni.getStorageSync('LOGIN_DATA') || {},
				userInfo: uni.getStorageSync('USERINFO') || {},
				datalist: [],
				city: '',
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
				// 长连接
				socketTask: null,
				// 确保websocket是打开状态
				is_open_socket: false,
				timer: null,
				city: '',
				location:{
					lat:'',
					lng:''
				},
			}
		},
		onLoad() {
			this.goLogin(this.loginData)
			this.userinfo()
		},
		onShow() {
			this.getUserLocation()
			this.connectSocketInit();
			this.timer = setInterval(() => {
				this.getUserLocation()
			}, 10000)

			this.getList(this.params)
		},
		onHide() {
			if(this.timer){
				clearInterval(this.timer)
				this.timer=null
			}
		},
		computed: {
			hasOrder() {
				if (this.userInfo.on_line && this.datalist.length > 0) {
					return false

				} else {
					return true
				}
			}
		},
		methods: {
			getUserLocation() {
				// 地图
				// var that = this;
				qqmapsdk.reverseGeocoder({
					success: (res) => {
						let a = res.result
						// console.log(location)
						this.city = a.address_component.city
						Object.assign(this.location,{
							lat:a.location.lat,
							lng:a.location.lng
						})
						this.clickRequest(a.location.lat, a.location.lng)
					}
				})
			},
			//事件触发，调用接口
			formSubmit(obj) {
				let _this = this
				let start = {
					latitude: _this.userInfo.latitude,
					longitude: _this.userInfo.longitude
				}
				//调用距离计算接口
				obj.forEach(item => {
					let end = [{
						latitude: item.user_latitude,
						longitude: item.user_longitude
					}]
					qqmapsdk.calculateDistance({
						from: start || '', //若起点有数据则采用起点坐标，若为空默认当前地址
						to: end, //终点坐标
						success: function(res) { //成功后的回调
							// let distance = res.result.elements[0].distance;
							item.distance = res.result.elements[0].distance;
						},
						fail: function(error) {
							// console.error(error);
							// resolve('错');
						}
					});
				})
			},
			toPage(type, obj) {
				switch (type) {
					case 'rechange':
						uni.navigateTo({
							url: '../me/rechange/rechange'
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
			deleteOrder(id) {
				uni.showModal({
					content: '确定删除该订单吗?',
					success: (res) => {
						if (res.confirm) {
							this.$apis.RECYCLE_REMOVE(id).then(() => {
								this.getList(this.params)
							})
						}
					}
				})
			},
			sure(id) {
				this.$apis.RECYCLE_SURE(id).then(() => {
					this.params.status = 1
					this.getList(this.params)
				})
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
					this.params.status = 2
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
						this.$apis.RECYCLE_LINE(this.userInfo.on_line ? 1 : 0).then(() => {
							this.userinfo()
						})
					}
				})
			},
			getList(params) {
				uni.showLoading({

				})
				// if()
				this.hasMore = true
				Object.assign(params, {
					page: 1,
				})
				this.$apis.RECYLE_LIST(params).then(res => {
					this.datalist = []
					if (res.length < params.limit) {
						this.hasMore = false
					}
					if (params.status == 0) {
						this.formSubmit(res)
					}
					//防止还没计算出结果就一把值赋给datalist
					setTimeout(() => {
						this.datalist = res
						uni.hideLoading()
						console.log(res, this.datalist)
					}, 500)
					// this.datalist = res
				})
			},
			navbarTap(type) {
				Object.assign(this.params, {
					status: type,
					page: 1,
				})
				this.getList(this.params)
			},
			loadMore(params) {
				this.$apis.RECYLE_LIST(params).then(res => {
					res.forEach(item => {
						item.juli = 100
					})
					if (res.length < params.limit) {
						this.hasMore = false
					}
					if (params.status == 0) {
						this.formSubmit(res)
					}
					//防止还没计算出结果就一把值赋给datalist
					setTimeout(() => {
						this.datalist = this.datalist.concat(res)
						uni.hideLoading()
					}, 500)
				})
			},
			onClose() {
				this.show = false
			},
			// 计算距离

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
						this.$apis.LOGIN(data).then((res) => {
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
							this.userinfo()

							uni.hideLoading()
						}).catch((error) => {
							this.loginshow = true
							console.log(error, this.loginshow)
						})
					}
				});
			},
			userinfo() {
				this.$apis.USERINFO().then(res => {
					res.on_line = res.on_line == 1 ? true : false
					this.InverseAnalysis(res.latitude, res.longitude)

					uni.setStorageSync('USERINFO', res)
					this.userInfo = res
				})
			},
			// 计算距离
			InverseAnalysis(lat, lng) {
				qqmapsdk.reverseGeocoder({
					location: {
						latitude: lat,
						longitude: lng
					},
					success: res => {
						let mapres = res.result
						this.city = mapres.address_component.city
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
			// 长连接
			// 进入这个页面的时候创建websocket连接【整个页面随时使用】
			connectSocketInit() {
				// 创建一个this.socketTask对象【发送、接收、关闭socket都由这个对象操作】
				this.socketTask = uni.connectSocket({
					// 【非常重要】必须确保你的服务器是成功的,如果是手机测试千万别使用ws://127.0.0.1:9099【特别容易犯的错误】
					url: socketHost,
					success(data) {
						console.log("websocket连接成功");
					},
				});
				// 消息的发送和接收必须在正常连接打开中,才能发送或接收【否则会失败】
				this.socketTask.onOpen((res) => {
					console.log("WebSocket连接正常打开中...！");
					this.is_open_socket = true;
					// 注：只有连接正常打开中 ，才能正常成功发送消息
					this.socketTask.send({
						data: 'type=2&id='+this.userInfo.id+'&latitude='+this.location.lat+'&longitude='+this.location.lng,
						async success() {
							// console.log("消息发送成功!");
						},
					});
					// 注：只有连接正常打开中 ，才能正常收到消息
					this.socketTask.onMessage((res) => {
						let obj = JSON.parse(res.data)
						if (res.data !== '') {
							
						}
						console.log(JSON.parse(res.data),11111)
					});
				})
				// 这里仅是事件监听【如果socket关闭了会执行】
				this.socketTask.onClose(() => {
					console.log("已经被关闭了")
				})
			},
			// 关闭websocket【离开这个页面的时候执行关闭】
			closeSocket() {
				this.socketTask.close({
					success(res) {
						this.is_open_socket = false;
						console.log("关闭成功", res)
					},
					fail(err) {
						console.log("关闭失败", err)
					}
				})
			},
			clickRequest(lat,lng) {
				if (this.is_open_socket) {
					// websocket的服务器的原理是:发送一次消息,同时返回一组数据【否则服务器会进去死循环崩溃】
					this.socketTask.send({
						data: 'type=2&id='+this.userInfo.id+'&latitude='+lat+'&longitude='+lng,
						async success() {
							console.log("消息发送成功");
						},
					});
				}
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
		padding-top: 0;
		height: 100%;

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

	// .hasinput{
	// 	margin-top: 0;
	// }
	.switch {
		position: relative;
		top: 11rpx;
		margin-right: 20rpx;
	}
</style>
