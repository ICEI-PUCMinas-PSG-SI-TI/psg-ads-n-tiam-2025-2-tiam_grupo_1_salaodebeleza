import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { theme } from "../styles/theme";

export default function MultiSelect({
  placeholder = "Selecione...",
  items = [],
  selectedItems = [],
  onSelectItem = () => {},
  onRemoveItem = () => {},
  renderItemLabel = (item) => item.nome || item.label,
}) {
  const [selectedValue, setSelectedValue] = useState(null);

  // Itens disponíveis (não selecionados)
  const availableItems = items.filter(
    (item) => !selectedItems.some((selected) => selected.id === item.id)
  );

  const handleSelectItem = (itemId) => {
    if (itemId !== null) {
      const item = items.find((i) => i.id === itemId);
      if (item) {
        onSelectItem(item);
        setSelectedValue(null);
      }
    }
  };

  const handleRemoveItem = (itemId) => {
    onRemoveItem(itemId);
  };

  return (
    <View style={styles.pickerContainer}>
      {/* Tags — permitem clique nos botões, mas não bloqueiam o fundo */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tagScrollContainer}
        pointerEvents="box-none" // 👈 permite o toque "passar" para o Picker
      >
        <View style={styles.tagsWrapper}>
          {selectedItems.map((item) => (
            <View key={item.id} style={styles.tag}>
              <Text style={styles.tagText} numberOfLines={1}>
                {renderItemLabel(item)}
              </Text>
              <TouchableOpacity
                onPress={() => handleRemoveItem(item.id)}
                style={styles.removeButton}
              >
                <Text style={styles.removeText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* Placeholder à direita do último item */}
        </View>
      </ScrollView>
      {selectedItems.length === 0 && (
        <Text style={styles.placeholderText}>{placeholder}</Text>
      )}

      {/* Picker cobrindo tudo e totalmente clicável */}
      <Picker
        style={styles.picker}
        dropdownIconColor="transparent"
        selectedValue={selectedValue}
        onValueChange={handleSelectItem}
      >
        <Picker.Item label="" value={null} />
        {availableItems.map((item) => (
          <Picker.Item
            color={theme.colors.textInput}
            key={item.id}
            label={renderItemLabel(item)}
            value={item.id}
          />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: theme.spacing.small,
  },

  tagScrollContainer: {
    flex: 1,
    marginRight: theme.spacing.small,
    zIndex: 2,
  },
  tagsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
  },
  pickerContainer: {
    position: "relative",
    backgroundColor: theme.colors.container3,
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    borderColor: theme.colors.container3,
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.small,
    marginVertical: theme.spacing.small,
    minHeight: 50,
  },

  picker: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    color: theme.colors.textInput,
    fontSize: 16,
    borderWidth: 0,
    backgroundColor: "transparent",
    zIndex: 1,
    paddingVertical: 0,
  },

  tag: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.small,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  tagText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
    maxWidth: 120,
  },
  removeButton: {
    padding: 2,
  },
  removeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  placeholderText: {
    color: theme.colors.textInput,
    fontSize: 16,
    opacity: 0.7,
    alignSelf: "baseline",
    justifyItems: "center",
    color: theme.colors.text,
  },
});
