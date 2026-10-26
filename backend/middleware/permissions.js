const checkPermission = (module, action) => {
  return (req, res, next) => {

    //   if (req.user?.role === "super_admin") {
    //   return next();
    // }
    const permission = `${module}:${action}`;

    const permissions = req.user.permissions;


    if (!permissions.includes(permission)) {
      return res.status(403).send({
        message: "You do not have permission"
      });
    }

    next();
  };
};

module.exports = checkPermission;