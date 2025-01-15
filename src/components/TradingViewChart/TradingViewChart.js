import React, { useEffect, useRef } from "react";

let tvScriptLoadingPromise;

export default function TradingViewChart({ baseAsset, quoteAsset }) {
  const onLoadScriptRef = useRef();

  useEffect(() => {
    onLoadScriptRef.current = createWidget;

    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise((resolve) => {
        const script = document.createElement("script");
        script.id = "tradingview-widget-loading-script";
        script.src = "https://s3.tradingview.com/tv.js";
        script.type = "text/javascript";
        script.onload = resolve;

        document.head.appendChild(script);
      });
    }

    tvScriptLoadingPromise.then(
      () => onLoadScriptRef.current && onLoadScriptRef.current()
    );

    return () => (onLoadScriptRef.current = null);

    function createWidget() {
      if (
        document.getElementById("tradingview_c49ac") &&
        "TradingView" in window
      ) {
        new window.TradingView.widget({
          autosize: true,
          symbol: `${baseAsset}${quoteAsset}`,
          // symbol: "BITSTAMP:BTCUSD",
          interval: "1",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          enable_publishing: false,
          withdateranges: true,
          range: "3M",
          hide_side_toolbar: false,
          allow_symbol_change: true,
          //   save_image: false,
          container_id: "tradingview_c49ac",
          backgroundColor: "#0A0C14",
          // backgroundColor: "#0A0C14",
        });
      }
    }
  }, [baseAsset]);

  return (
    <div
      className="tradingview-widget-container"
      style={{ height: "100%", width: "100%" }}
    >
      <div id="tradingview_c49ac" style={{ height: "100%", width: "100%" }} />
    </div>
  );
}
