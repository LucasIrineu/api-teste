import { Buffer } from 'buffer'
import fs from 'fs'

export function getMonthStartAndEnd(input: string): { start: Date, end: Date } {
    const yearMonth = input.slice(0, 7)
    
    const [year, month] = yearMonth.split('-').map(Number)
    
    const start = new Date(year, month - 1, 1)
    
    const end = new Date(year, month, 0)
    return { start, end }
}

export function isValidDateTime(input: string): boolean {
    const date = new Date(input)
    return !isNaN(date.getTime())
}

export function isInvalidMeasureType(measureType: string): boolean {
    return measureType !== 'water' && measureType !== 'gas'
}


export function base64ToBuffer(base64: string): Buffer {
  const base64Data = base64.replace(/^data:image\/\w+;base64,/, '')
  return Buffer.from(base64Data, 'base64')
}

export async function saveBase64Image(base64Image: string) {
    const imageBuffer = base64ToBuffer(base64Image)
    const fileName = 'imagemTemporaria'
    const outputPath = __dirname + '/../gemini-api/' + fileName + '.jpeg'
  
    fs.writeFile(outputPath, imageBuffer, (err) => {
      if (err) {
        console.error('Erro ao salvar imagem:', err)
      } else {
        return fileName
      }
    })
  }

export function removeFile(): void {
    const filePath = __dirname + '/../gemini-api/imagemTemporaria.jpeg'

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Erro ao remover o arquivo: ${err.message}`);
      } else {
        return true
      }
    });
  }

export function isBase64(str: string): boolean {
    const base64Regex = /^([0-9a-zA-Z+/]{4})*([0-9a-zA-Z+/]{3}=|[0-9a-zA-Z+/]{2}==)?$/;
    return base64Regex.test(str);
  }

export function concatNumbers(string: string): number {
  const numeros = string.match(/\d+/g) || [];

  const stringNumeros = numeros.join('');

  return Number(stringNumeros);
}

export function isUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}