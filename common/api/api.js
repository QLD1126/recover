// 引入工具类
import request from './request.js'

export default {
	LOGIN(data){
		return request({
			url:'/api/wechat/mp_auth',
			method:'post',
			data
		})
	},
	LOGO(){
		return request({
			url:'/api/recycle/get_logo',
			method:'get'
		})
	},
	EDIT_INFO(data){
		return request({
			url:'/api/recycle/submit',
			method:'get',
			data
		})
	},
	// 上下线
	RECYCLE_LINE(id){
		return request({
			url:'/api/recycle/line/'+id,
			method:'get'
		})
	},
	RECYLE_LIST(params){
		return request({
			url:'/api/recycle/orderList',
			method:'get'
		})
	},
	RECYLE_SURE(id){
		return request({
			url:'/api/recycle/accept/'+id,
			method:'get'
		})
	},
	RECYLE_COMPLATE(id){
		return request({
			url:'/api/recycle/complete/'+id,
			method:'get'
		})
	},
	RECYCLE_REMOVE(id){
		return request({
			url:'/api/recycle/del/'+id,
			method:'get'
		})
	}
}
