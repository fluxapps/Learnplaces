import {
  created
} from './Behaviors.mjs';

export default class Actor {
  /**
   * @var {string}
   */
  #name;
  /**
   * @var {ShadowRoot}
   */
  #shadowRoot;
  /**
   * @function()
   */
  #publish;
  /**
   * @function()
   */
  #template;


  /**
   * @private
   */
  constructor(publish, template) {
    this.#publish = publish;
    this.#template = template;
  }

  /**
   * @return {Actor}
   */
  static async new(name, publish, template) {
    const obj = new Actor(publish, template);
    await obj.#create(name);
    return obj;
  }

  /**
   * @param {string} name
   * @return {void}
   */
  async #create(name) {
    this.#name = name;
    await this.#createCustomElement();
    await this.#applyCreated(
      created(name)
    );
  }

  /**
   * @param {CreatedEvent} payload
   * @return {void}
   */
  async #applyCreated(payload) {
    this.#publish(payload.id + "/" + created.name, payload)
  }

  /**
   * @return {void}
   */
  async #createCustomElement() {
    const linkStyleSheet = document.getElementById('flux-layout-style');
    const styleElement = document.createElement('style');
    styleElement.innerHTML = await (await fetch(linkStyleSheet.href)).text();
    const tag = this.#name.replace("/", "-");
    const applyShadowRootCreated = (shadowRoot) => {
      this.#shadowRoot = shadowRoot;
    }

    //todo at connectedCallback / when slot is connected / get attributes from template
    const leafletCss = document.createElement('link');
    leafletCss.rel = "stylesheet";
    leafletCss.href = "./contexts/flux-layout/node_modules/leaflet/dist/leaflet.css";

    const leafletJs = document.createElement('script');
    leafletJs.src = "./contexts/flux-layout/node_modules/leaflet/dist/leaflet.js";

    const leafletSrcJs = document.createElement('script');
    leafletSrcJs.src = "./contexts/flux-layout/node_modules/leaflet/dist/leaflet-src.js";


    customElements.define(
      tag,
      class extends HTMLElement {
        constructor() {
          super();
          const shadowRoot = this.attachShadow({ mode: "open" });
          applyShadowRootCreated(shadowRoot);
          shadowRoot.append(styleElement);

          shadowRoot.append(leafletCss);

          shadowRoot.append(leafletJs);
          shadowRoot.append(leafletSrcJs);
        }

        connectedCallback() {

        }
      }
    );
    const element = document.createElement(tag)
    const div = document.createElement('div');
    div.id = this.#name;
    element.shadowRoot.appendChild(div);
    document.body.appendChild(element)
  }


  /**
   * @param {AppendTemplateContent} payload
   * @return {void}
   */
  async appendTemplateContent(payload) {
    const id = payload.parentId + "/" + payload.templateName;

    if (this.#shadowRoot.getElementById(id)) {
      return;
    }

    const templateId = payload.templateName + "-template";
    await this.#loadTemplate(templateId)
    const templateContent = await this.#shadowRoot.getElementById(templateId)
    .content
    .cloneNode(true)
    const element = templateContent.children[0]

    let slots = element.querySelectorAll('slot');
    const slotNames = [];
    [].forEach.call(slots, function (slot) {
      // do whatever
      slotNames.push(slot.name)
    });

    const div = document.createElement('div');
    div.attachShadow({ mode: "open" })
    div.id = id;

    const shadowRoot = await div.shadowRoot;

    if (payload.slotName) {
      div.slot = payload.slotName;
    }
    shadowRoot.appendChild(element);


    const linkStyleSheet = document.getElementById('flux-layout-style');
    const styleElement = document.createElement('style');
    styleElement.innerHTML = await (await fetch(linkStyleSheet.href)).text();
    shadowRoot.appendChild(styleElement);
    console.log(payload.parentId);
    this.#shadowRoot.getElementById(payload.parentId).appendChild(div)

    await this.#applyCreated(
      created(
        id,
        slotNames
      )
    )
  }

  async changeSlotData(payload) {
    const parentId = payload.parentId;
    const parentElement = this.#shadowRoot.getElementById(parentId);
    const shadowRoot = parentElement.shadowRoot;
    const data = payload.data;


    for (const [slotName, slotData] of Object.entries(data)) {
      const slots = shadowRoot.querySelectorAll('slot[name=' + slotName + ']');
      if (slots[0]) {
        const slotDefinition = slots[0];
        let addOnClickEvent = false;
        if (slotDefinition.hasAttribute('add-on-click-event')) {
          addOnClickEvent = slotDefinition.getAttribute('add-on-click-event')
        }

        const elementContainerId = parentId + "/" + slotName;

        //TODO extract in functions
        //single slotItem
        if (slotDefinition.getAttribute('slot-value-type') === "item") {
          const slotItem = slotData;
          let elementContainer = null;
          let element = null;
          elementContainer = this.#shadowRoot.getElementById(elementContainerId);
          if (elementContainer) {
            element = elementContainer.children[0];
          }
          if (elementContainer === null) {
            const templateId = slotDefinition.getAttribute('template-id');
            await this.#loadTemplate(templateId);
            const templateContent = this.#shadowRoot.getElementById(templateId)
            .content
            .cloneNode(true)
            elementContainer = document.createElement('div');
            elementContainer.id = elementContainerId;
            elementContainer.slot = slotName;
            element = templateContent.children[0];
            elementContainer.appendChild(element);
            parentElement.appendChild(elementContainer);
          }
          element.textContent = slotItem.value
          element.id = elementContainerId + "/" + slotItem.id;
          if (addOnClickEvent) {
            element.addEventListener("click", () => this.#publish(
              slotItem.parentId + "/" + slotName + "/clicked", { data: { id: slotItem.id } }
            ));
          }
        }

        if (slotDefinition.getAttribute('slot-value-type') === "item-list") {
          const slotItemList = slotData;
          let elementContainer = null;
          let element = null;

          elementContainer = this.#shadowRoot.getElementById(elementContainerId);
          if (elementContainer) {
            elementContainer.remove();
          }

          const templateId = slotDefinition.getAttribute('template-id');
          await this.#loadTemplate(templateId);
          const templateContent = this.#shadowRoot.getElementById(templateId)
          .content
          .cloneNode(true)
          elementContainer = document.createElement('div');
          elementContainer.id = elementContainerId;
          elementContainer.slot = slotName;

          Object.entries(slotItemList).forEach(([itemKey, slotItem]) => {

            element = templateContent.children[0].cloneNode(true);

            element.textContent = slotItem.value
            element.id = elementContainerId + "/" + +slotItem.id;

            if (addOnClickEvent) {

              const data = {};
              data[slotItem.idType] = slotItem.id

              element.addEventListener("click", () => this.#publish(
                elementContainerId + "/clicked", { data: data }
              ));
            }
            elementContainer.appendChild(element)
          });
          parentElement.appendChild(elementContainer);
        }
      }
    }
  }


  async #loadTemplate(templateId) {
    console.log(templateId);
    if (this.#shadowRoot.getElementById(templateId)) {
      return;
    }
    const template = await this.#template(templateId)
    this.#shadowRoot.appendChild(template);
  }

}