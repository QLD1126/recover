<template>
	<view class="container">
		<view class="top">
			<view class="">
				{{routine_name}}
			</view>
			<view class="flex_between">
				<view class="" @click="getlocalset">
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
		<me-empty v-if="datalist.length==0" description="暂时没有订单"></me-empty>
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
						重量：{{params.status==2?item.weight+'kg':item.weight_type}}
					</view>
					<view class="dizhi" @click="toPage('map',item)">
						服务地址：
						<text>
							{{item.user_location}}
						</text>
						<image src="../../static/dizhi_s.png" mode="" class="icon_44" v-if="params.status==1"></image>
					</view>
					<view class="" v-if="params.status!==0">
						详细地址：{{item.user_address}}
					</view>
					<view class="">
						备注：{{item.mark||'暂无备注信息'}}
					</view>
					<view class="" v-if="item.images.length!==0">
						图片：
						<view class="images" @click='lookPic(item.images)'>
							<!-- <image v-for="img in item.images" :src="img" mode=""></image> -->

							<image v-for="(img,index) in item.images" :key='index' :src="img" mode=""></image>
						</view>
					</view>
					<view class="" v-if="params.status==0">
						距离：{{item.distance||0}}m
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
			<uni-load-more :status="loadState"></uni-load-more>
		</view>
		<!-- 弹出层 -->
		<van-popup class='middle_prop' :show='show' closeable @close="onClose" round duration='100'>
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
					<view class="btn btn_green" @click="getuserSet">
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
		<van-action-sheet :show="loginshow" :actions="actions" @close="loginshow=false" @getuserinfo="getUserInfo" />
	</view>
</template>

