"use strict";

const BaseExceptionHandler = use("BaseExceptionHandler");

/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {void}
   */
  async handle(error, { request, response, view }) {
    // response.status(error.status).send(error.message)
    if (
			error.name === 'InvalidSessionException' ||
			error.name === 'HttpException'
		) {
      console.log("error",error)
			return response.redirect('/');
			// return view.render('authlogin')
		}
    if (
  error.code === 'E_UNDEFINED_METHOD'
){
  console.log('OMGGGGG',error)

      return response.redirect('/auth/login');
}
	return super.handle(...arguments);
  }

  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
  async report(error, { request }) {}
}

module.exports = ExceptionHandler;
