import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  ReactElement,
  ReactNode,
  useId,
} from "react"
import { tcx } from "~/utils"
import { Input, type InputProps } from "../input"
import { FieldAddon, FieldDescription, FieldLabel } from "./components"
import { TextFieldTv } from "./tv"

export interface TextFieldProps extends Omit<InputProps, "children"> {
  children?: ReactNode
}

interface TextFieldComponent
  extends React.ForwardRefExoticComponent<TextFieldProps & React.RefAttributes<HTMLInputElement>> {
  Description: typeof FieldDescription
  Label: typeof FieldLabel
  Prefix: typeof FieldAddon
  Suffix: typeof FieldAddon
}

const TextFieldContent = ({
  className,
  prefixNode,
  suffixNode,
  inputProps,
  styles,
  inputRef,
}: {
  className?: string
  inputProps: InputProps
  inputRef: React.Ref<HTMLInputElement>
  prefixNode: ReactElement | null
  styles: ReturnType<typeof TextFieldTv>
  suffixNode: ReactElement | null
}) => (
  <div className={tcx(styles.root(), className)}>
    {prefixNode &&
      cloneElement(prefixNode, {
        className: tcx(styles.prefix(), prefixNode.props.className),
      })}

    <Input
      ref={inputRef}
      variant="reset"
      className={styles.input()}
      {...inputProps}
    />

    {suffixNode &&
      cloneElement(suffixNode, {
        className: tcx(styles.suffix(), suffixNode.props.className),
      })}
  </div>
)

const TextFieldBase = forwardRef<HTMLInputElement, TextFieldProps>((props, ref) => {
  const { className, variant, size, children, disabled, ...rest } = props

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

  const styles = TextFieldTv({
    variant,
    size,
    hasPrefix: !!prefixNode,
    hasSuffix: !!suffixNode,
    disabled,
  })

  const uuid = useId()

  return labelNode || descriptionNode ? (
    <div className={tcx(styles.container(), className)}>
      {labelNode &&
        cloneElement(labelNode, {
          className: tcx(styles.label(), labelNode.props.className),
          htmlFor: uuid,
        })}
      <TextFieldContent
        className={className}
        prefixNode={prefixNode}
        suffixNode={suffixNode}
        styles={styles}
        inputRef={ref}
        inputProps={{ ...rest, id: uuid, size, disabled }}
      />

      {descriptionNode &&
        cloneElement(descriptionNode, {
          className: tcx(styles.description(), descriptionNode.props.className),
        })}
    </div>
  ) : (
    <TextFieldContent
      className={className}
      prefixNode={prefixNode}
      suffixNode={suffixNode}
      styles={styles}
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
  Label: FieldLabel,
  Description: FieldDescription,
}) as TextFieldComponent
