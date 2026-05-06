import { generateUniqueId } from "../../helpers/dom-helpers";
import WebComponent from "../web-component";
import template from "./tab-panel.html?raw";

export default class TabPanel extends WebComponent {
  public static readonly TagName = "pb-tab-panel";

  constructor() {
    super(template);
  }

  protected connectedCallback(): void {
    this.setAttributeDefault("id", `tabpanel-${generateUniqueId()}`);
    this.setAttribute("role", "tabpanel");
  }
}
