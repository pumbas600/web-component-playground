import { generateUniqueId, TabIndices } from "../../helpers/dom-helpers";
import WebComponent from "../web-component";
import template from "./tab.html?raw";

export default class Tab extends WebComponent {
  public static readonly TagName = "pb-tab";

  constructor() {
    super(template);
  }

  public get name(): string {
    return this.getAttribute("name") ?? "";
  }

  public set name(value: string) {
    this.setAttribute("name", value);
  }

  protected connectedCallback() {
    this.upgradeProperty("name");
    this.checkHasRequiredAttribute("name");

    this.setAttributeDefault("id", `tab-${this.name}-${generateUniqueId()}`);
    this.setAttributeDefault("tabindex", String(TabIndices.DISABLED));
    this.setAttributeDefault("aria-selected", "false");
    this.setAttribute("role", "tab");
  }
}
