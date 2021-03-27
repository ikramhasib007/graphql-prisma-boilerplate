import createError from "../utils/createError";
import getUserId from "../utils/getUserId"

const User = {
  email(parent, args, { request }, info) {
    try {
      const userId = getUserId(request, false);
      
      if(userId && userId === parent.id) {
        return parent.email
      } else {
        return null
      }
    } catch (error) {
      return createError.BadRequest(error)
    }
  }
}

export default User