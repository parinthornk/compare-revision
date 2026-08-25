var MAX_LEN = 500;

/* ========= Helpers ========= */
function getSafeUserAgent() {
  var ua = context.getVariable("request.header.User-Agent");
  return ua && ua !== "" ? String(ua) : "UNKNOWN-USER-AGENT";
}

function isBinaryOrMultipart(contentType) {
  if (!contentType) return false;

  contentType = contentType.toLowerCase();
  return (
    contentType.indexOf("multipart/form-data") >= 0 ||
    contentType.indexOf("application/octet-stream") >= 0 ||
    contentType.indexOf("application/pdf") >= 0 ||
    contentType.indexOf("image/") >= 0 ||
    contentType.indexOf("zip") >= 0
  );
}

function truncatePayload(payload, maxLen) {
  if (!payload) return null;

  payload = String(payload);
  var len = payload.length;

  if (len <= maxLen) {
    return {
      type: "text",
      truncated: false,
      length: len,
      payload: payload
    };
  }

  return {
    type: "text",
    truncated: true,
    length: len,
    maxAllowed: maxLen,
    payload: payload.substring(0, maxLen)
  };
}

/* ========= Request (เหมือนเดิม ใช้ได้แล้ว) ========= */
var reqCT = context.getVariable("request.header.Content-Type");
var reqLen = context.getVariable("request.header.Content-Length");
var reqPayload = context.getVariable("request.content");

var reqLog;
if (isBinaryOrMultipart(reqCT)) {
  reqLog = {
    type: "file",
    skippedPayload: true,
    contentType: reqCT,
    contentLength: reqLen ? parseInt(reqLen, 10) : null
  };
} else {
  reqLog = truncatePayload(reqPayload, MAX_LEN);
}

context.setVariable("reqPayload", JSON.stringify(reqLog));

/* ========= Response (รองรับทั้ง success + error) ========= */
var statusCode = context.getVariable("response.status.code");
var resCT = context.getVariable("response.header.Content-Type");
var resLen = context.getVariable("response.header.Content-Length");
var resTE = context.getVariable("response.header.Transfer-Encoding");

// 🔥 จุดสำคัญ: เลือก payload ให้ถูกแหล่ง
var resPayload = null;

// ถ้าเป็น error status ให้ลองดึงจาก error.content ก่อน
if (statusCode >= 400) {
  resPayload = context.getVariable("error.content");
  
  // fallback ถ้า error.content ไม่มี
  if (!resPayload) {
    resPayload = context.getVariable("response.content");
  }
} else {
  // success ปกติ
  resPayload = context.getVariable("response.content");
}

var resLog;

if (isBinaryOrMultipart(resCT)) {
  resLog = {
    type: "file",
    skippedPayload: true,
    statusCode: statusCode,
    contentType: resCT,
    contentLength: resLen ? parseInt(resLen, 10) : null,
    transferEncoding: resTE || null
  };
} else {
  var bodyLog = truncatePayload(resPayload, MAX_LEN);

  resLog = {
    statusCode: statusCode,
    isError: statusCode >= 400,
    body: bodyLog
  };
}

context.setVariable("resPayload", JSON.stringify(resLog));

/* ========= Common ========= */
context.setVariable("userAgent", getSafeUserAgent());
