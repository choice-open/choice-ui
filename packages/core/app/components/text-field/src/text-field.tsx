import { tcx } from "@choice-ui/shared"
import { Input, type InputProps } from "@choice-ui/input"
import { Label } from "@choice-ui/label"
import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  ReactElement,
  ReactNode,
  useId,
} from "react"
import { FieldAddon, FieldDescription } from "./components"
import { TextFieldTv } from "./tv"

export interface TextFieldProps extends Omit<InputProps, "children"> {
  children?: ReactNode
}

interface TextFieldComponent extends React.ForwardRefExoticComponent<
  TextFieldProps & React.RefAttributes<HTMLInputElement>
> {
  Description: typeof FieldDescription
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

  const childrenArray = Children.toArray(children)

  const prefixElements = childrenArray.filter(
    (child): child is ReactElement => isValidElement(child) && child.type === TextField.Prefix,
  )

  const suffixElements = childrenArray.filter(
    (child): child is ReactElement => isValidElement(child) && child.type === TextField.Suffix,
  )

  const labelElements = childrenArray.filter(
    (child): child is ReactElement => isValidElement(child) && child.type === TextField.Label,
  )

  const descriptionElements = childrenArray.filter(
    (child): child is ReactElement => isValidElement(child) && child.type === TextField.Description,
  )

  const prefixNode = prefixElements[0] || null
  const suffixNode = suffixElements[0] || null
  const labelNode = labelElements[0] || null
  const descriptionNode = descriptionElements[0] || null

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
        className={className}
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
  Description: FieldDescription,
}) as TextFieldComponent
