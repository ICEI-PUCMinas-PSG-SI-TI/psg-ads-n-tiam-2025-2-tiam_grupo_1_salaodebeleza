import { useState } from "react";
import { View, Text, Pressable, Modal, FlatList, StyleSheet } from "react-native";
import { theme } from "../styles/theme";
import { Ionicons } from "@expo/vector-icons";

export default function Filter({ label, listItem = [], onSelect }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState([]);

  const handleSelect = (id) => {
    const itemId = id;
    const exists = selected.some(
      (i) => i?.id === itemId || i?.sid === itemId
    );

    if (exists) {
      // Remove se já estiver selecionado
      const newSelected = selected.filter(
        (i) => i?.id !== itemId && i?.sid !== itemId
      );
      setSelected(newSelected);
      // Notifica com array de IDs selecionados
      const selectedIds = newSelected.map((i) => i.id || i.sid);
      onSelect?.(selectedIds);
    } else {
      // Adiciona se não estiver selecionado
      const item = listItem.find((i) => i.id === itemId || i.sid === itemId);
      if (item) {
        const newSelected = [...selected, item];
        setSelected(newSelected);
        // Notifica com array de IDs selecionados
        const selectedIds = newSelected.map((i) => i.id || i.sid);
        onSelect?.(selectedIds);
      }
    }
  };

  const isSelected = (id) => {
    return selected.some((i) => i?.id === id || i?.sid === id);
  };

  const getSelectedCount = () => {
    return selected.length;
  };

  return (
    <>
      <Pressable style={styles.chip} onPress={() => setOpen(true)}>
        <Text style={styles.chipText}>
          {label}
          {getSelectedCount() > 0 && ` (${getSelectedCount()})`}
        </Text>
        <Ionicons name="chevron-down" size={16} color={theme.colors.textInput} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade">
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.modalBox} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <Pressable onPress={() => setOpen(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </Pressable>
            </View>
            <FlatList
              data={listItem}
              keyExtractor={(item) => item.id?.toString() || item.sid?.toString() || item.nome}
              renderItem={({ item }) => {
                const itemId = item.id || item.sid;
                const checked = isSelected(itemId);
                return (
                  <Pressable
                    style={styles.option}
                    onPress={() => handleSelect(itemId)}
                  >
                    <View style={styles.optionContent}>
                      <Ionicons
                        name={checked ? "checkbox" : "checkbox-outline"}
                        size={24}
                        color={checked ? theme.colors.primary : theme.colors.textInput}
                      />
                      <Text style={[styles.optionText, checked && styles.optionTextSelected]}>
                        {item.nome}
                      </Text>
                    </View>
                  </Pressable>
                );
              }}
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
    paddingHorizontal: 12,
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
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  optionText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  optionTextSelected: {
    fontWeight: "600",
    color: theme.colors.primary,
  },
});
