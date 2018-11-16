- ##### Plain text

```typescript
this.overlayIns = this._toppy
  .overlay(position)
  .host(`some plain text content`) // simple text
  .create();
```

<br/>

- ##### Using html

```typescript
this.overlayIns = this._toppy
  .overlay(position)
  .host(`<div>any HTML content</div>`, { hasHTML: true }) // html
  .create();
```

<br/>

- ##### Using component

```typescript
@Component({
  template: '<div>Hello</div>'
})
export class HelloComponent {}
```

```typescript
this.overlayIns = this._toppy
  .overlay(position)
  .host(HelloComponent) // host a component
  .create();
```

<br/>

- ##### Using TemplateRef

```html
<div #tpl>Hello world!</div>
```

```typescript
@ViewChild('tpl') tpl:TemplateRef<any>;

this.overlayIns = this._toppy
  .overlay(position)
  .host(this.tpl) // template ref
  .create();
```
