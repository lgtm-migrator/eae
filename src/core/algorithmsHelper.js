const timer = require('timers');
const { ErrorHelper } = require('eae-utils');
/**
* @fn AlgorithmHelper
* @desc Algorithms manager. Use it to update the available algorithms in OPAL
* @param config [in] Additional fields to include in the status
* @constructor
*/
function AlgorithmHelper(config = {}) {
    //Init member vars
    this._config = config;
    this._intervalTimeout = null;

    //Bind member functions
    this.startPeriodicUpdate = AlgorithmHelper.prototype.startPeriodicUpdate.bind(this);
    this.stopPeriodicUpdate = AlgorithmHelper.prototype.stopPeriodicUpdate.bind(this);
    this._sync = AlgorithmHelper.prototype._sync.bind(this);
}
/**
 * @fn _sync
 * @desc Update the status in the global status collection.
 * Identification is based on the ip/port combination
 * @return {Promise} Resolve to true if update operation has been successful
 * @private
 */
AlgorithmHelper.prototype._sync = function() {
    let _this = this;
    return new Promise(function(resolve, reject) {
        if (_this._statusCollection === null || _this._statusCollection === undefined) {
            reject(ErrorHelper('No MongoDB collection to sync against'));
            return;
        }

        request({
            method: 'GET',
            baseUrl: 'http://127.0.0.1:' + ts.config.port,
            uri: '/list',
            json: true
        }, function (error, response, body) {
            if (error) {
                reject(ErrorHelper());
            }


        });
    });
};

/**
 * @fn startPeriodicUpdate
 * @desc Start an automatic update and synchronisation of the status
 * @param delay The intervals (in milliseconds) on how often to update the status
 */
AlgorithmHelper.prototype.startPeriodicUpdate = function(delay = 100000) {
    let _this = this;

    //Stop previous interval if any
    _this.stopPeriodicUpdate();
    //Start a new interval update
    _this._intervalTimeout = timer.setInterval(function(){
        _this._sync(); //Update the list
    }, delay);
};

/**
 * @fn stopPeriodicUpdate
 * @desc Stops the automatic update and synchronisation.
 * Does nothing if the periodic update was not running
 */
AlgorithmHelper.prototype.stopPeriodicUpdate = function() {
    let _this = this;

    if (_this._intervalTimeout !== null && _this._intervalTimeout !== undefined) {
        timer.clearInterval(_this._intervalTimeout);
        _this._intervalTimeout = null;
    }
};

/**
 * @fn AlgorithmHelperExport
 * @param algoServiceURL {String} A valid connection url to the OPAL-algoService
 * @param options {Object} Additional custom fields
 * @return {AlgorithmHelperExport} Helper class
 */
function AlgorithmHelperExport(algoServiceURL = 'algoService', options = {}) {
    let opts = Object.assign({}, algoServiceURL, options);
    return new AlgorithmHelper(opts);
}
module.exports = AlgorithmHelperExport;
