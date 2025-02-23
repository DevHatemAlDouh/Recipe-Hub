import * as React from "react";
import Svg, { Path } from "react-native-svg";

// مكون SVG مع دعم تغيير اللون
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={48} height={48} {...props}>
    <Path
      fill={props.fill || "#063855"} // استخدام اللون المرسل عبر props أو القيمة الافتراضية
      fillRule="evenodd"
      d="M0 0h48v1H0z"
    />
  </Svg>
);

export default SvgComponent;
