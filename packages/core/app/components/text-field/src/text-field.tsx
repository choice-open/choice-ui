import { Description } from "@choice-ui/description"
import { Input, type InputProps } from "@choice-ui/input"
import { Label } from "@choice-ui/label"
import { findSlotChild, tcx } from "@choice-ui/shared"
import React, {
  cloneElement,
  forwardRef,
  ReactElement,
  ReactNode,
  useId,
} from "react"
import { FieldAddon } from "./components"
import { TextFieldTv } from "./tv"

export interface TextFieldProps extends Omit<InputProps, "children"> {
  children?: ReactNode
}

interface TextFieldComponent extends React.ForwardRefExoticComponent<
  TextFieldProps & React.RefAttributes<HTMLInputElement>
> {
  Description: typeof Description
  Label: typeof Label
  Prefix: typeof FieldAddon
  Suffix: typeof FieldAddon
}

const TextFieldContent = ({
  className,
  prefixNode,
  suffixNode,
  inputProps,
  tv,
  inputRef,
}: {
  className?: string
  inputProps: InputProps
  inputRef: React.Ref<HTMLInputElement>
  prefixNode: ReactElement | null
  tv: ReturnType<typeof TextFieldTv>
  suffixNode: ReactElement | null
}) => (
  <div className={tcx(tv.root(), className)}>
    {prefixNode &&
      cloneElement(prefixNode, {
        className: tcx(tv.prefix(), prefixNode.props.className),
      })}

    <Input
      ref={inputRef}
      variant="reset"
      className={tv.input()}
      {...inputProps}
    />

    {suffixNode &&
      cloneElement(suffixNode, {
        className: tcx(tv.suffix(), suffixNode.props.className),
      })}
  </div>
)

const TextFieldBase = forwardRef<HTMLInputElement, TextFieldProps>((props, ref) => {
  const { className, variant, size, children, disabled, selected, ...rest } = props

  // Use findSlotChild from @choice-ui/shared so memo-wrapped or
  // div-wrapped slots are still discovered.
  const prefixNode = findSlotChild(children, TextField.Prefix) ?? null
  const suffixNode = findSlotChild(children, TextField.Suffix) ?? null
  const labelNode = findSlotChild(children, TextField.Label) ?? null
  const descriptionNode = findSlotChild(children, TextField.Description) ?? null

  const tv = TextFieldTv({
    variant,
    size,
    hasPrefix: !!prefixNode,
    hasSuffix: !!suffixNode,
    disabled,
    selected,
  })

  const generatedId = useId()
  const uuid = props.id ?? generatedId

  return labelNode || descriptionNode ? (
    <div className={tcx(tv.container(), className)}>
      {labelNode &&
        cloneElement(labelNode, {
          variant,
          disabled,
          htmlFor: uuid,
        })}
      <TextFieldContent
        prefixNode={prefixNode}
        suffixNode={suffixNode}
        tv={tv}
        inputRef={ref}
        inputProps={{ ...rest, id: uuid, size, disabled }}
      />

      {descriptionNode &&
        cloneElement(descriptionNode, {
          className: tcx(tv.description(), descriptionNode.props.className),
        })}
    </div>
  ) : (
    <TextFieldContent
      className={className}
      prefixNode={prefixNode}
      suffixNode={suffixNode}
      tv={tv}
      inputRef={ref}
      inputProps={{ ...rest, id: uuid, size, disabled }}
    />
  )
})

TextFieldBase.displayName = "TextField"

const PrefixComponent = (props: React.ComponentProps<typeof FieldAddon>) => (
  <FieldAddon {...props} />
)

const SuffixComponent = (props: React.ComponentProps<typeof FieldAddon>) => (
  <FieldAddon {...props} />
)

export const TextField = Object.assign(TextFieldBase, {
  Prefix: PrefixComponent,
  Suffix: SuffixComponent,
  Label: Label,
  Description: Description,
}) as TextFieldComponent
