const Product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
    const products = await Product.find({ price: { $gt: 30 } })
        .sort("price")
        .select("name price ratings");
    res.status(200).json({ products, nbHits: products.length });
};

const getAllProducts = async (req, res) => {
    const { featured, company, name, sort, fields, numbericFilter } = req.query;
    const queryObject = {};
    if (featured) {
        queryObject.featured = featured === "true" ? true : false;
    }
    if (company) {
        queryObject.company = company;
    }
    if (name) {
        queryObject.name = { $regex: name, $options: "i" };
    }
    if (numbericFilter) {
        const conditionMap = {
            ">": "$gt",
            ">=": "$gte",
            "=": "$eq",
            "<": "$lt",
            "<=": "$lte",
        };
        const regEx = /\b(<|>|>=|=|<|<=)\b/g;
        let filter = numbericFilter.replace(
            regEx,
            (match) => `-${conditionMap[match]}-`
        );

        const options = ["price", "ratings"];
        filter.split(",").forEach((item) => {
            const [field, operator, value] = item.split("-");
            if (options.includes(field)) {
                queryObject[field] = { [operator]: Number(value) };
            }
        });
    }

    let result = Product.find(queryObject);

    // sort
    if (sort) {
        const sortQuery = sort.split(",").join(" ");
        result = result.sort(sortQuery);
    } else {
        result = result.sort("createdAt");
    }

    // select field
    if (fields) {
        const fieldQuery = fields.split(",").join(" ");
        result = result.select(fieldQuery);
    }

    // pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);

    const products = await result;
    res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
    getAllProducts,
    getAllProductsStatic,
};
