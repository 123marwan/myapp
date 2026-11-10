import { StyleSheet, View } from "react-native";
import Text from "../AppText";
import { colors, fonts, radius } from "../../theme/tokens";

export default function ErrorBanner({ message, style }) {
  if (!message) return null;

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.icon}>!</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF1F2",
    borderWidth: 1,
    borderColor: "#FECDD3",
    borderRadius: radius.sm,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 16,
  },
  icon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.danger,
    color: "#fff",
    fontSize: 12,
    fontFamily: fonts.extrabold,
    textAlign: "center",
    lineHeight: 18,
    marginLeft: 8,
    overflow: "hidden",
  },
  message: {
    color: colors.danger,
    fontSize: 13,
    fontFamily: fonts.semibold,
    flexShrink: 1,
    textAlign: "right",
  },
});