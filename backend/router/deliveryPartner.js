const express = require("express");
const router = express.Router();
const {addDeliveryPartner,getAllDeliveryPartnerUsers, getAllDeliveryPartners, getAvailableDeliveryPartners,toggleDeliveryPartnerStatus,updateDeliveryPartnerLocation}=require("../controller/deliveryPartner")

const auth = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/permissions");



router.post(
    "/addpartner",
    auth,
    checkPermission("delivery-partner", "create"),
    addDeliveryPartner
);

router.get(
    "/all-users",
    auth,
    checkPermission("delivery-partner", "read"),
    getAllDeliveryPartnerUsers
);

router.get(
    "/all",
    auth,
    checkPermission("delivery-partner", "read"),
    getAllDeliveryPartners
);
router.get(
    "/available", auth,checkPermission("delivery-partner", "read"),
    getAvailableDeliveryPartners
);
router.patch(
    "/delivery-partner/toggle-status",
    auth,
    toggleDeliveryPartnerStatus
);

router.patch(
    "/delivery-partner/update-location",
    auth,
    updateDeliveryPartnerLocation
);


module.exports = router;