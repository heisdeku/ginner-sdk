// utils.js
"use strict";

// the origin should point to your hosted app (React, Vue etc) in production,
//  but for development, it would point to localhost of your app (pay-app)
const origin = " http://localhost:5173/";
const iFrameId = "pay-frame-id";
const containerId = "pay-widget-wrapper";

const utils = () => {
  function closeWidget() {
    const container = document.getElementById(containerId);
    document.body.removeChild(container);
  }

  function init({ title, config }) {
    if (
      document.getElementById(containerId) &&
      document.getElementById(iFrameId)
    ) {
      closeWidget();
    }

    //create a style element with a name of stylesheet
    const styleSheet = document.createElement("style");
    // attach styles into the newly created style element innerText
    styleSheet.innerText = loaderStyles;
    // append the style into the document head
    document.head.appendChild(styleSheet);

    //create a div element for loader
    const loader = document.createElement("div");
    // attach to the newly created loader for div, an id of "pay-app-loader"
    loader.setAttribute("id", "pay-app-loader");
    loader.classList.add("app-loader");

    //create another div for child element of app loader which is for the spinner
    let childDiv = document.createElement("div");
    // attach to the div a class of "app-loader__spinner"
    childDiv.classList.add("app-loader__spinner");

    for (let i = 0; i < 12; i++) {
      let div = document.createElement("div");
      childDiv.appendChild(div);
    }
    //append the childDiv spinner to the loader div element as parent & child
    loader.appendChild(childDiv);

    //create a div element for the sdk container
    const container = document.createElement("div");
    //set the div conainer an attribute with an id of the containerId
    container.setAttribute("id", containerId);
    // set the div container an attribute of style with the styles from containerStyle
    container.setAttribute("style", containerStyle);
    // insert the sdk div container before the document body first element
    document.body.insertBefore(container, document.body.childNodes[0]);
    //appened the loader div element to the container widget
    document.getElementById(containerId).appendChild(loader);

    const source = new URL(origin);

    // create an object which olds all the attributes for the iframe
    const iframeAttr = [
      {
        key: "src",
        val: source.href,
      },
      {
        key: "style",
        val: iframeStyle,
      },
      {
        key: "id",
        val: iFrameId,
      },
      {
        key: "allowfullscreen",
        val: "true",
      },
      {
        key: "allowpaymentrequest",
        val: "true",
      },
      {
        key: "title",
        val: title,
      },
      {
        key: "sandbox",
        val: "allow-forms allow-scripts allow-same-origin allow-top-navigation-by-user-activation allow-popups",
      },
    ];
    //create an iframe element
    const iframe = document.createElement("IFRAME");
    // loop through the iframe attribute object and sets each attribute according to key and value for the iframe
    iframeAttr.forEach(({ key, val }) => iframe.setAttribute(key, val));
    //during the iframe loading state
    iframe.onload = function () {
      if (iframe.style.visibility === "visible") {
        const loader = document.getElementById("pay-app-loader");
        loader.style.display = "none";
      }
      iframe.contentWindow.postMessage(
        {
          type: "sdkData",
          config: { ...config, iframeOrigin: window.origin },
        },
        origin
      );
    };

    document.getElementById(containerId).appendChild(iframe);
    window.closePayFrame = closeWidget;
  }

  function openWidget() {
    //get the pay widget container
    const container = document.getElementById(containerId);
    // get the loader div element for the pay widget container
    const loader = document.getElementById("pay-app-loader");
    // get the iframe for the widget
    const frame = document.getElementById(iFrameId);
    //set styles to the container & loader elements making it visible and display-able
    container.style.visibility = "visible";
    container.style.display = "flex";
    loader.style.display = "block";

    setTimeout(() => {
      const container = document.getElementById(containerId);
      container.style.display = "flex";
      frame.style.display = "block";
      [container, frame].forEach((wrapper) => {
        wrapper.style.visibility = "visible";
        wrapper.focus({ preventScroll: false });
      });
    }, 1500);
  }

  return {
    openWidget,
    closeWidget,
    init,
  };
};

module.exports = utils;

