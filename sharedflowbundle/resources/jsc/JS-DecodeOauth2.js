var app = {
  app_id: context.getVariable("developer.app.id"),
  product_name: context.getVariable("apigee.apiproduct.name"),
  app_name: context.getVariable("developer.app.name"),
  email: context.getVariable("developer.email"),
  organization_name: context.getVariable("organization_name"),
  environment: context.getVariable("environment.name")
};

context.setVariable("Info_application", JSON.stringify((JSON.stringify(app))));