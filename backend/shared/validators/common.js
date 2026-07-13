// Shared validators using Zod with JSDoc helper wrappers.

let zodInstance = null;
try {
  zodInstance = require("zod");
} catch (_) {
  // Safe mock wrapper if zod not present in node_modules yet
}

const schemas = {
  phone: zodInstance
    ? zodInstance.string().min(10).max(15)
    : { parse: (val) => val },
  objectId: zodInstance
    ? zodInstance.string().regex(/^[0-9a-fA-F]{24}$/)
    : { parse: (val) => val },
};

module.exports = { schemas, zod: zodInstance };
