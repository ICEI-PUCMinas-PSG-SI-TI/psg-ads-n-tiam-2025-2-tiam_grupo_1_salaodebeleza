import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  ScrollView,
  Pressable,
} from "react-native";
import { theme } from "../styles/theme";

export default function MultiSelect({
  placeholder = "Selecione...",
  items = [],
  selectedItems = [],
  onSelectItem = () => {},
  onRemoveItem = () => {},
  renderItemLabel = (item) => item.nome || item.label,
  searchableField = "nome",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredItems, setFilteredItems] = useState(items);
  const containerRef = useRef(null);

  // Atualizar itens filtrados quando o texto de busca mudar
  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(
        (item) =>
          item[searchableField]
            ?.toLowerCase()
            .includes(searchText.toLowerCase()) &&
          !selectedItems.some((selected) => selected.id === item.id)
      );
      setFilteredItems(filtered);
    }
  }, [searchText, items, selectedItems]);

  const handleSelectItem = (item) => {
    onSelectItem(item);
    setSearchText("");
    setFilteredItems(items);
  };

  const handleRemoveItem = (itemId) => {
    onRemoveItem(itemId);
  };

  return (
    <Pressable
      style={styles.outsidePress}
      onPress={() => setIsOpen(false)}
    >
      <View style={styles.container} ref={containerRef}>
      {/* Campo de input/seleção */}
      <TouchableOpacity
        style={styles.inputContainer}
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.7}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tagScrollContainer}
        >
          <View style={styles.tagsWrapper}>
            {selectedItems.length > 0 ? (
              selectedItems.map((item) => (
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
              ))
            ) : (
              <Text style={styles.placeholder}>{placeholder}</Text>
            )}
          </View>
        </ScrollView>
        <Text style={styles.dropdown}>{isOpen ? "▲" : "▼"}</Text>
      </TouchableOpacity>

      {/* Lista de opções */}
      {isOpen && (
        <View style={styles.dropdownContainer}>
          {/* Campo de busca */}
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar..."
            placeholderTextColor={theme.colors.textInput}
            value={searchText}
            onChangeText={setSearchText}
            autoFocus
          />

          {/* Itens disponíveis */}
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.optionItem}
                onPress={() => handleSelectItem(item)}
              >
                <Text style={styles.optionText}>
                  {renderItemLabel(item)}
                </Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nenhum item encontrado</Text>
            }
          />
        </View>
      )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  outsidePress: {
    flex: 1,
    width: "100%",
  },
  container: {
    width: "100%",
    marginVertical: theme.spacing.small,
  },
  inputContainer: {
    backgroundColor: theme.colors.container3,
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    borderColor: theme.colors.container3,
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.small,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 50,
  },
  tagScrollContainer: {
    flex: 1,
  },
  tagsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
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
  placeholder: {
    color: theme.colors.textInput,
    fontSize: 15,
  },
  dropdown: {
    color: theme.colors.textInput,
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 8,
  },
  dropdownContainer: {
    backgroundColor: theme.colors.container3,
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    borderColor: theme.colors.container3,
    marginTop: 8,
    maxHeight: 300,
    paddingVertical: 8,
  },
  searchInput: {
    backgroundColor: theme.colors.container2,
    borderRadius: theme.radius.small,
    marginHorizontal: 8,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: theme.colors.text,
    fontSize: 14,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  optionItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.container2,
  },
  optionText: {
    color: theme.colors.text,
    fontSize: 14,
  },
  emptyText: {
    textAlign: "center",
    color: theme.colors.textInput,
    paddingVertical: 12,
    fontSize: 14,
  },
});
