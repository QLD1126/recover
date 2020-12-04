// 引入工具类
import request from './request.js'

export default {
	LOGIN(data){
		return request({
			url:'/api/recycle/mp_auth',
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
	USERINFO(){
		return request({
			url:'/api/recycle/info',
			method:'get'
		})
	},
	// 账单
	BILL(params){
		return request({
			url:'/api/recycle/bill',
			method:'get',
			params
		})
	},
	INDEX(){
		return request({
			url:'/api/recycle/index',
			method:'get'
		})
	},
	// 充值
	RECHANGE(data){
		return request({
			url:'/api/recycle/recharge',
			method:'post',
			data
		})
	},
	// 提现
	EXPORT_MONEY(data){
		return request({
			url:'/api/recycle/extract/cash',
			method:'post',
			data
		})
	},
	EDIT_USER(data){
		return request({
			url:'/api/recycle/edit',
			method:'post',
			data
		})
	},
	RECYCLE_USER(data){
		return request({
			url:'/api/recycle/submit',
			method:'post',
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
			method:'get',
			params
		})
	},
	RECYCLE_SURE(id){
		return request({
			url:'/api/recycle/accept/'+id,
			method:'get'
		})
	},
	RECYCLE_COMPLATE(id,data){
		return request({
			url:'/api/recycle/complete/'+id,
			method:'post',
			data
		})
	},
	RECYCLE_REMOVE(id){
		return request({
			url:'/api/recycle/del/'+id,
			method:'get'
		})
	},
	// 城市列表
	CITY_TREE(){
		return request({
			url:'/api/cities',
			method:'get'
		})
	}
}
