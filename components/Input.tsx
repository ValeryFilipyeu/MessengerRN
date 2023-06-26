import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { colors } from "../constants/colors";

interface InputProps {
  label: string;
  icon: "user" | "mail" | "lock";
  iconSize?: number;
  errorText?: string;
}

const Input: React.FC<InputProps> = (props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{props.label}</Text>

      <View style={styles.inputContainer}>
        {props.icon && (
          <Feather
            name={props.icon}
            size={props.iconSize ?? 15}
            style={styles.icon}
          />
        )}
        <TextInput style={styles.input} />
      </View>

      {props.errorText && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{props.errorText}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  label: {
    marginVertical: 8,
    fontFamily: "boldRegular",
    letterSpacing: 0.3,
    color: colors.textColor,
  },
  inputContainer: {
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 2,
    backgroundColor: colors.nearlyWhite,
    flexDirection: "row",
  },
  icon: {
    marginRight: 10,
    color: colors.grey,
  },
  input: {
    color: colors.textColor,
    flex: 1,
    fontFamily: "regular",
    letterSpacing: 0.3,
    paddingTop: 0,
  },
  errorContainer: {
    marginVertical: 5,
  },
  errorText: {
    color: "red",
    fontSize: 13,
    fontFamily: "regular",
    letterSpacing: 0.3,
  },
});

export default Input;
