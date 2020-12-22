<template>
	<view>
		<van-nav-bar :title="info.routine_name" left-arrow @click-left="onClickLeft" :border='false' />
		<view class="login">
			<image :src="logo" mode=""></image>
			<view class="pro_title">
				登录后该应用将获得以下权限
			</view>
			<view class="c_28_888">
				<view class="ty">

				</view>
				获得你的公开信息（昵称、头像等）
			</view>
			<button open-type="getUserInfo" lang="zh_CN" @getuserinfo="getUserInfoclick">确认登录</button>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				info: uni.getStorageSync('INDEX'),
				loginData: {},
				logo: '',
			};
		},
		onLoad() {
			let info = uni.getStorageSync('INDEX')
			if (info.length !== 0) {
				this.info = info
			} else {
				this.$apis.INDEX().then(res => {
					this.info = res
					uni.setStorageSync('INDEX', res)
				})
			}
			this.$apis.LOGO().then(res => {
				this.logo = res.logo_url
			})
		},
		methods: {
			//微信授权登录
			getUserInfoclick(e) {
				// let that = this;
				uni.getSetting({
					success: (isAuth) => {
						if (isAuth.authSetting['scope.userInfo']) {
							uni.showLoading({title:'登陆中...'})
							let res = e.detail
							Object.assign(this.loginData, {
								iv: res.iv,
								encryptedData: res.encryptedData,
							})
							uni.hideLoading()
							this.goLogin(this.loginData)
						} else {
							uni.showModal({
								title: '提示',
								content: '授权失败，请确认授权已开启',
								success: (res) => {
									if (res.confirm) {
										uni.openSetting({})
									}
								}
							})
						}
					}
				})
			},
			goLogin(data) {
				uni.login({
					provider: 'weixin',
					success: (res) => {
						Object.assign(data, {
							jsCode: res.code,
						})
						this.$apis.LOGIN(data).then((res) => {
							uni.setStorageSync('TOKEN', res.token)
							uni.navigateBack()
						})
					}
				});
			},
			onClickLeft() {
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style lang="scss">
	.login {
		>image {
			width: 200rpx;
			height: 200rpx;
			border-radius: 50%;
			margin: 70rpx auto;
			display: block;
		}

		.pro_title {
			margin-bottom: 10rpx;
		}

		>view {
			margin-left: 24rpx;

			>view {
				width: 14rpx;
				height: 14rpx;
				background: #888;
				border-radius: 50%;
				display: inline-block;
				margin-right: 10rpx;
			}
		}

		button {
			background: #06C261;
			margin-top: 70rpx;
			width: 702rpx;
			color: #fff;

		}
	}
</style>
