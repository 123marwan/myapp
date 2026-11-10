import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Text from "../AppText";
import { fonts, gradients, radius, shadow } from "../../theme/tokens";

export default function PrimaryButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  icon = "←",
  style,
}) {
  const isDisabled = loading || disabled;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [styles.wrap, style, pressed && !isDisabled && styles.pressed]}
    >
      <LinearGradient colors={gradients.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.button}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            {icon ? <Text style={styles.icon}>{icon}</Text> : null}
          </View>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 16, borderRadius: radius.md, ...shadow.glow },
  pressed: { opacity: 0.88, transform: [{ scale: 0.99 }] },
  button: {
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    width: "100%",
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { color: "#fff", fontSize: 16, fontFamily: fonts.extrabold },
  icon: { color: "#fff", fontSize: 20, fontFamily: fonts.bold },
});