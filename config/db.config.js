require("dotenv").config();

const url = `mongodb://${process.env.USER_ID}:${process.env.PASSWORD}@${process.env.SERVER}:${process.env.ORACLE_PORT}/${process.env.USER_ID}?authMechanism=PLAIN&authSource=$external&ssl=true&loadBalanced=true&retryWrites=false`

module.exports = {
    url
}