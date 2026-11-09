import { Text as RNText } from "react-native";

import { fonts } from "../theme";

// كل النصوص في التطبيق بتستخدم خط Cairo تلقائيًا
export default function Text({ style, ...props }) {
  return <RNText {...props} style={[{ fontFamily: fonts.regular }, style]} />;
}
