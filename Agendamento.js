const _url = 'https://www.api.logmed.gustech-rec.com'

$(document).ready(function () {

    fetchProcedimentos().then(procs => {
        if (procs) {
            $('#exam-select').empty()
            $('#exam-select').append(`<option selected>Selecione o Exame</option>`)
            procs.exames.forEach((ex, i) => {
                $('#exam-select').append(`<option value="${ex.idProcedimento}">${ex.Nome}</option>`)
            })
            $('#esp-select').empty()
            $('#esp-select').append(`<option selected>Selecione a Especialidade</option>`)
            procs.especialidades.forEach((es, i) => {
                $('#esp-select').append(`<option value="${es.idProcedimento}">${es.Nome}</option>`)
            })
        } else {
            alert('Ocorreu um erro de comunicação com o servidor, por favor recarregue a página.');
        }
    })
    $('#exam-select').hide()
    $('#esp-select').hide()


    var select = ''
    var procID = -1
    var resAgenda = []
    var resDias = []
    var resHoras = []
    var agSelect = {}

    // Initial step
    var currentStep = 1;
    showStep(currentStep);

    // Function to display a specific step
    function showStep(step) {
        $('.step').hide();
        $('#step' + step).show();
    }

    function showPill(step) {
        $('.pill').removeClass('pill-selected')
        for (let i = 1; i <= step; i++) {
            $('#pill-' + i).toggleClass('pill-selected')
        }
    }

    // Previous button
    $('#prevBtn').click(function () {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
            showPill(currentStep);
            if (currentStep === 1) {
                $(this)
                    .removeClass('btn-primary')
                    .addClass('btn-secondary');
            }
            if (currentStep < 3) {
                $('#nextBtn')
                    .removeClass('btn-secondary')
                    .addClass('btn-primary')
            }
        }
    });

    // Next button
    $('#nextBtn').click(function () {
        let validation = true;
        if (currentStep === 1) {
            validation = validateUser()
        } else if (currentStep === 2) {
            validation = validateProc()
            console.log(validation);

            if (validation) {
                setAgenda()
            }
        }

        if (validation) {
            if (currentStep < 3) { // Change '3' to the total number of steps
                currentStep++;
                showStep(currentStep);
                showPill(currentStep);
                $('#prevBtn')
                    .removeClass('btn-secondary')
                    .addClass('btn-primary')
                if (currentStep > 2) {
                    $(this).addClass('btn-secondary')
                }
            }
        }
    });

    $('#phone').on('input', function () {
        let phoneNumber = $(this).val().replace(/\D/g, ''); // Remove non-numeric characters

        console.log(phoneNumber);

        if (phoneNumber.length > 2) {
            phoneNumber = '(' + phoneNumber.substring(0, 2) + ')' + phoneNumber.substring(2);
        }

        if (phoneNumber.length > 5) {
            phoneNumber = phoneNumber.substring(0, 4) + ' ' + phoneNumber.substring(4);
        }

        if (phoneNumber.length > 6) {
            phoneNumber = phoneNumber.substring(0, 6) + ' ' + phoneNumber.substring(6);
        }

        if (phoneNumber.length > 11) {
            phoneNumber = phoneNumber.substring(0, 11) + '-' + phoneNumber.substring(11);
        }

        if (phoneNumber.length > 16) {
            phoneNumber = phoneNumber.substring(0, 16);
        }

        $(this).val(phoneNumber);
    });

    $('#cpf').on('input', function () {
        let cpf = $(this).val().replace(/\D/g, ''); // Remove non-numeric characters

        console.log(cpf);

        if (cpf.length > 3) {
            cpf = cpf.substring(0, 3) + '.' + cpf.substring(3);
        }

        if (cpf.length > 7) {
            cpf = cpf.substring(0, 7) + '.' + cpf.substring(7);
        }

        if (cpf.length > 11) {
            cpf = cpf.substring(0, 11) + '-' + cpf.substring(11);
        }

        if (cpf.length > 14) {
            cpf = cpf.substring(0, 14);
        }

        $(this).val(cpf);
    });

    $('#sus').on('input', function () {
        let sus = $(this).val().replace(/\D/g, ''); // Remove non-numeric characters

        console.log(sus);

        if (sus.length > 3) {
            sus = sus.substring(0, 3) + ' ' + sus.substring(3);
        }

        if (sus.length > 8) {
            sus = sus.substring(0, 8) + ' ' + sus.substring(8);
        }

        if (sus.length > 13) {
            sus = sus.substring(0, 13) + ' ' + sus.substring(13);
        }

        if (sus.length > 18) {
            sus = sus.substring(0, 18);
        }

        $(this).val(sus);
    });

    $('#cep').on('input', function () {
        let CEP = $(this).val().replace(/\D/g, ''); // Remove non-numeric characters

        console.log(CEP);

        if (CEP.length > 5) {
            CEP = CEP.substring(0, 5) + '-' + CEP.substring(5);
        }

        if (CEP.length >= 9) {
            CEP = CEP.substring(0, 9);
        }

        $(this).val(CEP);
    });

    $('#esp-card').click(function () {
        $('#esp-select').show()
        $('#exam-select').hide()
        select = 'consulta'
    })
    $('#exam-card').click(function () {
        $('#exam-select').show()
        $('#esp-select').hide()
        select = 'exame'
    })
    $('#esp-select').change(function () {
        procID = $(this).val()
    })
    $('#exam-select').change(function () {
        procID = $(this).val()
    })

    $('.card')
        .click(function () {
            $('.card').removeClass('selected')
            $(this).toggleClass('selected')
        })

    $('#dia-select').change(function () {
        setHoras($(this))
    })

    $('#fin-ag').click(function () {
        if ($('#dia-select').val() >= 0 && $('#hora-select').val() >= 0) {
            sendConsulta();
        } else {
            alert('Por favor, insira a data e hora do agendamento.');
        }
    })

    function validateUser() {
        const validName = $('#username').val() != ''
        const validEmail = validateEmail()
        const validPhone = validatePhone()
        const validDataNasc = $('#datanasc').val() != ''
        const validSexo = $('#sexo').val() != '-Selecione-'
        const validCPF = validateCPF()
        const validSUS = validateSUS()
        const validCEP = validateCEP()
        const validNum = $('#num').val() != ''
        const validRua = $('#rua').val() != ''
        const validBairro = $('#bairro').val() != ''
        const validCidade = $('#cidade').val() != ''
        const validNEstado = $('#estado').val() != ''

        if (!(
            validName
            && validEmail
            && validPhone
            && validDataNasc
            && validSexo
            && validCPF
            && validSUS
            && validCEP
            && validNum
            && validRua
            && validBairro
            && validCidade
            && validNEstado
        )) {
            alert('Por favor, insira os dados corretos.');
        }

        return (
            validName
            && validEmail
            && validPhone
            && validDataNasc
            && validSexo
            && validCPF
            && validSUS
            && validCEP
            && validNum
            && validRua
            && validBairro
            && validCidade
            && validNEstado
        )
    }

    function validateEmail() {
        const email = $('#email').val()
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

        return emailPattern.test(email);
    }

    function validatePhone() {
        let phoneNumber = $('#phone').val()

        return phoneNumber.length >= 16
    }

    function validateCEP() {
        let CEP = $('#cep').val()

        return CEP.length >= 9
    }

    function validateCPF() {
        let CPF = $('#cpf').val()

        return CPF.length >= 14
    }

    function validateSUS() {
        let SUS = $('#sus').val()

        return SUS.length >= 18
    }

    function validateProc() {
        let retval
        if (select === 'consulta' && $('#esp-select').val() > 0) {
            retval = true
        } else if (select === 'exame' && $('#exam-select').val() > 0) {
            retval = true
        } else {
            retval = false
            alert('Por favor, selecione seu procedimento.');
        }

        return retval
    }

    function setAgenda() {
        fetchAgenda(procID).then(data => {
            if (data) {
                resAgenda = data;

                $('#tbody-agenda').empty()
                data.forEach((ag, i) => {
                    const hosp = `<th scope="row">${ag.nomeHospital}</th>`
                    const proc = ag.idMedico > 0 ? `<td>${ag.nomeMedico} (${ag.Procedimento})</td>` : `<td>${ag.Procedimento}</td>`
                    const bair = `<td>${ag.Bairro}</td>`
                    const cida = `<td>${ag.Cidade}</td>`

                    const modalSet = 'data-bs-toggle="modal" data-bs-target="#exampleModal"'

                    const row = `<tr data-index="${i}" class="ag-table-row" ${modalSet}>${hosp} ${proc} ${bair} ${cida}</tr>`
                    $('#tbody-agenda').append(row)
                })
            } else {
                alert('Ocorreu um erro de comunicação com o servidor, por favor recarregue a página.');
            }

            setDias()
        })
    }

    function setDias() {
        $('.ag-table-row').click(function () {
            console.log('setDias: ');
            console.log(resAgenda);
            agSelect = resAgenda[$(this).data('index')]
            console.log(agSelect);

            fetchDias(agSelect).then(dias => {
                if (dias) {
                    resDias = dias

                    $('#dia-select').empty()
                    $('#dia-select').append('<option selected>Selecione o Dia</option>')
                    dias.forEach((d, i) => {
                        $('#dia-select').append(`<option value="${i}">${d.Dia}</option>`)
                    })
                    $('hora-select').empty()
                    $('hora-select').append('<option selected>Selecione o Horário</option>')
                } else {
                    alert('Ocorreu um erro de comunicação com o servidor, por favor recarregue a página.');
                }
            })
        })
    }

    function setHoras(d) {
        $('#hora-select').empty().append('<option selected>Selecione o Horário</option>')

        if (d.val() >= 0) {
            fetchHoras(agSelect, resDias[d.val()].Dia).then(hl => {
                if (hl) {
                    resHoras = hl;

                    hl.forEach((h, i) => {
                        $('#hora-select').append(`<option value="${i}">${h.hora}</option>`)
                    })
                } else {
                    alert('Ocorreu um erro de comunicação com o servidor, por favor recarregue a página.');
                }
            })
        }
    }

    function sendConsulta() {
        const consulta = {
            datahora: `${resDias[$('#dia-select').val()].Dia} ${resHoras[$('#hora-select').val()].hora}`,
            idMedico: agSelect.idMedico ? agSelect.idMedico : -1,
            hospitalCNPJ: agSelect.HospitalCNPJ ? agSelect.HospitalCNPJ : '',
            idExame: agSelect.idProcedimento ? agSelect.idProcedimento : -1,

            paciente: {
                cpf: $('#cpf').val(),
                data: formatDate($('#datanasc').val()),
                email: $('#email').val(),
                nome: $('#username').val(),
                sus: $('#sus').val(),
                sexo: $('#sexo').val(),
                telefone: $('#phone').val(),

                endereco: {
                    cidade: $('#cidade').val(),
                    bairro: $('#bairro').val(),
                    rua: $('#rua').val(),
                    estado: $('#estado').val(),
                    cep: $('#cep').val(),
                    complemento: $('#num').val(),
                    lat: 1,
                    long: 1
                }
            }
        }

        console.log(consulta);
        fetchConsultaPOST(consulta)
            .then(success => {
                if(success) {
                    window.location.href = './Agradecimento.html';
                }
            })
    }

    function formatDate(inputDate) {
        // Split the input date string into an array using the '-' delimiter
        const parts = inputDate.split('-');

        // Check if the input date has three parts (year, month, day)
        if (parts.length === 3) {
            // Reorder the parts to "day, month, year"
            const [year, month, day] = parts;

            // Construct the output date string in "dd/mm/yyyy" format
            const outputDate = `${day}/${month}/${year}`;

            return outputDate;
        } else {
            // Return an error message for invalid input
            return 'Invalid date format';
        }
    }
});

