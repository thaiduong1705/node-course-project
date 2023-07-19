const asyncWrapper = (fn) => {
    // mặc định khi trong dòng express middleware chain, mình được express truyền cho 3 biến req, res, next nên giờ mình có thể khai báo đc trong cái return.
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            next(error);
        }
    };
};

module.exports = asyncWrapper;
