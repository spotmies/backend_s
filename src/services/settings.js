const settingsSchema = require("../models/settings/settings");

checkOrdersForwardAutomation = () => {
  const settingName = "forward_orders";
  return new Promise((resolve) => {
    try {
      settingsSchema.findOne({ name: settingName }).exec((err, data) => {
        if (err) {
          console.log(err);
          return resolve(false);
        } else {
          console.log(data);
          if (!data || data === null || data === undefined)
            return resolve(false);
          if (data.isActive && !data.isDeleted) {
            return resolve(data.value ?? false);
          }
        }
      });
    } catch (error) {
      console.log(error);
      return resolve(false);
    }
  });
};
module.exports = {
  checkOrdersForwardAutomation,
};
