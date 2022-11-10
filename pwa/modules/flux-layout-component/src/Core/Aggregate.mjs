import domainMessage from './DomainMessage.mjs';
import OutboundAdapter from '../Adapters/Api/OutboundAdapter.mjs';
import State from './State.mjs';
import Slot from './Slot.mjs';

export default class Aggregate {
  /**
   * @var {string}
   */
  #name;
  /**
   * @var {string}
   */
  #id;
  /**
   * @var {string}
   */
  #stylesheet;
  /**
   * @var {{id: string, html: string}}
   */
  #template;
  /**
   * @var {State}
   */
  #state;
  /**
   * @function()
   */
  #onEvent;
  /**
   * @var {OutboundAdapter}
   */
  #outbounds


  /**
   *
   * @param payload
   * @param replyTo
   * @return {Aggregate}
   */
   static async initialize(payload, replyTo) {
    const obj = new this(payload, replyTo);
    obj.#state = State.new();
    obj.#outbounds = OutboundAdapter.new()
    obj.#template = await obj.#outbounds.loadTemplate(obj.#name);
    obj.#onEvent =  await obj.#outbounds.onEvent(obj.#name)
    obj.#onEvent(replyTo,
      domainMessage.initialized({
        name: obj.#name
      })
    )
    return obj;
  }

  /**
   * @param {{name: string}} payload
   * @param {string} replyTo
   */
  constructor(payload, replyTo) {
    this.#name = payload.name;
  }


  /**
   * @param {{name: string}} payload
   * @param {string} replyTo
   */
  async defineCustomHtmlElement(payload, replyTo) {
    document.body.insertAdjacentHTML('afterbegin', this.#template.html);
    const templateId = this.#template.id;

    const defineId = (id) => {
      this.defineId(id)
    };
    const changeAttribute = (attributeName, attribute) => this.changeAttribute(attributeName,
      attribute);
    const stylesheetText = await (await this.#outbounds.importCss());

    const styleElement = document.createElement('style');
    styleElement.innerHTML = stylesheetText;


    customElements.define(
      this.#name,
      class extends HTMLElement {

        constructor() {
          super();
          const template = document.getElementById(
            templateId
          ).content;

          const shadowRoot = this.attachShadow({ mode: "open" });
          shadowRoot.appendChild(template.cloneNode(true));
          shadowRoot.append(styleElement);

        }

        connectedCallback() {

          console.log(this.id + "connected");
          defineId(this.id);
          /*if (this.hasAttributes()) {
            for (const name of this.getAttributeNames()) {
              const value = this.getAttribute(name);
              changeAttribute('name', value);
            }
          }*/
        }
      }
    );
    this.#onEvent(replyTo, payload);
  }

  defineId(id) {
    if(this.#id !== id) {
      this.applyDefineId(id)
    }


    /*const events = this.#template.events;
    Object.entries(events).forEach(([id, event]) => {
        console.log(event);
    })*/

  }

  applyDefineId(id) {
    this.#id = id
    console.log(id);
  }



  async changeAttribute(attributeName, attribute) {
    const updateCache = async (attributeName, attribute) => {
      /*const cache = await caches.open(this.#name);
      await cache.put(attributeName, attribute);*/
      //this.#onEvent(this.#name + "/" + attributeName + "changed", attribute)
    }
    //this.#state.change(attributeName, attribute, updateCache);
  }

  async replaceSlotData(slotName, payload, replyTo) {
    const slotTemplateDefinition = await this.#outbounds.loadTemplate(slotName)
    const slotTemplateId = slotTemplateDefinition.id

    if(document.getElementById(slotTemplateId) === null) {
      const slotTemplateHtml = slotTemplateDefinition.html;
      await document.body.insertAdjacentHTML('afterbegin', slotTemplateHtml);
    }

    const element = await document.getElementById(this.#id);
    const slotTemplate = document.getElementById(slotTemplateId);

    const items = payload.items;
    const childElement = slotTemplate.content.firstChild.cloneNode(true);

    Object.entries(items).forEach(([id, item]) => {
      childElement.id = item.id;
      childElement.innerHTML = item.value;


      if(slotTemplateDefinition.events.hasOwnProperty('onClick')) {
        const adressDefinition = slotTemplateDefinition.events.onClick.address;
        const adress = adressDefinition.replace("{$name}", slotName);

        element.addEventListener("click",  () => this.#outbounds.onEvent(this.#name)(
          adress, {id: item.id}
        ));

      }
      element.appendChild(childElement.cloneNode(true))


    });


    this.#onEvent(replyTo, items)


  }




}