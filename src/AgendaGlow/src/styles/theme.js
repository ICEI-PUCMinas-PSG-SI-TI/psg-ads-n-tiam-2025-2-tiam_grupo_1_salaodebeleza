// Tema de cores, fontes e espaçamentos para o aplicativo AgendaGlow

export const theme = {
  colors: {
    // Cores principais
    primary: '#C38379',           // Botão principal
    primaryPressed: '#C36859',    // Botão clicado / hover
    background: '#F9F9F9',        // Cor de fundo geral

    // Textos
    text: '#333333',              // Texto principal
    textInput: '#7D7D7D',         // Texto em inputs / placeholder

    // Containers e áreas de destaque
    container1: '#FADED7',        // Cards e seções claras
    container2: '#FFE8DB',        // Alternativa suave
    container3: '#FCEDED',        // Destaques sutis

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
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
  },
};
