import { stringToFragment } from "../../helpers/dom-helpers";

class TabGroup extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });

    const fragment = stringToFragment(`
        <div role="tablist">
            <slot name="tab"></slot>
        </div>
        <slot></slot>   
    `);

    shadowRoot.append(fragment);
  }
}

customElements.define("pb-tab-group", TabGroup);
