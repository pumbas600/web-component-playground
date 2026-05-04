import Tab from "./tab";
import TabPanel from "./tab-panel";
import template from "./tab-group.html?raw";
import WebComponent from "../web-component";

export default class TabGroup extends WebComponent {
  public static readonly TagName = "pb-tab-group";

  constructor() {
    super(template);
    this.onSlotChange = this.onSlotChange.bind(this);

    const slots = this.shadow.querySelectorAll("slot");
    for (const slot of slots) {
      slot.addEventListener("slotchange", this.onSlotChange);
    }
  }

  public allTabs(): Tab[] {
    return Array.from(this.querySelectorAll<Tab>(`:scope > ${Tab.TagName}`));
  }

  public allTabPanels(): TabPanel[] {
    return Array.from(
      this.querySelectorAll<TabPanel>(`:scope > ${TabPanel.TagName}`),
    );
  }

  protected connectedCallback() {
    console.debug("Connected");
  }

  private onSlotChange() {
    this.linkPanels();
  }

  private linkPanels(): void {
    const tabs = this.allTabs();
    const tabPanels = this.allTabPanels();

    if (tabs.length !== tabPanels.length) {
      throw new Error(
        `Missing corresponding tab or tabpanel. Found ${tabs.length} tabs and ${tabPanels.length} tab panels`,
      );
    }

    const minCount = Math.min(tabs.length, tabPanels.length);

    for (let index = 0; index < tabs.length; index++) {
      const tab = tabs[index];
      const tabPanel = tabPanels[index];

      tab.setAttribute("aria-controls", tabPanel.id);
      tabPanel.setAttribute("aria-labelledby", tab.id);
    }
  }
}
