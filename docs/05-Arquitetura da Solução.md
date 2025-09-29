# Arquitetura da Solução

<span style="color:red">Pré-requisitos: <a href="3-Projeto de Interface.md"> Projeto de Interface</a></span>

Definição de como o software é estruturado em termos dos componentes que fazem parte da solução e do ambiente de hospedagem da aplicação.

![Arquitetura da Solução](img/02-mob-arch.png)

## Diagrama de Classes

O diagrama de classes ilustra graficamente como será a estrutura do software, e como cada uma das classes da sua estrutura estarão interligadas. Essas classes servem de modelo para materializar os objetos que executarão na memória.

As referências abaixo irão auxiliá-lo na geração do artefato “Diagrama de Classes”.

> - [Diagramas de Classes - Documentação da IBM](https://www.ibm.com/docs/pt-br/rational-soft-arch/9.6.1?topic=diagrams-class)
> - [O que é um diagrama de classe UML? | Lucidchart](https://www.lucidchart.com/pages/pt/o-que-e-diagrama-de-classe-uml)

## Modelo ER

O Modelo ER representa através de um diagrama como as entidades (coisas, objetos) se relacionam entre si na aplicação interativa.]

<img width="3004" height="2844" alt="image" src="https://github.com/user-attachments/assets/556ad49b-887f-4149-9d1f-82e86711a764" />


## Esquema Relacional

O Esquema Relacional corresponde à representação dos dados em tabelas juntamente com as restrições de integridade e chave primária.
 
<img width="5884" height="3084" alt="image" src="https://github.com/user-attachments/assets/1d4ec242-70df-461f-8585-ca3a13d900e5" />


## Modelo Físico

Entregar um arquivo banco.sql contendo os scripts de criação das tabelas do banco de dados. Este arquivo deverá ser incluído dentro da pasta src\bd.

## Tecnologias Utilizadas

Descreva aqui qual(is) tecnologias você vai usar para resolver o seu problema, ou seja, implementar a sua solução. Liste todas as tecnologias envolvidas, linguagens a serem utilizadas, serviços web, frameworks, bibliotecas, IDEs de desenvolvimento, e ferramentas.

Apresente também uma figura explicando como as tecnologias estão relacionadas ou como uma interação do usuário com o sistema vai ser conduzida, por onde ela passa até retornar uma resposta ao usuário.

## Hospedagem

Explique como a hospedagem e o lançamento da plataforma foi feita.

> **Links Úteis**:
>
> - [Website com GitHub Pages](https://pages.github.com/)
> - [Programação colaborativa com Repl.it](https://repl.it/)
> - [Getting Started with Heroku](https://devcenter.heroku.com/start)
> - [Publicando Seu Site No Heroku](http://pythonclub.com.br/publicando-seu-hello-world-no-heroku.html)

## Qualidade de Software

#### 1. Usabilidade Extrema

**O que é:** É a garantia de que o aplicativo `AgendaGlow` e o site serão fáceis, rápidos e agradáveis de usar. A tecnologia deve ser uma aliada que simplifica o trabalho, e não um obstáculo.

**O que isso significa no dia a dia?**
* **Agilidade no Atendimento:** Quando uma cliente ligar para o salão, a recepcionista não pode perder tempo com um sistema lento ou complicado. Com poucos cliques, ela deve ser capaz de visualizar a agenda de todos os profissionais, encontrar um horário livre, selecionar o serviço (ex: "Mechas") e confirmar o agendamento. O objetivo é que essa operação completa dure **menos de 60 segundos**.
* **Baixa Necessidade de Treinamento:** A interface será tão clara e intuitiva que uma nova funcionária, mesmo sem familiaridade com tecnologia, conseguirá aprender a usar as funções principais em **poucos minutos**. Não serão necessários manuais complexos ou longos períodos de adaptação.
* **Redução de Estresse:** Um design limpo e organizado evita a sensação de sobrecarga de informação, tornando o ambiente de trabalho mais tranquilo e produtivo.

#### 2. Funcionalidade Completa e Correta

**O que é:** É o compromisso de que o software entregará exatamente o que foi combinado, e que tudo funcionará sem erros.

**O que isso significa no dia a dia?**
* **Todas as Ferramentas na Mão:** O aplicativo terá a lista completa e atualizada de serviços — de "Corte" a "Plástica dos Pés". Todos os quatro perfis de usuárias (Patrícia, Kênia, Eliene e Maysa) terão seu acesso individual. Nada que foi solicitado ficará de fora.
* **Zero Erros de Agendamento:** "Correto" significa que, ao agendar um "Spa dos pés" com a profissional Kênia às 14h, o sistema irá bloquear esse horário especificamente na agenda da Kênia. Não haverá risco de o sistema agendar outra cliente no mesmo horário com ela ou de registrar o serviço na agenda de outra profissional por engano.
* **Informações Precisas:** A observação digitada no agendamento (ex: "cliente tem alergia a esmalte vermelho") será salva e vinculada corretamente àquele atendimento. Da mesma forma, o site exibirá sempre o endereço, telefone e horário de funcionamento corretos para as clientes.

#### 3. Alta Confiabilidade

**O que é:** É a certeza de que o sistema é estável, seguro e estará sempre funcionando quando a equipe precisar dele. É a confiança de que a agenda digital é tão ou mais segura que a antiga agenda de papel.

**O que isso significa no dia a dia?**
* **Sempre Disponível:** Das 9h às 18h, de terça a sábado, o aplicativo `AgendaGlow` estará no ar. A equipe não chegará para trabalhar e encontrará o sistema "fora do ar". A meta é uma disponibilidade de **99.8%**, o que significa que falhas serão extremamente raras.
* **À Prova de Travamentos:** O aplicativo foi desenhado para ser robusto. Ele não irá travar no meio de um agendamento nem fechar sozinho, o que poderia causar perda de informações e retrabalho.
* **Segurança dos Dados:** Um agendamento feito hoje estará lá, intacto, amanhã, na próxima semana e no próximo ano. O sistema terá rotinas de backup para garantir que nenhuma informação seja perdida em caso de problemas técnicos.

#### 4. Segurança Robusta

**O que é:** É a proteção das informações do salão e, principalmente, da privacidade das clientes.

**O que isso significa no dia a dia?**
* **Acesso Restrito e Controlado:** Apenas as quatro funcionárias cadastradas poderão entrar no sistema, cada uma com sua senha pessoal. Isso impede que ex-funcionários ou pessoas não autorizadas acessem a agenda e os dados dos clientes.
* **Privacidade das Clientes:** O nome e o telefone de uma cliente são dados sensíveis. O sistema garantirá que essas informações fiquem armazenadas em um ambiente seguro, protegidas contra vazamentos ou ataques cibernéticos.
* **Integridade do Negócio:** A segurança protege o bem mais valioso do salão depois da sua equipe: sua carteira de clientes e sua organização interna. Garante que a gestão do negócio permaneça privada e sob controle.
