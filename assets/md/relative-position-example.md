```typescript
new RelativePosition({ placement, src, hostWidth, hostHeight, autoUpdate });
```

`placement` - Location of the conetent. Only `OutsidePlacement` positions is supported.

`src` - target element

`hostWidth` - width of the overlay. Supports **auto** , **15px** , **10%** .

`hostHeight` - height of the overlay. Supports **auto**, **15px** , **10%**.

`autoUpdate` - when the window is scrolled, or resized should position be updated
