import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Modal,
  Animated,
  PanResponder,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../styles/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Filter({ groups = [], onChange }) {
  const [visible, setVisible] = useState(false);
  const [selections, setSelections] = useState({});
  const insets = useSafeAreaInsets();
  const [translateY] = useState(() => new Animated.Value(0));

  const open = () => {
    translateY.setValue(0);
    setVisible(true);
  };

  const close = () => {
    Animated.timing(translateY, {
      toValue: 500,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
    onPanResponderMove: (_, g) => {
      if (g.dy > 0) translateY.setValue(g.dy);
    },
    onPanResponderRelease: (_, g) => {
      if (g.dy > 100) return close();
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start();
    },
  });

  const toggleItem = (groupLabel, item) => {
    setSelections((prev) => {
      const current = prev[groupLabel] || [];
      const itemId = item.id || item.sid;
      const exists = current.some((i) => (i.id || i.sid) === itemId);

      const updated = exists
        ? current.filter((i) => (i.id || i.sid) !== itemId)
        : [...current, item];

      const newState = { ...prev, [groupLabel]: updated };
      
      // Converte para o formato esperado por Agenda.js
      const filterFormat = {
        profissional: newState["Profissionais"]?.map(i => i.id || i.sid) || [],
        servico: newState["Serviços"]?.map(i => i.id || i.sid) || [],
      };
      
      onChange?.(filterFormat);
      return newState;
    });
  };

  return (
    <>
      {/* BOTÃO PRINCIPAL */}
      <Pressable style={styles.chip} onPress={open}>
        <Text style={styles.chipText}>Filtros</Text>
        <Ionicons name="chevron-down" size={16} color={theme.colors.textInput} />
      </Pressable>

      {/* MODAL ÚNICO */}
      <Modal visible={visible} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={close}>
          <Animated.View
            style={[
              styles.modalContainer,
              {
                paddingBottom: insets.bottom + 30,
                transform: [{ translateY }],
              },
            ]}
          >
            {/* Header */}
            <View style={styles.header} {...panResponder.panHandlers}>
              <View style={styles.dragHandle} />
              <Text style={styles.headerTitle}>Filtros</Text>
            </View>

            {/* LISTAS */}
            <ScrollView style={{ maxHeight: 450 }}>
              {groups.map((group) => (
                <View key={group.label} style={{ marginBottom: 25 }}>
                  <Text style={styles.sectionTitle}>{group.label}</Text>

                  <View style={styles.chipGrid}>
                    {group.items.map((item) => {
                      const itemId = item.id || item.sid;
                      const selected =
                        selections[group.label]?.some((s) => (s.id || s.sid) === itemId);

                      return (
                        <Pressable
                          key={itemId}
                          style={[
                            styles.selectableChip,
                            selected && styles.selectableChipSelected,
                          ]}
                          onPress={() => toggleItem(group.label, item)}
                        >
                          <Text
                            style={[
                              styles.selectableChipText,
                              selected && styles.selectableChipTextSelected,
                            ]}
                          >
                            {item.nome}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* FECHAR FLOTANTE */}
            <Pressable style={styles.floatingCloseButton} onPress={close}>
              <Ionicons name="close" size={22} color="#333" />
            </Pressable>
          </Animated.View>
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
  },
  chipText: {
    marginRight: 6,
    color: theme.colors.textInput,
    fontSize: 15,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 10,
    maxHeight: 550,
  },
  header: {
    padding: 12,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#ccc",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 4,
  },
  selectableChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.textInput,
  },
  selectableChipSelected: {
    backgroundColor: theme.colors.primary + "22",
    borderColor: theme.colors.primary,
  },
  selectableChipText: {
    fontSize: 15,
    color: theme.colors.text,
  },
  selectableChipTextSelected: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  floatingCloseButton: {
    position: "absolute",
    top: -60,
    right: 10,
    zIndex: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});
