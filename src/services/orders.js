const orderDB = require("../models/orders/create_service_sch");

function addFeedbackIdToOrder(id,body){
  orderDB.findByIdAndUpdate(
    id,
    { $set: body },
    { new: true },
    (err, data) => {
    }
  );
}

module.exports = {
    addFeedbackIdToOrder,
  };
    
