const fs = require('fs');
const pdf = require('pdf-parse');

// Regex para verificar o CNPJ
const cnpjRegex = /CNPJ:\s*03\.573\.863\/0001-46/;

// Regex para a Data de Emissão
const dataEmissaoRegex = /Data de emissão\s*(\d{2}\/\d{2}\/\d{4})/;

async function readPDF(filepath) {
    try {
        const dataBuffer = fs.readFileSync(filepath);
        const data = await pdf(dataBuffer);
        return data.text;
    } catch (err) {
        console.error(err);
    }
}

function extractAdditionalData(text) {
    const horasMensaisRegex = /Horas mensais positivas\s*(\d{2}:\d{2})/;
    const bancoHorasRegex = /Banco de horas no mês\s*(\d{2}:\d{2})/;
    const adicNotRegex = /ADIC NOT 20%\s*(\d{3}:\d{2})/;
    const compensacao100Regex = /Compensação 100%\s*(\d{2}:\d{2})/;
    const compensacaoRegex = /Compensação\s*(\d{2}:\d{2})/;

    const horasMensaisMatch = horasMensaisRegex.exec(text);
    const bancoHorasMatch = bancoHorasRegex.exec(text);
    const adicNotMatch = adicNotRegex.exec(text);
    const compensacao100Match = compensacao100Regex.exec(text);
    const compensacaoMatch = compensacaoRegex.exec(text);

    return {
        horasMensais: horasMensaisMatch ? horasMensaisMatch[1] : null,
        bancoHoras: bancoHorasMatch ? bancoHorasMatch[1] : null,
        adicNot: adicNotMatch ? adicNotMatch[1] : null,
        compensacao100: compensacao100Match ? compensacao100Match[1] : null,
        compensacao: compensacaoMatch ? compensacaoMatch[1] : null,
    };
}

function convertToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

function convertToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

function calculateTotalWorkedHours(entries) {
    let totalMinutes = 0;

    entries.forEach(entry => {
        const workedHours = entry.workedHours;
        if (workedHours) {
            totalMinutes += convertToMinutes(workedHours);
        }
    });

    return convertToTime(totalMinutes);
}

function extractEmployeeData(text) {
    const employeeRegex = /MATRÍCULA\s*(?<matricula>\d+)\s*PIS\s*(?<pis>\d+)\s*CPF\s*(?<cpf>\d+)\s*ADMISSÃO\s*(?<admissao>\d{2}\/\d{2}\/\d{4})\s*DEPARTAMENTO\s*(?<departamento>[^\n]*)\s*CARGO\s*(?<cargo>[^\n]*)\s*LOCALIZAÇÃO\s*(?<localizacao>[^\n]*)/;
    const nameRegex = /(?<nome>[^\n]+?)\s*ESPELHO DE PONTO/;

    const employeeMatch = employeeRegex.exec(text);
    const nameMatch = nameRegex.exec(text);

    const employeeData = employeeMatch ? { ...employeeMatch.groups } : {};
    if (nameMatch) {
        employeeData.nome = nameMatch.groups.nome.trim();
    }

    // Verifica se o CNPJ está presente no texto
    if (cnpjRegex.test(text)) {
        employeeData.agencie = 'Randstad';
    } else {
        employeeData.agencie = employeeData.agencie || null;
    }

    const additionalData = extractAdditionalData(text);
    Object.assign(employeeData, additionalData);

    // Extraindo a data de emissão
    const dataEmissaoMatch = dataEmissaoRegex.exec(text);
    employeeData.dataEmissao = dataEmissaoMatch ? dataEmissaoMatch[1] : null;

    // Remove chaves vazias
    for (const key in employeeData) {
        if (!employeeData[key]) {
            delete employeeData[key];
        }
    }

    delete employeeData.localizacao;

    return employeeData;
}

function extractTimeEntries(text) {
    const entryRegex = /(\d{2}\/\d{2}\/\d{4}\s*-\s*(?:Seg|Ter|Qua|Qui|Sex|Sáb|Dom))([\s\S]+?)(?=\d{2}\/\d{2}\/\d{4}\s*-\s*(?:Seg|Ter|Qua|Qui|Sex|Sáb|Dom)|$)/g;
    const intervalRegex = /INTERVALO([\s\S]+?)(?=\d{2}:\d{2}\s*-\s*Inserido)/;
    const specificCaseRegex = /(\d{2}:\d{2})H\s*AS\s*(\d{2}:\d{2})H([\s\S]+?)\d{2}:\d{2}\s*-\s*Inserido/;
    const entries = [];
    let match;

    while ((match = entryRegex.exec(text)) !== null) {
        const dateAndDay = match[1];
        const details = match[2];
        const dateMatch = /(\d{2}\/\d{2}\/\d{4})/.exec(dateAndDay);
        const dayMatch = /-\s*(\w+)/.exec(dateAndDay);

        if (dateMatch && dayMatch) {
            const date = dateMatch[1];
            let day = dayMatch[1];
            
            if (day === 'S') {
                day = 'Sáb';
            }

            let intervalDetails = '';
            const specificCaseMatch = specificCaseRegex.exec(details);
            if (specificCaseMatch) {
                const [ , startTime, endTime, specificDetails ] = specificCaseMatch;
                intervalDetails = `${startTime}H AS ${endTime}H${specificDetails}`;
            } else {
                const intervalMatch = intervalRegex.exec(details);
                intervalDetails = intervalMatch ? intervalMatch[1] : '';
            }
            
            const rawTimes = intervalDetails.match(/(\d{2}:\d{2})/g) || [];
            const validTimes = rawTimes.length > 0 ? [rawTimes[0], rawTimes[rawTimes.length - 1]] : [];

            const workedHoursMatch = /Horas Trabalhadas\s*:\s*(\d{2}:\d{2})/.exec(details);
            const additionalNightMatch = /ADIC NOT 20%\s*:\s*(\d{2}:\d{2})/.exec(details);
            const compensationMatch = /Compensação\s*:\s*(\d{2}:\d{2})/.exec(details);
            const compensation100Match = /Compensação 100%\s*:\s*(\d{2}:\d{2})/.exec(details);

            const workedHours = workedHoursMatch ? workedHoursMatch[1] : null;
            const additionalNight = additionalNightMatch ? additionalNightMatch[1] : null;
            const compensation = compensationMatch ? compensationMatch[1] : null;
            const compensation100 = compensation100Match ? compensation100Match[1] : null;

            const entry = {
                date,
                day,
                marcacao: validTimes.join(' | '),
                workedHours,
                additionalNight,
                compensation,
                compensation100
            };

            for (const key in entry) {
                if (!entry[key]) {
                    delete entry[key];
                }
            }

            entries.push(entry);
        }
    }
    return entries;
}

async function processExtractedText(filepath) {
    const text = await readPDF(filepath);
    if (!text) {
        console.error("O texto extraído do PDF está vazio.");
        return { employeeData: null, timeEntries: [] };
    }
    
    const employeeData = extractEmployeeData(text);
    const timeEntries = extractTimeEntries(text);

    employeeData.totalWorkedHours = calculateTotalWorkedHours(timeEntries);
    employeeData.timeEntries = timeEntries;

    return employeeData;
}

module.exports = processExtractedText;
