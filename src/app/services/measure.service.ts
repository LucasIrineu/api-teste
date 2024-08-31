import { GeminiAPI } from '../../gemini-api/geminiAPI';
import { concatNumbers, getMonthStartAndEnd, isBase64, isInvalidMeasureType, isUUID, isValidDateTime } from '../../utils';
import { IUpload } from '../interfaces/IUpload';
import { measureRepository } from '../repositories/MeasureRepository';
import { Between } from 'typeorm';
import { randomUUID } from 'crypto';

export class MeasureService {

    async getMeasures(inputCustomerCode: string | undefined, query?: string | undefined) {

        if (query === undefined) {
            const measureList = await measureRepository.find({
                where: { customer_code: inputCustomerCode },
                select: { 
                    uuid: true, 
                    measured_datetime: true,
                    measure_type: true,
                    has_confirmed: true,
                    image_url: true,
                },
            })

                if (measureList.length < 1) return {
                    error_code: 'MEASURES_NOT_FOUND',
                    error_description: 'Nenhuma leitura encontrada'
                 }

                return { customer_code: inputCustomerCode, measures: measureList }
        }

        const caseFixQuery = query.toLowerCase()

        if (caseFixQuery === 'water' || caseFixQuery === "gas") {
            const measureList = await measureRepository.find({
                where: { customer_code: inputCustomerCode, measure_type: query },
                select: { 
                    uuid: true, 
                    measured_datetime: true,
                    measure_type: true,
                    has_confirmed: true,
                    image_url: true,
                }
            })

            if (measureList.length < 1) return {
                error_code: 'MEASURES_NOT_FOUND',
                error_description: 'Nenhuma leitura encontrada'
             }

            return { customer_code: inputCustomerCode, measures: measureList}
        }

        return { error_code: 'INVALID_TYPE', error_description: 'Tipo de medição não permitida'}

        
        
    }

    async checkUserCode(userCode: string) {
        const check = await measureRepository.findOne({
            where: {customer_code: userCode}
        })

        if (check === null) return false
    }

    async uploadPhoto(body: IUpload) {
        const { image, customer_code, measure_datetime, measure_type } = body

        const Gemini = new GeminiAPI
        const geminiRes = await Gemini.Generate(image)

        if (isValidDateTime(measure_datetime.toString()) === false
            || isInvalidMeasureType(measure_type) === false
            || isBase64(image) === false
            || await this.checkUserCode(customer_code) === false) 
            return {
                error_code: 'INVALID_DATA',
                error_description: 'Os dados fornecidos no corpo da requisição são inválidos'
                }

        const month = getMonthStartAndEnd(measure_datetime.toString())
        const {start, end} = month

        const result = await measureRepository.find({
            where: { 
                measure_type: measure_type,
                customer_code: customer_code,
                measured_datetime: Between(start, end)
            },
            select: { image_url: true, uuid: true }
        })

        if (result.length > 0) {
            return {
                error_code: 'DOUBLE_REPORT',
                error_description: 'Leitura do mês já realizada'
                }
        }
        
        return {
            image_url: geminiRes.uri,
            measure_value: concatNumbers(geminiRes.text),
            measure_uuid: randomUUID()
        }
    }

    async confirm(uuid: string, confirmed_value: number) {
        if (isUUID(uuid) === false || confirmed_value > 1 || confirmed_value < 0) {
            return {
                error_code: 'INVALID_DATA',
                error_description: 'Os dados fornecidos no corpo da requisição são inválidos'
            }
        }
        const result = await measureRepository.find({
            where: {uuid: uuid}
        })
        if (result.length < 1 ) return {
            error_code: 'MEASURE_NOT_FOUND',
            error_description: 'Leitura do mês já realizada'
        }
        
        
        if (result[0].has_confirmed === false) {
            measureRepository.update({uuid: uuid}, {has_confirmed: true})
            
           return { success: true }
        }

       
        return {
            error_code: 'CONFIRMATION_DUPLICATE',
            error_description: 'Leitura do mês já realizada' 
        }
    }
}