const containerStyle =
  "position:fixed;overflow: hidden;display: none;justify-content: center;align-items: center;z-index: 999999999;height: 100%;width: 100%;color: transparent;background: rgba(0, 0, 0, 0.6);visibility:hidden;margin: 0;top:0;right:0;bottom:0;left:0;";
const iframeStyle =
  "position: fixed;display: none;overflow: hidden;z-index: 999999999;width: 100%;height: 100%;transition: opacity 0.3s ease 0s;visibility:hidden;margin: 0;top:0;right:0;bottom:0;left:0; border: none";
const loaderStyles = `.app-loader {
  text-align: center;
  color: white;
  margin-right: -30px;
  width: 100%;
  position: fixed;
  top: 30vh
}
@-webkit-keyframes app-loader__spinner {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
.app-loader__spinner {
  position: relative;
  display: inline-block;
  width: fit-content;
}
.app-loader__spinner div {
  position: absolute;
  -webkit-animation: app-loader__spinner linear 1s infinite;
  animation: app-loader__spinner linear 1s infinite;
  background: white;
  width: 10px;
  height: 30px;
  border-radius: 40%;
  -webkit-transform-origin: 5px 65px;
  transform-origin: 5px 65px;
}
.app-loader__spinner div:nth-child(1) {
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
  -webkit-animation-delay: -0.916666666666667s;
  animation-delay: -0.916666666666667s;
}
.app-loader__spinner div:nth-child(2) {
  -webkit-transform: rotate(30deg);
  transform: rotate(30deg);
  -webkit-animation-delay: -0.833333333333333s;
  animation-delay: -0.833333333333333s;
}
.app-loader__spinner div:nth-child(3) {
  -webkit-transform: rotate(60deg);
  transform: rotate(60deg);
  -webkit-animation-delay: -0.75s;
  animation-delay: -0.75s;
}
.app-loader__spinner div:nth-child(4) {
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
  -webkit-animation-delay: -0.666666666666667s;
  animation-delay: -0.666666666666667s;
}
.app-loader__spinner div:nth-child(5) {
  -webkit-transform: rotate(120deg);
  transform: rotate(120deg);
  -webkit-animation-delay: -0.583333333333333s;
  animation-delay: -0.583333333333333s;
}
.app-loader__spinner div:nth-child(6) {
  -webkit-transform: rotate(150deg);
  transform: rotate(150deg);
  -webkit-animation-delay: -0.5s;
  animation-delay: -0.5s;
}
.app-loader__spinner div:nth-child(7) {
  -webkit-transform: rotate(180deg);
  transform: rotate(180deg);
  -webkit-animation-delay: -0.416666666666667s;
  animation-delay: -0.416666666666667s;
}
.app-loader__spinner div:nth-child(8) {
  -webkit-transform: rotate(210deg);
  transform: rotate(210deg);
  -webkit-animation-delay: -0.333333333333333s;
  animation-delay: -0.333333333333333s;
}
.app-loader__spinner div:nth-child(9) {
  -webkit-transform: rotate(240deg);
  transform: rotate(240deg);
  -webkit-animation-delay: -0.25s;
  animation-delay: -0.25s;
}
.app-loader__spinner div:nth-child(10) {
  -webkit-transform: rotate(270deg);
  transform: rotate(270deg);
  -webkit-animation-delay: -0.166666666666667s;
  animation-delay: -0.166666666666667s;
}
.app-loader__spinner div:nth-child(11) {
  -webkit-transform: rotate(300deg);
  transform: rotate(300deg);
  -webkit-animation-delay: -0.083333333333333s;
  animation-delay: -0.083333333333333s;
}
.app-loader__spinner div:nth-child(12) {
  -webkit-transform: rotate(330deg);
  transform: rotate(330deg);
  -webkit-animation-delay: 0s;
  animation-delay: 0s;
}
.app-loader__spinner {
  -webkit-transform: translate(-20px, -20px) scale(0.2) translate(20px, 20px);
  transform: translate(-20px, -20px) scale(0.2) translate(20px, 20px);
}
`;
