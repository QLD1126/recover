<template>
	<view class="container">
		<view class="">
			<image src="../../../static/dqq.png" mode=""></image>
			<view class="title">
				收款码
			</view>
			<view class="">
				<image :src="info.receiving_qr" mode="" @click="lookPic(info.receiving_qr)"></image>
			</view>
		</view>
		<view class="btn" @click="uploadImg">
			上传微信收款码
		</view>
	</view>
</template>

<script>
	import {
		public_data
	} from '../../../common/public_data.js'
	let host = public_data.host
	export default {
		data() {
			return {
				info: uni.getStorageSync('USERINFO')
			};
		},
		onLoad() {

			// this.$apis.CITY_TREE().then(res=>{
			// 	console.log(res)
			// })
			uni.connectSocket({
				url: 'websocket://192.168.3.48:2345',
				data() {
					return {
						type: 1
					};
				},
				header: {
					'content-type': 'application/json'
				},
				protocols: ['protocol1'],
				method: 'GET',
				complete: (res) => {
					console.log(res)
				}
			});
		},
		methods: {
			lookPic(url) {
				uni.previewImage({
					urls: [url]
				})
			},
			// 上传图片
			uploadImg() {
				let _self = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function(res) {
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
							success: function(uploadFileRes) {
								let receiving_qr = JSON.parse(uploadFileRes.data).data.url
								Object.assign(_self.info, {
									receiving_qr: receiving_qr
								})
								_self.edit({
									receiving_qr: receiving_qr
								})
							}
						});
					},
					error: function(e) {
						console.log(e);
					}
				});
			},
			edit(data) {
				uni.showLoading({})
				this.$apis.EDIT_USER(data).then((res) => {
					this.getUserinfo()
				})
			},
			getUserinfo() {
				this.$apis.USERINFO().then(res => {
					this.info = res
					uni.setStorageSync('USERINFO', res)
					uni.hideLoading()
				})
			},
		}
	}
</script>

<style lang="scss">
	.container {
		background-color: #2E8EF4;
		font-size: 32rpx;
		position: static;
		z-index: -1;

		>view {
			margin: 0 auto;
			position: relative;
			overflow: hidden;
			border-radius: 10rpx;
			>view {
				position: relative;
			}

			>image {
				width: 700rpx;
				height: 688rpx;
				position: absolute;
				top: 0;
				// z-index: -1;
			}
		}

		>view:first-child {
			width: 700rpx;
			height: 688rpx;
			// display: flex;
			// justify-content: center;
			// align-items: center;

			>view {
				width: 100%;
				text-align: center;
			}

			.title {
				background: #f3f3f3;
				color: #2E8EF4;
				height: 108rpx;
				line-height: 108rpx;

				+view {
					image {
						width: 320rpx;
						height: 320rpx;
						margin-top: 72rpx;
					}
				}
			}
		}

		.btn {
			width: 464rpx;
			height: 88rpx;
			line-height: 88rpx;
			background: #ffffff;
			border-radius: 44rpx;
			text-align: center;
			color: #2E8EF4;
			margin-top: 100rpx;
		}
	}
</style>
