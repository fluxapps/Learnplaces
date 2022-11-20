export class OfflineFirstStorage {
  /**
   * @var {string}
   */
  #name;
  /**
   * @var {string|null}
   */
  #onlineApiBaseUrl = null;

  constructor(name, onlineApiBaseUrl) {
    this.#name = name;
    this.#onlineApiBaseUrl = onlineApiBaseUrl;
  }

  /**
   * @param {string} name
   * @param {string} onlineApiBaseUrl
   * @return {Promise<OfflineFirstStorage>}
   */
  static async new(name, onlineApiBaseUrl) {
    return new OfflineFirstStorage(name, onlineApiBaseUrl);
  }

  /**
   * @typedef {{address: string, projectionName: string}} Get
   * @param {Get} get
   * @param {function(jsonObject: string)} replyTo
   */
  async get(get, replyTo) {
    const dataCacheName = this.#name;
    let address = get.projection;
    if (get.data) {
      Object.entries(get.data).forEach(([key, value]) => {
        address = address + "/" + key + "/" + value
      })
    }

    const src = this.#onlineApiBaseUrl + address;
    const cache = await caches.open(dataCacheName);
    const cache_response = await cache.match(address) ?? null;
    let cacheData = null;
    await (async () => {
      if (cache_response !== null) {
        const cacheResponseData = await cache_response.json();
        replyTo(cacheResponseData);
      }
    });

    const response = await fetch(src);
    const clonedResponse = await response.clone();
    console.log(clonedResponse);
    const responseData = await clonedResponse.json();
    if (JSON.stringify(cacheData) !== JSON.stringify(responseData)) {
      await cache.put(address, response);
      await replyTo(responseData);
    }
  }
}