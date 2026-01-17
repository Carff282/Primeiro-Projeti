document.getElementById('form-contato').addEventListener('submit', function(e) {
    e.preventDefault();
    document.getElementById('msg-sucesso').style.display = 'block';
    setTimeout(function() {
        document.getElementById('msg-sucesso').style.display = 'none';
    }, 3000);
    this.reset();
});

// Modal de agendamento
const btnAgendar = document.getElementById('btn-agendar');
const agendamentoModal = document.getElementById('agendamento-modal');
const closeModal = document.getElementById('close-modal');
const formAgendar = document.getElementById('form-agendar');
const msgAgendar = document.getElementById('msg-agendar');
btnAgendar.addEventListener('click', function() {
    agendamentoModal.style.display = 'flex';
});
closeModal.addEventListener('click', function() {
    agendamentoModal.style.display = 'none';
});
formAgendar.addEventListener('submit', function(e) {
    e.preventDefault();
    msgAgendar.style.display = 'block';
    setTimeout(function() {
        msgAgendar.style.display = 'none';
        agendamentoModal.style.display = 'none';
    }, 2500);
    this.reset();
});
window.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') agendamentoModal.style.display = 'none';
});
// Feedback ao clicar nos serviços
Array.from(document.querySelectorAll('.servicos-lista li')).forEach(function(item) {
    item.addEventListener('click', function() {
        item.classList.add('ativo');
        setTimeout(function() { item.classList.remove('ativo'); }, 400);
        alert('Serviço selecionado: ' + item.textContent.trim());
    });
});
