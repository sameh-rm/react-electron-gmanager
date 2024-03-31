import HttpException from './HttpException';

class ForbiddenException extends HttpException {
  constructor(message = 'FORBIDDEN!') {
    super(403, message);
  }
}

export default ForbiddenException;
