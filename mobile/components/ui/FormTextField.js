import { Pressable, StyleSheet, TextInput, View } from "react-native";
import Text from "../AppText";
import { colors, fonts, radius } from "../../theme";

export default function FormTextField({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  focused = false,
  onFocus,
  onBlur,
  secureTextEntry,
  rightActionLabel,
  onRightActionPress,
  style,
  inputStyle,
  ...inputProps
}) {
  return (
    <View style={style}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.inputWrap}>
        {icon ? <Text style={styles.icon}>{icon}</Text> : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.faint}
          onFocus={onFocus}
          onBlur={onBlur}
          secureTextEntry={secureTextEntry}
          style={[
            styles.input,
            focused && styles.inputFocused,
            rightActionLabel ? styles.inputWithAction : null,
            inputStyle,
          ]}
          {...inputProps}
        />
        {rightActionLabel ? (
          <Pressable onPress={onRightActionPress} hitSlop={8} style={styles.actionButton}>
            <Text style={styles.actionText}>{rightActionLabel}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: "#3F4756",
    marginBottom: 6,
    marginTop: 8,
    textAlign: "right",
  },
  inputWrap: { position: "relative", justifyContent: "center" },
  icon: {
    position: "absolute",
    right: 14,
    zIndex: 2,
    fontSize: 15,
    color: colors.primary,
    fontFamily: fonts.extrabold,
  },
  input: {
    backgroundColor: "#F7F9FD",
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingRight: 42,
    paddingLeft: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: colors.text,
    textAlign: "right",
    fontFamily: fonts.regular,
  },
  inputFocused: {
    borderColor: colors.primary,
    backgroundColor: "#FFFFFF",
    shadowColor: colors.primary,
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  inputWithAction: { paddingLeft: 62 },
  actionButton: {
    position: "absolute",
    left: 6,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  actionText: { color: colors.primary, fontSize: 13, fontFamily: fonts.extrabold },
});