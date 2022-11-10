import FluxMessageStreamApi
  from '../../../../flux-message-stream/src/Adapters/Api/FluxMessageStreamApi.mjs';
import FluxLayoutComponentApi
  from '../../../../flux-layout-component/src/Adapters/Api/FluxLayoutComponentApi.mjs';
import FluxRepositoryApi from '../../../../flux-repository/src/Adapters/Api/FluxRepositoryApi.mjs';

export default class OutboundAdapter {

  #logEnabled = false;
  #messageStreamApi;

  static new() {
    return new this();
  }

  /**
   * @private
   */
  constructor() {
    this.#messageStreamApi = FluxMessageStreamApi.initialize(this.#logEnabled)
  }

  disableLog() {
    this.#logEnabled = false;
    this.#messageStreamApi.logEnabled = false;
  }

  /**
   * @return {{defineCustomHtmlElement(*): void}}
   */
  publish() {
    const messageStreamApi = this.#messageStreamApi;
    return {
      defineCustomHtmlElement(payload) {
        messageStreamApi.publish("flux-layout-component/defineCustomHtmlElement", payload)
      }
    }
  }

  /**
   * @param name
   * @return {(function(string, string, Object): void)|*}
   */
  onEvent(name) {
    return this.#messageStreamApi.onEvent(name)
  }

  onRegister(name) {
    return this.#messageStreamApi.onRegister(name)
  }

  /**
   * @param  {{name: string}} payload
   * @return {void}
   */
  initializeLayoutComponent(payload) {
    FluxLayoutComponentApi.initialize(payload)
  }

  /**
   * @param {{name: string}} payload
   * @return {void}
   */
  initializeRepositories(payload) {
    FluxRepositoryApi.initialize(payload)
  }

  /**
   * @param {string} src
   */
  async importJsonSchema(src) {
    const url = this.#appendBaserUrl(src);
    const schema = await (await fetch(url));
    return await schema.json();
  }

  /**
   * @param {string} src
   * @return {string}
   */
  #appendBaserUrl(src) {
    const baseUrl = document.getElementById("flux-pwa-base");
    return baseUrl.href + "/" + src;
  }
}

