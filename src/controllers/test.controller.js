const public = (req, res, next) => {
    res.json("Hello from public route");
}

const private = (req, res, next) => {
    res.json("Hello from private route");
}

const adminPath = (req, res, next) => {
    res.json("Hello from admin route");
}

module.exports = {
    public,
    private,
    adminPath,
};