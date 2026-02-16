var MAX_LEN = 100000;

// default กัน unresolved
context.setVariable(
  "reqPayload",
  JSON.stringify({ message: "NO_REQUEST_PAYLOAD" })
);

var payload = context.getVariable("request.content");
var len = context.getVariable("request.header.content-length");

if (payload) {
  // มี content-length และไม่เกิน
  if (len && parseInt(len, 10) <= MAX_LEN) {
    context.setVariable("reqPayload", payload);
  }
  // ไม่มี content-length (chunked)
  else if (!len && payload.length <= MAX_LEN) {
    context.setVariable("reqPayload", payload);
  }
  // ใหญ่เกิน
  else {
    context.setVariable(
      "reqPayload",
      JSON.stringify({
        message: "REQUEST_PAYLOAD_TOO_LARGE",
        truncated: true,
        contentLength: len || payload.length
      })
    );
  }
}
