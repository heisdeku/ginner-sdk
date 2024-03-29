// App.jsx
import { useEffect, useState } from "react";

const postMessageToListeners = ({
  event,
  data,
  iframeOrigin,
}: {
  event: string;
  data?: any;
  iframeOrigin?: any;
}) => {
  if (window.parent) {
    window.parent.postMessage(
      { type: event, data: { ...data }, origin },
      iframeOrigin
    );
  }
};

const App = () => {
  const [config, setConfig] = useState<any>();

  // listening for messages starts here
  const handleMessage = async (event: any) => {
    if (event.data.type === "sdkData") {
      if (!config) {
        setConfig(event.data.config);
      }
      return;
    }
  };

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [setConfig]);

  // listening for messages ends here

  // from search query starts here
  const { search } = window.location;

  useEffect(() => {
    if (!search) return;

    const parseParams = (querystring: string) => {
      const params = new URLSearchParams(querystring);
      const obj: any = {};
      for (const key of params.keys()) {
        obj[key] = params.get(key);
      }
      return obj;
    };

    const searchConfigObj = parseParams(search);
    setConfig(searchConfigObj);
  }, [search]);

  // from search query ends here

  if (!config) return <div />;
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
    postMessageToListeners({
      event: "pay.success",
      data: transactionData,
      iframeOrigin,
    });
  };

  const handleErrorClick = () =>
    postMessageToListeners({ event: "pay.server_error", iframeOrigin });

  return (
    <div className="pay__container">
      <h2 className="pay__header">
        You're are about to make an airtime payment
      </h2>
      <div className="pay__business">
        <div className="business__avatar"></div>
        <h4 className="business__name">Jekomo Sexual Enterprises</h4>
      </div>

      {Object?.keys(config).map((key) => (
        <p key={key}>
          This is the {key}: {config[key]}
        </p>
      ))}
      <p className="disclaimer">
        By clicking the button below, you agree to{" "}
        <b className="disclaimer__link">Zeddpay T&C</b>
      </p>
      <div className="pay__actions grid-center">
        <button onClick={handleCloseClick}>Close SDK</button>
        <button onClick={handleSuccessClick}>Simulate success</button>
        <button onClick={handleErrorClick}>Simulate error</button>
      </div>
    </div>
  );
};

export default App;
