# Plano de Testes de Usabilidade

## Objetivo
Avaliar se o app AgendaGlow é fácil de aprender, navegar e concluir tarefas chave (agendar, editar e acompanhar serviços), identificando obstáculos de fluxo, clareza de rótulos e tempo para concluir ações.

## Escopo das tarefas
- Login (senha e biometria, quando disponível no dispositivo).
- Consultar agenda do dia e abrir detalhes de um agendamento.
- Criar um novo agendamento (cliente, serviço, profissional, data/hora, valor, observação).
- Editar um agendamento existente.
- Gerenciar cadastros: criar e excluir cliente; criar e excluir serviço; criar e excluir funcionário.
- Gerar relatório filtrando por período, serviço e profissional; exportar PDF.
- Ajustar dados pessoais e trocar foto do perfil em "Mais".

## Perfil dos participantes
- 5 participantes (3 usuários finais de salão, 2 funcionários/gestores internos).
- Experiência prévia: variando de nenhuma a uso eventual de apps de agendamento.
- Dispositivos: smartphone Android (preferencialmente com biometria) + 1 emulador para registro em vídeo.

## Ambiente e ferramentas
- Dispositivo Android físico ou emulador com o APK/Expo em modo produção.
- Conexão estável à internet e acesso à conta de teste (admin e profissional).
- Gravação de tela e áudio para observação; cronômetro para tempo de tarefa.
- Formulários: roteiro de tarefas, questionário SUS pós-sessão, escala Likert de satisfação por tarefa.

## Métricas
- Taxa de sucesso por tarefa (com/sem ajuda).
- Tempo para concluir cada tarefa (segundos) e número de erros/passos extras.
- SUS (System Usability Scale) por participante.
- Satisfação por tarefa (escala 1–5) e esforço percebido (NASA-TLX abreviado, opcional).

## Roteiro e tarefas
1) Aquecimento: objetivo do teste e consentimento; perguntar experiência prévia.
2) Login: autenticar com e-mail/senha e, se disponível, acionar biometria.
3) Consultar agenda: filtrar pelo dia atual, abrir um agendamento e ler detalhes.
4) Criar agendamento: selecionar cliente, serviço(s), profissional(is), data/hora e valor.
5) Editar agendamento: alterar horário e salvar; verificar atualização na lista.
6) Clientes: criar novo cliente e depois excluí-lo.
7) Serviços: criar novo serviço e excluí-lo.
8) Funcionários: criar funcionário e excluí-lo.
9) Relatórios: aplicar filtro por período e serviço; gerar PDF.
10) Mais: alterar foto/ dados pessoais; sair do app.
11) Pós-teste: aplicar SUS e coletar comentários livres.

## Critérios de sucesso
- ≥ 80% das tarefas concluídas sem ajuda em até 2 tentativas.
- Tempo mediano adequado: criação de agendamento ≤ 2 min; aplicação de filtro de relatório ≤ 1 min.
- SUS médio ≥ 75; nenhuma barreira crítica (tarefa não executável).

## Coleta de dados
- Observação moderada: registrar dificuldades, cliques extras, termos confusos.
- Captura de telas/áudio para evidências.
- Logs manuais por tarefa: sucesso/falha, tempo, erros cometidos, sugestões.

## Riscos e mitigação
- Dispositivo sem biometria: registrar como variação; seguir login tradicional.
- Falha de rede: repetir após estabilizar conexão; registrar impacto.
- Dados de produção: usar contas e cadastros de teste; limpar após sessão.

## Responsáveis e cronograma
- Moderador/anotador: membro da equipe de UX/QA.
- Período: 1 semana, com sessões individuais de 30–40 minutos.
- Consolidação dos achados: 2 dias após última sessão, priorizando melhorias por severidade (bloqueio, maior esforço, cosmético).
