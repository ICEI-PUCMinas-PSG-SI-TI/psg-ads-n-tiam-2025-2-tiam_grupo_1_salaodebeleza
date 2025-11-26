import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/Home";
import Agenda from '../screens/Agenda'
import Mais from "../screens/Mais";
import { Ionicons } from "@expo/vector-icons";
import Clientes from "../screens/Clientes";
import { theme } from "../styles/theme";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Inicio") iconName = "home-outline";
          else if (route.name === "Agenda") iconName = "calendar-outline";
          else if (route.name === "Clientes") iconName = "people-outline";
          else if (route.name === "Mais") iconName = "ellipsis-horizontal-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
         // cor do ícone/label (usa theme.colors.text)
        tabBarActiveTintColor: theme.colors.text,
        tabBarInactiveTintColor: theme.colors.text,

        // >>> ADIÇÕES: fundo rosado na aba ativa e estilos do tabBar
        tabBarActiveBackgroundColor: "#FBEAE6", // ajuste a cor se quiser outra tonalidade
        tabBarStyle: {
          height: 72,
          backgroundColor: theme.colors.white, // cor padrão do tab bar
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 4,
        },
        headerShown: false
      })}
    >
      <Tab.Screen name="Inicio" component={Home} />
      <Tab.Screen name="Agenda" component={Agenda} />
      <Tab.Screen name="Clientes" component={Clientes} />
      <Tab.Screen name="Mais" component={Mais} />
    </Tab.Navigator>
  );
}
