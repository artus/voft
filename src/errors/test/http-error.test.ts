import { HTTP_CODES } from '../../constants/http-codes';
import { HttpError } from '../http-error';

const { CLIENT_ERROR, SERVER_ERROR } = HTTP_CODES;

describe('HttpError', () => {
  describe('from', () => {
    it('Should create a new HttpError from a status code and message', () => {
      const error = HttpError.from('Not Found', 404);
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe('Not Found');
    });

    it('Should use a default Internal Server error if no parameters are provided', () => {
      const error = HttpError.from();
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(500);
      expect(error.message).toBe('Internal Server Error');
    });
  });

  describe('cast', () => {
    it('Should cast an Error to a new HttpError with statuscode 500', () => {
      const testError = new Error('This is a test');
      const httpError = HttpError.cast(testError);
      expect(httpError).toBeInstanceOf(HttpError);
      expect(httpError.statusCode).toBe(500);
      expect(httpError.message).toBe('This is a test');
    });

    it('It should infer the Error type and cast it to a HttpError', () => {
      const testHttpError = HttpError.from();
      const castError = HttpError.cast(testHttpError as Error);
      expect(castError).toBeInstanceOf(HttpError);
      expect(castError.statusCode).toBe(500);
      expect(castError.message).toBe('Internal Server Error');
      expect(testHttpError).toStrictEqual(castError);
    });
  });

  describe('fromError', () => {
    it('Should return a NEW HttpError with the same message as the Error and status code 500', () => {
      const testError = new Error('This is a test');
      const httpError = HttpError.fromError(testError);
      expect(httpError).toBeInstanceOf(HttpError);
      expect(httpError.statusCode).toBe(500);
      expect(httpError.message).toBe('This is a test');
    });

    it('Should return a NEW HttpError with the same message as the Error and the supplied statuscode', () => {
      const testError = new Error('This is a test');
      const httpError = HttpError.fromError(testError, 404);
      expect(httpError).toBeInstanceOf(HttpError);
      expect(httpError.statusCode).toBe(404);
      expect(httpError.message).toBe('This is a test');
    });
  });

  describe('badRequest', () => {
    it('Should return a new HttpError with status code 400', () => {
      const error = HttpError.badRequest('Bad Request');
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe('Bad Request');
    });

    it('Should use the default message if no message is provided', () => {
      const error = HttpError.badRequest();
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(CLIENT_ERROR.BAD_REQUEST.code);
      expect(error.message).toBe(CLIENT_ERROR.BAD_REQUEST.message);
    });
  });

  describe('unauthorized', () => {
    it('Should return a new HttpError with status code 401', () => {
      const error = HttpError.unauthorized('Unauthorized');
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe('Unauthorized');
    });

    it('Should use the default message if no message is provided', () => {
      const error = HttpError.unauthorized();
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(CLIENT_ERROR.UNAUTHORIZED.code);
      expect(error.message).toBe(CLIENT_ERROR.UNAUTHORIZED.message);
    });
  });

  describe('paymentRequired', () => {
    it('Should return a new HttpError with status code 402', () => {
      const error = HttpError.paymentRequired('Payment Required');
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(402);
      expect(error.message).toBe('Payment Required');
    });

    it('Should use the default message if no message is provided', () => {
      const error = HttpError.paymentRequired();
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(CLIENT_ERROR.PAYMENT_REQUIRED.code);
      expect(error.message).toBe(CLIENT_ERROR.PAYMENT_REQUIRED.message);
    });
  });

  describe('forbidden', () => {
    it('Should return a new HttpError with status code 403', () => {
      const error = HttpError.forbidden('Forbidden');
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(403);
      expect(error.message).toBe('Forbidden');
    });

    it('Should use the default message if no message is provided', () => {
      const error = HttpError.forbidden();
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(CLIENT_ERROR.FORBIDDEN.code);
      expect(error.message).toBe(CLIENT_ERROR.FORBIDDEN.message);
    });
  });

  describe('notFound', () => {
    it('Should return a new HttpError with status code 404', () => {
      const error = HttpError.notFound('Not Found');
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe('Not Found');
    });

    it('Should use the default message if no message is provided', () => {
      const error = HttpError.notFound();
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(CLIENT_ERROR.NOT_FOUND.code);
      expect(error.message).toBe(CLIENT_ERROR.NOT_FOUND.message);
    });
  });

  describe('methodNotAllowed', () => {
    it('Should return a new HttpError with status code 405', () => {
      const error = HttpError.methodNotAllowed('Method Not Allowed');
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(405);
      expect(error.message).toBe('Method Not Allowed');
    });

    it('Should use the default message if no message is provided', () => {
      const error = HttpError.methodNotAllowed();
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(CLIENT_ERROR.METHOD_NOT_ALLOWED.code);
      expect(error.message).toBe(CLIENT_ERROR.METHOD_NOT_ALLOWED.message);
    });
  });

  describe('notAcceptable', () => {
    it('Should return a new HttpError with status code 406', () => {
      const error = HttpError.notAcceptable('Not Acceptable');
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(406);
      expect(error.message).toBe('Not Acceptable');
    });

    it('Should use the default message if no message is provided', () => {
      const error = HttpError.notAcceptable();
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(CLIENT_ERROR.NOT_ACCEPTABLE.code);
      expect(error.message).toBe(CLIENT_ERROR.NOT_ACCEPTABLE.message);
    });
  });

  describe('proxyAuthenticationRequired', () => {
    it('Should return a new HttpError with status code 407', () => {
      const error = HttpError.proxyAuthenticationRequired(
        'Proxy Authentication Required'
      );
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(407);
      expect(error.message).toBe('Proxy Authentication Required');
    });

    it('Should use the default message if no message is provided', () => {
      const error = HttpError.proxyAuthenticationRequired();
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(
        CLIENT_ERROR.PROXY_AUTHENTICATION_REQUIRED.code
      );
      expect(error.message).toBe(
        CLIENT_ERROR.PROXY_AUTHENTICATION_REQUIRED.message
      );
    });
  });

  describe('requestTimeout', () => {
    it('Should return a new HttpError with status code 408', () => {
      const error = HttpError.requestTimeout('Request Timeout');
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(408);
      expect(error.message).toBe('Request Timeout');
    });

    it('Should use the default message if no message is provided', () => {
      const error = HttpError.requestTimeout();
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(CLIENT_ERROR.REQUEST_TIMEOUT.code);
      expect(error.message).toBe(CLIENT_ERROR.REQUEST_TIMEOUT.message);
    });
  });

  describe('conflict', () => {
    it('Should return a new HttpError with status code 409', () => {
      const error = HttpError.conflict('Conflict');
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(409);
      expect(error.message).toBe('Conflict');
    });

    it('Should use the default message if no message is provided', () => {
      const error = HttpError.conflict();
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(CLIENT_ERROR.CONFLICT.code);
      expect(error.message).toBe(CLIENT_ERROR.CONFLICT.message);
    });
  });

  describe('gone', () => {
    it('Should return a new HttpError with status code 410', () => {
      const error = HttpError.gone('Gone');
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(410);
      expect(error.message).toBe('Gone');
    });

    it('Should use the default message if no message is provided', () => {
      const error = HttpError.gone();
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(CLIENT_ERROR.GONE.code);
      expect(error.message).toBe(CLIENT_ERROR.GONE.message);
    });
  });

  describe('lengthRequired', () => {
    it('Should return a new HttpError with status code 411', () => {
      const error = HttpError.lengthRequired('Length Required');
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(411);
      expect(error.message).toBe('Length Required');
    });

    it('Should use the default message if no message is provided', () => {
      const error = HttpError.lengthRequired();
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(CLIENT_ERROR.LENGTH_REQUIRED.code);
      expect(error.message).toBe(CLIENT_ERROR.LENGTH_REQUIRED.message);
    });
  });

  describe('preconditionFailed', () => {
    it('Should return a new HttpError with status code 412', () => {
      const error = HttpError.preconditionFailed('Precondition Failed');
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(412);
      expect(error.message).toBe('Precondition Failed');
    });

    it('Should use the default message if no message is provided', () => {
      const error = HttpError.preconditionFailed();
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(CLIENT_ERROR.PRECONDITION_FAILED.code);
      expect(error.message).toBe(CLIENT_ERROR.PRECONDITION_FAILED.message);
    });
  });

  describe('payloadTooLarge', () => {
    it('Should return a new HttpError with status code 413', () => {
      const error = HttpError.payloadTooLarge('Payload Too Large');
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(413);
      expect(error.message).toBe('Payload Too Large');
    });

    it('Should use the default message if no message is provided', () => {
      const error = HttpError.payloadTooLarge();
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(CLIENT_ERROR.PAYLOAD_TOO_LARGE.code);
      expect(error.message).toBe(CLIENT_ERROR.PAYLOAD_TOO_LARGE.message);
    });
  });

  describe('uriTooLong', () => {
    it('Should return a new HttpError with status code 414', () => {
      const error = HttpError.uriTooLong('URI Too Long');
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(414);
      expect(error.message).toBe('URI Too Long');
    });

    it('Should use the default message if no message is provided', () => {
      const error = HttpError.uriTooLong();
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(CLIENT_ERROR.URI_TOO_LONG.code);
      expect(error.message).toBe(CLIENT_ERROR.URI_TOO_LONG.message);
    });
  });

  describe('unsupportedMediaType', () => {
    it('Should return a new HttpError with status code 415', () => {
      const error = HttpError.unsupportedMediaType('Unsupported Media Type');
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(415);
      expect(error.message).toBe('Unsupported Media Type');
    });

    it('Should use the default message if no message is provided', () => {
      const error = HttpError.unsupportedMediaType();
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(CLIENT_ERROR.UNSUPPORTED_MEDIA_TYPE.code);
      expect(error.message).toBe(CLIENT_ERROR.UNSUPPORTED_MEDIA_TYPE.message);
    });
  });

  describe('rangeNotSatisfiable', () => {
    it('Should return a new HttpError with status code 416', () => {
      const error = HttpError.rangeNotSatisfiable('Range Not Satisfiable');
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(416);
      expect(error.message).toBe('Range Not Satisfiable');
    });

    it('Should use the default message if no message is provided', () => {
      const error = HttpError.rangeNotSatisfiable();
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(CLIENT_ERROR.RANGE_NOT_SATISFIABLE.code);
      expect(error.message).toBe(CLIENT_ERROR.RANGE_NOT_SATISFIABLE.message);
    });
  });

  describe('expectationFailed', () => {
    it('Should return a new HttpError with status code 417', () => {
      const error = HttpError.expectationFailed('Expectation Failed');
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(417);
      expect(error.message).toBe('Expectation Failed');
    });

    it('Should use the default message if no message is provided', () => {
      const error = HttpError.expectationFailed();
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(CLIENT_ERROR.EXPECTATION_FAILED.code);
      expect(error.message).toBe(CLIENT_ERROR.EXPECTATION_FAILED.message);
    });
  });

  describe('imATeapot', () => {
    it('Should return a new HttpError with status code 418', () => {
      const error = HttpError.imATeapot("I'm a teapot");
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(418);
      expect(error.message).toBe("I'm a teapot");
    });

    it('Should use the default message if no message is provided', () => {
      const error = HttpError.imATeapot();
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(CLIENT_ERROR.I_AM_A_TEAPOT.code);
      expect(error.message).toBe(CLIENT_ERROR.I_AM_A_TEAPOT.message);
    });
  });

  describe('misdirectedRequest', () => {
    it('Should return a new HttpError with status code 421', () => {
      const error = HttpError.misdirectedRequest('Misdirected Request');
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(421);
      expect(error.message).toBe('Misdirected Request');
    });

    it('Should use the default message if no message is provided', () => {
      const error = HttpError.misdirectedRequest();
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(CLIENT_ERROR.MISDIRECTED_REQUEST.code);
      expect(error.message).toBe(CLIENT_ERROR.MISDIRECTED_REQUEST.message);
    });
  });

  describe('unprocessableEntity', () => {
    it('Should return a new HttpError with status code 422', () => {
      const error = HttpError.unprocessableEntity('Unprocessable Entity');
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(422);
      expect(error.message).toBe('Unprocessable Entity');
    });

    it('Should use the default message if no message is provided', () => {
      const error = HttpError.unprocessableEntity();
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(CLIENT_ERROR.UNPROCESSABLE_ENTITY.code);
      expect(error.message).toBe(CLIENT_ERROR.UNPROCESSABLE_ENTITY.message);
    });
  });

  describe('locked', () => {
    it('Should return a new HttpError with status code 423', () => {
      const error = HttpError.locked('Locked');
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(423);
      expect(error.message).toBe('Locked');
    });

    it('Should use the default message if no message is provided', () => {
      const error = HttpError.locked();
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(CLIENT_ERROR.LOCKED.code);
      expect(error.message).toBe(CLIENT_ERROR.LOCKED.message);
    });
  });

  describe('failedDependency', () => {
    it('Should return a new HttpError with status code 424', () => {
      const error = HttpError.failedDependency('Failed Dependency');
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(424);
      expect(error.message).toBe('Failed Dependency');
    });

    it('Should use the default message if no message is provided', () => {
      const error = HttpError.failedDependency();
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(CLIENT_ERROR.FAILED_DEPENDENCY.code);
      expect(error.message).toBe(CLIENT_ERROR.FAILED_DEPENDENCY.message);
    });
  });

  describe('tooEarly', () => {
    it('Should return a new HttpError with status code 425', () => {
      const error = HttpError.tooEarly('Too Early');
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(425);
      expect(error.message).toBe('Too Early');
    });

    it('Should use the default message if no message is provided', () => {
      const error = HttpError.tooEarly();
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(CLIENT_ERROR.TOO_EARLY.code);
      expect(error.message).toBe(CLIENT_ERROR.TOO_EARLY.message);
    });
  });

  describe('upgradeRequired', () => {
    it('Should return a new HttpError with status code 426', () => {
      const error = HttpError.upgradeRequired('Upgrade Required');
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(426);
      expect(error.message).toBe('Upgrade Required');
    });

    it('Should use the default message if no message is provided', () => {
      const error = HttpError.upgradeRequired();
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(CLIENT_ERROR.UPGRADE_REQUIRED.code);
      expect(error.message).toBe(CLIENT_ERROR.UPGRADE_REQUIRED.message);
    });
  });

  describe('preconditionRequired', () => {
    it('Should return a new HttpError with status code 428', () => {
      const error = HttpError.preconditionRequired('Precondition Required');
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(428);
      expect(error.message).toBe('Precondition Required');
    });

    it('Should use the default message if no message is provided', () => {
      const error = HttpError.preconditionRequired();
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(CLIENT_ERROR.PRECONDITION_REQUIRED.code);
      expect(error.message).toBe(CLIENT_ERROR.PRECONDITION_REQUIRED.message);
    });
  });

  describe('tooManyRequests', () => {
    it('Should return a new HttpError with status code 429', () => {
      const error = HttpError.tooManyRequests('Too Many Requests');
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(429);
      expect(error.message).toBe('Too Many Requests');
    });

    it('Should use the default message if no message is provided', () => {
      const error = HttpError.tooManyRequests();
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(CLIENT_ERROR.TOO_MANY_REQUESTS.code);
      expect(error.message).toBe(CLIENT_ERROR.TOO_MANY_REQUESTS.message);
    });
  });

  describe('requestHeaderFieldsTooLarge', () => {
    it('Should return a new HttpError with status code 431', () => {
      const error = HttpError.requestHeaderFieldsTooLarge(
        'Request Header Fields Too Large'
      );
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(431);
      expect(error.message).toBe('Request Header Fields Too Large');
    });

    it('Should use the default message if no message is provided', () => {
      const error = HttpError.requestHeaderFieldsTooLarge();
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(
        CLIENT_ERROR.REQUEST_HEADER_FIELDS_TOO_LARGE.code
      );
      expect(error.message).toBe(
        CLIENT_ERROR.REQUEST_HEADER_FIELDS_TOO_LARGE.message
      );
    });
  });

  describe('unavailableForLegalReasons', () => {
    it('Should return a new HttpError with status code 451', () => {
      const error = HttpError.unavailableForLegalReasons(
        'Unavailable For Legal Reasons'
      );
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(451);
      expect(error.message).toBe('Unavailable For Legal Reasons');
    });

    it('Should use the default message if no message is provided', () => {
      const error = HttpError.unavailableForLegalReasons();
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(
        CLIENT_ERROR.UNAVAILABLE_FOR_LEGAL_REASONS.code
      );
      expect(error.message).toBe(
        CLIENT_ERROR.UNAVAILABLE_FOR_LEGAL_REASONS.message
      );
    });
  });

  describe('internalServerError', () => {
    it('Should return a new HttpError with status code 500', () => {
      const error = HttpError.internalServerError('Internal Server Error');
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(500);
      expect(error.message).toBe('Internal Server Error');
    });

    it('Should use the default message if no message is provided', () => {
      const error = HttpError.internalServerError();
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(SERVER_ERROR.INTERNAL_SERVER_ERROR.code);
      expect(error.message).toBe(SERVER_ERROR.INTERNAL_SERVER_ERROR.message);
    });
  });

  describe('notImplemented', () => {
    it('Should return a new HttpError with status code 501', () => {
      const error = HttpError.notImplemented('Not Implemented');
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(501);
      expect(error.message).toBe('Not Implemented');
    });

    it('Should use the default message if no message is provided', () => {
      const error = HttpError.notImplemented();
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(SERVER_ERROR.NOT_IMPLEMENTED.code);
      expect(error.message).toBe(SERVER_ERROR.NOT_IMPLEMENTED.message);
    });
  });

  describe('badGateway', () => {
    it('Should return a new HttpError with status code 502', () => {
      const error = HttpError.badGateway('Bad Gateway');
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(502);
      expect(error.message).toBe('Bad Gateway');
    });

    it('Should use the default message if no message is provided', () => {
      const error = HttpError.badGateway();
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(SERVER_ERROR.BAD_GATEWAY.code);
      expect(error.message).toBe(SERVER_ERROR.BAD_GATEWAY.message);
    });
  });

  describe('serviceUnavailable', () => {
    it('Should return a new HttpError with status code 503', () => {
      const error = HttpError.serviceUnavailable('Service Unavailable');
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(503);
      expect(error.message).toBe('Service Unavailable');
    });

    it('Should use the default message if no message is provided', () => {
      const error = HttpError.serviceUnavailable();
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(SERVER_ERROR.SERVICE_UNAVAILABLE.code);
      expect(error.message).toBe(SERVER_ERROR.SERVICE_UNAVAILABLE.message);
    });
  });

  describe('gatewayTimeout', () => {
    it('Should return a new HttpError with status code 504', () => {
      const error = HttpError.gatewayTimeout('Gateway Timeout');
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(504);
      expect(error.message).toBe('Gateway Timeout');
    });

    it('Should use the default message if no message is provided', () => {
      const error = HttpError.gatewayTimeout();
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(SERVER_ERROR.GATEWAY_TIMEOUT.code);
      expect(error.message).toBe(SERVER_ERROR.GATEWAY_TIMEOUT.message);
    });
  });

  describe('httpVersionNotSupported', () => {
    it('Should return a new HttpError with status code 505', () => {
      const error = HttpError.httpVersionNotSupported(
        'HTTP Version Not Supported'
      );
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(505);
      expect(error.message).toBe('HTTP Version Not Supported');
    });

    it('Should use the default message if no message is provided', () => {
      const error = HttpError.httpVersionNotSupported();
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(
        SERVER_ERROR.HTTP_VERSION_NOT_SUPPORTED.code
      );
      expect(error.message).toBe(
        SERVER_ERROR.HTTP_VERSION_NOT_SUPPORTED.message
      );
    });
  });

  describe('variantAlsoNegotiates', () => {
    it('Should return a new HttpError with status code 506', () => {
      const error = HttpError.variantAlsoNegotiates('Variant Also Negotiates');
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(506);
      expect(error.message).toBe('Variant Also Negotiates');
    });

    it('Should use the default message if no message is provided', () => {
      const error = HttpError.variantAlsoNegotiates();
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(SERVER_ERROR.VARIANT_ALSO_NEGOTIATES.code);
      expect(error.message).toBe(SERVER_ERROR.VARIANT_ALSO_NEGOTIATES.message);
    });
  });

  describe('insufficientStorage', () => {
    it('Should return a new HttpError with status code 507', () => {
      const error = HttpError.insufficientStorage('Insufficient Storage');
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(507);
      expect(error.message).toBe('Insufficient Storage');
    });

    it('Should use the default message if no message is provided', () => {
      const error = HttpError.insufficientStorage();
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(SERVER_ERROR.INSUFFICIENT_STORAGE.code);
      expect(error.message).toBe(SERVER_ERROR.INSUFFICIENT_STORAGE.message);
    });
  });

  describe('loopDetected', () => {
    it('Should return a new HttpError with status code 508', () => {
      const error = HttpError.loopDetected('Loop Detected');
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(508);
      expect(error.message).toBe('Loop Detected');
    });

    it('Should use the default message if no message is provided', () => {
      const error = HttpError.loopDetected();
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(SERVER_ERROR.LOOP_DETECTED.code);
      expect(error.message).toBe(SERVER_ERROR.LOOP_DETECTED.message);
    });
  });

  describe('notExtended', () => {
    it('Should return a new HttpError with status code 510', () => {
      const error = HttpError.notExtended('Not Extended');
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(510);
      expect(error.message).toBe('Not Extended');
    });

    it('Should use the default message if no message is provided', () => {
      const error = HttpError.notExtended();
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(SERVER_ERROR.NOT_EXTENDED.code);
      expect(error.message).toBe(SERVER_ERROR.NOT_EXTENDED.message);
    });
  });

  describe('networkAuthenticationRequired', () => {
    it('Should return a new HttpError with status code 511', () => {
      const error = HttpError.networkAuthenticationRequired(
        'Network Authentication Required'
      );
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(511);
      expect(error.message).toBe('Network Authentication Required');
    });

    it('Should use the default message if no message is provided', () => {
      const error = HttpError.networkAuthenticationRequired();
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(
        SERVER_ERROR.NETWORK_AUTHENTICATION_REQUIRED.code
      );
      expect(error.message).toBe(
        SERVER_ERROR.NETWORK_AUTHENTICATION_REQUIRED.message
      );
    });
  });
});
