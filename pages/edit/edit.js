// pages/edit/edit.js
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		successReadImg: false,
		tempFilePaths: '',
		//  上传进度
		uploadPercent: 0
	},
	onChooseImage: function () {
		let _this = this
		wx.chooseImage({
			count: 1,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success: (res) => {
				// tempFilePath可以作为img标签的src属性显示图片
				const tempFilePaths = res.tempFilePaths
				console.log('图片读取的临时地址', tempFilePaths)
				_this.setData({
					successReadImg: true,
					tempFilePaths
				})
				wx.uploadFile({
					//仅为示例，非真实的接口地址
					url: 'https://example.weixin.qq.com/upload',
					filePath: tempFilePaths[0],
					name: 'file',
					formData: {
						user: 'test'
					},
					success(res) {
						const data = res.data
						//do something
					}
				})
			},
			fail: (error) => {
				_this.setData({
					successReadImg: false
				})
				wx.showToast({
					title: '获取图片失败',
					icon: 'none',
					duration: 1000
				})
			}
		})
	},
	onRecord: function () {
		const recorderManager = wx.getRecorderManager()

		recorderManager.onStart(() => {
			console.log('recorder start')
		})
		recorderManager.onPause(() => {
			console.log('recorder pause')
		})
		recorderManager.onStop((res) => {
			console.log('recorder stop', res)
			const { tempFilePath } = res
			console.log('录音完以后的临时地址--', tempFilePath)
			wx.uploadFile({
				//仅为示例，非真实的接口地址
				url: 'https://example.weixin.qq.com/upload',
				filePath: tempFilePath,
				name: 'file',
				formData: {
					user: 'test'
				},
				success(res) {
					const data = res.data
					//do something
				}
			})
		})
		recorderManager.onFrameRecorded((res) => {
			const { frameBuffer } = res
			console.log('frameBuffer.byteLength', frameBuffer.byteLength)
		})

		const options = {
			duration: 10000,
			sampleRate: 44100,
			numberOfChannels: 1,
			encodeBitRate: 192000,
			format: 'aac',
			frameSize: 50
		}

		recorderManager.start(options)
	},
	onChooseVideo: function () {
		let _this = this
		wx.chooseVideo({
			sourceType: ['album', 'camera'],
			maxDuration: 60,
			camera: 'back',
			success(res) {
				console.log('读取到的临时视频文件地址', res.tempFilePath)
				const uploadTask = wx.uploadFile({
					// 上传到服务器
					url: '',
					filePath: res.tempFilePath,
					name: 'file',
					header: {
						'Content-Type': 'multipart/form-data'
					},
					//  传的自定义参数
					formData: {
						user: 'test'
					},
					success(res) {
						// 坑一：与wx.request不同，wx.uploadFile返回的是json字符串，需要自己转为JSON对象格式
						const data = JSON.parse(res.data)
						console.log(data)
					}
				})
				uploadTask.onProgressUpdate((res) => {
					console.log('上传进度', res.progress)
					console.log('已经上传的数据长度', res.totalBytesSent)
					console.log(
						'预期需要上传的数据总长度',
						res.totalBytesExpectedToSend
					)
					const uploadProgress = res.progress
					if (uploadProgress < 100) {
						// 坑2：wx.uploadFile本身有一个this，所以要通过外部var _this = this 把this带进来
						_this.setData({
							uploadPercent: uploadProgress
						})
					} else if (uploadProgress === 100) {
						_this.setData({
							uploadPercent: 50
						})
					}
				})
			}
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {}
})
