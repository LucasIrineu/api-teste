import { Router } from 'express'
import { MeasureController } from '../controllers/measure.controller'

const routes = Router()

routes.post('/upload', new MeasureController().uploadImage)
routes.patch('/confirm', new MeasureController().confirm)
routes.get('/:customerCode/list', new MeasureController().getByCustomerCode)

export default routes