import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Modal,
  Platform,
  Animated,
  PanResponder,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../styles/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Filter({ label, listItem = [], onSelect }) {
  const [selected, setSelected] = useState([]);
  const [visible, setVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const [translateY] = useState(() => new Animated.Value(0));

  // Reset translateY ao abrir o modal
  const open = () => {
    translateY.setValue(0);
    setVisible(true);
  };

  // Fecha o modal animando para baixo, só reseta translateY após o modal sumir
  const close = () => {
    Animated.timing(translateY, {
      toValue: 500,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      // O reset do translateY será feito no efeito abaixo
    });
  };

  // Quando o modal for fechado, reseta translateY
  // Isso garante que não "pule" para cima antes de sumir
  // Efeito só roda quando visible muda para false
  // Não executa no primeiro render
  useState(() => {
    let first = true;
    return () => {
      if (first) {
        first = false;
        return;
      }
      if (!visible) {
        translateY.setValue(0);
      }
    };
  }, [visible]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return gestureState.dy > 5;
    },
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0) {
        translateY.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 100) {
        close();
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const handleSelect = (id) => {
    const exists = selected.some((i) => i?.id === id || i?.sid === id);

    let newSelected;

    if (exists) {
      newSelected = selected.filter((i) => (i.id ?? i.sid) !== id);
    } else {
      const item = listItem.find((i) => (i.id ?? i.sid) === id);
      if (!item) return;
      newSelected = [...selected, item];
    }

    setSelected(newSelected);
    onSelect?.(newSelected.map((i) => i.id ?? i.sid));
  };

  const isSelected = (id) => selected.some((i) => (i.id ?? i.sid) === id);

  return (
    <>
      {/* Botão do filtro */}
      <Pressable style={styles.chip} onPress={open}>
        <Text style={styles.chipText}>
          {label}
          {selected.length > 0 && ` (${selected.length})`}
        </Text>
        <Ionicons
          name="chevron-down"
          size={16}
          color={theme.colors.textInput}
        />
      </Pressable>

      {/* Modal estilo bottom sheet */}
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={close}
      >
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
            {/* Header fixo com área de arrastar */}
            <View style={styles.header} {...panResponder.panHandlers}>
              <View style={styles.dragHandle} />
              <View style={styles.headerContent}>
                <Text style={styles.headerTitle}>{label}</Text>

              </View>
            </View>

            {/* Lista */}
            <ScrollView style={{ maxHeight: 350 }}>
              <View style={styles.chipGrid}>
                {listItem.map((item) => {
                  const itemId = item.id || item.sid;
                  const checked = isSelected(itemId);

                  return (
                    <Pressable
                      key={itemId}
                      style={[
                        styles.selectableChip,
                        checked && styles.selectableChipSelected,
                      ]}
                      onPress={() => handleSelect(itemId)}
                    >
                      <Text
                        style={[
                          styles.selectableChipText,
                          checked && styles.selectableChipTextSelected,
                        ]}
                      >
                        {item.nome}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
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
    maxHeight: 500,
  },

  header: {
    padding:theme.spacing.small,

  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#ccc",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 10,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
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
  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    padding: theme.spacing.small,
  },

  selectableChip: {
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.textInput,
    backgroundColor: "#fff",
  },

  selectableChipSelected: {
    backgroundColor: theme.colors.primary + "22",
    borderColor: theme.colors.primary,
  },

  selectableChipText: {
    color: theme.colors.text,
    fontSize: 15,
  },

  selectableChipTextSelected: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  floatingCloseButton: {
    position: "absolute",
    top: -60,
    right: 10,
    zIndex: 999,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5, // Android shadow
  },
});
