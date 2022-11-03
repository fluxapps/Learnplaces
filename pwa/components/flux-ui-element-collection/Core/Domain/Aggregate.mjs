import DomainEventPublisher from '../Ports/DomainEventPublisher.mjs';
import {
  Created
} from './DomainEvents.mjs';

export default class Aggregate {
  /**
   * @var {string}
   */
  componentId;

  /**
   * @var {DomainEventPublisher}
   */
  #domainEventPublisher;


  /**
   * @param {string} componentId
   * @param {DomainEventPublisher} domainEventPublisher
   * @return {Aggregate}
   */
  static create(componentId, domainEventPublisher) {
    return new this(componentId, domainEventPublisher);
  }

  /**
   * @param {string} componentId
   * @param {DomainEventPublisher} domainEventPublisher
   */
  constructor(componentId, domainEventPublisher) {
    this.componentId = componentId;
    this.domainEventPublisher = domainEventPublisher;
  }

  create() {
    this.#applyCreated(
      {
        componentId: this.componentId
      }
    );
  }

  /**
   * @param {Created} event
   */
  #applyCreated(event) {
   // document.getElementById(this.id).attachShadow({ mode: "closed" });
  /*  this.#domainEventPublisher.publish(
      event
    )*/
  }

  /**
   * @return Aggregate
   */
  setLinks(links) {
    //todo do some checkes
    this.applySetLinks(links)
  }

  applySetLinks(links) {

    links.forEach(
      (link) => {
        const menuItem = document.createElement('a');
        const item = Object.assign(menuItem, link);
        item.slot = "item";
        document.getElementByName('flux-menu').node.insertAfter(item)
      }
    );

  }

  /**
   * @param {string} htmlLayout
   * @return Aggregate
   */
  renderHtmlLayout(htmlLayout) {
    this.#applyHtmlLayoutRendered(
      {
        elementId: this.id,
        "data": htmlLayout
      }
    )
    return this;
  }


  #applyHtmlLayoutRendered(event) {
    const shadowRoot = document.getElementById(this.id).attachShadow({ mode: "open" });
    const template = document.createElement("template");
    template.innerHtml = event.data;
    shadowRoot.appendChild(template.content.cloneNode(true));

    this.#domainEventPublisher.publish(
      'HtmlLayoutRendered',
      event
    )

  }


  /**
   * @return {HtmlMenuElement.slot}
   */
  /*
  slot = function() {
      const obj = {};
      obj.name = 'item';
      obj.tag = 'a';
      obj.props = {};
      obj.props.className = "menu-item f3";
      obj.props.href = "#";
      return obj;
  }*/

  /**
   * @param slot
   * @return HTMLElement
   */
  /*
  slotHtmlElement = function(slot) {
      const slotHtmlElement = document.createElement('slot');
      slotHtmlElement.name = slot.name;

      const slotInnerHtmlElement = document.createElement(slot.tag)
      slot.props.forEach((([key, value]) => {
              slotInnerHtmlElement.setAttribute(key, value)
          })
      )

      slotHtmlElement.appendChild(slot);

      return slotHtmlElement;
  };
  */

  /*
  nav = function(title, slotHtmlElement) {
      const nav = document.createElement(
          'nav'
      );
      nav.clasName = "menu";
      nav.ariaLabel = "title";
      nav.appendChild(document.createElement(
          "span", {
              class: "menu-heading"
          }
      ));
      nav.appendChild(
          slotHtmlElement
      );
      return nav;
  }*/


  /**
   * @private
   */
  /* constructor() {
       super();
       this.#channelFluxMenu = new BroadcastChannel("flux_menu");
       this.#shadowRoot = this.
   }
*/
  /*
  connectedCallback() {
      this.#channelFluxMenu.postMessage(
          FluxMenuMessage.Connnected(
              this.id,
              this.slot()
          )
      );
  }
   */


}

