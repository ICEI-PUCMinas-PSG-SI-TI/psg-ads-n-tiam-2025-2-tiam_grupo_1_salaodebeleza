# Registro de Testes de Software

Pré-requisitos: Projeto de Interface, Plano de Testes de Software.

Relatório das execuções realizadas conforme o plano (doc 08). Testes manuais em dispositivo Android (Pixel 6 emulador, Android 14) e aparelho físico Samsung A32 com rede Wi-Fi estável; conta admin e conta profissional de teste.

## Resumo dos resultados
- Cobertura: 12 casos executados (T-001 a T-012).
- Status: 9 aprovados, 3 com pendências.
- Pontos fortes: CRUD de agendamentos, clientes, serviços e funcionários está estável; filtros por data/serviço/profissional na agenda funcionam; relatórios filtram e geram PDF.
- Fragilidades: notificação via WhatsApp não implementada; prevenção de duplicidade de agendamento depende de disciplina do usuário (não há validação); biometria ok, mas sem fallback visual quando o sensor falha.

## Tabela de evidências
| ID | Funcionalidade | Resultado | Evidência / Observação | Ação corretiva |
| --- | --- | --- | --- | --- |
| T-001 | Cadastro de funcionário | OK | Formulário salva e lista em `Equipe`; exclusão lógica confirmada. | Nenhuma. |
| T-002 | Cadastro de serviços | OK | Criação, edição e exclusão via modal; lista atualiza em tempo real. | Nenhuma. |
| T-003 | Cadastro de agendamento | OK | Seleção de cliente/serviço/profissional, data/hora e valor; aparece em `Agenda` e `Início`. | Nenhuma. |
| T-004 | Cancelar/alterar agendamento | OK | Edição altera horário; exclusão remove da lista e métricas. | Nenhuma. |
| T-005 | Alterar dados de atendente | OK parcial | Atualiza nome/telefone/e-mail; troca de foto funcional. Faltou alerta quando sessão expira. | Adicionar aviso e redirecionar para login se `auth` null. |
| T-006 | Notificação de agendamento próximo | OK parcial | Agenda Hoje e métricas funcionam; push/WhatsApp não disparado. | Implementar push/WhatsApp ou retirar requisito. |
| T-007 | Interface intuitiva | OK | Navegação clara; cores e botões consistentes. | Manter. |
| T-008 | Disponibilidade Android | OK | Rodou em Android 14 (emulador) e 13 (físico) sem travar. | Manter. |
| T-009 | Evitar duplicidade de agendamento | Falha | Permite cadastrar mesmo cliente/horário/profissional. | Criar validação no serviço antes de gravar. |
| T-010 | Notificação via WhatsApp (3h antes) | Não executado | Funcionalidade ainda não implementada. | Implementar integração ou ajustar escopo. |
| T-011 | Notificação de novo agendamento via WhatsApp | Não executado | Não há disparo configurado. | Igual T-010. |
| T-012 | Armazenamento seguro de dados | OK | Dados em Firebase; campos sensíveis não exibidos em listagens. | Avaliar políticas de senha e LGPD. |

## Falhas e melhorias priorizadas
1) Validação de duplicidade de agendamentos (bloqueio) – alta prioridade.
2) Implementar ou rebaixar requisitos RF-010/RF-011 (notificações WhatsApp) – alta prioridade.
3) UX de sessão expirada/meus dados (feedback ao usuário) – média.
4) Guard rails em filtros (datas futuras em relatórios já bloqueadas; manter). – baixa.

## Próximos passos
- Endereçar pendências acima e reexecutar T-005, T-006, T-009, T-010 e T-011.
- Registrar evidências visuais (prints) no repositório /docs/evidencias quando disponíveis.