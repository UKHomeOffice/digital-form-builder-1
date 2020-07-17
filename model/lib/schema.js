"use strict";

const joi = require('joi');

const sectionsSchema = joi.object().keys({
  name: joi.string().required(),
  title: joi.string().required()
});
const conditionFieldSchema = joi.object().keys({
  name: joi.string().required(),
  type: joi.string().required(),
  display: joi.string().required()
});
const conditionValueSchema = joi.object().keys({
  type: joi.string().required(),
  value: joi.string().required(),
  display: joi.string().required()
});
const relativeTimeValueSchema = joi.object().keys({
  type: joi.string().required(),
  timePeriod: joi.string().required(),
  timeUnit: joi.string().required(),
  direction: joi.string().required(),
  timeOnly: joi.boolean().required()
});
const conditionSchema = joi.object().keys({
  field: conditionFieldSchema,
  operator: joi.string().required(),
  value: joi.alternatives().try(conditionValueSchema, relativeTimeValueSchema),
  coordinator: joi.string().optional()
});
const conditionGroupSchema = joi.object().keys({
  conditions: joi.array().items(joi.alternatives().try(conditionSchema,
  /**Should be a link to conditionGroupSchema **/
  joi.any()))
});
const conditionsModelSchema = joi.object().keys({
  name: joi.string().required(),
  conditions: joi.array().items(joi.alternatives().try(conditionSchema, conditionGroupSchema))
});
const conditionsSchema = joi.object().keys({
  name: joi.string().required(),
  displayName: joi.string(),
  value: joi.alternatives().try(joi.string(), conditionsModelSchema).required()
});
const localisedString = joi.alternatives().try(joi.object({
  a: joi.any()
}).unknown(), joi.string().allow(''));
const componentSchema = joi.object().keys({
  type: joi.string().required(),
  name: joi.string(),
  title: localisedString,
  hint: localisedString.optional(),
  options: joi.object().default({}),
  schema: joi.object().default({}),
  errors: joi.object({
    a: joi.any()
  }).optional()
}).unknown(true);
const nextSchema = joi.object().keys({
  path: joi.string().required(),
  condition: joi.string().allow('').optional()
});
const pageSchema = joi.object().keys({
  path: joi.string().required(),
  title: localisedString,
  section: joi.string(),
  controller: joi.string(),
  components: joi.array().items(componentSchema),
  next: joi.array().items(nextSchema),
  repeatField: joi.string().optional()
});
const listItemSchema = joi.object().keys({
  text: localisedString,
  value: joi.alternatives().try(joi.number(), joi.string()),
  description: localisedString.optional(),
  conditional: joi.object().keys({
    components: joi.array().required().items(componentSchema.unknown(true)).unique('name')
  }).allow(null).optional(),
  condition: joi.string().allow('').optional()
});
const listSchema = joi.object().keys({
  name: joi.string().required(),
  title: localisedString,
  type: joi.string().required().valid('string', 'number'),
  items: joi.array().items(listItemSchema)
});
const feeSchema = joi.object().keys({
  description: joi.string().required(),
  amount: joi.number().required(),
  multiplier: joi.string().optional(),
  condition: joi.string().optional()
});
const notifySchema = joi.object().keys({
  apiKey: joi.string().allow('').optional(),
  templateId: joi.string(),
  personalisation: joi.array().items(joi.string()),
  emailField: joi.string()
});
const emailSchema = joi.object().keys({
  emailAddress: joi.string()
});
const webhookSchema = joi.object().keys({
  url: joi.string()
});
const sheetItemSchema = joi.object().keys({
  name: joi.string(),
  id: joi.string()
});
const sheetsSchema = joi.object().keys({
  credentials: joi.object().keys({
    private_key: joi.string(),
    client_email: joi.string()
  }),
  project_id: joi.string(),
  scopes: joi.array().items(joi.string()),
  sheets: joi.array().items(sheetItemSchema),
  spreadsheetIdField: joi.string()
});
const outputSchema = joi.object().keys({
  name: joi.string(),
  type: joi.string().allow('confirmationEmail', 'email', 'webhook', 'sheets'),
  outputConfiguration: joi.alternatives().try(notifySchema, emailSchema, webhookSchema, sheetsSchema)
});
const schema = joi.object().required().keys({
  name: localisedString.optional(),
  startPage: joi.string().required(),
  pages: joi.array().required().items(pageSchema).unique('path'),
  sections: joi.array().items(sectionsSchema).unique('name').required(),
  conditions: joi.array().items(conditionsSchema).unique('name'),
  lists: joi.array().items(listSchema).unique('name'),
  fees: joi.array().items(feeSchema).optional(),
  metadata: joi.object({
    a: joi.any()
  }).unknown().optional(),
  declaration: joi.string().allow('').optional(),
  outputs: joi.array().items(outputSchema),
  payApiKey: joi.string().allow('').optional(),
  skipSummary: joi.boolean().default(false)
});
module.exports = schema;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zY2hlbWEuanMiXSwibmFtZXMiOlsiam9pIiwicmVxdWlyZSIsInNlY3Rpb25zU2NoZW1hIiwib2JqZWN0Iiwia2V5cyIsIm5hbWUiLCJzdHJpbmciLCJyZXF1aXJlZCIsInRpdGxlIiwiY29uZGl0aW9uRmllbGRTY2hlbWEiLCJ0eXBlIiwiZGlzcGxheSIsImNvbmRpdGlvblZhbHVlU2NoZW1hIiwidmFsdWUiLCJyZWxhdGl2ZVRpbWVWYWx1ZVNjaGVtYSIsInRpbWVQZXJpb2QiLCJ0aW1lVW5pdCIsImRpcmVjdGlvbiIsInRpbWVPbmx5IiwiYm9vbGVhbiIsImNvbmRpdGlvblNjaGVtYSIsImZpZWxkIiwib3BlcmF0b3IiLCJhbHRlcm5hdGl2ZXMiLCJ0cnkiLCJjb29yZGluYXRvciIsIm9wdGlvbmFsIiwiY29uZGl0aW9uR3JvdXBTY2hlbWEiLCJjb25kaXRpb25zIiwiYXJyYXkiLCJpdGVtcyIsImFueSIsImNvbmRpdGlvbnNNb2RlbFNjaGVtYSIsImNvbmRpdGlvbnNTY2hlbWEiLCJkaXNwbGF5TmFtZSIsImxvY2FsaXNlZFN0cmluZyIsImEiLCJ1bmtub3duIiwiYWxsb3ciLCJjb21wb25lbnRTY2hlbWEiLCJoaW50Iiwib3B0aW9ucyIsImRlZmF1bHQiLCJzY2hlbWEiLCJlcnJvcnMiLCJuZXh0U2NoZW1hIiwicGF0aCIsImNvbmRpdGlvbiIsInBhZ2VTY2hlbWEiLCJzZWN0aW9uIiwiY29udHJvbGxlciIsImNvbXBvbmVudHMiLCJuZXh0IiwicmVwZWF0RmllbGQiLCJsaXN0SXRlbVNjaGVtYSIsInRleHQiLCJudW1iZXIiLCJkZXNjcmlwdGlvbiIsImNvbmRpdGlvbmFsIiwidW5pcXVlIiwibGlzdFNjaGVtYSIsInZhbGlkIiwiZmVlU2NoZW1hIiwiYW1vdW50IiwibXVsdGlwbGllciIsIm5vdGlmeVNjaGVtYSIsImFwaUtleSIsInRlbXBsYXRlSWQiLCJwZXJzb25hbGlzYXRpb24iLCJlbWFpbEZpZWxkIiwiZW1haWxTY2hlbWEiLCJlbWFpbEFkZHJlc3MiLCJ3ZWJob29rU2NoZW1hIiwidXJsIiwic2hlZXRJdGVtU2NoZW1hIiwiaWQiLCJzaGVldHNTY2hlbWEiLCJjcmVkZW50aWFscyIsInByaXZhdGVfa2V5IiwiY2xpZW50X2VtYWlsIiwicHJvamVjdF9pZCIsInNjb3BlcyIsInNoZWV0cyIsInNwcmVhZHNoZWV0SWRGaWVsZCIsIm91dHB1dFNjaGVtYSIsIm91dHB1dENvbmZpZ3VyYXRpb24iLCJzdGFydFBhZ2UiLCJwYWdlcyIsInNlY3Rpb25zIiwibGlzdHMiLCJmZWVzIiwibWV0YWRhdGEiLCJkZWNsYXJhdGlvbiIsIm91dHB1dHMiLCJwYXlBcGlLZXkiLCJza2lwU3VtbWFyeSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7O0FBQUEsTUFBTUEsR0FBRyxHQUFHQyxPQUFPLENBQUMsS0FBRCxDQUFuQjs7QUFFQSxNQUFNQyxjQUFjLEdBQUdGLEdBQUcsQ0FBQ0csTUFBSixHQUFhQyxJQUFiLENBQWtCO0FBQ3ZDQyxFQUFBQSxJQUFJLEVBQUVMLEdBQUcsQ0FBQ00sTUFBSixHQUFhQyxRQUFiLEVBRGlDO0FBRXZDQyxFQUFBQSxLQUFLLEVBQUVSLEdBQUcsQ0FBQ00sTUFBSixHQUFhQyxRQUFiO0FBRmdDLENBQWxCLENBQXZCO0FBS0EsTUFBTUUsb0JBQW9CLEdBQUdULEdBQUcsQ0FBQ0csTUFBSixHQUFhQyxJQUFiLENBQWtCO0FBQzdDQyxFQUFBQSxJQUFJLEVBQUVMLEdBQUcsQ0FBQ00sTUFBSixHQUFhQyxRQUFiLEVBRHVDO0FBRTdDRyxFQUFBQSxJQUFJLEVBQUVWLEdBQUcsQ0FBQ00sTUFBSixHQUFhQyxRQUFiLEVBRnVDO0FBRzdDSSxFQUFBQSxPQUFPLEVBQUVYLEdBQUcsQ0FBQ00sTUFBSixHQUFhQyxRQUFiO0FBSG9DLENBQWxCLENBQTdCO0FBTUEsTUFBTUssb0JBQW9CLEdBQUdaLEdBQUcsQ0FBQ0csTUFBSixHQUFhQyxJQUFiLENBQWtCO0FBQzdDTSxFQUFBQSxJQUFJLEVBQUVWLEdBQUcs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QW9DMEIsTUFBcEMsQ0FBMkMsTUFBM0MsQ0FMOEI7QUFNMUM4QixFQUFBQSxLQUFLLEVBQUV6RixHQUFHLENBQUM2QixLQUFKLEdBQVlDLEtBQVosQ0FBa0I4QixVQUFsQixFQUE4QkQsTUFBOUIsQ0FBcUMsTUFBckMsQ0FObUM7QUFPMUMrQixFQUFBQSxJQUFJLEVBQUUxRixHQUFHLENBQUM2QixLQUFKLEdBQVlDLEtBQVosQ0FBa0JnQyxTQUFsQixFQUE2QnBDLFFBQTdCLEVBUG9DO0FBUTFDaUUsRUFBQUEsUUFBUSxFQUFFM0YsR0FBRyxDQUFDRyxNQUFKLENBQVc7QUFBRWlDLElBQUFBLENBQUMsRUFBRXBDLEdBQUcsQ0FBQytCLEdBQUo7QUFBTCxHQUFYLEVBQTZCTSxPQUE3QixHQUF1Q1gsUUFBdkMsRUFSZ0M7QUFTMUNrRSxFQUFBQSxXQUFXLEVBQUU1RixHQUFHLENBQUNNLE1BQUosR0FBYWdDLEtBQWIsQ0FBbUIsRUFBbkIsRUFBdUJaLFFBQXZCLEVBVDZCO0FBVTFDbUUsRUFBQUEsT0FBTyxFQUFFN0YsR0FBRyxDQUFDNkIsS0FBSixHQUFZQyxLQUFaLENBQWtCc0QsWUFBbEIsQ0FWaUM7QUFXMUNVLEVBQUFBLFNBQVMsRUFBRTlGLEdBQUcsQ0FBQ00sTUFBSixHQUFhZ0MsS0FBYixDQUFtQixFQUFuQixFQUF1QlosUUFBdkIsRUFYK0I7QUFZMUNxRSxFQUFBQSxXQUFXLEVBQUUvRixHQUFHLENBQUNtQixPQUFKLEdBQWN1QixPQUFkLENBQXNCLEtBQXRCO0FBWjZCLENBQTdCLENBQWY7QUFlQXNELE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQnRELE1BQWpCIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qgam9pID0gcmVxdWlyZSgnam9pJylcblxuY29uc3Qgc2VjdGlvbnNTY2hlbWEgPSBqb2kub2JqZWN0KCkua2V5cyh7XG4gIG5hbWU6IGpvaS5zdHJpbmcoKS5yZXF1aXJlZCgpLFxuICB0aXRsZTogam9pLnN0cmluZygpLnJlcXVpcmVkKClcbn0pXG5cbmNvbnN0IGNvbmRpdGlvbkZpZWxkU2NoZW1hID0gam9pLm9iamVjdCgpLmtleXMoe1xuICBuYW1lOiBqb2kuc3RyaW5nKCkucmVxdWlyZWQoKSxcbiAgdHlwZTogam9pLnN0cmluZygpLnJlcXVpcmVkKCksXG4gIGRpc3BsYXk6IGpvaS5zdHJpbmcoKS5yZXF1aXJlZCgpXG59KVxuXG5jb25zdCBjb25kaXRpb25WYWx1ZVNjaGVtYSA9IGpvaS5vYmplY3QoKS5rZXlzKHtcbiAgdHlwZTogam9pLnN0cmluZygpLnJlcXVpcmVkKCksXG4gIHZhbHVlOiBqb2kuc3RyaW5nKCkucmVxdWlyZWQoKSxcbiAgZGlzcGxheTogam9pLnN0cmluZygpLnJlcXVpcmVkKClcbn0pXG5cbmNvbnN0IHJlbGF0aXZlVGltZVZhbHVlU2NoZW1hID0gam9pLm9iamVjdCgpLmtleXMoe1xuICB0eXBlOiBqb2kuc3RyaW5nKCkucmVxdWlyZWQoKSxcbiAgdGltZVBlcmlvZDogam9pLnN0cmluZygpLnJlcXVpcmVkKCksXG4gIHRpbWVVbml0OiBqb2kuc3RyaW5nKCkucmVxdWlyZWQoKSxcbiAgZGlyZWN0aW9uOiBqb2kuc3RyaW5nKCkucmVxdWlyZWQoKSxcbiAgdGltZU9ubHk6IGpvaS5ib29sZWFuKCkucmVxdWlyZWQoKVxufSlcblxuY29uc3QgY29uZGl0aW9uU2NoZW1hID0gam9pLm9iamVjdCgpLmtleXMoe1xuICBmaWVsZDogY29uZGl0aW9uRmllbGRTY2hlbWEsXG4gIG9wZXJhdG9yOiBqb2kuc3RyaW5nKCkucmVxdWlyZWQoKSxcbiAgdmFsdWU6IGpvaS5hbHRlcm5hdGl2ZXMoKS50cnkoY29uZGl0aW9uVmFsdWVTY2hlbWEsIHJlbGF0aXZlVGltZVZhbHVlU2NoZW1hKSxcbiAgY29vcmRpbmF0b3I6IGpvaS5zdHJpbmcoKS5vcHRpb25hbCgpXG59KVxuXG5jb25zdCBjb25kaXRpb25Hcm91cFNjaGVtYSA9IGpvaS5vYmplY3QoKS5rZXlzKHtcbiAgY29uZGl0aW9uczogam9pLmFycmF5KCkuaXRlbXMoam9pLmFsdGVybmF0aXZlcygpLnRyeShjb25kaXRpb25TY2hlbWEsIC8qKlNob3VsZCBiZSBhIGxpbmsgdG8gY29uZGl0aW9uR3JvdXBTY2hlbWEgKiovam9pLmFueSgpKSlcbn0pXG5cbmNvbnN0IGNvbmRpdGlvbnNNb2RlbFNjaGVtYSA9IGpvaS5vYmplY3QoKS5rZXlzKHtcbiAgbmFtZTogam9pLnN0cmluZygpLnJlcXVpcmVkKCksXG4gIGNvbmRpdGlvbnM6IGpvaS5hcnJheSgpLml0ZW1zKGpvaS5hbHRlcm5hdGl2ZXMoKS50cnkoY29uZGl0aW9uU2NoZW1hLCBjb25kaXRpb25Hcm91cFNjaGVtYSkpXG59KVxuXG5jb25zdCBjb25kaXRpb25zU2NoZW1hID0gam9pLm9iamVjdCgpLmtleXMoe1xuICBuYW1lOiBqb2kuc3RyaW5nKCkucmVxdWlyZWQoKSxcbiAgZGlzcGxheU5hbWU6IGpvaS5zdHJpbmcoKSxcbiAgdmFsdWU6IGpvaS5hbHRlcm5hdGl2ZXMoKS50cnkoam9pLnN0cmluZygpLCBjb25kaXRpb25zTW9kZWxTY2hlbWEpLnJlcXVpcmVkKClcbn0pXG5cbmNvbnN0IGxvY2FsaXNlZFN0cmluZyA9IGpvaS5hbHRlcm5hdGl2ZXMoKS50cnkoam9pLm9iamVjdCh7IGE6IGpvaS5hbnkoKSB9KS51bmtub3duKCksIGpvaS5zdHJpbmcoKS5hbGxvdygnJykpXG5cbmNvbnN0IGNvbXBvbmVudFNjaGVtYSA9IGpvaS5vYmplY3QoKS5rZXlzKHtcbiAgdHlwZTogam9pLnN0cmluZygpLnJlcXVpcmVkKCksXG4gIG5hbWU6IGpvaS5zdHJpbmcoKSxcbiAgdGl0bGU6IGxvY2FsaXNlZFN0cmluZyxcbiAgaGludDogbG9jYWxpc2VkU3RyaW5nLm9wdGlvbmFsKCksXG4gIG9wdGlvbnM6IGpvaS5vYmplY3QoKS5kZWZhdWx0KHt9KSxcbiAgc2NoZW1hOiBqb2kub2JqZWN0KCkuZGVmYXVsdCh7fSksXG4gIGVycm9yczogam9pLm9iamVjdCh7IGE6IGpvaS5hbnkoKSB9KS5vcHRpb25hbCgpXG59KS51bmtub3duKHRydWUpXG5cbmNvbnN0IG5leHRTY2hlbWEgPSBqb2kub2JqZWN0KCkua2V5cyh7XG4gIHBhdGg6IGpvaS5zdHJpbmcoKS5yZXF1aXJlZCgpLFxuICBjb25kaXRpb246IGpvaS5zdHJpbmcoKS5hbGxvdygnJykub3B0aW9uYWwoKVxufSlcblxuY29uc3QgcGFnZVNjaGVtYSA9IGpvaS5vYmplY3QoKS5rZXlzKHtcbiAgcGF0aDogam9pLnN0cmluZygpLnJlcXVpcmVkKCksXG4gIHRpdGxlOiBsb2NhbGlzZWRTdHJpbmcsXG4gIHNlY3Rpb246IGpvaS5zdHJpbmcoKSxcbiAgY29udHJvbGxlcjogam9pLnN0cmluZygpLFxuICBjb21wb25lbnRzOiBqb2kuYXJyYXkoKS5pdGVtcyhjb21wb25lbnRTY2hlbWEpLFxuICBuZXh0OiBqb2kuYXJyYXkoKS5pdGVtcyhuZXh0U2NoZW1hKSxcbiAgcmVwZWF0RmllbGQ6IGpvaS5zdHJpbmcoKS5vcHRpb25hbCgpXG59KVxuXG5jb25zdCBsaXN0SXRlbVNjaGVtYSA9IGpvaS5vYmplY3QoKS5rZXlzKHtcbiAgdGV4dDogbG9jYWxpc2VkU3RyaW5nLFxuICB2YWx1ZTogam9pLmFsdGVybmF0aXZlcygpLnRyeShqb2kubnVtYmVyKCksIGpvaS5zdHJpbmcoKSksXG4gIGRlc2NyaXB0aW9uOiBsb2NhbGlzZWRTdHJpbmcub3B0aW9uYWwoKSxcbiAgY29uZGl0aW9uYWw6IGpvaS5vYmplY3QoKS5rZXlzKHtcbiAgICBjb21wb25lbnRzOiBqb2kuYXJyYXkoKS5yZXF1aXJlZCgpLml0ZW1zKGNvbXBvbmVudFNjaGVtYS51bmtub3duKHRydWUpKS51bmlxdWUoJ25hbWUnKVxuICB9KS5hbGxvdyhudWxsKS5vcHRpb25hbCgpLFxuICBjb25kaXRpb246IGpvaS5zdHJpbmcoKS5hbGxvdygnJykub3B0aW9uYWwoKVxufSlcblxuY29uc3QgbGlzdFNjaGVtYSA9IGpvaS5vYmplY3QoKS5rZXlzKHtcbiAgbmFtZTogam9pLnN0cmluZygpLnJlcXVpcmVkKCksXG4gIHRpdGxlOiBsb2NhbGlzZWRTdHJpbmcsXG4gIHR5cGU6IGpvaS5zdHJpbmcoKS5yZXF1aXJlZCgpLnZhbGlkKCdzdHJpbmcnLCAnbnVtYmVyJyksXG4gIGl0ZW1zOiBqb2kuYXJyYXkoKS5pdGVtcyhsaXN0SXRlbVNjaGVtYSlcbn0pXG5cbmNvbnN0IGZlZVNjaGVtYSA9IGpvaS5vYmplY3QoKS5rZXlzKHtcbiAgZGVzY3JpcHRpb246IGpvaS5zdHJpbmcoKS5yZXF1aXJlZCgpLFxuICBhbW91bnQ6IGpvaS5udW1iZXIoKS5yZXF1aXJlZCgpLFxuICBtdWx0aXBsaWVyOiBqb2kuc3RyaW5nKCkub3B0aW9uYWwoKSxcbiAgY29uZGl0aW9uOiBqb2kuc3RyaW5nKCkub3B0aW9uYWwoKVxufSlcblxuY29uc3Qgbm90aWZ5U2NoZW1hID0gam9pLm9iamVjdCgpLmtleXMoe1xuICBhcGlLZXk6IGpvaS5zdHJpbmcoKS5hbGxvdygnJykub3B0aW9uYWwoKSxcbiAgdGVtcGxhdGVJZDogam9pLnN0cmluZygpLFxuICBwZXJzb25hbGlzYXRpb246IGpvaS5hcnJheSgpLml0ZW1zKGpvaS5zdHJpbmcoKSksXG4gIGVtYWlsRmllbGQ6IGpvaS5zdHJpbmcoKVxufSlcblxuY29uc3QgZW1haWxTY2hlbWEgPSBqb2kub2JqZWN0KCkua2V5cyh7XG4gIGVtYWlsQWRkcmVzczogam9pLnN0cmluZygpXG59KVxuXG5jb25zdCB3ZWJob29rU2NoZW1hID0gam9pLm9iamVjdCgpLmtleXMoe1xuICB1cmw6IGpvaS5zdHJpbmcoKVxufSlcblxuY29uc3Qgc2hlZXRJdGVtU2NoZW1hID0gam9pLm9iamVjdCgpLmtleXMoe1xuICBuYW1lOiBqb2kuc3RyaW5nKCksXG4gIGlkOiBqb2kuc3RyaW5nKClcbn0pXG5cbmNvbnN0IHNoZWV0c1NjaGVtYSA9IGpvaS5vYmplY3QoKS5rZXlzKHtcbiAgY3JlZGVudGlhbHM6IGpvaS5vYmplY3QoKS5rZXlzKHtcbiAgICBwcml2YXRlX2tleTogam9pLnN0cmluZygpLFxuICAgIGNsaWVudF9lbWFpbDogam9pLnN0cmluZygpXG4gIH0pLFxuICBwcm9qZWN0X2lkOiBqb2kuc3RyaW5nKCksXG4gIHNjb3Blczogam9pLmFycmF5KCkuaXRlbXMoam9pLnN0cmluZygpKSxcbiAgc2hlZXRzOiBqb2kuYXJyYXkoKS5pdGVtcyhzaGVldEl0ZW1TY2hlbWEpLFxuICBzcHJlYWRzaGVldElkRmllbGQ6IGpvaS5zdHJpbmcoKVxufSlcbmNvbnN0IG91dHB1dFNjaGVtYSA9IGpvaS5vYmplY3QoKS5rZXlzKHtcbiAgbmFtZTogam9pLnN0cmluZygpLFxuICB0eXBlOiBqb2kuc3RyaW5nKCkuYWxsb3coJ2NvbmZpcm1hdGlvbkVtYWlsJywgJ2VtYWlsJywgJ3dlYmhvb2snLCAnc2hlZXRzJyksXG4gIG91dHB1dENvbmZpZ3VyYXRpb246IGpvaS5hbHRlcm5hdGl2ZXMoKS50cnkobm90aWZ5U2NoZW1hLCBlbWFpbFNjaGVtYSwgd2ViaG9va1NjaGVtYSwgc2hlZXRzU2NoZW1hKVxufSlcblxuY29uc3Qgc2NoZW1hID0gam9pLm9iamVjdCgpLnJlcXVpcmVkKCkua2V5cyh7XG4gIG5hbWU6IGxvY2FsaXNlZFN0cmluZy5vcHRpb25hbCgpLFxuICBzdGFydFBhZ2U6IGpvaS5zdHJpbmcoKS5yZXF1aXJlZCgpLFxuICBwYWdlczogam9pLmFycmF5KCkucmVxdWlyZWQoKS5pdGVtcyhwYWdlU2NoZW1hKS51bmlxdWUoJ3BhdGgnKSxcbiAgc2VjdGlvbnM6IGpvaS5hcnJheSgpLml0ZW1zKHNlY3Rpb25zU2NoZW1hKS51bmlxdWUoJ25hbWUnKS5yZXF1aXJlZCgpLFxuICBjb25kaXRpb25zOiBqb2kuYXJyYXkoKS5pdGVtcyhjb25kaXRpb25zU2NoZW1hKS51bmlxdWUoJ25hbWUnKSxcbiAgbGlzdHM6IGpvaS5hcnJheSgpLml0ZW1zKGxpc3RTY2hlbWEpLnVuaXF1ZSgnbmFtZScpLFxuICBmZWVzOiBqb2kuYXJyYXkoKS5pdGVtcyhmZWVTY2hlbWEpLm9wdGlvbmFsKCksXG4gIG1ldGFkYXRhOiBqb2kub2JqZWN0KHsgYTogam9pLmFueSgpIH0pLnVua25vd24oKS5vcHRpb25hbCgpLFxuICBkZWNsYXJhdGlvbjogam9pLnN0cmluZygpLmFsbG93KCcnKS5vcHRpb25hbCgpLFxuICBvdXRwdXRzOiBqb2kuYXJyYXkoKS5pdGVtcyhvdXRwdXRTY2hlbWEpLFxuICBwYXlBcGlLZXk6IGpvaS5zdHJpbmcoKS5hbGxvdygnJykub3B0aW9uYWwoKSxcbiAgc2tpcFN1bW1hcnk6IGpvaS5ib29sZWFuKCkuZGVmYXVsdChmYWxzZSlcbn0pXG5cbm1vZHVsZS5leHBvcnRzID0gc2NoZW1hXG4iXX0=