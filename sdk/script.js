const utils = require("./utils");
const origin = "http://localhost:3000";

function isRequired(key) {
  throw new Error(`${key} is required`);
}

function Pay({ onSuccess, onError, onClose, ...rest }) {
  if (!(this instanceof Pay))
    // checks whether there isn't an instance of Pay Class / function in the prototype chain
    // if there isn't an instance of Pay class, return a new instance of the Pay class / function with action points and other props
    return new Pay({
      onSuccess,
      onError,
      onClose,
      ...rest,
    });
  Pay.prototype.config = rest;
  Pay.prototype.onClose = onClose || isRequired("onClose callback");
  Pay.prototype.onError = onError || isRequired("onError callback");
  Pay.prototype.onSuccess = onSuccess || isRequired("onSuccess callback");
  Pay.prototype.utils = utils();
}

Pay.prototype.setup = function () {
  Pay.prototype.utils.init({
    title: "Pay SDK",
    config: this.config,
  });
};

Pay.prototype.open = function () {
  Pay.prototype.utils.openWidget({ config: this.config, sdkType: "send" });
  const handleEvents = (event) => {
    if (event.data.appOrigin !== origin) return;
    switch (event.data.type) {
      case "pay.success":
        Pay.prototype.success(event.data);
        break;
      case "pay.close":
        Pay.prototype.close(event.data);
        break;
      case "pay.server_error":
        Pay.prototype.error(event.data);
        break;
    }
  };

  Pay.prototype.eventHandler = handleEvents.bind(this);
  window.addEventListener("message", this.eventHandler, false);
};

Pay.prototype.close = function (data) {
  window.removeEventListener("message", this.eventHandler, false);
  Pay.prototype.utils.closeWidget();
  this.onClose(data);
};

Pay.prototype.success = function (data) {
  window.removeEventListener("message", this.eventHandler, false);
  Pay.prototype.utils.closeWidget();
  this.onSuccess(data);
};

Pay.prototype.error = function (event) {
  this.onError(event);
};

// This makes the module safe to import into an isomorphic code.
if (typeof window !== "undefined") {
  window.Pay = Pay; // make Pay available in the window object
}

module.exports = Pay;