/*
      <style>
        .menu{margin-bottom:16px;list-style:none;background-color:var(--color-canvas-default);border:1px solid var(--color-border-default);border-radius:6px}.menu-item{position:relative;display:block;padding:8px 16px;color:var(--color-fg-default);border-bottom:1px solid var(--color-border-muted)}.menu-item:first-child{border-top:0;border-top-left-radius:6px;border-top-right-radius:6px}.menu-item:first-child::before{border-top-left-radius:6px}.menu-item:last-child{border-bottom:0;border-bottom-right-radius:6px;border-bottom-left-radius:6px}.menu-item:last-child::before{border-bottom-left-radius:6px}.menu-item:hover{text-decoration:none;background-color:var(--color-neutral-subtle)}.menu-item:active{background-color:var(--color-canvas-subtle)}.menu-item.selected,.menu-item[aria-selected=true],.menu-item[aria-current]:not([aria-current=false]){cursor:default;background-color:var(--color-menu-bg-active)}.menu-item.selected::before,.menu-item[aria-selected=true]::before,.menu-item[aria-current]:not([aria-current=false])::before{position:absolute;top:0;bottom:0;left:0;width:2px;content:"";background-color:var(--color-primer-border-active)}.menu-item .octicon{width:16px;margin-right:8px;color:var(--color-fg-muted);text-align:center}.menu-item .Counter{float:right;margin-left:4px}.menu-item .menu-warning{float:right;color:var(--color-attention-fg)}.menu-item .avatar{float:left;margin-right:4px}.menu-item.alert .Counter{color:var(--color-danger-fg)}.menu-heading{display:block;padding:8px 16px;margin-top:0;margin-bottom:0;font-size:inherit;font-weight:600;color:var(--color-fg-default);border-bottom:1px solid var(--color-border-muted)}.menu-heading:hover{text-decoration:none}.menu-heading:first-child{border-top-left-radius:6px;border-top-right-radius:6px}.menu-heading:last-child{border-bottom:0;border-bottom-right-radius:6px;border-bottom-left-radius:6px}.tabnav{margin-top:0;margin-bottom:16px;border-bottom:1px solid var(--color-border-default)}.tabnav-tabs{display:flex;margin-bottom:-1px;overflow:auto}.tabnav-tab{display:inline-block;flex-shrink:0;padding:8px 16px;font-size:14px;line-height:23px;color:var(--color-fg-muted);text-decoration:none;background-color:transparent;border:1px solid transparent;border-bottom:0;transition:color .2s cubic-bezier(0.3, 0, 0.5, 1)}.tabnav-tab.selected,.tabnav-tab[aria-selected=true],.tabnav-tab[aria-current]:not([aria-current=false]){color:var(--color-fg-default);background-color:var(--color-canvas-default);border-color:var(--color-border-default);border-radius:6px 6px 0 0}.tabnav-tab.selected .octicon,.tabnav-tab[aria-selected=true] .octicon,.tabnav-tab[aria-current]:not([aria-current=false]) .octicon{color:inherit}.tabnav-tab:hover{color:var(--color-fg-default);text-decoration:none;transition-duration:.1s}.tabnav-tab:focus,.tabnav-tab:focus-visible{border-radius:6px 6px 0 0 !important;outline-offset:-6px}.tabnav-tab:active{color:var(--color-fg-muted)}.tabnav-tab .octicon{margin-right:4px;color:var(--color-fg-muted)}.tabnav-tab .Counter{margin-left:4px;color:inherit}.tabnav-extra{display:inline-block;padding-top:10px;margin-left:10px;font-size:12px;color:var(--color-fg-muted)}.tabnav-extra>.octicon{margin-right:2px}a.tabnav-extra:hover{color:var(--color-accent-fg);text-decoration:none}.tabnav-btn{margin-left:8px}.filter-list{list-style-type:none}.filter-list.small .filter-item{padding:6px 12px;font-size:12px}.filter-list.pjax-active .filter-item{color:var(--color-fg-muted);background-color:transparent}.filter-list.pjax-active .filter-item.pjax-active{color:var(--color-fg-on-emphasis);background-color:var(--color-accent-emphasis)}.filter-item{position:relative;display:block;padding:8px 16px;margin-bottom:4px;overflow:hidden;font-size:14px;color:var(--color-fg-muted);text-decoration:none;text-overflow:ellipsis;white-space:nowrap;cursor:pointer;border-radius:6px}.filter-item:hover{text-decoration:none;background-color:var(--color-canvas-subtle)}.filter-item.selected,.filter-item[aria-selected=true],.filter-item[aria-current]:not([aria-current=false]){color:var(--color-fg-on-emphasis);background-color:var(--color-accent-emphasis)}.filter-item.selected:focus,.filter-item[aria-selected=true]:focus,.filter-item[aria-current]:not([aria-current=false]):focus{outline:2px solid var(--color-accent-fg);outline-offset:-2px;box-shadow:inset 0 0 0 3px var(--color-fg-on-emphasis)}.filter-item.selected:focus:not(:focus-visible),.filter-item[aria-selected=true]:focus:not(:focus-visible),.filter-item[aria-current]:not([aria-current=false]):focus:not(:focus-visible){outline:solid 1px transparent;box-shadow:none}.filter-item.selected:focus-visible,.filter-item[aria-selected=true]:focus-visible,.filter-item[aria-current]:not([aria-current=false]):focus-visible{outline:2px solid var(--color-accent-fg);outline-offset:-2px;box-shadow:inset 0 0 0 3px var(--color-fg-on-emphasis)}.filter-item .count{float:right;font-weight:600}.filter-item .bar{position:absolute;top:2px;right:0;bottom:2px;z-index:-1;display:inline-block;background-color:var(--color-neutral-subtle)}.SideNav{background-color:var(--color-canvas-subtle)}.SideNav-item{position:relative;display:block;width:100%;padding:12px 16px;color:var(--color-fg-default);text-align:left;background-color:transparent;border:0;border-top:1px solid var(--color-border-muted)}.SideNav-item:first-child{border-top:0}.SideNav-item:last-child{box-shadow:0 1px 0 var(--color-border-default)}.SideNav-item::before{position:absolute;top:0;bottom:0;left:0;z-index:1;width:2px;pointer-events:none;content:""}.SideNav-item:hover{text-decoration:none;background-color:var(--color-neutral-subtle)}.SideNav-item:active{background-color:var(--color-canvas-subtle)}.SideNav-item[aria-current]:not([aria-current=false]),.SideNav-item[aria-selected=true]{background-color:var(--color-sidenav-selected-bg)}.SideNav-item[aria-current]:not([aria-current=false])::before,.SideNav-item[aria-selected=true]::before{background-color:var(--color-primer-border-active)}.SideNav-icon{width:16px;margin-right:8px;color:var(--color-fg-muted)}.SideNav-subItem{position:relative;display:block;width:100%;padding:4px 0;color:var(--color-accent-fg);text-align:left;background-color:transparent;border:0}.SideNav-subItem:hover{color:var(--color-fg-default);text-decoration:none}.SideNav-subItem[aria-current]:not([aria-current=false]),.SideNav-subItem[aria-selected=true]{font-weight:500;color:var(--color-fg-default)}.subnav{margin-bottom:20px}.subnav::before{display:table;content:""}.subnav::after{display:table;clear:both;content:""}.subnav-bordered{padding-bottom:20px;border-bottom:1px solid var(--color-border-muted)}.subnav-flush{margin-bottom:0}.subnav-item{position:relative;float:left;padding:5px 16px;font-weight:500;line-height:20px;color:var(--color-fg-default);border:1px solid var(--color-border-default)}.subnav-item+.subnav-item{margin-left:-1px}.subnav-item:hover,.subnav-item:focus{text-decoration:none;background-color:var(--color-canvas-subtle)}.subnav-item.selected,.subnav-item[aria-selected=true],.subnav-item[aria-current]:not([aria-current=false]){z-index:2;color:var(--color-fg-on-emphasis);background-color:var(--color-accent-emphasis);border-color:var(--color-accent-emphasis)}.subnav-item.selected:focus,.subnav-item[aria-selected=true]:focus,.subnav-item[aria-current]:not([aria-current=false]):focus{outline:2px solid var(--color-accent-fg);outline-offset:-2px;box-shadow:inset 0 0 0 3px var(--color-fg-on-emphasis)}.subnav-item.selected:focus:not(:focus-visible),.subnav-item[aria-selected=true]:focus:not(:focus-visible),.subnav-item[aria-current]:not([aria-current=false]):focus:not(:focus-visible){outline:solid 1px transparent;box-shadow:none}.subnav-item.selected:focus-visible,.subnav-item[aria-selected=true]:focus-visible,.subnav-item[aria-current]:not([aria-current=false]):focus-visible{outline:2px solid var(--color-accent-fg);outline-offset:-2px;box-shadow:inset 0 0 0 3px var(--color-fg-on-emphasis)}.subnav-item:first-child{border-top-left-radius:6px;border-bottom-left-radius:6px}.subnav-item:last-child{border-top-right-radius:6px;border-bottom-right-radius:6px}.subnav-search{position:relative;margin-left:12px}.subnav-search-input{width:320px;padding-left:32px;color:var(--color-fg-muted)}.subnav-search-input-wide{width:500px}.subnav-search-icon{position:absolute;top:9px;left:8px;display:block;color:var(--color-fg-muted);text-align:center;pointer-events:none}.subnav-search-context .btn{border-top-right-radius:0;border-bottom-right-radius:0}.subnav-search-context .btn:hover,.subnav-search-context .btn:focus,.subnav-search-context .btn:active,.subnav-search-context .btn.selected{z-index:2}.subnav-search-context+.subnav-search{margin-left:-1px}.subnav-search-context+.subnav-search .subnav-search-input{border-top-left-radius:0;border-bottom-left-radius:0}.subnav-search-context .select-menu-modal-holder{z-index:30}.subnav-search-context .select-menu-modal{width:220px}.subnav-search-context .select-menu-item-icon{color:inherit}.subnav-spacer-right{padding-right:12px}.UnderlineNav{display:flex;min-height:48px;overflow-x:auto;overflow-y:hidden;box-shadow:inset 0 -1px 0 var(--color-border-muted);-webkit-overflow-scrolling:auto;justify-content:space-between}.UnderlineNav .Counter{margin-left:8px;color:var(--color-fg-default);background-color:var(--color-neutral-muted)}.UnderlineNav .Counter--primary{color:var(--color-fg-on-emphasis);background-color:var(--color-neutral-emphasis)}.UnderlineNav-body{display:flex;align-items:center;gap:8px;list-style:none}.UnderlineNav-item{position:relative;display:flex;padding:0 8px;font-size:14px;line-height:30px;color:var(--color-fg-default);text-align:center;white-space:nowrap;cursor:pointer;background-color:transparent;border:0;border-radius:6px;align-items:center}.UnderlineNav-item:hover,.UnderlineNav-item:focus,.UnderlineNav-item:focus-visible{color:var(--color-fg-default);text-decoration:none;border-bottom-color:var(--color-neutral-muted);outline-offset:-2px;transition:border-bottom-color .12s ease-out}.UnderlineNav-item [data-content]::before{display:block;height:0;font-weight:600;visibility:hidden;content:attr(data-content)}.UnderlineNav-item::before{position:absolute;top:50%;left:50%;width:100%;height:100%;min-height:48px;content:"";transform:translateX(-50%) translateY(-50%)}@media(pointer: fine){.UnderlineNav-item:hover{color:var(--color-fg-default);text-decoration:none;background:var(--color-action-list-item-default-hover-bg);transition:background .12s ease-out}}.UnderlineNav-item.selected,.UnderlineNav-item[role=tab][aria-selected=true],.UnderlineNav-item[aria-current]:not([aria-current=false]){font-weight:600;color:var(--color-fg-default);border-bottom-color:var(--color-primer-border-active)}.UnderlineNav-item.selected::after,.UnderlineNav-item[role=tab][aria-selected=true]::after,.UnderlineNav-item[aria-current]:not([aria-current=false])::after{position:absolute;right:50%;bottom:calc(50% - 25px);width:100%;height:2px;content:"";background:var(--color-primer-border-active);border-radius:6px;transform:translate(50%, -50%)}.UnderlineNav--right{justify-content:flex-end}.UnderlineNav--right .UnderlineNav-actions{flex:1 1 auto}.UnderlineNav-actions{align-self:center}.UnderlineNav--full{display:block}.UnderlineNav--full .UnderlineNav-body{min-height:48px}.UnderlineNav-octicon{display:inline !important;margin-right:8px;color:var(--color-fg-muted);fill:var(--color-fg-muted)}.UnderlineNav-container{display:flex;justify-content:space-between}
      </style>

       <nav class="menu" aria-label="example">
        <span class="menu-heading">Klassen</span>
         ${this.slotHtml(this.slot())}
      </nav>`;
 */