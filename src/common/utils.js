export function getDeviceUUID() {
	let deviceId = uni.getStorageSync('uni_deviceId') ||
		uni.getSystemInfoSync().deviceId ||
		uni.getSystemInfoSync().system + '_' + Math.random().toString(36).substr(2);

	uni.setStorageSync('uni_deviceId', deviceId)
	return deviceId;
}

//解决小程序端真机图片不展示
/**
 * 动态绑定的使用方式 例如首页使用：
 * import common from '@/utils/common'
 * :style="{
			backgroundImage: `url(${common.urlTobase64('home', 'home-bg')})`,
	 }"
 */
 
/**
 * 获取本地图
 * @param folder // 文件夹名字 如 /static/images/home
 * @param fileName // 文件名 如 home-bg
 * @param format // 文件类型 如 png jpg
 * @returns {*|string}
 */
 
// #ifdef MP-WEIXIN
export function urlTobase64 (folder, fileName, format = "png") {
	let img = `/static/img/${folder}/${fileName}.${format}`
    let imgBase64 = wx.getFileSystemManager().readFileSync(img, "base64")
    let base64Url = `data:image/png;base64,${imgBase64}`;
    return base64Url;
};
// #endif

