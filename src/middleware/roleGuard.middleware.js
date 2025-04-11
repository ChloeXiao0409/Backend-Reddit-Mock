
// Dynamic Role Guard Middleware
module.exports = (role) => (req, res, next) => {
    const {user} = req;
    if(!user) {
        res.status(401).json({error: "Unauthorized"});
        return;
    }

    console.log(user);

    if(user.role !== role) {
        res.status(403).json({error: "Invalid permission"});
        return;
    }

    next();
}