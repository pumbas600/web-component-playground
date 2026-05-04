import { generateUniqueId } from "../../helpers/dom-helpers";
import WebComponent from "../web-component";

export default class TabPanel extends WebComponent {
  public static readonly TagName = "pb-tab-panel";

  constructor() {
    super();
  }

  protected connectedCallback(): void {
    this.setAttributeDefault("id", `tabpanel-${generateUniqueId()}`);
    this.setAttribute("role", "tabpanel");
  }
}
