import Tab from "./tab";
import TabPanel from "./tab-panel";
import template from "./tab-group.html?raw";
import WebComponent from "../web-component";

export default class TabGroup extends WebComponent {
  public static readonly TagName = "pb-tab-group";

  public static get observedAttributes(): string[] {
    return ["selected"];
  }

  constructor() {
    super(template);
    this.onSlotChange = this.onSlotChange.bind(this);

    const slots = this.shadow.querySelectorAll("slot");
    for (const slot of slots) {
      slot.addEventListener("slotchange", this.onSlotChange);
    }
  }

  public get selected(): string {
    return this.getAttribute("selected") ?? "";
  }

  public set selected(selectedTabName: string) {
    this.setAttribute("selected", selectedTabName);
  }

  public allTabs(): Tab[] {
    return Array.from(this.querySelectorAll<Tab>(`:scope > ${Tab.TagName}`));
  }

  public allTabPanels(): TabPanel[] {
    return Array.from(this.querySelectorAll<TabPanel>(`:scope > ${TabPanel.TagName}`));
  }

  public findTabWithName(name: string): Tab | null {
    return this.allTabs().find((tab) => tab.name === name) ?? null;
  }

  protected connectedCallback() {
    console.debug("Connected");
  }

  protected attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    console.debug(name, oldValue, newValue);

    switch (name) {
      case "selected":
        if (oldValue !== null) {
          const currentSelectedTab = this.findTabWithName(oldValue);
          if (currentSelectedTab) {
            this.setSelectedTabAttributes(currentSelectedTab, false);
          }
        }

        if (newValue !== null) {
          const selectedTab = this.findTabWithName(newValue);
          if (selectedTab) {
            this.setSelectedTabAttributes(selectedTab, true);
          }
        }
        break;
    }
  }

  private setSelectedTabAttributes(tab: Tab, isSelected: boolean): void {
    tab.setAttribute("aria-selected", String(isSelected));
    tab.tabIndex = isSelected ? 0 : -1;
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

    for (let index = 0; index < tabs.length; index++) {
      const tab = tabs[index];
      const tabPanel = tabPanels[index];

      tab.setAttribute("aria-controls", tabPanel.id);
      tabPanel.setAttribute("aria-labelledby", tab.id);
      tabPanel.setAttribute("hidden", "until-found");
    }
  }
}
