<!--
# Plano de Testes de Software

<span style="color:red">Pré-requisitos: <a href="2-Especificação do Projeto.md"> Especificação do Projeto</a></span>, <a href="3-Projeto de Interface.md"> Projeto de Interface</a>

Apresente os cenários de testes utilizados na realização dos testes da sua aplicação. Escolha cenários de testes que demonstrem os requisitos sendo satisfeitos.

Enumere quais cenários de testes foram selecionados para teste. Neste tópico o grupo deve detalhar quais funcionalidades avaliadas, o grupo de usuários que foi escolhido para participar do teste e as ferramentas utilizadas.
 
## Ferramentas de Testes (Opcional)

Comente sobre as ferramentas de testes utilizadas.
 
> **Links Úteis**:
> - [IBM - Criação e Geração de Planos de Teste](https://www.ibm.com/developerworks/br/local/rational/criacao_geracao_planos_testes_software/index.html)
> - [Práticas e Técnicas de Testes Ágeis](http://assiste.serpro.gov.br/serproagil/Apresenta/slides.pdf)
> -  [Teste de Software: Conceitos e tipos de testes](https://blog.onedaytesting.com.br/teste-de-software/)
> - [Criação e Geração de Planos de Teste de Software](https://www.ibm.com/developerworks/br/local/rational/criacao_geracao_planos_testes_software/index.html)
> - [Ferramentas de Test para Java Script](https://geekflare.com/javascript-unit-testing/)
> - [UX Tools](https://uxdesign.cc/ux-user-research-and-user-testing-tools-2d339d379dc7)
-->

# Plano de Testes de Software

## Pré-requisitos
- Especificação do Projeto
- Projeto de Interface

---

## Objetivo
Garantir que todos os requisitos funcionais e não funcionais do sistema sejam atendidos, assegurando que o aplicativo Android funcione de forma correta, segura e intuitiva para os usuários.

---

## Escopo
- Testes cobrem todas as funcionalidades do aplicativo relacionadas a cadastro de usuários, agendamentos, notificações e relatórios.
- Não serão testadas funcionalidades de backend complexo, conforme restrição do projeto.

---

## Cenários de Teste

| ID do Teste | Requisito | Funcionalidade | Usuário | Passos do Teste | Resultado Esperado |
|------------|-----------|----------------|--------|----------------|------------------|
| T-001 | RF-001 | Cadastro de funcionário | Administrador | 1. Abrir app como admin <br>2. Cadastrar funcionário (nome, cargo, email, contato) | Funcionário é cadastrado com sucesso |
| T-002 | RF-002 | Cadastro de serviços | Administrador | 1. Abrir app como admin <br>2. Adicionar novo serviço | Serviço é cadastrado corretamente |
| T-003 | RF-003 | Cadastro de agendamento | Usuário | 1. Abrir app <br>2. Selecionar serviço <br>3. Informar cliente e horário | Agendamento criado corretamente e visível na agenda |
| T-004 | RF-004 | Cancelamento/alteração de agendamento | Usuário | 1. Selecionar agendamento existente <br>2. Cancelar ou alterar horário | Alteração/cancelamento é refletido corretamente no sistema |
| T-005 | RF-005 | Alteração de dados do atendente | Atendente | 1. Abrir perfil <br>2. Alterar dados | Alterações são salvas corretamente |
| T-006 | RF-009 | Notificação de agendamento próximo | Usuário | 1. Simular agendamento com horário próximo (30 min) | Usuário recebe notificação dentro do prazo |
| T-007 | RNF-001 | Interface intuitiva | Todos | Navegar pelo aplicativo, testar menus e telas | Interface clara, menus e botões funcionam corretamente |
| T-008 | RNF-002 | Disponibilidade Android | Todos | Instalar aplicativo em dispositivo Android | App roda corretamente em dispositivos compatíveis |
| T-009 | RNF-004 | Evitar duplicidade de agendamento | Usuário | Tentar criar dois agendamentos iguais | Sistema impede duplicidade e exibe alerta |
| T-010 | RF-010 | Notificação via WhatsApp | Cliente | Simular agendamento 3h antes | Cliente recebe mensagem via WhatsApp |
| T-011 | RF-011 | Notificação de novo agendamento via WhatsApp | Cliente | Criar novo agendamento | Cliente recebe mensagem via WhatsApp |
| T-012 | RNF-005 | Armazenamento seguro de dados | Todos | Testar cadastro de clientes e funcionários | Dados são armazenados de forma segura e conforme LGPD |

> ⚠️ Observação: Cenários de média e baixa prioridade podem ser testados posteriormente.

---

## Ferramentas de Teste (Opcional)
- **Android Emulator / Dispositivo físico**: testes de interface e funcionalidade.  
- **Postman**: simulação de chamadas API local (se houver).  
- **WhatsApp**: testes de notificações (RF-010 e RF-011).  
- **GitHub Projects / Planilhas**: controle dos testes realizados.

---

## Critérios de Aceitação
- Todos os testes essenciais (alta prioridade) devem passar para considerar o sistema funcional.  
- Testes de média e baixa prioridade podem ser revisados posteriormente.  
- Nenhum teste crítico deve apresentar falha.

---

## Links Úteis
- [IBM - Criação e Geração de Planos de Teste](https://www.ibm.com/docs/pt-br)  
- [Práticas e Técnicas de Testes Ágeis](https://www.example.com)  
- [Teste de Software: Conceitos e tipos de testes](https://www.example.com)  
- [Criação e Geração de Planos de Teste de Software](https://www.example.com)  
- [Ferramentas de Test para JavaScript](https://www.example.com)  
- [UX Tools](https://www.example.com)  
