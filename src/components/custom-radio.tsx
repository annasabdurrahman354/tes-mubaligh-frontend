import { Radio } from "@heroui/react";
import { button } from "@heroui/theme";

type CustomRadioProps = Omit<
  React.ComponentPropsWithoutRef<typeof Radio>,
  "className"
> & {
  buttonColor?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | undefined;
};

export const CustomRadio: React.FC<CustomRadioProps> = ({
  buttonColor = "default",
  children,
  ...otherProps
}) => {
  return (
    <Radio
      {...otherProps}
      className={button({
        color: buttonColor,
        variant: "faded",
        radius: "lg",
        fullWidth: true,
      })}
      color={buttonColor}
    >
      {children}
    </Radio>
  );
};
