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

**OutsidePlacement.BOTTOM** | **OutsidePlacement.BOTTOM_LEFT** | **OutsidePlacement.BOTTOM_RIGHT**|, **OutsidePlacement.LEFT** | **OutsidePlacement.LEFT_BOTTOM** | **OutsidePlacement.LEFT_TOP**|, **OutsidePlacement.RIGHT** | **OutsidePlacement.RIGHT_BOTTOM** | **OutsidePlacement.RIGHT_TOP**|, **OutsidePlacement.TOP** | **OutsidePlacement.TOP_LEFT** | **OutsidePlacement.TOP_RIGHT**

```typescript
enum InsidePlacement {}
```

**InsidePlacement** | **InsidePlacement.BOTTOM** | **InsidePlacement.BOTTOM_LEFT**|, **InsidePlacement.BOTTOM_RIGHT** | **InsidePlacement.LEFT** | **InsidePlacement.RIGHT**|, **InsidePlacement.TOP** | **InsidePlacement.TOP_LEFT** | **InsidePlacement.TOP_RIGHT**|, **InsidePlacement.CENTER**

```typescript
enum SlidePlacement {}
```

**SlidePlacement.LEFT** | **SlidePlacement.RIGHT**

```

```
