/**
 * 格式化日期
 * @param {number|string} timestamp - 时间戳或日期字符串
 * @param {string} [locale='zh-CN'] - 地区设置
 * @param {object} [options] - 格式化选项
 * @returns {string} 格式化后的日期字符串
 */
export const formatDate = (timestamp, locale = 'zh-CN', options = {}) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleDateString(locale, options)
}

/**
 * 格式化时间
 * @param {number|string} timestamp - 时间戳或日期字符串
 * @param {string} [locale='zh-CN'] - 地区设置
 * @returns {string} 格式化后的日期和时间字符串
 */
export const formatDateTime = (timestamp, locale = 'zh-CN') => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleString(locale)
}

/**
 * 格式化相对时间
 * @param {number|string} timestamp - 时间戳或日期字符串
 * @returns {string} 相对时间字符串
 */
export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return ''
  
  const now = new Date()
  const date = new Date(timestamp)
  const diff = now - date

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 60) {
    return `${minutes} 分钟前`
  } else if (hours < 24) {
    return `${hours} 小时前`
  } else if (days < 30) {
    return `${days} 天前`
  } else {
    return formatDate(timestamp)
  }
} 
/**
 * 将字节大小转换为可读的文件大小
 * @param {number} bytes 字节数
 * @param {number} decimals 小数位数，默认为2
 * @returns {string} 格式化后的文件大小
 */
export function formatFileSize(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
  
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
  
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
  }

export async function checkChinese(name) {
    const chineseRegex = /[\u4e00-\u9fa5]/;
    if (chineseRegex.test(name)) {
      return true;
    }else{
      return false;
    }
}