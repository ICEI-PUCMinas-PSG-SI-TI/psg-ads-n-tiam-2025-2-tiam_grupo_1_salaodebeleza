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
    <View style={styles.container}>
      {/* Picker com estilo similar ao componente cliente */}
      <Picker
        style={styles.picker}
        dropdownIconColor={theme.colors.textInput}
        selectedValue={selectedValue}
        onValueChange={handleSelectItem}
      >
        <Picker.Item
          color={theme.colors.textInput}
          label={placeholder}
          value={null}
        />
        {availableItems.map((item) => (
          <Picker.Item
            color={theme.colors.textInput}
            key={item.id}
            label={renderItemLabel(item)}
            value={item.id}
          />
        ))}
      </Picker>

      {/* Tags dos itens selecionados */}
      {selectedItems.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tagScrollContainer}
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
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: theme.spacing.small,
  },
  picker: {
    backgroundColor: theme.colors.container3,
    borderRadius: theme.radius.medium,
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: 10,
    marginVertical: theme.spacing.small,
    color: theme.colors.textInput,
    fontSize: 16,
    borderWidth: 1,
    borderColor: theme.colors.container3,
  },
  tagScrollContainer: {
    marginTop: theme.spacing.small,
  },
  tagsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: theme.spacing.small,
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
});
