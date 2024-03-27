import HttpException from './HttpException';

class WrongCredentialsException extends HttpException {
  constructor(message='Wrong credentials provided') {
    super(401, message);
  }
}

export default WrongCredentialsException;
