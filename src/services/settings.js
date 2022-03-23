const settingsSchema = require("../models/settings/settings");

function checkOrdersForwardAutomation() {
  const settingName = "forward_orders";
  try {
    settingsSchema.findOne({ name: settingName }, (err, data) => {
      if (err) {
        console.log(err);
        return false;
      } else {
        if (!data || data === null || data === undefined) return false;
        if (data.isActive && !data.isDeleted) {
          return data.value ?? false;
        }
      }
    });
  } catch (error) {
    console.log(error);
    return false;
  }
}
module.exports = {
  checkOrdersForwardAutomation,
};
