const API_KEY = "4015108a22693d8816fe8491cf3d309024e997aaf87f9aed07116f23857af6fb";

const tickersHandlers = new Map();
export const loaderTicker = () => {
  if (tickersHandlers.size === 0) {
    return;
  }

  fetch(
    `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[...tickersHandlers
      .keys()]}&tsyms=USD&api_key=${API_KEY}`
  ).then(r => r.json())
    .then(rawData => {
      const updatetPrices = Object.fromEntries(
        Object.entries(rawData).map(([key, value]) => [key, value.USD])
      );

      Object.entries(updatetPrices).forEach(([currency, newPrice]) => {
        const handlers = tickersHandlers.get(currency) ?? [];
        handlers.forEach(fn => fn(newPrice));
      });
    });
}

export const subscribeToTicker = (ticker, cb) => {
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribers, cb]);
};

export const unsubscribeToTicker = (ticker) => {
  tickersHandlers.delete(ticker);
};

setInterval(loaderTicker, 5000);
