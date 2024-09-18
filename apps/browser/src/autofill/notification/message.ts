import {LitElement, html, css} from 'lit';
import {customElement} from 'lit/decorators';

@customElement('notification-message')
export class NotificationMessage extends LitElement {
  render() {
    return html`
      <div css=${messageStyles}>Hello Whirled!</div>
    `;
  }
}

const messageStyles = `
  background-color: hotpink;
  color: lime;
`
