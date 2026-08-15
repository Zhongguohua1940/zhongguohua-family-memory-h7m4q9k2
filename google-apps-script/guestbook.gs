const SHEET_NAME = '观后留言';

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['时间', '姓名', '联系电话', '留言内容']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || '{}');
    const name = String(data.name || '').trim();
    const phone = String(data.phone || '').trim();
    const message = String(data.message || '').trim();

    if (!/^[\\u4e00-\\u9fff]{2,4}$/.test(name)) {
      return json_({ok:false, error:'姓名必须是2～4个汉字。'});
    }
    if (!/^\\d{11}$/.test(phone)) {
      return json_({ok:false, error:'联系电话必须正好11位数字。'});
    }
    if (!message) {
      return json_({ok:false, error:'留言内容不能为空。'});
    }
    if (Array.from(message).length > 100) {
      return json_({ok:false, error:'留言内容不能超过100个字。'});
    }

    const sheet = getSheet_();
    sheet.appendRow([new Date(), name, phone, message]);
    return json_({ok:true});
  } catch (err) {
    return json_({ok:false, error:'服务器暂时无法保存留言，请稍后再试。'});
  }
}

function doGet() {
  return json_({ok:true, message:'观后留言服务正常运行。'});
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
