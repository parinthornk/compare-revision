
var asset = context.getVariable('header.assets')

if (!asset) {
    asset = "other"
}

context.setVariable("assets", asset);