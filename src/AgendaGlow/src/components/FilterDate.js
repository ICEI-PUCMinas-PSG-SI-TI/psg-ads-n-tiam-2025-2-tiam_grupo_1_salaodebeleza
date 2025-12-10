import { useState } from "react";
import { View, Text, Pressable, Modal, StyleSheet, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../styles/theme";

export default function FilterDate({ onSelect }) {
    const [open, setOpen] = useState(false);
    const [openPicker, setOpenPicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    // Converte Date para formato "dd/mm/yyyy"
    const formatDatePtBr = (date) => {
        if (!date) return null;
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleSelect = (date) => {
        const formattedDate = formatDatePtBr(date);
        setSelectedDate(formattedDate);
        onSelect(formattedDate);
        setOpen(false);
        setOpenPicker(false);
    };

    const clearFilter = () => {
        setSelectedDate(null);
        onSelect(null);
    };

    const tomorrow = () => {
        const t = new Date();
        t.setDate(t.getDate() + 1);
        return t;
    };

    return (
        <>
            {/* Chip */}
            <Pressable 
                style={styles.chip} 
                onPress={() => setOpen(true)}
                onLongPress={clearFilter}
            >
                <Text style={styles.chipText}>
                    {selectedDate ? selectedDate : "Data"}
                </Text>
                {selectedDate && (
                    <Pressable 
                        onPress={(e) => {
                            e.stopPropagation();
                            clearFilter();
                        }}
                        style={styles.clearButton}
                    >
                        <Ionicons name="close-circle" size={16} color={theme.colors.textInput} />
                    </Pressable>
                )}
                <Ionicons name="calendar" size={16} color={theme.colors.textInput} />
            </Pressable>

            {/* Modal com opções */}
            <Modal transparent visible={open} animationType="fade">
                <Pressable
                    style={styles.backdrop}
                    onPress={() => {
                        setOpen(false);
                        setOpenPicker(false);
                    }}
                >
                    <View style={styles.menu} onStartShouldSetResponder={() => true}>
                        <Pressable style={styles.option} onPress={() => handleSelect(new Date())}>
                            <Text>Hoje</Text>
                        </Pressable>

                        <Pressable style={styles.option} onPress={() => handleSelect(tomorrow())}>
                            <Text>Amanhã</Text>
                        </Pressable>

                        <Pressable
                            style={styles.option}
                            onPress={() => {
                                setOpen(false);
                                setOpenPicker(true);
                            }}
                        >
                            <Text>Selecionar data…</Text>
                        </Pressable>

                        {selectedDate && (
                            <Pressable style={styles.option} onPress={clearFilter}>
                                <Text style={styles.clearOptionText}>Limpar filtro</Text>
                            </Pressable>
                        )}
                    </View>
                </Pressable>
            </Modal>


            {/* Date Picker nativo */}
            {openPicker && (
                <DateTimePicker
                    value={new Date()}
                    mode="date"
                    display="calendar"
                    minimumDate={new Date()}
                    onChange={(event, date) => {
                        if (event.type === "dismissed") {
                            setOpenPicker(false);
                            setOpen(true);
                            return;
                        }

                        if (date) {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const picked = new Date(date);
                            picked.setHours(0, 0, 0, 0);

                            if (picked < today) {
                                Alert.alert(
                                    "Data inválida",
                                    "Selecione apenas datas a partir de hoje."
                                );
                                setOpenPicker(false);
                                setOpen(true);
                                return;
                            }

                            handleSelect(date);
                        }
                    }}
                />
            )}

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
    },
  chipText: {
    marginRight: 6,
    color: theme.colors.textInput,
  },
  clearButton: {
    marginRight: 4,
  },
  clearOptionText: {
    color: theme.colors.primary || "#FF4C4C",
  },
    backdrop: {
        flex: 1,
        backgroundColor: "#00000055",
        justifyContent: "center",
        padding: 20,
    },
    menu: {
        backgroundColor: "white",
        borderRadius: 12,
        overflow: "hidden",
    },
    option: {
        padding: 14,
        borderBottomColor: "#eee",
        borderBottomWidth: 1,
    },
});
