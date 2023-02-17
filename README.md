# WebSight RTE Extensions
WebSight RTE Extensions contains extensions for WebSight [Rich Text Editor dialog field](https://www.websight.io/docs/developers/development/dialogs/richtext-editor/).

## Email extension

Email plugin encrypt email addresses in case to prevent spam messages. Decryption happens after the page load, therefore plugin must be used with a decryption script, which should be added independently on the page. Script code:

```js
window.addEventListener('load', () => {
    const links = document.querySelectorAll('[data-part1][data-part2][data-part3]');
    for (const link of links) {
      const attrs = link.dataset;
      link.setAttribute(
        'href',
        `mailto:${attrs.part1}@${attrs.part2}.${attrs.part3}`
      );
    }
});
```
