import { Text as RNText } from "react-native";
import { fonts } from "../theme/tokens";

export default function AppText({ style, ...props }) {
  return <RNText {...props} style={[{ fontFamily: fonts.regular }, style]} />;
}