var { exams, especialidades, agendas } = getData()
const _url = 'https://www.api.logmed.gustech-rec.com'


$(document).ready(function () {
    
    exams.forEach((ex, i) => {
        $('#exam-select').append(`<option value="${i + 1}">${ex}</option>`)
    })
    especialidades.forEach((es, i) => {
        $('#esp-select').append(`<option value="${i + 1}">${es}</option>`)
        console.log(`<option value="${i + 1}">${es}</option>`);
    })

    fetchProcedimentos().then(procs => {
        if(procs) {
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
        }
    })
    $('#exam-select').hide()
    $('#esp-select').hide()


    var select = ''
    var procSelect = ''
    var procID = -1
    var filteredAgenda = []
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
                $('#tbody-agenda').empty()
                filteredAgenda = filterAgendamento()
                filteredAgenda.forEach((ag, i) => {
                    const hosp = `<th scope="row">${ag.hospital}</th>`
                    const proc = ag.tipo === 'consulta' ? `<td>${ag.medico} (${ag.procedimento})</td>` : `<td>${ag.procedimento}</td>`
                    const bair = `<td>${ag.bairro}</td>`
                    const cida = `<td>${ag.cidade}</td>`

                    const modalSet = 'data-bs-toggle="modal" data-bs-target="#exampleModal"'

                    const row = `<tr data-index="${i}" class="ag-table-row" ${modalSet}>${hosp} ${proc} ${bair} ${cida}</tr>`
                    $('#tbody-agenda').append(row)
                })
                fetchAgenda(procID).then(data => {
                    if(data) {
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
                    }
                })

                $('.ag-table-row').click(function () {
                    agSelect = filteredAgenda[$(this).data('index')]
                    console.log(agSelect);

                    $('#dia-select').empty()
                    $('#dia-select').append('<option selected>Selecione o Dia</option>')
                    agSelect.datas.forEach((d, i) => {
                        $('#dia-select').append(`<option value="${i}">${d.dia}</option>`)
                    })
                    $('hora-select').empty()
                    $('hora-select').append('<option selected>Selecione o Horário</option>')
                })
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

    var filteredAgenda = []


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
        procSelect = especialidades[$(this).val() - 1]
        procID = $(this).val()
    })
    $('#exam-select').change(function () {
        procSelect = exams[$(this).val() - 1]
        procID = $(this).val()
    })

    $('.card')
        .click(function () {
            $('.card').removeClass('selected')
            $(this).toggleClass('selected')
        })

    $('#dia-select').change(function () {
        $('#hora-select').empty().append('<option selected>Selecione o Horário</option>')
        if ($(this).val() >= 0) {
            agSelect.datas[$(this).val()].horarios.forEach((h, i) => {
                $('#hora-select').append(`<option value="${i}">${h}</option>`)
            })
        }
    })

    $('#fin-ag').click(function () {
        if ($('#dia-select').val() >= 0 && $('#hora-select').val() >= 0) {
            window.location.href = './Agradecimento.html';
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

    function filterAgendamento() {
        return agendas.filter(ag => ag.procedimento === procSelect)
    }


});

function getData() {
    const namesAndSurnames = ["Alice Smith", "Bob Johnson", "Charlie Brown", "David Davis", "Emma Wilson", "Frank Anderson", "Grace García", "Henry Martínez", "Isabel Rodriguez", "Jack Jones", "Katherine Miller", "Liam Davis", "Mia Williams", "Noah Moore", "Olivia Taylor", "Penelope Jackson", "Quinn Martin", "Ryan Lee", "Sophia Perez", "Thomas Harris", "Uma Clark", "Victor Lewis", "Willow Young", "Xander Walker", "Yasmine Hall", "Zachary Allen", "Abigail King", "Benjamin Wright", "Chloe Scott", "Daniel Torres", "Ella Nguyen", "Fiona Hill", "George Lopez", "Hannah Adams", "Isaac Green", "Jasmine Baker", "Kevin Nelson", "Lily Carter", "Mary Mitchell", "Nathan Phillips", "Oliver Davis", "Olivia Williams", "Piper Moore", "Quinn Taylor", "Riley Jackson", "Samuel Martin", "Sophia Lee", "Thomas Perez", "Uma Harris", "Victor Clark", "Willow Lewis", "Xander Young", "Yasmine Walker", "Zachary Hall", "Abigail Allen", "Benjamin King", "Chloe Wright", "Daniel Scott", "Ella Torres", "Fiona Nguyen", "George Hill", "Hannah Lopez", "Isaac Adams", "Jasmine Green", "Kevin Baker", "Lily Nelson", "Mason Carter", "Nora Mitchell", "Oscar Phillips", "Phoebe Smith", "Quincy Johnson", "Rebecca Brown", "Samuel Davis", "Tara Williams", "Uriel Moore", "Violet Taylor", "William Jackson", "Xander Martin", "Yara Lee", "Zane Perez", "Zoe Harris"];

    const times = ["06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"]

    const dates = ["20/10/2023", "21/10/2023", "22/10/2023", "23/10/2023", "24/10/2023", "25/10/2023", "26/10/2023", "27/10/2023", "28/10/2023", "29/10/2023", "30/10/2023", "31/10/2023", "01/11/2023", "02/11/2023", "03/11/2023", "04/11/2023", "05/11/2023", "06/11/2023", "07/11/2023", "08/11/2023", "09/11/2023", "10/11/2023", "11/11/2023", "12/11/2023", "13/11/2023", "14/11/2023", "15/11/2023", "16/11/2023", "17/11/2023", "18/11/2023", "19/11/2023", "20/11/2023", "21/11/2023", "22/11/2023", "23/11/2023", "24/11/2023", "25/11/2023", "26/11/2023", "27/11/2023", "28/11/2023", "29/11/2023", "30/11/2023", "01/12/2023", "02/12/2023", "03/12/2023", "04/12/2023", "05/12/2023", "06/12/2023", "07/12/2023", "08/12/2023", "09/12/2023", "10/12/2023", "11/12/2023", "12/12/2023", "13/12/2023", "14/12/2023", "15/12/2023", "16/12/2023", "17/12/2023", "18/12/2023", "19/12/2023", "20/12/2023", "21/12/2023", "22/12/2023", "23/12/2023", "24/12/2023", "25/12/2023", "26/12/2023", "27/12/2023", "28/12/2023", "29/12/2023", "30/12/2023", "31/12/2023"]

    const brazilianHospitals = ["Hospital Albert Einstein", "Hospital Sírio-Libanês", "Hospital das Clínicas da USP", "Hospital Samaritano", "Hospital Copa D'Or", "Hospital Moinhos de Vento", "Hospital do Coração", "Hospital Alemão Oswaldo Cruz", "Hospital São Lucas", "Hospital São Camilo", "Hospital das Clínicas de Porto Alegre", "Hospital Beneficência Portuguesa", "Hospital de Clínicas de Curitiba", "Hospital Santa Catarina", "Hospital da Criança Santo Antônio", "Hospital das Clínicas de Ribeirão Preto", "Hospital Geral de Fortaleza", "Hospital das Clínicas da UFMG", "Hospital de Clínicas de Porto Alegre", "Hospital Universitário Clementino Fraga Filho"];

    const exams = ['Glicemia', 'Radiografia', 'Mamografia', 'Ultrassonografia']

    const especialidades = ['Nutricionista', 'Ortopedista', 'Psicólogo', 'Cardiologista']

    const bairrosList = [ { bairro: "Boa Viagem", cidade: "Recife" }, { bairro: "Boa Vista", cidade: "Recife" }, { bairro: "Imbiribeira", cidade: "Recife" }, { bairro: "Setúbal", cidade: "Recife" }, { bairro: "Casa Amarela", cidade: "Recife" }, { bairro: "Jardim São Paulo", cidade: "Recife" }, { bairro: "Piedade", cidade: "Jaboatão dos Guararapes" }, { bairro: "Candeias", cidade: "Jaboatão dos Guararapes" }, { bairro: "Boa Esperança", cidade: "Olinda" }, { bairro: "Carmo", cidade: "Olinda" }, { bairro: "Aflitos", cidade: "Recife" }, { bairro: "Areias", cidade: "Recife" }, { bairro: "Pina", cidade: "Recife" }, { bairro: "Ibura", cidade: "Recife" }, { bairro: "Janga", cidade: "Paulista" }, { bairro: "Camaragibe", cidade: "Camaragibe" }, { bairro: "Monteiro", cidade: "Jaboatão dos Guararapes" }, { bairro: "Ilha do Retiro", cidade: "Recife" }, { bairro: "Casa Caiada", cidade: "Olinda" }, { bairro: "Espinheiro", cidade: "Recife" }    ];



    const agenda = {
        tipo: 'consulta',
        hospital: 'logmed1',
        medico: 'fulano de tal',
        procedimento: 'Nutricionista',
        distancia: '0.8 km',
        datas: [
            {
                dia: '23/10/2023',
                horarios: ['13:00', '13:30']
            }
        ]
    }

    const agendas = []

    for (let i = 0; i < 40; i++) { // consultas
        agendas.push(createAgenda('consulta', especialidades, i))
    }

    for (let i = 40; i < 80; i++) { // exames
        agendas.push(createAgenda('exame', exams, i))
    }

    /* console.log(agendas);
    console.log(agendas.length);
    console.log(agendas[79].datas[0]);
    console.log(agendas[79]); */

    function createAgenda(tipo, procedimentos, i) {
        const bc = Math.floor(Math.random() * bairrosList.length)

        const agenda = {
            tipo: tipo,
            hospital: brazilianHospitals[Math.floor(Math.random() * brazilianHospitals.length)],
            medico: i < 40 ? namesAndSurnames[i] : '',
            procedimento: procedimentos[Math.floor(Math.random() * procedimentos.length)],
            distancia: `${(Math.random() * 4).toFixed(3)} km`,
            datas: createDatas(),
            bairro: bairrosList[bc].bairro,
            cidade: bairrosList[bc].cidade
        }
        return agenda
    }

    function createDatas() {
        const datasCriadas = []
        dates.forEach(d => {
            const newData = {
                dia: d,
                horarios: createHorarios()
            }

            datasCriadas.push(newData)
        })

        return datasCriadas
    }

    function createHorarios() {
        const horasCriadas = []
        times.forEach(t => {
            if (Math.random() > 0.2) {
                horasCriadas.push(t)
            }
        })

        return horasCriadas
    }

    return {
        exams,
        especialidades,
        agendas
    }

}

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