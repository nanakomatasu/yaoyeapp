/** S 是否H5端 **/
// #ifdef H5
const IS_H5 = true
// #endif

// #ifndef H5
const IS_H5 = false
// #endif
/** E 是否H5端 **/

/** S API BaseURL **/
const baseURLMap = {
	// 开发环境 
	development: 'https://rylss.12d3.cn/api/',
	// 生产环境
	production: IS_H5 ? location.origin +'/api/' : 'https://rylss.12d3.cn/api/'
}

const baseURL = baseURLMap[process.env.NODE_ENV]

const downLoadUrl = 'https://rylss.12d3.cn/apk/yaoye.apk'

const imageBaseUrl = 'https://rylss.12d3.cn'


/** E API BaseURL **/


module.exports = {  
    HEADER: {
        'content-type': 'application/json'
    },
	baseURL,					// API Base URL
	downLoadUrl,
	imageBaseUrl
}
