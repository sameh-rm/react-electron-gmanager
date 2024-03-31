import HttpException from './HttpException';

class BadRequestException extends HttpException {
  constructor(message = 'BAD REQUEST!') {
    super(400, message);
  }
}
export default BadRequestException;
