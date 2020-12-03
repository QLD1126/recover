<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "./common/iconfont.css";

	.pro_title {
		color: #323232;
		font-size: 32rpx;
		font-weight: bold;
		margin-bottom: 40rpx;
	}

	/*每个页面公共css */
	.b_zhu {
		display: inline-block;
		width: 6rpx;
		height: 32rpx;
		background: #2D8DF4;
		margin-right: 22rpx;
	}
.nodata {
			width: 547rpx;
			margin: 0 auto;
			margin-top: 20vh;
			text-align: center;
			background: transparent !important;

			>image {
				width: 547rpx;
				height: 342rpx;

				+text {
					color: #ccc;
				}
			}
		}
	.btn_line {
		color: #fff;
		background-image: linear-gradient(to right, rgba(51, 167, 250, 1), rgba(33, 211, 211, 1)) !important;
		font-weight: 200;
		text-align: center;
		padding: 29rpx 0 !important;
		border-radius: 50rpx;
		width: 702rpx;
		// margin: 0 auto;

	}
		.model_jiedan {
			margin: 20rpx auto;
			border-radius: 10rpx;
			background-color: #fff;
			padding: 20rpx;
			width: 670rpx;

			>view {
				padding: 40rpx 0;
			}

			.flex_between {
				font-size: 24rpx;
				>text:first-child {
					color: #999;

					+text {
						color: #2E8EF4;
					}
				}

				+view {
					border-top: 1rpx solid #f3f3f3;
					border-bottom: 1rpx solid #f3f3f3;

					>view {
						margin-bottom: 40rpx;
					}
				}
			}
		}
	.btn_2 {
		display: inline-block;
		padding: 0 25rpx;
		height: 64rpx;
		line-height: 64rpx;
		border-radius: 32rpx;
		color: #fff;
		text-align: center;
		background: #23CED7;
		font-size: 28rpx;
	}

	.btn_3 {
		display: inline-block;
		padding: 0 40rpx;
		height: 88rpx;
		line-height: 88rpx;
		border-radius: 44rpx;
		text-align: center;
		font-size: 32rpx;
		border: 2rpx solid #CCCCCC;
		color: #666;

	}

	.select_blue {
		/* color: blue; */
		background-image: linear-gradient(to right, rgba(51, 167, 250, 1), rgba(33, 211, 211, 1));
		background-clip: text;
		font-size: 32rpx;
		-webkit-line-clamp: 2;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.btn_bottom {
		background-image: linear-gradient(to right, rgba(51, 167, 250, 1), rgba(33, 211, 211, 1));
		width: 30rpx;
		height: 8rpx;
		border-radius: 4rpx;
	}

	.container {
		height: 100vh;
		font-size: 28rpx;
		background: #f3f3f3;
		padding-top: 20rpx;
		
	}
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
	.icon_44 {
		width: 44rpx;
		height: 44rpx;
		position: relative;
		top: 15rpx;
	}

	.btn {
		border-radius: 10rpx;
		color: #FFF;
		font-size: 32rpx;
		text-align: center;
		height: 88rpx;
		line-height: 88rpx;
	}

	.btn_bule {
		width: 662rpx;
		background: #2E8EF4;
	}

	.btn_green {
		background: #21D2D3;
		width: 340rpx;
	}

	.tabbar {
		width: 750rpx;
		position: fixed;
		background: #fff;
		display: flex;
		justify-content: space-around;
		align-items: center;
		font-size: 28rpx;

		>view {
			width: 85rpx;
			text-align: center;
			margin: 20rpx 0;

			>view {
				width: 48rpx;
				height: 6rpx;
				margin: 10rpx auto;
			}
		}

		.bule {
			background-color: #2E8EF4;
		}
	}

	.flex_between_list {
		background: #fff;
		width: 700rpx;
		padding: 0rpx 25rpx;
		height: 106rpx;
		line-height: 106rpx;
		border-bottom: 2rpx solid #f3f3f3;
		display: flex;
		justify-content: space-between;

		>text {
			font-size: 28rpx;
			font-weight: bold;
		}

		>image {
			position: relative;
			top: 30rpx;
		}
	}

	.flex_left_list {
		background: #fff;
		width: 700rpx;
		padding: 0rpx 25rpx;
		height: 106rpx;
		line-height: 106rpx;
		border-bottom: 2rpx solid #f3f3f3;
		display: flex;
		justify-content: flex-start;

		>text {
			font-size: 28rpx;
			font-weight: bold;
			flex: 0 0 20%;
		}

		>image {
			position: relative;
			top: 30rpx;
		}

		>input {
			height: 100%;
			margin-left: 40rpx;
		}
	}

	.model {
		// width: 702rpx;
		margin: 0 auto;
		// height: 100vh;
		position: relative;
		background: #fff;
	}

	.flex_between {
		display: flex;
		justify-content: space-between;
		// margin: 30rpx 0;
	}

	.middle_prop {
		.middle_text {
			width: 702rpx;
			border-radius: 10rpx;
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
					max-width: 418rpx;
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
				.hasinput{
					margin-top: 0;
					
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
				}
			}

			.prop_bottom {
				height: 226rpx;

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

	.c_28_888 {
		color: #888;
		font-size: 28rpx;
		font-family: PingFang SC Medium;
	}

	.input {
		background-color: #F3F3F3;
		border-radius: 10rpx;
		font-size: 28rpx;
	}

	.s_title {
		font-weight: bold;
		font-size: 28rpx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
		font-weight: bold;
	}

	.t_28_f {
		font-size: -12rpx;
		color: #fff;
	}

	.s_number {
		color: rgba(204, 204, 204, 1);
		font-size: 24rpx;
	}

	.s_money {
		color: rgba(251, 169, 20, 1);
		font-size: 24rpx;
	}
</style>
