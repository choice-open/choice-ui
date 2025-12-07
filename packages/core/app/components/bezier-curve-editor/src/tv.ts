import { tcv } from "@choiceform/design-shared"

export const BezierCurveEditorTv = tcv({
  slots: {
    base: "isolate flex flex-col p-2",
    wrappr: "relative",
    presentation: "absolute inset-y-0",
    plane: "absolute",
    planeInner: "fill-none",
    curveWrapper: "relative overflow-visible",
    line: [
      "stroke-default-foreground transition-colors",
      "data-[active=true]:stroke-accent-foreground",
    ],
    curve: ["stroke-current transition-colors", "data-[active=true]:stroke-accent-foreground"],
    rect: "fill-transparent",
    preview: "fill-default-background stroke-default-foreground",
    handle: [
      "bg-inverse-background absolute box-content rounded-full select-none",
      "border-default-background -translate-x-1/2 -translate-y-1/2 border",
      // "data-[state=start]:bg-accent-background data-[state=end]:bg-danger-background",
      // "ring-accent-foreground data-[active=true]:ring-3",
    ],
  },
  variants: {
    fixed: {
      true: {
        handle: "pointer-events-none",
      },
      false: {
        handle: "active:bg-accent-background",
      },
    },
  },
  defaultVariants: {
    fixed: false,
  },
})
