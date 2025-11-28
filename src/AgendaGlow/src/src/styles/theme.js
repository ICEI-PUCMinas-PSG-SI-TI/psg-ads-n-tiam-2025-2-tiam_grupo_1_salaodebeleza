// Tema de cores, fontes e espaçamentos para o aplicativo AgendaGlow

export const theme = {
  colors: {
    // Cores principais
    primary: '#C38379',           // Botão principal
    primaryPressed: '#C36859',
    cancel: '#eec7c1ff',     // Botão clicado / hover
    background: '#F9F9F9',        // Cor de fundo geral
    remove: '#FF4C4C',            // Botão de remoção / exclusão

    // Textos
    text: '#333333',              // Texto principal
    textInput: '#7D7D7D',         // Texto em inputs / placeholder

    // Containers e áreas de destaque
    container1: '#FADED7',        // Cards e seções claras
    container2: '#FFE8DB',        // Alternativa suave
    container3: '#FCEDED',        // Destaques sutis
    container4: '#f3f3f3ff',        // Fundo de modais e pop-ups

    // Outros
    border: '#E0E0E0',
    white: '#FFFFFF',
    black: '#000000',
  },

  fonts: {
    regular: 'System',
    bold: 'System',
    medium: 'System',
  },

  spacing: {
    small: 8,
    medium: 16,
    large: 24
  },

  radius: {
    small: 6,
    medium: 10,
    large: 20,
    full: 999,
  },

  shadows: {
    light: {
      boxShadowColor: '#000',
      boxShadowOffset: { width: 0, height: 2 },
      boxShadowOpacity: 0.05,
      boxShadowRadius: 4,
      elevation: 2,
    },
  },
};

export const modalStyle = {
 modalOverlay: {
     flex: 1,
     backgroundColor: "rgba(0,0,0,0.5)",
     justifyContent: "center",
     alignItems: "center",
     paddingHorizontal: 20,
   },
   modalContainer: {
     backgroundColor: theme.colors.container4,
     borderRadius: 16,
     width: "100%",
     maxWidth: 420,
     padding: 18,
     elevation: 12,
   },
   modalHeaderRight: {
     flexDirection: "row",
     justifyContent: "space-between",
     alignItems: "center",
     marginBottom: 8,
   },
   modalTitle: {
     fontSize: 18,
     fontWeight: "700",
     color: theme.colors.text,
   },
   modalSubtitle: {
     fontSize: 13,
     color: theme.colors.textInput,
     marginTop: 4,
   },
   modalInner: {
     marginTop: 6,
   },
   topCard: {
     borderRadius: 10,
     marginBottom: 12,
     borderColor: theme.colors.border,
     flexDirection: "row",
     alignItems: "center",
     justifyContent: "space-between",
   },
   topCardLeft: {
     flexDirection: "row",
     alignItems: "center",
     flex: 1,
   },
   topCardIcon: {
     marginBottom: 0,
     backgroundColor: theme.colors.primary,
     padding: 10,
     borderRadius: theme.radius.medium,
     borderColor: theme.colors.border,
     width: 44,
     height: 44,
     justifyContent: "center",
     alignItems: "center",
     marginRight: 12,
   },
   topCardTextWrap: {
     flex: 1,
   },
   topCardTitle: {
     fontSize: 16,
     fontWeight: "700",
     color: theme.colors.text,
   },
   topCardSubtitle: {
     fontSize: 13,
     color: theme.colors.textInput,
     marginTop: 6,
   },
 
   topCardViewButton: {
     backgroundColor: theme.colors.white,
     width: 40,
     height: 40,
     borderRadius: 10,
     justifyContent: "center",
     alignItems: "center",
     borderWidth: 1,
     borderColor: theme.colors.border,
   },
   detailsCard: {
     backgroundColor: theme.colors.background,
     borderRadius: 12,
     padding: 12,
     borderWidth: 1,
     borderColor: theme.colors.border,
     marginBottom: 12,
   },
   detailRow: {
     flexDirection: "row",
   },
   detailCol: {
     flex: 1,
     paddingRight: 8,
   },
   detailLabel: {
     fontWeight: "700",
     color: theme.colors.primary,
     fontSize: 13,
   },
   detailValue: {
     color: theme.colors.text,
     fontSize: 15,
     marginTop: 4,
   },
   actionsRow: {
     flexDirection: "row",
     justifyContent: "space-between",
     marginTop: 6,
   },
   editButton: {
     backgroundColor: theme.colors.white,
     borderWidth: 1,
     borderColor: theme.colors.primary,
     width: "48%",
     marginTop: 8,
   },
   editButtonText: {
     color: theme.colors.primary,
     fontWeight: "700",
   },
   deleteButton: {
     backgroundColor: theme.colors.primary,
     width: "48%",
     marginTop: 8,
   },
   deleteButtonText: {
     color: theme.colors.white,
     fontWeight: "700",
   },
};