<script>
	import qqmapsdk from '../../common/qqmapsdk.js'
	import {
		public_data
	} from '../../common/public_data.js'
	let plugin = requirePlugin('routePlan');
	const key = public_data.qqmapKey; //使用在腾讯位置服务申请的key
	const referer = public_data.referer; //调用插件的app的名称
	const socketHost = public_data.socketHost
	export default {
		data() {
			return {
				a: [
					'http://contentcms-bj.cdn.bcebos.com/cmspic/a244e1652074ab715258aa7232995fd2.jpeg?x-bce-process=image/crop,x_37,y_0,w_423,h_284',
					'http://contentcms-bj.cdn.bcebos.com/cmspic/a244e1652074ab715258aa7232995fd2.jpeg?x-bce-process=image/crop,x_37,y_0,w_423,h_284',
					'http://contentcms-bj.cdn.bcebos.com/cmspic/a244e1652074ab715258aa7232995fd2.jpeg?x-bce-process=image/crop,x_37,y_0,w_423,h_284'
				],
				// 弹出层
				loginshow: false,
				show: false,
				prop: '位置',
				actions: [{
					name: '授权登录',
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
				loadState: 'more',
				loading: false,
				// 页面
				routine_name: '',
				loginData: uni.getStorageSync('LOGIN_DATA') || {},
				userInfo: uni.getStorageSync('USERINFO') || {},
				datalist: [],
				city: uni.getStorageSync('LOCAL').city || '暂未开启定位',
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
				// 长连接_定位
				socketTask: null,
				// 确保websocket是打开状态
				is_open_socket: false,
				timer: null,
				location: {
					lat: '',
					lng: ''
				},
				// 长连接_订单
				socketTask_order: null,
				// 确保websocket是打开状态
				is_open_socket_order: false,
				// timer: null,
			}
		},
		onLoad() {
			this.$apis.INDEX().then(res => {
				this.routine_name = res.routine_name
			})
			this.getUserLocation()
			// this.goLogin(this.loginData)
			// console
			if(uni.getStorageSync('TOKEN').length==''){
				uni.showModal({
					title: '是否立即登录？',
					cancelText:'稍后',
					confirmText:'立即前往',
					success: function(res) {
						if (res.confirm) {
							uni.navigateTo({
								url:'/pages/login/login'
							})
						}
					}
				})
			}
		},
		onShow() {
			this.getSetting_local().then(res => {
				if (res) {
					this.getUserLocation()
				} else {
					this.city = '暂未开启定位'
					if (this.timer) {
						clearInterval(this.timer)
						this.timer = null
					}
				}
			})
		},

		computed: {
			noOrder() {
				if ((this.userInfo.on_line!==0||!this.userInfo.on_line) && this.datalist.length > 0) {
					return false

				} else {
					return true
				}
			}
		},
		methods: {
			audio() {
				const innerAudioContext = uni.createInnerAudioContext();
				innerAudioContext.autoplay = true;
				innerAudioContext.src = 'https://www.guanshange.com/static/file/dingdong.mp3';
				innerAudioContext.onPlay(() => {
					console.log('开始播放');
				});
				innerAudioContext.onError((res) => {
					// console.log(res.errMsg);
					// console.log(res.errCode);
				});
			},
			lookPic(url) {
				uni.previewImage({
					urls: url,
					complete(err) {
						console.log(err)
					}
				})
			},
			getlocalset() {
				console.log('打开定位')
				this.getSetting_local().then(res => {
					if (res) {
						console.log('打开成功', res)
						this.getUserLocation()
					} else {
						// console.log('打开失败', res)
						this.show = true
					}
				})
			},
			getuserSet() {
				uni.openSetting({
					success: (setRes) => {
						if (setRes.authSetting['scope.userLocation']) {
							this.show = false
							uni.showLoading({
								title: '定位中...'
							})
							this.getUserLocation()
							uni.hideLoading()
						}
					}
				})
			},
			getSetting_local() {
				return new Promise(function(resolve, reject) {
					uni.getSetting({
						success: function(res) {
							if (res.authSetting['scope.userLocation']) {
								// console.log('存在');
								resolve(true);
							} else {
								// console.log('不存在1111');
								resolve(false);
							}
						}
					})
				}).catch((e) => {

				});;
			},
			getSetting_info() {
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
			getUserLocation() {
				// console.log('获取定位1111')
				// 地图
				// var that = this;
				qqmapsdk.reverseGeocoder({
					success: (res) => {
						let a = res.result
						// console.log(a,'定位')
						this.city = a.address_component.city
						// console.log(999999,this.city)
						let obj = { ...a.address_component,
							...a.location
						}
						uni.setStorageSync('LOCAL', obj)
						Object.assign(this.location, {
							lat: a.location.lat,
							lng: a.location.lng
						})
						this.clickRequest(a.location.lat, a.location.lng)
					}
				})
			},
			//计算距离
			InverseAnalysis(arr) {
				let _this = this
				let start = {
					latitude: _this.userInfo.latitude,
					longitude: _this.userInfo.longitude
				}
				//调用距离计算接口
				arr.forEach(item => {
					let end = [{
						latitude: item.user_latitude,
						longitude: item.user_longitude
					}]
					console.log('距离计算', start, end)
					qqmapsdk.calculateDistance({
						from: start || '', //若起点有数据则采用起点坐标，若为空默认当前地址
						to: end, //终点坐标
						success: function(res) { //成功后的回调
							// let distance = res.result.elements[0].distance;
							item.distance = res.result.elements[0].distance;
						},
						fail: function(error) {
							// uni.show
							// console.error(error);
							// resolve('错');
							uni.showToast({
								title: error.message,
								icon: 'none'
							})
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
						// //使用在腾讯位置服务申请的key
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
					success: (res) => {
						// 确认关闭
						if (res.confirm) {
							this.userInfo.on_line = !this.userInfo.on_line
							this.$apis.RECYCLE_LINE(this.userInfo.on_line ? 1 : 0).then(() => {
								this.userinfo()
								
							})
						}
					}
				})
			},
			getList(params) {
				uni.showLoading({
					title: '加载中...'
				})
				// 计算距离,每秒十个
				params.limit = params.status == 0 ? 5 : 10
				// if()
				this.hasMore = true
				Object.assign(params, {
					page: 1,
				})
				this.$apis.RECYLE_LIST(params).then(res => {
					this.datalist = []
					this.loadState = res.length < params.limit ? 'noMore' : 'more'
					if (params.status == 0) {
						this.InverseAnalysis(res)
					}
					//防止还没计算出结果就一把值赋给datalist
					setTimeout(() => {
						this.datalist = res
						this.loading = false
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
				if (type == 0 && !this.userInfo.on_line) {
					this.datalist=[]
					return
				}
				uni.showLoading({})
				// if (this.userInfo.on_line) {
				this.getList(this.params)
				// }
			},
			loadMore(params) {
				this.$apis.RECYLE_LIST(params).then(res => {
					res.forEach(item => {
						item.juli = 100
					})
					this.loadState = res.length < params.limit ? 'noMore' : 'more'
					if (params.status == 0) {
						this.InverseAnalysis(res)
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
			userinfo() {
				this.$apis.USERINFO().then(res => {
					if (res.on_line == 0 || !res.on_line) {
						this.closeSocket()
						this.closeSocket_order()
						if (this.timer) {
							clearInterval(this.timer)
							this.timer = null
						}
						console.log('下线', this.timer)
					} else {
						// this.connectSocketInit_local()
						this.connectSocketInit_order()
						this.getSetting_local().then(res => {
							// this.show = !res
							if (res) {
								// this.getUserLocation()
								this.connectSocketInit_local()
								this.timer = setInterval(() => {
									this.getUserLocation()
									this.clickRequest_order()
								}, 5000)
								// 最新订单列表
							} else {
								this.prop = '位置'
							}
						})
						this.getList(this.params)
						console.log('上线')
					}
					res.on_line = res.on_line == 1 ? true : false
					// this.InverseAnalysis(res.latitude, res.longitude)
					uni.setStorageSync('USERINFO', res)
					this.userInfo = res

				}).catch(() => {
					return
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
			// 定位
			connectSocketInit_local() {
				// 创建一个this.socketTask对象【发送、接收、关闭socket都由这个对象操作】
				this.socketTask = uni.connectSocket({
					// 【非常重要】必须确保你的服务器是成功的,如果是手机测试千万别使用ws://127.0.0.1:9099【特别容易犯的错误】
					url: socketHost,
					success(data) {
						console.log("定位长连接成功");
					},
				});
				// 消息的发送和接收必须在正常连接打开中,才能发送或接收【否则会失败】
				this.socketTask.onOpen((res) => {
					// console.log("定位连接正常打开中...！");
					this.is_open_socket = true;
					// 注：只有连接正常打开中 ，才能正常成功发送消息
					this.socketTask.send({
						data: 'type=2&id=' + this.userInfo.id + '&latitude=' + this.location.lat + '&longitude=' + this.location.lng,
						async success() {
							console.log("消息发送成功!");
						},
					});
					// 注：只有连接正常打开中 ，才能正常收到消息
					this.socketTask.onMessage((res) => {
						if (res.data !== '') {
							let obj = JSON.parse(res.data)
						}
						console.log(res.data, '定位结果')
					});
				})
				// 这里仅是事件监听【如果socket关闭了会执行】
				this.socketTask.onClose(() => {
					console.log("定位已经被关闭了")
				})
			},
			// 关闭websocket【离开这个页面的时候执行关闭】
			closeSocket() {
				this.socketTask.close({
					success(res) {
						this.is_open_socket = false;
						console.log("定位关闭成功", res)
					},
					fail(err) {
						console.log("定位关闭失败", err)
						// uni.showToast({
						// 	title: 'localSocket not close' + err.errMsg,
						// 	icon: 'none'
						// })
					}
				})
			},
			clickRequest(lat, lng) {
				if (this.is_open_socket) {
					// websocket的服务器的原理是:发送一次消息,同时返回一组数据【否则服务器会进去死循环崩溃】
					this.socketTask.send({
						data: 'type=2&id=' + this.userInfo.id + '&latitude=' + lat + '&longitude=' + lng,
						async success() {
							console.log("定位消息发送成功");
						},
					});
				}
			},
			// 新订单
			connectSocketInit_order() {
				// 创建一个this.socketTask对象【发送、接收、关闭socket都由这个对象操作】
				this.socketTask_order = uni.connectSocket({
					// 【非常重要】必须确保你的服务器是成功的,如果是手机测试千万别使用ws://127.0.0.1:9099【特别容易犯的错误】
					url: socketHost,
					success(data) {
						console.log("订单长连接成功");
					},
				});
				// 消息的发送和接收必须在正常连接打开中,才能发送或接收【否则会失败】
				this.socketTask_order.onOpen((res) => {
					// console.log("订单连接正常打开中...！");
					this.is_open_socket_order = true;
					// 注：只有连接正常打开中 ，才能正常成功发送消息
					this.socketTask_order.send({
						data: 'type=3&id=' + this.userInfo.id,
						async success() {
							console.log("订单消息发送成功!");
						},
					});
					// 注：只有连接正常打开中 ，才能正常收到消息
					this.socketTask_order.onMessage((res) => {
						if (res.data !== '') {
							this.audio()
							uni.showModal({
								content: '接到系统派发订单',
								cancelText: '稍后',
								confirmText: '立即查看',
								success: (res) => {
									if (res.confirm) {
										// let obj = JSON.parse(res.data)
										console.log(res.data, '订单结果')
										Object.assign(this.params, {
											page: 1,
											status: 0
										})
										this.getList(this.params)
									}
								}

							})
						}
					});
				})
				// 这里仅是事件监听【如果socket关闭了会执行】
				this.socketTask_order.onClose(() => {
					console.log("订单已经被关闭了")
				})
			},
			// 关闭websocket【离开这个页面的时候执行关闭】
			closeSocket_order() {
				this.socketTask_order.close({
					success(res) {
						this.is_open_socket_order = false;
						console.log("订单关闭成功", res)
					},
					fail(err) {
						console.log("订单关闭失败", err)
						// uni.showToast({
						// 	title: 'orderSocket not close' + err.errMsg,
						// 	icon: 'none'
						// })
					}
				})
			},
			clickRequest_order(lat, lng) {
				if (this.is_open_socket_order) {
					// websocket的服务器的原理是:发送一次消息,同时返回一组数据【否则服务器会进去死循环崩溃】
					this.socketTask_order.send({
						data: 'type=3&id=' + this.userInfo.id,
						async success() {
							console.log("订单消息发送成功");
						},
					});
				}
			},

		},
		beforeDestroy() {
			this.closeSocket();
			this.closeSocket_order()
		},
		onHide() {
			// tab页面使用onhide
			
			if (this.timer) {
				clearInterval(this.timer)
				this.timer = null
			}
			console.log(this.timer,'hide')
			this.closeSocket();
			this.closeSocket_order()
		},
		onPullDownRefresh() {
			this.loading = true
			// this.connectSocketInit_order()
			// this.getSetting_local().then(res => {
			// 	this.show = !res
			// 	if (res) {
			// 		this.connectSocketInit_local()
			// 		// 最新订单列表
			// 	} else {
			// 		this.prop = '位置'
			// 	}
			// })
			// this.getList(this.params)
			console.log(this.city, '我刷新了')
			this.userinfo()
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onReachBottom() {
			if (this.loadState !== 'noMore') {
				this.loadState = 'loading'
				this.params.page++
				this.loadMore(this.params)
			}
		}
	}
</script>

<style lang="scss">
	.images {
		width: 90vw;
		display: flex;

		>image {
			width: 220rpx;
			height: 220rpx;
		}
	}

	.container {
		padding-top: 0;
		height: 100%;

		>.top {
			background-color: #2E8EF4;
			width: 96vw;
			padding: 2vw;
			color: #fff;
			height: 27vh;

			>view:first-child {
				margin: 5vh 0;
				font-size: 32rpx;
				// color: #fff;
				font-weight: bold;
			}

			.flex_between {
				margin-bottom: 25rpx;

				// margin-top: 10vh;
				image {
					width: 44rpx;
					height: 44rpx;
					position: relative;
					top: 10rpx;
				}

				>view:last-child {
					margin-top: 12rpx;
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

	.switch {
		position: relative;
		top: 11rpx;
		margin-right: 20rpx;
	}

	.nodata {
		height: 0;
		width: 0;
	}
</style>
