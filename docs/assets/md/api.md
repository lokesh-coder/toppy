```typescript
Toppy.overlay(position:Position,config:ToppyConfig):Toppy
```

```typescript
Toppy.host(
  content: string | TemplateRef<any> | ComponentType<any>,
  props: { [x: string]: any } = {}
):Toppy
```

```typescript
Toppy.create(position:Position,config:ToppyConfig):ToppyRef
```

---

```typescript
ToppyRef.open():void
```

```typescript
ToppyRef.close():void
```

```typescript
ToppyRef.toggle():void
```

```typescript
ToppyRef.onDocumentClick():Observable
```

```typescript
ToppyRef.onWindowResize():Observable
```

```typescript
ToppyRef.getConfig():ToppyConfig
```

```typescript
ToppyRef.updateHost(
  content: string | TemplateRef<any> | ComponentType<any>,
  props: { [x: string]: any } = {}
):ToppyRef
```

```typescript
ToppyRef.updatePosition(config:object):ToppyRef
```

---

```typescript
enum OutsidePlacement {}
```

<div class="inline-code">

```typescript
OutsidePlacement.BOTTOM;
```

```typescript
OutsidePlacement.BOTTOM_LEFT;
```

```typescript
OutsidePlacement.BOTTOM_RIGHT;
```

```typescript
OutsidePlacement.LEFT;
```

```typescript
OutsidePlacement.LEFT_BOTTOM;
```

```typescript
OutsidePlacement.LEFT_TOP;
```

```typescript
OutsidePlacement.RIGHT;
```

```typescript
OutsidePlacement.RIGHT_BOTTOM;
```

```typescript
OutsidePlacement.RIGHT_TOP;
```

```typescript
OutsidePlacement.TOP;
```

```typescript
OutsidePlacement.TOP_LEFT;
```

```typescript
OutsidePlacement.TOP_RIGHT;
```

</div>

```typescript
enum InsidePlacement {}
```

<div class="inline-code">

```typescript
InsidePlacement;
```

```typescript
InsidePlacement.BOTTOM;
```

```typescript
InsidePlacement.BOTTOM_LEFT;
```

```typescript
InsidePlacement.BOTTOM_RIGHT;
```

```typescript
InsidePlacement.LEFT;
```

```typescript
InsidePlacement.RIGHT;
```

```typescript
InsidePlacement.TOP;
```

```typescript
InsidePlacement.TOP_LEFT;
```

```typescript
InsidePlacement.TOP_RIGHT;
```

```typescript
InsidePlacement.CENTER;
```

</div>

```typescript
enum SlidePlacement {}
```

<div class="inline-code">

```typescript
SlidePlacement.LEFT;
```

```typescript
SlidePlacement.RIGHT;
```

</div>
