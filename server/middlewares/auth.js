import { Jwt } from "jsonwebtoken";

const jwt = Jwt()
const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]

        let decodeData =  jwt.verfify(token, 'test')
        req.UserId = decodeData?.id
        next()
    } catch (error) {
        console.log(error)
    }
}

export default auth;