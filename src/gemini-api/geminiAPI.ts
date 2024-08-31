import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config'
import { removeFile, saveBase64Image } from "../utils"

const GEMINI_KEY = process.env.GEMINI_KEY
const fileManager = new GoogleAIFileManager(GEMINI_KEY as string)

export class GeminiAPI {
    async uploadResponse(string: string) {
        const fileName = await saveBase64Image(string)

        const uploadResponse = await fileManager.uploadFile( __dirname + '/imagemTemporaria.jpeg', {
            mimeType: "image/jpeg",
            displayName: "Imagem de Medição",
          });

        console.log(`Uploaded file! URI: ${uploadResponse.file.uri}`)

        removeFile()

        return uploadResponse
    }

    async Generate(string: string) {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY as string);

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
          });
        const uploadResponse = await this.uploadResponse(string)
        
        const result = await model.generateContent([
            {
              inlineData: {
                mimeType: uploadResponse.file.mimeType,
                data: string
              }
            },
            { text: "retorne apenas o valor numérico do medidor" },
          ]);
        
        return { text: result.response.text(), uri: uploadResponse.file.uri}
        
    }

}
  
  