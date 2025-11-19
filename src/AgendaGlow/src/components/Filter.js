import { useState } from "react";
import { View, Text, Pressable, Modal, FlatList, StyleSheet } from "react-native";
import { theme } from "../styles/theme";
import { Ionicons } from "@expo/vector-icons";

export default function Filter({ label, listItem = [], onSelect }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable style={styles.chip} onPress={() => setOpen(true)}>
        <Text style={styles.chipText}>{label}</Text>
        <Ionicons name="chevron-down" size={16} color={theme.colors.textInput} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade">
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.modalBox}>
            <FlatList
              data={listItem}
              keyExtractor={(item) => item.id?.toString() || item.nome}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.option}
                  onPress={() => {
                    onSelect(item.id || item.sid);
                    setOpen(false);
                  }}
                >
                  <Text style={styles.optionText}>{item.nome}</Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.textInput,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "white",
    marginRight: theme.spacing.small,
  },
  chipText: {
    marginRight: 6,
    color: theme.colors.textInput,
  },
  backdrop: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#00000055",
    padding: 20,
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    maxHeight: "60%",
    padding: 10,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionText: {
    fontSize: 16,
  },
});
