"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = void 0;
const http_codes_1 = require("../constants/http-codes");
const { CLIENT_ERROR, SERVER_ERROR } = http_codes_1.HTTP_CODES;
class HttpError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
    }
    /**
     * Returns an error that reflects a bad request.
     *
     * @param message - The error message.
     * @returns An error that reflects a bad request.
     */
    static badRequest(message = CLIENT_ERROR.BAD_REQUEST.message) {
        return this.from(message, CLIENT_ERROR.BAD_REQUEST.code);
    }
    /**
     * Returns an error that reflects an unauthorized request.
     * @param message
     * @returns An error that reflects an unauthorized request.
     */
    static unauthorized(message = CLIENT_ERROR.UNAUTHORIZED.message) {
        return this.from(message, CLIENT_ERROR.UNAUTHORIZED.code);
    }
    /**
     * Returns an error that reflects a payment required request.
     *
     * @param message - The error message.
     * @returns An error that reflects a payment required request.
     */
    static paymentRequired(message = CLIENT_ERROR.PAYMENT_REQUIRED.message) {
        return this.from(message, CLIENT_ERROR.PAYMENT_REQUIRED.code);
    }
    /**
     * Returns an error that reflects a forbidden request.
     *
     * @param message - The error message.
     * @returns An error that reflects a forbidden request.
     */
    static forbidden(message = CLIENT_ERROR.FORBIDDEN.message) {
        return this.from(message, CLIENT_ERROR.FORBIDDEN.code);
    }
    /**
     * Returns an error that reflects a not found request.
     *
     * @param message - The error message.
     * @returns An error that reflects a not found request.
     */
    static notFound(message = CLIENT_ERROR.NOT_FOUND.message) {
        return this.from(message, CLIENT_ERROR.NOT_FOUND.code);
    }
    /**
     * Returns an error that reflects a method not allowed request.
     *
     * @param message - The error message.
     * @returns An error that reflects a method not allowed request.
     */
    static methodNotAllowed(message = CLIENT_ERROR.METHOD_NOT_ALLOWED.message) {
        return this.from(message, CLIENT_ERROR.METHOD_NOT_ALLOWED.code);
    }
    /**
     * Returns an error that reflects a not acceptable request.
     *
     * @param message - The error message.
     * @returns An error that reflects a not acceptable request.
     */
    static notAcceptable(message = CLIENT_ERROR.NOT_ACCEPTABLE.message) {
        return this.from(message, CLIENT_ERROR.NOT_ACCEPTABLE.code);
    }
    /**
     * Returns an error that reflects a proxy authentication required request.
     *
     * @param message - The error message.
     * @returns An error that reflects a proxy authentication required request.
     */
    static proxyAuthenticationRequired(message = CLIENT_ERROR.PROXY_AUTHENTICATION_REQUIRED.message) {
        return this.from(message, CLIENT_ERROR.PROXY_AUTHENTICATION_REQUIRED.code);
    }
    /**
     * Returns an error that reflects a request timeout request.
     *
     * @param message - The error message.
     * @returns An error that reflects a request timeout request.
     */
    static requestTimeout(message = CLIENT_ERROR.REQUEST_TIMEOUT.message) {
        return this.from(message, CLIENT_ERROR.REQUEST_TIMEOUT.code);
    }
    /**
     * Returns an error that reflects a conflict request.
     *
     * @param message - The error message.
     * @returns An error that reflects a conflict request.
     */
    static conflict(message = CLIENT_ERROR.CONFLICT.message) {
        return this.from(message, CLIENT_ERROR.CONFLICT.code);
    }
    /**
     * Returns an error that reflects a gone request.
     *
     * @param message - The error message.
     * @returns An error that reflects a gone request.
     */
    static gone(message = CLIENT_ERROR.GONE.message) {
        return this.from(message, CLIENT_ERROR.GONE.code);
    }
    /**
     * Returns an error that reflects a length required request.
     *
     * @param message - The error message.
     * @returns An error that reflects a length required request.
     */
    static lengthRequired(message = CLIENT_ERROR.LENGTH_REQUIRED.message) {
        return this.from(message, CLIENT_ERROR.LENGTH_REQUIRED.code);
    }
    /**
     * Returns an error that reflects a precondition failed request.
     *
     * @param message - The error message.
     * @returns An error that reflects a precondition failed request.
     */
    static preconditionFailed(message = CLIENT_ERROR.PRECONDITION_FAILED.message) {
        return this.from(message, CLIENT_ERROR.PRECONDITION_FAILED.code);
    }
    /**
     * Returns an error that reflects a payload too large request.
     *
     * @param message - The error message.
     * @returns An error that reflects a payload too large request.
     */
    static payloadTooLarge(message = CLIENT_ERROR.PAYLOAD_TOO_LARGE.message) {
        return this.from(message, CLIENT_ERROR.PAYLOAD_TOO_LARGE.code);
    }
    /**
     * Returns an error that reflects a uri too long request.
     *
     * @param message - The error message.
     * @returns An error that reflects a uri too long request.
     */
    static uriTooLong(message = CLIENT_ERROR.URI_TOO_LONG.message) {
        return this.from(message, CLIENT_ERROR.URI_TOO_LONG.code);
    }
    /**
     * Returns an error that reflects an unsupported media type request.
     *
     * @param message - The error message.
     * @returns An error that reflects an unsupported media type request.
     */
    static unsupportedMediaType(message = CLIENT_ERROR.UNSUPPORTED_MEDIA_TYPE.message) {
        return this.from(message, CLIENT_ERROR.UNSUPPORTED_MEDIA_TYPE.code);
    }
    /**
     * Returns an error that reflects a range not satisfiable request.
     *
     * @param message - The error message.
     * @returns An error that reflects a range not satisfiable request.
     */
    static rangeNotSatisfiable(message = CLIENT_ERROR.RANGE_NOT_SATISFIABLE.message) {
        return this.from(message, CLIENT_ERROR.RANGE_NOT_SATISFIABLE.code);
    }
    /**
     * Returns an error that reflects an expectation failed request.
     *
     * @param message - The error message.
     * @returns An error that reflects an expectation failed request.
     */
    static expectationFailed(message = CLIENT_ERROR.EXPECTATION_FAILED.message) {
        return this.from(message, CLIENT_ERROR.EXPECTATION_FAILED.code);
    }
    /**
     * Returns an error that reflects an I'm a teapot request.
     *
     * @param message - The error message.
     * @returns An error that reflects an I'm a teapot request.
     */
    static imATeapot(message = CLIENT_ERROR.I_AM_A_TEAPOT.message) {
        return this.from(message, CLIENT_ERROR.I_AM_A_TEAPOT.code);
    }
    /**
     * Returns an error that reflects a misdirected request.
     *
     * @param message - The error message.
     * @returns An error that reflects a misdirected request.
     */
    static misdirectedRequest(message = CLIENT_ERROR.MISDIRECTED_REQUEST.message) {
        return this.from(message, CLIENT_ERROR.MISDIRECTED_REQUEST.code);
    }
    /**
     * Returns an error that reflects an unprocessable entity request.
     *
     * @param message - The error message.
     * @returns An error that reflects an unprocessable entity request.
     */
    static unprocessableEntity(message = CLIENT_ERROR.UNPROCESSABLE_ENTITY.message) {
        return this.from(message, CLIENT_ERROR.UNPROCESSABLE_ENTITY.code);
    }
    /**
     * Returns an error that reflects a locked request.
     *
     * @param message - The error message.
     * @returns An error that reflects a locked request.
     */
    static locked(message = CLIENT_ERROR.LOCKED.message) {
        return this.from(message, CLIENT_ERROR.LOCKED.code);
    }
    /**
     * Returns an error that reflects a failed dependency request.
     *
     * @param message - The error message.
     * @returns An error that reflects a failed dependency request.
     */
    static failedDependency(message = CLIENT_ERROR.FAILED_DEPENDENCY.message) {
        return this.from(message, CLIENT_ERROR.FAILED_DEPENDENCY.code);
    }
    /**
     * Returns an error that reflects a too early request.
     *
     * @param message - The error message.
     * @returns An error that reflects a too early request.
     */
    static tooEarly(message = CLIENT_ERROR.TOO_EARLY.message) {
        return this.from(message, CLIENT_ERROR.TOO_EARLY.code);
    }
    /**
     * Returns an error that reflects an upgrade required request.
     *
     * @param message - The error message.
     * @returns An error that reflects an upgrade required request.
     */
    static upgradeRequired(message = CLIENT_ERROR.UPGRADE_REQUIRED.message) {
        return this.from(message, CLIENT_ERROR.UPGRADE_REQUIRED.code);
    }
    /**
     * Returns an error that reflects a precondition required request.
     *
     * @param message - The error message.
     * @returns An error that reflects a precondition required request.
     */
    static preconditionRequired(message = CLIENT_ERROR.PRECONDITION_REQUIRED.message) {
        return this.from(message, CLIENT_ERROR.PRECONDITION_REQUIRED.code);
    }
    /**
     * Returns an error that reflects a too many requests request.
     *
     * @param message - The error message.
     * @returns An error that reflects a too many requests request.
     */
    static tooManyRequests(message = CLIENT_ERROR.TOO_MANY_REQUESTS.message) {
        return this.from(message, CLIENT_ERROR.TOO_MANY_REQUESTS.code);
    }
    /**
     * Returns an error that reflects a request header fields too large request.
     *
     * @param message - The error message.
     * @returns An error that reflects a request header fields too large request.
     */
    static requestHeaderFieldsTooLarge(message = CLIENT_ERROR.REQUEST_HEADER_FIELDS_TOO_LARGE.message) {
        return this.from(message, CLIENT_ERROR.REQUEST_HEADER_FIELDS_TOO_LARGE.code);
    }
    /**
     * Returns an error that reflects an unavailable for legal reasons request.
     *
     * @param message - The error message.
     * @returns An error that reflects an unavailable for legal reasons request.
     */
    static unavailableForLegalReasons(message = CLIENT_ERROR.UNAVAILABLE_FOR_LEGAL_REASONS.message) {
        return this.from(message, CLIENT_ERROR.UNAVAILABLE_FOR_LEGAL_REASONS.code);
    }
    /**
     * Returns an error that reflects an internal server error.
     *
     * @param message - The error message.
     * @returns An error that reflects an internal server error.
     */
    static internal(message = SERVER_ERROR.INTERNAL_SERVER_ERROR.message) {
        return this.from(message, SERVER_ERROR.INTERNAL_SERVER_ERROR.code);
    }
    /**
     * Returns an error that reflects a not implemented request.
     *
     * @param message - The error message.
     * @returns An error that reflects a not implemented request.
     */
    static notImplemented(message = SERVER_ERROR.NOT_IMPLEMENTED.message) {
        return this.from(message, SERVER_ERROR.NOT_IMPLEMENTED.code);
    }
    /**
     * Returns an error that reflects a bad gateway request.
     *
     * @param message - The error message.
     * @returns An error that reflects a bad gateway request.
     */
    static badGateway(message = SERVER_ERROR.BAD_GATEWAY.message) {
        return this.from(message, SERVER_ERROR.BAD_GATEWAY.code);
    }
    /**
     * Returns an error that reflects a service unavailable request.
     *
     * @param message - The error message.
     * @returns An error that reflects a service unavailable request.
     */
    static serviceUnavailable(message = SERVER_ERROR.SERVICE_UNAVAILABLE.message) {
        return this.from(message, SERVER_ERROR.SERVICE_UNAVAILABLE.code);
    }
    /**
     * Returns an error that reflects a gateway timeout request.
     *
     * @param message - The error message.
     * @returns An error that reflects a gateway timeout request.
     */
    static gatewayTimeout(message = SERVER_ERROR.GATEWAY_TIMEOUT.message) {
        return this.from(message, SERVER_ERROR.GATEWAY_TIMEOUT.code);
    }
    /**
     * Returns an error that reflects a http version not supported request.
     *
     * @param message - The error message.
     * @returns An error that reflects a http version not supported request.
     */
    static httpVersionNotSupported(message = SERVER_ERROR.HTTP_VERSION_NOT_SUPPORTED.message) {
        return this.from(message, SERVER_ERROR.HTTP_VERSION_NOT_SUPPORTED.code);
    }
    /**
     * Returns an error that reflects a variant also negotiates request.
     *
     * @param message - The error message.
     * @returns An error that reflects a variant also negotiates request.
     */
    static variantAlsoNegotiates(message = SERVER_ERROR.VARIANT_ALSO_NEGOTIATES.message) {
        return this.from(message, SERVER_ERROR.VARIANT_ALSO_NEGOTIATES.code);
    }
    /**
     * Returns an error that reflects an insufficient storage request.
     *
     * @param message - The error message.
     * @returns An error that reflects an insufficient storage request.
     */
    static insufficientStorage(message = SERVER_ERROR.INSUFFICIENT_STORAGE.message) {
        return this.from(message, SERVER_ERROR.INSUFFICIENT_STORAGE.code);
    }
    /**
     * Returns an error that reflects a loop detected request.
     *
     * @param message - The error message.
     * @returns An error that reflects a loop detected request.
     */
    static loopDetected(message = SERVER_ERROR.LOOP_DETECTED.message) {
        return this.from(message, SERVER_ERROR.LOOP_DETECTED.code);
    }
    /**
     * Returns an error that reflects a not extended request.
     *
     * @param message - The error message.
     * @returns An error that reflects a not extended request.
     */
    static notExtended(message = SERVER_ERROR.NOT_EXTENDED.message) {
        return this.from(message, SERVER_ERROR.NOT_EXTENDED.code);
    }
    /**
     * Returns an error that reflects a network authentication required request.
     *
     * @param message - The error message.
     * @returns An error that reflects a network authentication required request.
     */
    static networkAuthenticationRequired(message = SERVER_ERROR.NETWORK_AUTHENTICATION_REQUIRED.message) {
        return this.from(message, SERVER_ERROR.NETWORK_AUTHENTICATION_REQUIRED.code);
    }
    /**
     * Creates a custom error from an error.
     *
     * @param error - The error.
     * @param statusCode - The status code.
     * @returns A custom error.
     */
    static fromError(error, statusCode = 500) {
        return this.from(error.message, statusCode);
    }
    /**
     * Creates an HTTP error from a message and a status code.
     *
     * @param message - The error message.
     * @param statusCode - The status code.
     * @returns An HTTP error.
     */
    static from(message = 'Something went wrong.', statusCode = 500) {
        return new HttpError(message, statusCode);
    }
    static cast(error) {
        if (error instanceof HttpError) {
            return error;
        }
        else if (error.statusCode) {
            return this.fromError(error, error.statusCode);
        }
        return this.fromError(error, 500);
    }
}
exports.HttpError = HttpError;
