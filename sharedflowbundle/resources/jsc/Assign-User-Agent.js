var ua = context.getVariable("request.header.user-agent");

if (!ua) {
  ua = "[UNKNOWN_USER_AGENT]";
}

context.setVariable("userAgent", ua);