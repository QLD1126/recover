function req(obj) {
	return new Promise((resolve, reject) => {
		// const HOST = 'http://192.168.3.48:83'
		const HOST = 'http://wangye.lncswlgs.com'
		var method = obj.method || "GET";
		var url = HOST + obj.url || "";
		var data = obj.data || {};
		var params = obj.params || {};
		var token = uni.getStorageSync('TOKEN');
		var header = obj.header || {
			'Content-Type': obj.contentType || 'application/json',
			'Authori-zation': 'Bearer '+token
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
					uni.reLaunch({
						url: '/pages/index/index'
					})
				} else if (res.statusCode === 500) {
					// if(res.)
					uni.showToast({
						title: res.data.msg,
						icon: 'none'
					})
					// uni.navigateTo({
					// 	url:'/pages/index/index'
					// })
				} else if (res.statusCode === 200) {
					switch (res.data.code) {
						case 401:
							uni.reLaunch({
								url: '/pages/index/index'
							})
							reject(res.data)
							break;
						case 404:
							uni.showToast({
								title: '用户名被抢注，请重新注册',
								icon: 'none'
							})
							reject(res.data)
							break
						case 500:
							// uni.navigateTo({
							// 	url:'/pages/index/index'
							// })
							if (res.data.msg == '缺少token') {
								uni.reLaunch({
									url: '/pages/index/index'
								})
								reject(res.data)
								break
							} else {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								})
								reject(res.data)
								break
							}

						default:
							resolve(res.data.data)
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
