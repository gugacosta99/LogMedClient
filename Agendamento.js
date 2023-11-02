const _url = 'https://www.api.logmed.gustech-rec.com'


$(document).ready(function () {

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
        } else {
            alert('Ocorreu um erro de comunicação com o servidor, por favor recarregue a página.');
        }
    })
    $('#exam-select').hide()
    $('#esp-select').hide()


    var select = ''
    var procSelect = ''
    var procID = -1
    var filteredAgenda = []
    var resAgenda = []
    var resDias = []
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
                fetchAgenda(procID).then(data => {
                    if(data) {
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

                    $('.ag-table-row').click(function () {
                        agSelect = resAgenda[$(this).data('index')]
                        console.log(agSelect);
    
                        fetchDias(agSelect).then(dias => {
                            if (data) {
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
        $('#hora-select').empty().append('<option selected>Selecione o Horário</option>')

        if ($(this).val() >= 0) {
            fetchHoras(agSelect, resDias[$(this).val()].Dia).then(hl => {
                if (hl) {
                    hl.forEach((h, i) => {
                        $('#hora-select').append(`<option value="${i}">${h.hora}</option>`)
                    })
                } else {
                    alert('Ocorreu um erro de comunicação com o servidor, por favor recarregue a página.');
                }
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