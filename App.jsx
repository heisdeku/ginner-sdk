// App.jsx
import { useEffect, useState } from "react";

const postMessageToListeners = ({ event, data, iframeOrigin }) => {
  window.parent &&
    window.parent.postMessage({ type: event, data }, iframeOrigin);
};

const App = () => {
  const [config, setConfig] = useState();

  // listening for messages starts here
  const handleMessage = (event) => {
    event.data.type === "sdkData" && !config && setConfig(event.data.config);
  };

  window.addEventListener("message", handleMessage);
  useEffect(() => {
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  // listening for messages ends here

  // from search query starts here
  const { search } = window.location;

  useEffect(() => {
    if (!search) return;

    const parseParams = (querystring) => {
      const params = new URLSearchParams(querystring);
      const obj = {};
      for (const key of params.keys()) {
        obj[key] = params.get(key);
      }
      return obj;
    };

    const searchConfigObj = parseParams(search);
    setConfig(searchConfigObj);
  }, [search]);

  // from search query ends here

  if (!configObj) return <div />;
  const { publicKey, amount, meta, currency, iframeOrigin } = config;

  const handleCloseClick = () =>
    postMessageToListeners({ event: "pay.close", iframeOrigin });

  const handleSuccessClick = () => {
    const transactionData = {
      type: "transaction",
      transaction: {
        id: "transaction-identifier",
        remark: "medicine",
        amount: 50000,
        currency: "NGN",
        charge: 0,
        type: "peer",
        refund: false,
        channel: "send",
        status: "success",
        user: {
          name: "Tim Cook",
          identifier: "tim",
          identifier_type: "username",
          email: "tim@apple.com",
          reference: "one-more-thing",
          created_at: "2020-05-06T12:00:00.000Z",
          updated_at: "2020-05-06T12:00:00.000Z",
        },
        checkout: null,
        mode: "credit",
        reference: "transaction-reference",
        peer: {
          user: {
            name: "Kamsi Oleka",
            identifier: "ezemmuo",
            identifier_type: "username",
          },
          business: {
            name: "Apple",
            logo: null,
            logo_colour: "#ffffff",
          },
        },
        meta: {
          city: "Cupertino",
          state: "California",
        },
        created_at: "2021-04-12T19:52:22.000000Z",
        updated_at: "2021-04-12T19:52:22.000000Z",
      },
    };
    postMessageToListeners({ event: "pay.success", data: transactionData });
  };

  const handleErrorClick = () =>
    postMessageToListeners({ event: "pay.server_error", iframeOrigin });

  return (
    <div>
      {Object.keys(config).map((key) => (
        <p key={key}>This is the {key}: config[key]</p>
      ))}

      <button onClick={handleCloseClick}>Close SDK</button>
      <button onClick={handleSuccessClick}>Simulate success</button>
      <button onClick={handleErrorClick}>Simulate error</button>
    </div>
  );
};

export default App;
