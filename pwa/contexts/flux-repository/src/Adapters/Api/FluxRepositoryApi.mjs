import Actor from '../../Core/Actor.mjs';
import { OfflineFirstStorage } from '../Storage/OfflineFirstStorage.mjs';
import Definitions from '../Definitions/Definitions.mjs';
import MessageStream from '../EventStream/MessageStream.mjs';

export default class FluxRepositoryApi {
  /** @var {string} */
  #actorName;
  /** @var {Actor} */
  #actor;
  /** @var {MessageStream} */
  #messageStream;
  /** @var {Definitions} */
  #definitions;

  /**
   * @private
   */
  constructor(applicationName) {
    this.#actorName = applicationName + "/" + "repository";
  }

  /**
   * @param applicationName
   * @param logEnabled
   * @param projectionApiBaseUrl
   * @return {void}
   */
  static async initializeOfflineFirstRepository(applicationName, logEnabled, projectionApiBaseUrl) {
    const obj = new FluxRepositoryApi(applicationName);
    obj.#messageStream = await MessageStream.new(obj.#actorName, logEnabled);
    await obj.#initDefinitions();
    await obj.#initReactors();
    await obj.#initActor(await OfflineFirstStorage.new(obj.#actorName, projectionApiBaseUrl))
  }

  async #initDefinitions() {
    this.#definitions = await Definitions.new(await document.getElementById("flux-pwa-base").href)
  }

  async #initActor(storage) {
    this.#actor = await Actor.new(this.#actorName, (publishAddress, payload) => {
        this.#publish(
          publishAddress,
          payload
        )
      },
      storage
    );
  }

  async #initReactors() {
    const apiDefinition = await this.#definitions.apiDefinition();
    Object.entries(apiDefinition.reactions).forEach(([reactionId, reaction]) => {
      const addressDef = reaction.onMessage
      const address = addressDef.replace('{$actorName}', this.#actorName);
      this.#messageStream.register(address, (payload) => this.#reaction(reaction.process, payload))
    });
  }

  async #reaction(process, payload) {
    try {
      this.#actor[process](payload);
    }
    catch (e) {
      console.error(process + " " + e)
    }
  }

  async #publish(
    publishAddress, payload
  ) {
    publishAddress.replace('{$actorName}', this.#actorName);
    this.#messageStream.publish(publishAddress, payload)
  }

}