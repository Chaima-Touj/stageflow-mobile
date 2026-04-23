import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography, borderRadius, shadows } from "../theme";

/* 

─── Button ─────────────────────────────────────────────────── */
export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon,
  style,
}) {
  const isDisabled = disabled || loading;

  if (variant === "primary") {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.85}
        style={[styles.btnBase, styles[`btn_${size}`], isDisabled && styles.btnDisabled, style]}
      >
        <LinearGradient
          colors={isDisabled ? ["#94A3B8", "#94A3B8"] : [colors.primary, colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.btnGradient, styles[`btn_${size}`]]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <View style={styles.btnRow}>
              {icon && <View style={styles.btnIconLeft}>{icon}</View>}
              <Text style={[styles.btnText, styles[`btnText_${size}`]]}>{title}</Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        styles.btnBase,
        styles[`btn_${size}`],
        styles[`btn_${variant}`],
        isDisabled && styles.btnDisabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "outline" ? colors.primary : colors.textSecondary}
          size="small"
        />
      ) : (
        <View style={styles.btnRow}>
          {icon && <View style={styles.btnIconLeft}>{icon}</View>}
          <Text style={[styles.btnText, styles[`btnText_${size}`], styles[`btnText_${variant}`]]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

/* ─── Input ─────────────────────────────────────────────────── */
export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  multiline,
  numberOfLines,
  error,
  icon,
  rightIcon,
  editable = true,
  style,
  inputStyle,
  autoCapitalize = "none",
}) {
  return (
    <View style={[styles.inputWrapper, style]}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}
      <View style={[styles.inputContainer, error && styles.inputError, !editable && styles.inputDisabled]}>
        {icon && <View style={styles.inputIconLeft}>{icon}</View>}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          autoCapitalize={autoCapitalize}
          style={[
            styles.inputField,
            icon && styles.inputFieldWithIcon,
            rightIcon && styles.inputFieldWithRightIcon,
            multiline && styles.inputFieldMulti,
            inputStyle,
          ]}
        />
        {rightIcon && <View style={styles.inputIconRight}>{rightIcon}</View>}
      </View>
      {error && <Text style={styles.inputErrorText}>{error}</Text>}
    </View>
  );
}

/* ─── Card ─────────────────────────────────────────────────── */
export function Card({ children, style, onPress, gradient = false }) {
  const inner = gradient ? (
    <LinearGradient
      colors={colors.gradientCard}
      style={[styles.card, style]}
    >
      {children}
    </LinearGradient>
  ) : (
    <View style={[styles.card, style]}>{children}</View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.92}>
        {inner}
      </TouchableOpacity>
    );
  }
  return inner;
}

/* ─── Badge ─────────────────────────────────────────────────── */
export function Badge({ label, color = colors.primary, bg = colors.primaryLight, icon }) {
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      {icon && <View style={styles.badgeIcon}>{icon}</View>}
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

/* ─── Loader ─────────────────────────────────────────────────── */
export function Loader({ message = "Chargement..." }) {
  return (
    <View style={styles.loader}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loaderText}>{message}</Text>
    </View>
  );
}

/* ─── Avatar ─────────────────────────────────────────────────── */
export function Avatar({ name = "", size = 44, color = colors.primary }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: color + "20" },
      ]}
    >
      <Text style={[styles.avatarText, { fontSize: size * 0.38, color }]}>{initials}</Text>
    </View>
  );
}

/* ─── Section Header ─────────────────────────────────────────── */
export function SectionHeader({ title, subtitle, action, actionLabel }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={{ flex: 1 }}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
      </View>
      {action && (
        <TouchableOpacity onPress={action}>
          <Text style={styles.sectionAction}>{actionLabel || "Voir tout"}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

/* ─── Empty State ─────────────────────────────────────────────── */
export function EmptyState({ icon, title, subtitle, action, actionLabel }) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>{icon || "📭"}</Text>
      <Text style={styles.emptyTitle}>{title}</Text>
      {subtitle && <Text style={styles.emptySubtitle}>{subtitle}</Text>}
      {action && (
        <Button title={actionLabel || "Action"} onPress={action} style={{ marginTop: 16 }} />
      )}
    </View>
  );
}

/* ─── Styles ─────────────────────────────────────────────────── */
const styles = StyleSheet.create({
  // Button
  btnBase: { borderRadius: borderRadius.md, overflow: "hidden" },
  btnGradient: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  btn_sm: { height: 38 },
  btn_md: { height: 50 },
  btn_lg: { height: 56 },
  btn_outline: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  btn_ghost: {
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  btn_danger: {
    backgroundColor: colors.dangerLight,
    alignItems: "center",
    justifyContent: "center",
  },
  btnDisabled: { opacity: 0.6 },
  btnRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20 },
  btnIconLeft: { marginRight: 8 },
  btnText: { color: colors.textWhite, fontWeight: "700" },
  btnText_sm: { fontSize: 13 },
  btnText_md: { fontSize: 15 },
  btnText_lg: { fontSize: 16 },
  btnText_outline: { color: colors.primary },
  btnText_ghost: { color: colors.primary },
  btnText_danger: { color: colors.danger },

  // Input
  inputWrapper: { marginBottom: spacing.md },
  inputLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bgSurface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    minHeight: 50,
  },
  inputError: { borderColor: colors.danger },
  inputDisabled: { opacity: 0.6 },
  inputIconLeft: { paddingLeft: 14, paddingRight: 4 },
  inputIconRight: { paddingRight: 14 },
  inputField: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.textPrimary,
  },
  inputFieldWithIcon: { paddingLeft: 4 },
  inputFieldWithRightIcon: { paddingRight: 4 },
  inputFieldMulti: { textAlignVertical: "top", paddingTop: 12 },
  inputErrorText: { ...typography.xs, color: colors.danger, marginTop: 4 },

  // Card
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },

  // Badge
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  badgeIcon: { marginRight: 4 },
  badgeText: { fontSize: 12, fontWeight: "600" },

  // Loader
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 12,
  },
  loaderText: { ...typography.sm, color: colors.textSecondary },

  // Avatar
  avatar: { alignItems: "center", justifyContent: "center" },
  avatarText: { fontWeight: "700" },

  // Section Header
  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: spacing.md,
  },
  sectionTitle: { ...typography.h4, color: colors.textPrimary },
  sectionSubtitle: { ...typography.sm, color: colors.textSecondary, marginTop: 2 },
  sectionAction: { ...typography.smMd, color: colors.primary },

  // Empty State
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: spacing.xl,
  },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { ...typography.h4, color: colors.textPrimary, textAlign: "center", marginBottom: 8 },
  emptySubtitle: { ...typography.body, color: colors.textSecondary, textAlign: "center" },
});