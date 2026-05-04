import { generateRandomId } from "../../helpers/dom-helpers";
import Tab from "./tab";
import TabPanel from "./tab-panel";
import html from "./tab-group.html?raw";

export default class TabGroup extends HTMLElement {
  public static readonly TagName = "pb-tab-group";

  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = html;

    const tabs = this.tabs;
    const tabPanels = this.tabPanels;

    const minCount = Math.min(tabs.length, tabPanels.length);

    for (let index = 0; index < minCount; index++) {
      const tab = tabs[index];
      const tabPanel = tabPanels[index];

      const id = generateRandomId();
      const tabId = `tab-${id}`;
      const tabPanelId = `tab-panel-${id}`;

      TabGroup.setTabAttributes(tab, tabId, tabPanelId);
      TabGroup.setTabPanelAttributes(tabPanel, tabId, tabPanelId);
    }
  }

  connectedCallback() {
    console.debug("Connected");
  }

  get tabs(): Tab[] {
    return Array.from(this.querySelectorAll<Tab>(`:scope > ${Tab.TagName}`));
  }

  get tabPanels(): TabPanel[] {
    return Array.from(
      this.querySelectorAll<TabPanel>(`:scope > ${TabPanel.TagName}`),
    );
  }

  private static setTabAttributes(tab: Tab, tabId: string, tabPanelId: string) {
    tab.id = tabId;
    tab.role = "tab";
    tab.tabIndex = 0;
    tab.setAttribute("aria-selected", "false");
    tab.setAttribute("aria-controls", tabPanelId);
  }

  private static setTabPanelAttributes(
    tabPanel: TabPanel,
    tabId: string,
    tabPanelId: string,
  ) {
    tabPanel.id = tabPanelId;
    tabPanel.role = "tabpanel";
    tabPanel.hidden = true;
    tabPanel.setAttribute("aria-labelled-by", tabId);
  }
}
