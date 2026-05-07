import defaultHostCSS from "./web-component.css?inline";

const defaultHostStyles = new CSSStyleSheet();
defaultHostStyles.replaceSync(defaultHostCSS);

export default abstract class WebComponent extends HTMLElement {
  protected readonly shadow: ShadowRoot;

  protected constructor(template?: string) {
    super();

    this.shadow = this.attachShadow({ mode: "open" });
    this.shadow.adoptedStyleSheets = [defaultHostStyles];
    if (template) {
      this.shadow.innerHTML = template;
    }
  }

  /**
   * Checks that the consumer has set the specified required attribute. If the attribute is not
   * set, this method throws an error.
   *
   * @param attribute The required attribute to check for
   */
  protected checkHasRequiredAttribute(attribute: string): void {
    if (!this.hasAttribute(attribute)) {
      throw new Error(`Missing required attribute "${attribute}" on <${this.tagName.toLowerCase()}>`);
    }
  }

  /**
   * Sets the default value for an attribute, if it hasn't already been set by a consumer in the
   * HTML. As a general rule, attributes explicitly set consumers in HTML shouldn't be overridden.
   *
   * @param attribute The attribute to set the default value for
   * @param value The value to set if there isn't already a value
   * @see https://web.dev/articles/custom-elements-best-practices#dont_override_the_page_author
   */
  protected setAttributeDefault(attribute: string, value: string): void {
    if (!this.hasAttribute(attribute)) {
      this.setAttribute(attribute, value);
    }
  }

  /**
   * This should be called in the `connectedCallback` lifecycle function. It's possible that a
   * consumer may try set a property on the element before this class has loaded. That will override
   * the setter and not trigger any side-effects. To ensure side effects are correctly captured,
   * this reapplies any set values and triggers the setter.
   *
   * @param property
   * @see https://web.dev/articles/custom-elements-best-practices#make_properties_lazy
   */
  protected upgradeProperty(property: keyof this): void {
    if (this.hasOwnProperty(property)) {
      const value = this[property];
      delete this[property];
      this[property] = value;
    }
  }
}
