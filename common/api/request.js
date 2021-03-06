import {
	public_data
} from '../public_data.js'

function req(obj) {
	return new Promise((resolve, reject) => {
		// const HOST = 'http://192.168.3.48:8082'
		const HOST = public_data.host
		// const HOST = 'http://wangye.lncswlgs.com'
		var method = obj.method || "GET";
		var url = HOST + obj.url || "";
		var data = obj.data || {};
		var params = obj.params || {};
		var token = uni.getStorageSync('TOKEN');
		var header = obj.header || {
			'Content-Type': obj.contentType || 'application/json',
			'Authori-zation': 'Bearer ' + token
		};
		// console.log(header,'aaaaaa')
		var success = obj.success; // 成功回调函数
		var fail = obj.fail; //表示失败后，要执行的回调函数
		uni.request({
			url: url,
			data: method == 'get' ? params : data,
			header: header,
			method: method,
			success: ((res) => {
				if (res.statusCode === 403 || res.statusCode === 401) {
					// 错误处理，返回登录页
					uni.switchTab({
						url: '/pages/index/index'
					})
				} else if (res.statusCode === 500) {
					uni.showToast({
						title: res.data.msg,
						icon: 'none'
					})

				} else if (res.statusCode === 200) {

					switch (res.data.status) {
						case 200:
							resolve(res.data.data)
							break;
						case 410000:
							// 未登录
							// console.log(res.data,'啊啊啊')
							uni.hideLoading()
							uni.showModal({
								title: res.data.msg,
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
							reject(res.data)
							break;
						case 41000001:
							// 登录状态失败
							uni.hideLoading()
							uni.showModal({
								title: res.data.msg,
								cancelText:'稍后',
								confirmText:'立即前往',
								success: (res) => {
									if (res.confirm) {
										
										uni.removeStorageSync('TOKEN')
										uni.removeStorageSync('USERINFO')
										uni.navigateTo({
											url:'/pages/login/login'
										})
										
									}
								}
							})
							reject(res.data)
							break
							// 登录状态有误
						case 41000002:
							uni.hideLoading()
							uni.showModal({
								title: res.data.msg,
								cancelText:'稍后',
								confirmText:'立即前往',
								success: (res) => {
									if (res.confirm) {
										uni.removeStorageSync('TOKEN')
										uni.removeStorageSync('USERINFO')
										uni.navigateTo({
											url:'/pages/login/login'
										})
									}
								}
							})
							reject(res.data)
							break
						case 520000:
							// 不是回收员
							uni.hideLoading()
							uni.showModal({
								content: res.data.msg,
								showCancel: false,
								success: (res) => {
									if (res.confirm) {
										uni.setStorageSync('open_recycle', 1)
										uni.navigateTo({
											url: '/pages/index/recover_add/recover_add?status=' + 1
										})
									}
								}
							})
							reject(res.data)
							break;
						case 520004:
							// 审核中
							uni.hideLoading()
							uni.setStorageSync('open_recycle', 2)
							uni.navigateTo({
								url: '/pages/index/recover_add/recover_add?status=' + 2
							})
							reject(res.data)
							break;
						// case 400:
						// 	// uni.hideLoading()
						// 	uni.showToast({
						// 		title: res.data.msg,
						// 		icon: 'none',
						// 		duration:1000
						// 	})
						// 	reject(res.data)
						// 	break;
						default:
								uni.showToast({
									title: res.data.msg,
									icon: 'none',
									duration:1000
								})
								reject(res.data)
					}
				}
			}),
			fail: ((err) => {
				reject(err)
				uni.showToast({
					title: err
				})
			})
		})
	})
}
export default req
