/* OBSERVAÇÃO: precisa ser feita a seguinte correção:
    - Quando está no celular a mensagem é enviada corretamente para o Whatsapp,
    mas aparentemente pelo navegador não é enviada. O cliente consegue ser direcionado
    ao Whatsapp do salão mas a mensagem é vazia */

document.getElementById("whatsappForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const nome = document.getElementById("nome").value;
    const mensagem = document.querySelector('input[name="mensagem"]:checked').value;
    const texto = `Oi, meu nome é ${nome}, e eu ${mensagem}.`;
    const telefone = "5531995156131"; // número em formato internacional
    const url = `https://wa.me/${telefone}?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank");
});