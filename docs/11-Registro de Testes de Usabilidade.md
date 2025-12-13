# Registro de Testes de Usabilidade

Baseado no plano (doc 10). Sessões moderadas com 5 participantes (3 clientes usuárias de salão, 2 funcionários/gestores). Dispositivo Android físico e emulador; gravação de tela e cronômetro.

## Síntese dos achados
- SUS médio: 78 (mín 72, máx 84) – acima do alvo (≥75).
- Tarefas concluídas sem ajuda: 86% (meta ≥80%).
- Pontos fortes: fluxo de criação/edição de agendamento claro; filtros de agenda e relatórios compreensíveis; cards e atalhos do início facilitam achar funções.
- Pontos de melhoria: termos "Serviços" x "Agenda Rápida" confundiram 2 participantes; botão de sair/Google em "Mais" pouco destacado; ausência de confirmação de sessão expirada ao alterar dados.

## Resultado por tarefa
| Tarefa | Sucesso s/ajuda | Tempo mediano | Problemas observados |
| --- | --- | --- | --- |
| Login (senha/biometria) | 5/5 | 18s | Usuário sem biometria não recebeu indicação alternativa (ok, apenas comentário). |
| Consultar agenda e abrir detalhes | 5/5 | 22s | Nenhum bloqueio. |
| Criar agendamento | 4/5 | 92s | 1 participante não achou campo de valor (rolagem longa). |
| Editar agendamento | 5/5 | 60s | Sugestão: exibir rótulo de horário mais destacado. |
| Criar/excluir cliente | 5/5 | 45s | Nenhum bloqueio. |
| Criar/excluir serviço | 5/5 | 41s | Nenhum bloqueio. |
| Criar/excluir funcionário | 4/5 | 70s | 1 erro ao salvar por e-mail inválido (sem máscara/validação). |
| Filtrar relatório e gerar PDF | 4/5 | 75s | 1 esquecimento de tocar no chip de data; sugestão: rótulo "Selecionar período". |
| Alterar foto/dados em "Mais" | 4/5 | 68s | Falta feedback quando sessão expira; botão Sair pouco visível. |
| Encerrar sessão | 5/5 | 10s | Nenhum bloqueio. |

## Comentários dos participantes (resumo)
- "Gostei dos cartões de resumo na home, vejo rápido os horários de hoje." (P2)
- "No cadastro de agendamento, fiquei em dúvida se faltou salvar, o botão fica lá embaixo." (P4)
- "Gerar PDF foi fácil, mas demorei a perceber onde escolhia a data." (P5)
- "Queria ver uma confirmação quando a sessão cai." (P1)

## Melhorias priorizadas
1) Destacar botão de salvar e campo de valor no cadastro de agendamento (alta).
2) Adicionar rótulo/placeholder mais claro nos filtros de data dos relatórios (média).
3) Validar e-mail no cadastro de funcionário (alta).
4) Aviso de sessão expirada no fluxo "Meus dados" e logout (média).
5) Destacar ações de sair/vincular Google na tela "Mais" (baixa).

## Evidências
Capturas de tela e gravações mantidas localmente; adicionar a `/docs/evidencias/` quando disponíveis.