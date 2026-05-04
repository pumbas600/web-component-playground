import { generateUniqueId } from "../../helpers/dom-helpers";
import WebComponent from "../web-component";
import template from "./tab-panel.html?raw";

export default class TabPanel extends WebComponent {
  public static readonly TagName = "pb-tab-panel";

  constructor() {
    super(template);
  }

  private get tabPanelContainer(): Element {
    const container = this.shadow.firstElementChild;
    if (container) {
      return container;
    }

    throw new Error("Missing required container element");
  }

  protected connectedCallback(): void {
    this.setAttributeDefault("id", `tabpanel-${generateUniqueId()}`);
    this.setAttribute("role", "tabpanel");
    this.tabPanelContainer.setAttribute("hidden", "until-found");
  }
}
