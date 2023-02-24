<template>
	<view class="content">
		<view class="topNav" :style="{'backgroundImage':`url(${urlTobase64('new','bg_t','jpg')})`}">
			<view class="title">
				智慧出行
			</view>
		</view>
		<view class="navContianer">
			<u-grid :border="true" col="3" @click="click">
				<u-grid-item v-for="(listItem,listIndex) in list" :key="listIndex">
					<u-icon :customStyle="{paddingTop:20+'rpx'}" :name="listItem.name" :size="30"></u-icon>
					<text class="grid-text">{{listItem.title}}</text>
				</u-grid-item>
			</u-grid>
			<u-toast ref="uToast" />
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import {
		univerifyLogin
	} from '@/common/univerify.js'
	import {
		urlTobase64
	} from '@/common/utils.js'
	export default {
		computed: mapState(['forcedLogin', 'hasLogin', 'userName']),
		data() {
			return {
				list: [{
						name: 'photo',
						title: '图片'
					},
					{
						name: 'lock',
						title: '锁头'
					},
					{
						name: 'star',
						title: '星星'
					},
					{
						name: 'hourglass',
						title: '沙漏'
					},
					{
						name: 'home',
						title: '首页'
					},
					{
						name: 'star',
						title: '音量'
					},
				],
			}
		},
		onLoad() {
			this.initWxlogin()
			const loginType = uni.getStorageSync('login_type')
			if (loginType === 'local') {
				this.login(uni.getStorageSync('username'))
				return
			}
			let uniIdToken = uni.getStorageSync('uni_id_token')
			if (uniIdToken) {
				this.login(uni.getStorageSync('username'))
				uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'checkToken',
					},
					success: (e) => {

						console.log('checkToken success', e);

						if (e.result.code > 0) {
							//token过期或token不合法，重新登录
							if (this.forcedLogin) {
								uni.reLaunch({
									url: '../login/login'
								});
							} else {
								uni.navigateTo({
									url: '../login/login'
								});
							}
						}
					},
					fail(e) {
						uni.showModal({
							content: JSON.stringify(e),
							showCancel: false
						})
					}
				})
			} else {
				this.guideToLogin()
			}
		},
		methods: {
			...mapMutations(['login']),
			initWxlogin() {
				const that = this
				uni.getProvider({
					service: 'oauth',
					success: function(res) {
						console.log(res.provider);
						//支持微信、qq和微博等
						if (~res.provider.indexOf('weixin')) {
							uni.login({
								provider: 'weixin',
								success: function(loginRes) {
									console.log("App微信获取用户信息成功", loginRes);
									uni.getUserInfo({
										provider:res.provider,
										success:(userInfo)=>{
											console.log("AppuserInfo", userInfo);
										}
									})
									// that.getApploginData(loginRes)  //请求登录接口方法
								},
								fail: function(res) {
									console.log("App微信获取用户信息失败", res);
								}
							})
				 	}
					}
				});
			},
			click(name) {
				this.$refs.uToast.success(`点击了第${name}个`)
			},
			urlTobase64,
			guideToLogin() {
				uni.showModal({
					title: '未登录',
					content: '您未登录，需要登录后才能继续',
					/**
					 * 如果需要强制登录，不显示取消按钮
					 */
					showCancel: !this.forcedLogin,
					success: (res) => {
						if (res.confirm) {
							univerifyLogin().catch((err) => {
								if (err === false) return;
								/**
								 * 如果需要强制登录，使用reLaunch方式
								 */
								if (this.forcedLogin) {
									uni.reLaunch({
										url: '../login/login'
									});
								} else {
									uni.navigateTo({
										url: '../login/login'
									});
								}
							})
						}
					}
				});
			}
		}

	}
</script>

<style lang="scss">
	.topNav {
		background-size: 100% 100%;
		height: 200px;
		line-height: 200px;

		.title {
			font-size: 64rpx;
			font-weight: bold;
			padding-left: 20rpx;
			color: #fff;
			text-shadow: 3px 4px 5px #3c3cc1;
			font-style: italic;
		}
	}

	.navContianer {
		padding: 10rpx 0 20rpx;

		.grid-text {
			font-size: 25rpx;
			color: #909399;
			padding: 10rpx 0 20rpx 0rpx;
			/* #ifndef APP-PLUS */
			box-sizing: border-box;
			/* #endif */
		}
	}
</style>
