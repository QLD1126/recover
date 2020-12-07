<template>
	<view class="" v-if="open_recycle==2">
		<view class="else">
			平台正在审核 请耐心等待
		</view>
	</view>
	<view class="container" v-else="open_recycle=='1'">
		<view class="">
			<view class="s_title">
				个人资料填写
			</view>
			<view class="flex_left_list" v-for="(item,index) in userArr" :key='index'>
				<text>{{item.title}}</text>
				<input :type="item.type" :confirm-type="item.confirmtype" v-model="item.value" :placeholder="item.placeholder" />
			</view>
		</view>
		<view class="">
			<view class="s_title">
				请上传身份证正反面
			</view>
			<view class="upload">
				<view class="">
					<image :src="formData.card_img[0]?formData.card_img[0]:'../../../static/sfszm.png'" @click="uploadImg('0')" mode=""></image>
					<text>正面</text>
				</view>
				<view class="">
					<image :src="formData.card_img[1]?formData.card_img[1]:'../../../static/sfszm.png'" @click="uploadImg('1')"></image>
					<text>反面</text>
				</view>
			</view>
		</view>
		<view class="btn_line" @click="sure(userArr)">
			立即入驻
		</view>
		<!-- 弹出框 -->
		<van-popup class='middle_prop' :show='show' closeable @close="close" :close-on-click-overlay='false' round>
			<view class="middle_text">
				<view class="prop_top"></view>
				<view class="prop_content">
					<view class="">
						已提交入驻申请
					</view>
					<view class="">
						请等待平台审核
					</view>
					<!-- <view class="prop_content"> -->
				</view>
				<view class="prop_bottom">
					
				</view>
			</view>
		</van-popup>
	</view>

</template>

<script>
	// import this.$apis from '../../../common/this.$apis/this.$apis.js'
	import {
		public_data
	} from '../../../common/public_data.js'
	let host = public_data.host
	export default {
		data() {
			return {
				open_recycle:uni.getStorageSync('open_recycle'),
				aaa: '../../../static/images/sfszm.png',
				formData: {
					card_img: []
				},
				show: false,
				userArr: [{
						title: '姓名',
						placeholder: '请输入姓名',
						value: '',
						key: 'real_name',
						type: 'text',
						confirmtype: 'next',
					},
					{
						title: '联系电话',
						placeholder: '请输入联系电话',
						value: '',
						key: 'phone',
						type: 'number',
						confirmtype: 'next',
					},
					{
						title: '身份证号码',
						placeholder: '请输入身份证号码',
						value: '',
						key: 'card_id',
						type: 'idcard',
						confirmtype: 'done',
					},
				],
			};
		},
		// onShow() {
		// 	// this.useinfo()
		// },
		onLoad(options) {
			this.open_recycle=options.status
		},
		onShow() {
			this.open_recycle=uni.getStorageSync('open_recycle')
		},
		methods: {
			close() {
				this.show = false
				this.open_recycle=2
			},
			useinfo(){
				this.$apis.USERINFO().then((res)=>{
					uni.setStorageSync('USERINFO',res)
				}).catch(err=>{
					// if(err)
					console.log(err)
					this.open_recycle=2
				})
			},
			sure(data) {
				uni.showLoading({
					title:'提交中...'
				})
				let FormData = {}
				data.map(item => {
					let key = item.key
					let value = item.value
					FormData[key] = value
				})
				Object.assign(this.formData, FormData)
				this.$apis.RECYCLE_USER(this.formData).then(res => {
					// this.show=true
					console.log(this.formData,2222)
					this.$apis.USERINFO().then(res => {
						uni.setStorageSync('USERINFO', res)
						uni.setStorageSync('open_recycle',2)
						// this.open_recycle=res.open_recycle
						uni.hideLoading()
						this.show = true
					})
				}).catch(err => {
					uni.hideLoading()
					uni.showModal({
						content:err.msg,
						showCancel:false
					})
				})
			},
			// 上传图片
			uploadImg(type) {
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						uni.showLoading({})
						const tempFilePaths = res.tempFilePaths;
						const uploadTask = uni.uploadFile({
							url: host + '/api/upload/image',
							filePath: tempFilePaths[0],
							header: {
								'Authori-zation': 'Bearer' + ' ' + uni.getStorageSync('TOKEN')
							},
							name: 'image',
							formData: {
								filename: 'image'
							},
							success: (uploadFileRes) => {
								console.log(this.formData, this.aaa, 111)
								this.formData.card_img[type] = JSON.parse(uploadFileRes.data).data.url
								this.aaa = JSON.parse(uploadFileRes.data).data.url
								uni.hideLoading()
							}
						});
					},
					error: function(e) {
						console.log(e);
					}
				});
			},
		}
	}
</script>

<style lang="scss">
	.container {
		height: 100vh;
		padding-top: 1rpx;

		.s_title {
			font-size: 32rpx;
			margin-left: 20rpx;
		}

		>view {
			background: #fff;
			padding-top: 40rpx;
			padding-left: 24rpx;
			margin: 20rpx 0;
		}

		.upload {
			padding: 58rpx 0;
			display: flex;
			justify-content: space-around;
			align-items: center;

			>view {
				width: 315rpx;
				text-align: center;
				font-weight: bold;

				image {
					width: 315rpx;
					height: 202rpx;
					margin-bottom: 38rpx;
				}
			}
		}

		.btn_line {
			margin: 100rpx auto 90rpx;
		}


	}
	.middle_prop {
		.middle_text {
			width: 90vw;
			padding: 0;
			// min-height: 100%;
			margin: 0;

			>view {
				text-align: center;
				display: flex;
				flex-flow: column nowrap;
				justify-content: center;
				align-items: center;
			}

			.prop_title {
				height: 112rpx;
				border-bottom: 1rpx solid #f3f3f3;
			}

			.prop_content {
				height: 45%;

				.c_28_888 {
					max-width: 420rpx;
					font-weight: 200 !important;
				}

				>image {
					width: 300rpx;
					height: 244rpx;
				}

				>image,
				text,
				view {
					margin-top: 60rpx;
				}
			}

			.prop_bottom {
				height: 70rpx;

				>view {
					margin: 60rpx;
				}

				>.btn_2 {
					font-weight: 200;
					padding: 10rpx 60rpx;
					border-radius: 44rpx;
				}

				>.btn_squre {
					border-radius: 10rpx !important;
				}

			}
		}
	}
	.else {
		width: 670rpx;
		// padding: 0 150rpx;
		height: 368rpx;
		line-height: 368rpx;
		background: #f3f3f3;
		border-radius: 10rpx;
		text-align: center;
		color: #999999;
		font-size: 32rpx;
		font-weight: bold;
		margin: 30vh auto;

		>view {
			width: 190rpx;
		}
	}
</style>
