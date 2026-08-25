var code = context.getVariable("response.status.code");
var severity = "INFO";

if (code >= 500) {
  severity = "ERROR";
} else if (code >= 400) {
  severity = "WARNING";
}

context.setVariable("log.severity", severity);