async function fetchProcedimentos() {
    try {
        const response = await fetch(`${_url}/rest/procs`);
        const data = await response.json();
        console.log(data);
        return data
    } catch (error) {
        console.error('Error:', error);
    }
}

async function fetchAgenda(proc) {
    try {
        const response = await fetch(`${_url}/rest/hospitalProc/${proc}`);
        const data = await response.json();
        console.log(data);
        return data
    } catch (error) {
        console.error('Error:', error);
    }
}

async function fetchDias(agenda) {
    console.log(agenda);
    const endpoint =
        agenda.idMedico > 0 ?
            `/rest/data-medico/${agenda.idMedico}` :
            `/rest/data-exame/${agenda.idProcedimento}/${encodeURIComponent(agenda.HospitalCNPJ)}`
    console.log(endpoint);

    try {
        const response = await fetch(`${_url}${endpoint}`);
        const data = await response.json();
        console.log(data);
        return data
    } catch (error) {
        console.error('Error:', error);
    }
}

async function fetchHoras(agenda, dia) {
    const endpoint =
        agenda.idMedico > 0 ?
            `/rest/hora-medico/${agenda.idMedico}/${encodeURIComponent(dia)}` :
            `/rest/hora-exame/${agenda.idProcedimento}/${encodeURIComponent(agenda.HospitalCNPJ)}/${encodeURIComponent(dia)}`
    console.log(endpoint);

    try {
        const response = await fetch(`${_url}${endpoint}`);
        const data = await response.json();
        console.log(data);
        return data
    } catch (error) {
        console.error('Error:', error);
    }
}

async function fetchConsultaPOST(consulta) {
    // Configuração para enviar dados em um POST
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Define o tipo de conteúdo como JSON
        },
        body: JSON.stringify(consulta), // Dados a serem enviados
    };

    // Fazendo uma requisição POST para o servidor
    try {
        const response = await fetch(`${_url}/rest/consulta`, requestOptions)
        console.log(response);

        if (response.ok) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Erro:', error);
        return false;
    }
}