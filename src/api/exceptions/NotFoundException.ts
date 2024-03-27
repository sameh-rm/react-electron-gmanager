import HttpException from "./HttpException";

 class NotFoundException extends HttpException {
  constructor(message="NOT FOUND!") {
    super(404, message);
  }
}
export default NotFoundException