import Tab from "./tab";
import TabPanel from "./tab-panel";
import template from "./tab-group.html?raw";
import WebComponent from "../web-component";
import { Keys } from "../../helpers/key-codes";
import { TabIndices } from "../../helpers/dom-helpers";

export default class TabGroup extends WebComponent {
  public static readonly TagName = "pb-tab-group";

  public static get observedAttributes(): string[] {
    return ["selected"];
  }

  constructor() {
    super(template);
    this.handleSlotChange = this.handleSlotChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);

    const slots = this.shadow.querySelectorAll("slot");
    for (const slot of slots) {
      slot.addEventListener("slotchange", this.handleSlotChange);
    }

    this.addEventListener("click", this.handleClick);
    this.addEventListener("keydown", this.handleKeyDown);
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

  private findTabPanelControlledBy(tab: Tab): TabPanel | null {
    return this.allTabPanels().find((tabPanel) => tabPanel.getAttribute("aria-labelledBy") === tab.id) ?? null;
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
            this.setSelectedAttributes(currentSelectedTab, false);
          }
        }

        if (newValue !== null) {
          const selectedTab = this.findTabWithName(newValue);
          if (selectedTab) {
            this.setSelectedAttributes(selectedTab, true);
          }
        }
        break;
    }
  }

  protected disconnectedCallback() {
    this.removeEventListener("click", this.handleClick);
    this.removeEventListener("keydown", this.handleKeyDown);
  }

  private setSelectedAttributes(tab: Tab, isSelected: boolean): void {
    tab.setAttribute("aria-selected", String(isSelected));
    tab.tabIndex = isSelected ? 0 : -1;
    const tabPanel = this.findTabPanelControlledBy(tab);

    if (tabPanel) {
      if (isSelected) {
        tabPanel.removeAttribute("hidden");
      } else {
        tabPanel.setAttribute("hidden", "until-found");
      }
    }
  }

  private handleClick(event: MouseEvent): void {
    const target = event.target;
    if (!this.isTab(target)) return;

    this.selected = target.name;
  }

  private handleKeyDown(event: KeyboardEvent): void {
    console.debug(event.target);
    const target = event.target;

    if (!this.isTab(target)) return;
    if (event.altKey) return; /* Don't handle modifier shortcuts used by assistive technologies. */

    const tabs = this.allTabs();
    const currentlyFocusedTabIndex = Math.max(
      0,
      tabs.findIndex((tab) => tab.tabIndex === TabIndices.ENABLED),
    );

    console.debug(currentlyFocusedTabIndex, event.key);

    switch (event.key) {
      case Keys.HOME:
        event.preventDefault();
        this.focusTab(tabs[0]);
        break;
      case Keys.END:
        event.preventDefault();
        this.focusTab(tabs[tabs.length - 1]);
        break;
      case Keys.RIGHT:
        event.preventDefault();
        this.shiftFocus(1, currentlyFocusedTabIndex, tabs);
        break;
      case Keys.LEFT:
        event.preventDefault();
        this.shiftFocus(-1, currentlyFocusedTabIndex, tabs);
        break;
    }
  }

  private isTab(target: unknown): target is Tab {
    return target instanceof Tab && this.allTabs().includes(target);
  }

  private shiftFocus(amount: number, currentlyFocusedTabIndex: number, tabs: Tab[]): void {
    const newFocusedTabIndex = (tabs.length + currentlyFocusedTabIndex + amount) % tabs.length;
    const newFocusedTab = tabs[newFocusedTabIndex];
    this.focusTab(newFocusedTab);
  }

  private focusTab(newFocusedTab: Tab): void {
    newFocusedTab.focus();

    this.selected = newFocusedTab.name;
  }

  private handleSlotChange(): void {
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

    /* By default, select the first tab. */
    this.setAttributeDefault("selected", () => this.allTabs().at(0)?.name);
  }
}
