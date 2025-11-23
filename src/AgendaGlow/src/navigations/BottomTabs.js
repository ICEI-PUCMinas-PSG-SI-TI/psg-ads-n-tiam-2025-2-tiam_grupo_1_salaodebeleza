import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import Home from "../screens/Home";
import Agenda from "../screens/Agenda";
import Clientes from "../screens/Clientes";
import Mais from "../screens/Mais";
import { theme } from "../styles/theme";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Inicio: "home-outline",
            Agenda: "calendar-outline",
            Clientes: "people-outline",
            Mais: "ellipsis-horizontal-outline",
          };

          return <Ionicons name={icons[route.name]} size={24} color={color} />;
        },

        tabBarActiveTintColor: theme.colors.text,
        tabBarInactiveTintColor: "#B9B9B9",

        headerShown: false,

        // ---- CONFIGS PARA BARRA FLUTUANTE ----
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
        tabBarLabelStyle: styles.label,
      })}
    >
      <Tab.Screen name="Inicio" component={Home} />
      <Tab.Screen name="Agenda" component={Agenda} />
      <Tab.Screen name="Clientes" component={Clientes} />
      <Tab.Screen name="Mais" component={Mais} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  // Barra flutuante moderna
  tabBar: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    height: 68,
    borderRadius: 999,
    backgroundColor: theme.colors.white,
    marginHorizontal: theme.spacing.large,
    paddingBottom: 6,
    paddingTop: 6,

    // sombra moderna (iOS + Android)
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 8,
  },

  // Ajusta posição interna dos botões
  tabBarItem: {
    
  },

  // Label mais clean
  label: {
    fontSize: 11,
    marginTop: 0,
  },
});
