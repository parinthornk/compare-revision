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

/* ========= Request ========= */
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

/* ========= Response ========= */
var resCT = context.getVariable("response.header.Content-Type");
var resLen = context.getVariable("response.header.Content-Length");
var resTE = context.getVariable("response.header.Transfer-Encoding");
var resPayload = context.getVariable("response.content");

var resLog;
if (isBinaryOrMultipart(resCT)) {
  resLog = {
    type: "file",
    skippedPayload: true,
    contentType: resCT,
    contentLength: resLen ? parseInt(resLen, 10) : null,
    transferEncoding: resTE || null
  };
} else {
  resLog = truncatePayload(resPayload, MAX_LEN);
}

context.setVariable("resPayload", JSON.stringify(resLog));

/* ========= Common ========= */
context.setVariable("userAgent", getSafeUserAgent());
