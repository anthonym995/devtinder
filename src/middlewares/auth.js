const adminAuth = (req, res, next) => {
  const token = "xyz";
  const isAuthorized = token === "xyz1";
  if (!isAuthorized) {
    res.status(401).send("Your Not Authorised to get these data");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  const token = "xyz";
  const isAuthorized = token === "xyz1";
  if (!isAuthorized) {
    res.status(401).send("Your Not Authorised to get these data");
  } else {
    next();
  }
};

module.exports = { adminAuth, userAuth };
