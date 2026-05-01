import "./style.css";
import TabGroup from "./components/tabs/tab-group.ts";
import TabPanel from "./components/tabs/tab-panel.ts";
import Tab from "./components/tabs/tab.ts";

[TabGroup, TabPanel, Tab].forEach((webComponent) => {
  customElements.define(webComponent.TagName, webComponent);
});
