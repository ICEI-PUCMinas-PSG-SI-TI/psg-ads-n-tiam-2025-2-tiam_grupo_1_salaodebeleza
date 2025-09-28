
# Metodologia

A equipe definiu uma metodologia de trabalho baseada em práticas ágeis, combinando Scrum com ferramentas de apoio à gestão de projeto, controle de versão e comunicação.

O grupo priorizou ambientes de trabalho que garantem organização, rastreabilidade e colaboração durante todas as etapas do desenvolvimento do software.

## Relação de Ambientes de Trabalho

Os ambientes e plataformas utilizados pela equipe estão descritos na tabela a seguir:

| Ambiente                | Plataforma         | Link de Acesso                                                 |
| ----------------------- | ------------------ | -------------------------------------------------------------- |
| Repositório de Código   | GitHub             | [Acessar Repositório GitHub](github.com/ICEI-PUCMinas-PSG-SI-TI/psg-ads-n-tiam-2025-2-tiam_grupo_1_salaodebeleza/)          |
| Gestão de Projeto       | GitHub Projects    | [Acessar Quadro KanBan](github.com/orgs/ICEI-PUCMinas-PSG-SI-TI/projects/119) |
| Comunicação             | Discord / WhatsApp | Discord (para reuniões online) e WhatsApp (comunicação rápida) |
| Modelagem BPMN          | Camunda            | [camunda.com](https://camunda.com/)                            |
| Diagramas UML           | Lucidchart         | [lucidchart.com](https://lucidchart.com)                       |
| Wireframes / Protótipos | Figma              | [Acessar Protótipos](https://www.figma.com/design/SZaZNk9k6hhm9TGGcDOgEn/AgendaGlow?node-id=0-1&p=f)                                 |
| Editor de Código        | VSCode             | [Link para baixar a ferramenta](https://code.visualstudio.com/)        |


## Controle de Versão

A ferramenta de controle de versão adotada no projeto foi o
[Git](https://git-scm.com/), sendo que o [Github](https://github.com)
foi utilizado para hospedagem do repositório.

O projeto segue a seguinte convenção para o nome de branches:

- `main`: versão estável já testada do software
- `testing`: versão em testes do software
- `feature`: versão de desenvolvimento de alguma feature

Quanto à gerência de issues, o projeto adota a seguinte convenção para
etiquetas:

- `documentation`: melhorias ou acréscimos à documentação
- `bug`: uma funcionalidade encontra-se com problemas
- `enhancement`: uma funcionalidade precisa ser melhorada
- `feature`: uma nova funcionalidade precisa ser introduzida

Commits seguem a convenção semântica com mensagens curtas e objetivas, ex.:

- `feat`: adiciona cadastro de usuário
- `fix`: corrige bug no login
- `docs`: atualiza README

Esse processo garante rastreabilidade, colaboração e qualidade no ciclo de desenvolvimento.

<!--
> **Links Úteis**:
> - [Microfundamento: Gerência de Configuração](https://pucminas.instructure.com/courses/87878/)
> - [Tutorial GitHub](https://guides.github.com/activities/hello-world/)
> - [Git e Github](https://www.youtube.com/playlist?list=PLHz_AreHm4dm7ZULPAmadvNhH6vk9oNZA)
>  - [Comparando fluxos de trabalho](https://www.atlassian.com/br/git/tutorials/comparing-workflows)
> - [Understanding the GitHub flow](https://guides.github.com/introduction/flow/)
> - [The gitflow workflow - in less than 5 mins](https://www.youtube.com/watch?v=1SXpE08hvGs) 
-->

## Gerenciamento de Projeto

### Divisão de Papéis

O grupo adotou a metodologia ágil Scrum como guia para o processo de desenvolvimento. A divisão de papéis está organizada da seguinte forma:

- `Scrum Master`: Arthur Coelho;
- `Product Owner`: Melissa Duque;
- `Equipe de Desenvolvimento`: Arthur Coelho, Livia Taciano, Lucas Dias, Maria Caroline, Melissa Duque, Pedro Dias;
- `Equipe de Design`: Lívia Taciano, Maria Caroline.

<!--
> **Links Úteis**:
> - [11 Passos Essenciais para Implantar Scrum no seu Projeto](https://mindmaster.com.br/scrum-11-passos/)
> - [Scrum em 9 minutos](https://www.youtube.com/watch?v=XfvQWnRgxG0)
> - [Os papéis do Scrum e a verdade sobre cargos nessa técnica](https://www.atlassian.com/br/agile/scrum/roles)
-->

### Processo

A equipe implementou o **Scrum** da seguinte forma:
 
- Reuniões quinzenais de alinhamento via Discord.
- Sprints com duração de duas semanas.
- Product Backlog gerenciado no GitHub Projects, contendo todas as histórias de usuário.
- Sprint Backlog criado a partir do backlog priorizado, com tarefas distribuídas por membro.
- Kanban Board no GitHub Projects para acompanhamento visual do status das atividades (To Do, In Progress, Done).

Esse processo permitiu melhor acompanhamento do progresso, transparência das entregas e divisão clara das responsabilidades.

### Ferramentas

As ferramentas empregadas no projeto foram escolhidas considerando a **familiaridade da equipe**, a **integração entre ambientes** e a **eficiência no fluxo de trabalho**:

- **VSCode**: editor de código leve e integrado ao Git.  
- **Discord e WhatsApp**: comunicação síncrona e assíncrona da equipe.  
- **Figma**: prototipagem de telas e criação de wireframes.  
- **Camunda**: modelagem de processos de negócio (BPMN).  
- **Lucidchart**: elaboração de diagramas UML.  

Cada ferramenta foi escolhida para atender a uma necessidade específica do projeto, garantindo **produtividade** e **organização**.

---

### Justificativa

- **VSCode**: escolhido como editor de código pela leveza, ampla aceitação pela comunidade e integração nativa com sistemas de controle de versão.  
- **WhatsApp e Discord**: selecionados para comunicação por serem familiares aos integrantes da equipe, além de oferecerem praticidade tanto em interações rápidas quanto em reuniões online.  
- **Lucidchart**: utilizado para criação da maioria dos diagramas, devido à sua interface intuitiva e facilidade de colaboração.  
- **Camunda**: escolhido especificamente para diagramas **BPMN**, pela robustez e adequação à modelagem de processos de negócio.  
- **Figma**: adotado para prototipagem de interfaces e elaboração de wireframes, graças à sua versatilidade, suporte a colaboração em tempo real e familiaridade da equipe.
