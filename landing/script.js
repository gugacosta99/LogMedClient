/*const perfil = {
    nome: 'Matheus',
    idade: 22
}*/

document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Aqui você pode verificar as credenciais do usuário.
    // Por exemplo, comparar com valores hardcoded ou enviar uma solicitação AJAX para um servidor.

    if (username === 'usuario' && password === 'senha') {
        document.getElementById('result-message').textContent = 'Login bem-sucedido!';
        document.getElementById('result-message').style.color = 'green';
    } else {
        document.getElementById('result-message').textContent = 'Credenciais inválidas. Tente novamente.';
        document.getElementById('result-message').style.color = 'red';
    }

    document.getElementById('login-result').classList.remove('hidden');
});

const login = document.getElementById("username")

login.value = perfil.nome

document.getElementById("signupForm").addEventListener("submit", function (event) {
    event.preventDefault();

    // Coletar os valores do formulário
    const fullName = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const cpf = document.getElementById("cpf").value;
    const dob = document.getElementById("dob").value;
    const phoneNumber = document.getElementById("phoneNumber").value;

    // Validar se as senhas correspondem
    if (password !== confirmPassword) {
        alert("As senhas não correspondem. Por favor, tente novamente.");
        return;
    }

    // Aqui você pode adicionar código para enviar os dados do usuário para o servidor
    // Por razões de segurança, não faça isso diretamente no JavaScript em um ambiente de produção.

    // Exemplo: Enviar os dados para um servidor usando fetch

    fetch("/seu_endpoint_de_registro", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ fullName, email, password, cpf, dob, phoneNumber })
    })
        .then(response => {
            if (response.status === 200) {
                alert("Conta criada com sucesso!");
                // Redirecionar para a página de login ou fazer qualquer outra ação necessária.
            } else {
                alert("Erro ao criar conta. Tente novamente mais tarde.");
            }
        })
        .catch(error => {
            console.error("Erro ao criar conta:", error);
            alert("Erro ao criar conta. Tente novamente mais tarde.");
        });
});

/* DADOS PESSOAIS */
// Função para salvar os dados e exibi-los
function saveData() {
    const formData = document.getElementById('personalInfoForm');
    const displayData = document.getElementById('displayData');

    // Coletar os valores dos campos
    const fullName = formData.fullName.value;
    const email = formData.email.value;
    const bloodType = formData.bloodType.value;
    const gender = formData.gender.value;
    const address = formData.address.value;
    const phone = formData.phone.value;

    // Exibir os dados na página
    displayData.innerHTML = `
        <h2>Dados Pessoais Salvos:</h2>
        <p><strong>Nome Completo:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Tipo Sanguíneo:</strong> ${bloodType}</p>
        <p><strong>Gênero:</strong> ${gender}</p>
        <p><strong>Endereço:</strong> ${address}</p>
        <p><strong>Telefone:</strong> ${phone}</p>
    `;
}