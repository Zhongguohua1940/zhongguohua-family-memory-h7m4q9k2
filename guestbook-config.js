// 观后留言系统配置
// Google Apps Script Web 应用网址
const GUESTBOOK_API_URL = 'https://script.google.com/macros/s/AKfycbxTuUudI2Bfg3N5ouI8PQ2g6d2tzMT22inAdOOH4AiW_HmCTirO11SfSdOopdJ4l3RL4A/exec';

// 兼容现有留言页面的返回字段：Apps Script 返回 success/message，旧页面读取 ok/error。
const _guestbookFetch = window.fetch.bind(window);
window.fetch = async function(...args) {
  const response = await _guestbookFetch(...args);
  try {
    const data = await response.clone().json();
    if (Object.prototype.hasOwnProperty.call(data, 'success')) {
      return new Response(JSON.stringify({ok:data.success,error:data.message||''}), {
        status: response.status,
        headers: {'Content-Type':'application/json'}
      });
    }
  } catch (e) {}
  return response;
};
