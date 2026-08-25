var MAX_LEN = 100000;

// default กันพัง
context.setVariable(
  "resPayload",
  JSON.stringify({ message: "NO_RESPONSE_PAYLOAD" })
);

var payload = context.getVariable("response.content");
var len = context.getVariable("response.header.content-length");
var status = context.getVariable("response.status.code");

if (payload) {
  // log body เฉพาะ error จะดีที่สุด
  if (status >= 400) {
    if (len && parseInt(len, 10) <= MAX_LEN) {
      context.setVariable("resPayload", payload);
    }
    else if (!len && payload.length <= MAX_LEN) {
      context.setVariable("resPayload", payload);
    }
    else {
      context.setVariable(
        "resPayload",
        JSON.stringify({
          message: "RESPONSE_PAYLOAD_TOO_LARGE",
          truncated: true,
          status: status,
          contentLength: len || payload.length
        })
      );
    }
  } else {
    context.setVariable(
      "resPayload",
      JSON.stringify({
        message: "RESPONSE_BODY_SKIPPED",
        status: status
      })
    );
  }
}
