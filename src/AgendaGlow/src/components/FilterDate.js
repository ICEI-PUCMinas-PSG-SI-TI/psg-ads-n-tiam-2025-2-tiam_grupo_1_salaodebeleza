import { useState } from "react";
import { View, Text, Pressable, Modal, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../styles/theme";

export default function FilterDate({ onSelect }) {
    const [open, setOpen] = useState(false);
    const [openPicker, setOpenPicker] = useState(false);

    const handleSelect = (date) => {
        onSelect(date);
        setOpen(false);
        setOpenPicker(false);
    };

    const tomorrow = () => {
        const t = new Date();
        t.setDate(t.getDate() + 1);
        return t;
    };

    return (
        <>
            {/* Chip */}
            <Pressable style={styles.chip} onPress={() => setOpen(true)}>
                <Text style={styles.chipText}>Data</Text>
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
                    <View style={styles.menu}>
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
                    </View>
                </Pressable>
            </Modal>


            {/* Date Picker nativo */}
            {openPicker && (
                <DateTimePicker
                    value={new Date()}
                    mode="date"
                    display="calendar"
                    onChange={(event, date) => {
                        if (event.type === "dismissed") {
                            setOpenPicker(false);
                            setOpen(true);
                            return;
                        }

                        if (date) handleSelect(date);
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
        marginRight: theme.spacing.small,
    },
    chipText: {
        marginRight: 6,
        color: theme.colors.textInput,
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
