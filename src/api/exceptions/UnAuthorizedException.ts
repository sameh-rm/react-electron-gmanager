import HttpException from "./HttpException";

class UnAuthorizedException extends HttpException {
  constructor(message = `NOT AUTHORIZED!`) {
    super(401, message);
  }
}

export default UnAuthorizedException;
